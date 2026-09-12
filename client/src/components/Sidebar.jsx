import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  History,
  Info,
  BookOpenCheck,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export default function Sidebar({
  currentView,
  setCurrentView,
  onOpenAbout,
  stats = {},
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Overview & Stats',
      icon: LayoutDashboard,
      badge: stats.totalRecords ? String(stats.totalRecords) : null,
    },
    {
      id: 'calculator',
      label: 'ATP Calculator',
      icon: Calculator,
      badge: 'Live',
    },
    {
      id: 'history',
      label: 'Score Records',
      icon: History,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-5">
        {/* Main Navigation Card */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs">
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation Menu
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-2xs border border-brand-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-brand-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badge === 'Live'
                          ? 'bg-brand-100 text-brand-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Assessment Metrics Widget */}
        <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-brand-500/20 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Session Summary
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Evaluations</span>
              <span className="text-lg font-bold text-white">
                {stats.totalRecords || 0}
              </span>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Avg Score</span>
              <span className="text-lg font-bold text-emerald-400">
                {stats.avgScore || 0}%
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Pass Rate: <span className="font-semibold text-white">{stats.passRate || 0}%</span>
          </div>
        </div>

        {/* College Project Formula Guide Callout */}
        <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-4">
          <div className="flex items-start gap-2.5">
            <BookOpenCheck className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-brand-900">Configurable Formula</h4>
              <p className="text-[11px] text-brand-800 mt-1 leading-relaxed">
                The ATP calculation engine is completely separated in <code className="px-1 py-0.5 bg-emerald-100/70 rounded font-mono text-[10px]">server/utils/atpCalculator.js</code>.
              </p>
              <button
                onClick={onOpenAbout}
                className="mt-2 text-[11px] font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 underline underline-offset-2"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                View formula & documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
