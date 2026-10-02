// NEXORA server: serves the React app and provides secure user authentication.
// Run `npm run dev` (development) or `npm run build && npm start` (production).
import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.argv.includes('--prod') || process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SECRET_FILE = path.join(DATA_DIR, '.jwt_secret');
const COOKIE_NAME = 'nexora_session';

fs.mkdirSync(DATA_DIR, { recursive: true });

// ---------- Secrets ----------
function loadJwtSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16) return process.env.JWT_SECRET;
  if (isProd) console.warn('[auth] WARNING: set a strong JWT_SECRET in your environment for production.');
  if (fs.existsSync(SECRET_FILE)) return fs.readFileSync(SECRET_FILE, 'utf8').trim();
  const generated = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(SECRET_FILE, generated, { mode: 0o600 });
  return generated;
}
const JWT_SECRET = loadJwtSecret();

// ---------- User store (JSON file, atomic writes) ----------
function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch {
    return [];
  }
}
function writeUsers(users) {
  const tmp = `${USERS_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(users, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, USERS_FILE);
}
const publicUser = ({ passwordHash, ...rest }) => rest;
const findByEmail = (users, email) => users.find((u) => u.email === email);

function seedAdmin() {
  const users = readUsers();
  if (users.some((u) => u.role === 'admin')) return;
  const email = (process.env.ADMIN_EMAIL || 'admin@nexora.com').trim().toLowerCase();
  let password = process.env.ADMIN_PASSWORD;
  let generated = false;
  if (!password || password.length < 8) {
    password = crypto.randomBytes(9).toString('base64url');
    generated = true;
  }
  users.push({
    id: `usr-${crypto.randomUUID()}`,
    name: process.env.ADMIN_NAME || 'NEXORA Administrator',
    email,
    phone: '',
    role: 'admin',
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    addresses: [],
    authProvider: 'email',
    passwordHash: bcrypt.hashSync(password, 12),
  });
  writeUsers(users);
  console.log('\n[auth] Admin account created');
  console.log(`[auth]   email:    ${email}`);
  if (generated) {
    console.log(`[auth]   password: ${password}   (generated - save it now, it is shown only once)`);
    console.log('[auth]   Tip: set ADMIN_EMAIL / ADMIN_PASSWORD in .env to choose your own.\n');
  } else {
    console.log('[auth]   password: (from ADMIN_PASSWORD in .env)\n');
  }
}
seedAdmin();

// ---------- Helpers ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DUMMY_HASH = bcrypt.hashSync('dummy-password-for-timing', 12);
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function setSession(req, res, userId, remember) {
  const maxAgeMs = remember ? 30 * 24 * 3600 * 1000 : 24 * 3600 * 1000;
  const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: Math.floor(maxAgeMs / 1000) });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: req.secure,
    path: '/',
    ...(remember ? { maxAge: maxAgeMs } : {}),
  });
}

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

// Loads the logged-in user (fresh from disk, so deactivation/role changes apply immediately).
function auth(req, _res, next) {
  req.user = null;
  const token = readCookie(req, COOKIE_NAME);
  if (token) {
    try {
      const { sub } = jwt.verify(token, JWT_SECRET);
      const user = readUsers().find((u) => u.id === sub);
      if (user && user.status === 'Active') req.user = user;
    } catch { /* invalid or expired token */ }
  }
  next();
}
const requireUser = (req, res, next) =>
  req.user ? next() : res.status(401).json({ error: 'Please sign in to continue.' });
const requireAdmin = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ error: 'Administrator access required.' });

// Simple in-memory rate limiter (per key)
const hits = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  const entry = (hits.get(key) || []).filter((t) => now - t < windowMs);
  entry.push(now);
  hits.set(key, entry);
  return entry.length > max;
}
setInterval(() => hits.clear(), 60 * 60 * 1000).unref();

// ---------- App ----------
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.use('/api', express.json({ limit: '200kb' }), auth);
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  // Block cross-site state-changing requests (defence in depth on top of SameSite cookies)
  if (req.method !== 'GET') {
    const origin = req.headers.origin;
    let originHost = null;
    try { originHost = origin ? new URL(origin).host : null; } catch { originHost = 'invalid'; }
    if (origin && originHost !== req.headers.host) {
      return res.status(403).json({ error: 'Cross-site request blocked.' });
    }
  }
  next();
});

app.post('/api/auth/register', (req, res) => {
  const name = str(req.body?.name, 60);
  const email = str(req.body?.email, 120).toLowerCase();
  const phone = str(req.body?.phone, 30);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (rateLimit(`reg:${req.ip}`, 10, 60 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many sign-up attempts. Please try again later.' });
  }
  if (name.length < 2) return res.status(400).json({ error: 'Please enter your full name.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (password.length > 72) return res.status(400).json({ error: 'Password must be 72 characters or fewer.' });

  const users = readUsers();
  if (findByEmail(users, email)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }
  const user = {
    id: `usr-${crypto.randomUUID()}`,
    name,
    email,
    phone,
    role: 'customer',
    joinedDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    addresses: [],
    authProvider: 'email',
    passwordHash: bcrypt.hashSync(password, 12),
  };
  users.push(user);
  writeUsers(users);
  setSession(req, res, user.id, true);
  res.status(201).json({ user: publicUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const email = str(req.body?.email, 120).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const remember = req.body?.remember !== false;

  if (rateLimit(`login:${req.ip}:${email}`, 8, 15 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many attempts. Please wait 15 minutes and try again.' });
  }
  const user = findByEmail(readUsers(), email);
  // Always run bcrypt so response time does not reveal whether the email exists
  const valid = bcrypt.compareSync(password.slice(0, 72), user?.passwordHash || DUMMY_HASH);
  if (!user || !valid) return res.status(401).json({ error: 'Invalid email or password.' });
  if (user.status !== 'Active') {
    return res.status(403).json({ error: 'This account has been deactivated. Please contact support.' });
  }
  setSession(req, res, user.id, remember);
  res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax', secure: req.secure, path: '/' });
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

app.patch('/api/auth/profile', requireUser, (req, res) => {
  const users = readUsers();
  const user = users.find((u) => u.id === req.user.id);
  const body = req.body || {};
  if (body.name !== undefined) {
    const name = str(body.name, 60);
    if (name.length < 2) return res.status(400).json({ error: 'Please enter a valid name.' });
    user.name = name;
  }
  if (body.phone !== undefined) user.phone = str(body.phone, 30);
  if (body.avatar !== undefined) user.avatar = typeof body.avatar === 'string' ? body.avatar.slice(0, 150000) : undefined;
  if (body.addresses !== undefined) {
    if (!Array.isArray(body.addresses) || body.addresses.length > 10) {
      return res.status(400).json({ error: 'Invalid addresses.' });
    }
    user.addresses = body.addresses.map((a) => ({
      id: str(a?.id, 60) || `addr-${crypto.randomUUID()}`,
      fullName: str(a?.fullName, 80),
      phone: str(a?.phone, 30),
      street: str(a?.street, 200),
      city: str(a?.city, 80),
      state: str(a?.state, 80),
      postalCode: str(a?.postalCode, 20),
      isDefault: !!a?.isDefault,
    }));
  }
  writeUsers(users);
  res.json({ user: publicUser(user) });
});

app.post('/api/auth/change-password', requireUser, (req, res) => {
  const current = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
  const next = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
  if (rateLimit(`pw:${req.user.id}`, 5, 15 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  }
  if (next.length < 8 || next.length > 72) {
    return res.status(400).json({ error: 'New password must be 8-72 characters.' });
  }
  const users = readUsers();
  const user = users.find((u) => u.id === req.user.id);
  if (!bcrypt.compareSync(current.slice(0, 72), user.passwordHash)) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }
  user.passwordHash = bcrypt.hashSync(next, 12);
  writeUsers(users);
  res.json({ ok: true });
});

app.get('/api/admin/users', requireUser, requireAdmin, (_req, res) => {
  res.json({ users: readUsers().map(publicUser) });
});

app.patch('/api/admin/users/:id/status', requireUser, requireAdmin, (req, res) => {
  const users = readUsers();
  const target = users.find((u) => u.id === req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found.' });
  if (target.role === 'admin') return res.status(400).json({ error: 'Administrator accounts cannot be deactivated.' });
  target.status = target.status === 'Active' ? 'Inactive' : 'Active';
  writeUsers(users);
  res.json({ user: publicUser(target) });
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

// ---------- Frontend ----------
if (isProd) {
  const dist = path.join(__dirname, 'dist');
  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    console.error('dist/ not found. Run `npm run build` before `npm start`.');
    process.exit(1);
  }
  app.use(express.static(dist, { index: false, maxAge: '1h' }));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
}

app.use((err, _req, res, _next) => {
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid request body.' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NEXORA running at http://localhost:${PORT} (${isProd ? 'production' : 'development'})`);
});
