# NEXORA - Quick start (with real user authentication)

## Run it
```bash
npm install
cp .env.example .env      # then edit .env (set ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET)
npm run dev               # development  -> http://localhost:3000
```
Production:
```bash
npm run build
npm start                 # serves the built site + API on PORT (default 3000)
```
Requires Node.js 20 or newer.

## How authentication works
- `server.js` is an Express server that serves the site **and** the `/api/auth/*` endpoints.
- Passwords are hashed with bcrypt (never stored in plain text). Sessions use a signed JWT in an
  `HttpOnly`, `SameSite=Lax` cookie (and `Secure` automatically when served over HTTPS).
- Accounts are saved in `data/users.json` (created automatically, git-ignored). Back this folder up.
- Admin account: created on first start from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. If no password is set,
  a random one is printed once in the console.
- Admin-only endpoints (customer list, activate/deactivate) are enforced on the server.
- Login is rate limited (8 attempts / 15 min per IP + email). Deactivated users are signed out immediately.

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register` | Create account (name, email, phone, password >= 8 chars) |
| `POST /api/auth/login` | Sign in |
| `POST /api/auth/logout` | Sign out |
| `GET /api/auth/me` | Current user |
| `PATCH /api/auth/profile` | Update name, phone, addresses |
| `POST /api/auth/change-password` | Change password |
| `GET /api/admin/users`, `PATCH /api/admin/users/:id/status` | Admin only |

## Good to know
- Products, orders, cart and coupons are still stored in each browser (`localStorage`); only accounts are server-side.
- "Forgot password" by email is not implemented (needs an email service such as SMTP/Resend).
- This needs a Node.js host (VPS, Render, Railway, Fly.io...). Static-only hosts (GitHub Pages, plain Netlify) cannot run the login server.
- The old PHP/MySQL files in `php/` and `database/` are unchanged and are not used by this version.

---

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/754a9307-a6af-4a63-ac81-c3c112bb2704

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
