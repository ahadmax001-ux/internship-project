import React from 'react';
import { GraduationCap, Heart, Terminal, ShieldCheck } from 'lucide-react';

export default function Footer({ onOpenAbout }) {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200/80 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">
                ATP Score Management & Calculation Web Application
              </p>
              <p className="text-slate-400">
                Final Year / Semester College Academic Project
              </p>
            </div>
          </div>

          {/* Center Tech Stack Tag */}
          <div className="flex flex-wrap items-center gap-1.5 justify-center">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] text-slate-600">
              React (Vite)
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] text-slate-600">
              Tailwind CSS
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] text-slate-600">
              Node.js + Express
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[11px] text-slate-600">
              MongoDB Mongoose
            </span>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAbout}
              className="text-brand-700 hover:text-brand-900 font-medium hover:underline"
            >
              Formula Documentation
            </button>
            <span className="text-slate-300">|</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              REST API Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
