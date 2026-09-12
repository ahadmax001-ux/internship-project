import React from 'react';
import {
  GraduationCap,
  Calculator,
  LayoutDashboard,
  History,
  Info,
  Menu,
  X,
  Database,
  Sparkles,
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenAbout,
  dbStatus,
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculator', label: 'ATP Calculator', icon: Calculator },
    { id: 'history', label: 'Score History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & College Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  ATP <span className="text-brand-600">SCORE</span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    MERN v1.0
                  </span>
                </span>
                <p className="text-xs text-slate-500 hidden sm:block font-normal">
                  Academic Performance & Evaluation Engine
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-2xs border border-brand-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={onOpenAbout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 rounded-lg transition-colors ml-1"
            >
              <Info className="w-4 h-4 text-slate-400" />
              Formula Info
            </button>
          </nav>

          {/* Right Action / System Status Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                dbStatus
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
              title={
                dbStatus
                  ? 'Connected to MongoDB'
                  : 'Running in resilient In-Memory session mode'
              }
            >
              <Database className="w-3.5 h-3.5" />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current"></span>
              {dbStatus ? 'MongoDB Online' : 'Session Store'}
            </div>

            <button
              onClick={() => setCurrentView('calculator')}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Calculate Now
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}

          <button
            onClick={() => {
              onOpenAbout();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 text-left"
          >
            <Info className="w-5 h-5 text-slate-400" />
            Formula & Project Information
          </button>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
              {dbStatus ? 'MongoDB Database Active' : 'In-Memory Storage Mode'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
