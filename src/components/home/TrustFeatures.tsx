import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export const TrustFeatures: React.FC = () => {
  const features = [
    {
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      title: 'Free Express Shipping',
      desc: 'On all orders above $50.00'
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-blue-600" />,
      title: '30-Day Easy Returns',
      desc: 'No-hassle money-back guarantee'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: '100% Secure Checkout',
      desc: 'End-to-end encrypted payments'
    },
    {
      icon: <Headphones className="w-6 h-6 text-blue-600" />,
      title: '24/7 Customer Care',
      desc: 'Live expert support at your service'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        {features.map((feat, i) => (
          <div key={i} className="flex items-center gap-3.5 px-3 py-2">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              {feat.icon}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                {feat.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {feat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
