import React from 'react';
import {
  Calculator,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Layers,
} from 'lucide-react';

export default function Dashboard({
  stats = {},
  recentRecords = [],
  onNavigate,
  onOpenAbout,
}) {
  const statCards = [
    {
      title: 'Total Evaluated',
      value: stats.totalRecords || 0,
      sub: 'Student assessments',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: 'Batch Average',
      value: `${stats.avgScore || 0}%`,
      sub: 'Mean ATP Score',
      icon: TrendingUp,
      color: 'text-brand-600',
      bg: 'bg-brand-50',
      border: 'border-brand-100',
    },
    {
      title: 'Pass Percentage',
      value: `${stats.passRate || 0}%`,
      sub: 'Meets minimum threshold',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Highest Score',
      value: `${stats.highestScore || 0}`,
      sub: 'Out of 100 points',
      icon: Award,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-md border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-brand-500/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>MERN Stack Academic Assessment Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            ATP Score Management & Assessment Dashboard
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Calculate candidate performance across Attendance, Theory Tests, Lab Practicals, and Continuous Assessment with an isolated, modular formula engine.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-brand-500 to-emerald-500 hover:from-brand-600 hover:to-emerald-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              Launch ATP Calculator
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenAbout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <BookOpenCheck className="w-4 h-4 text-brand-400" />
              Review Formula Rubric
            </button>
          </div>
        </div>
      </div>

      {/* Overview Statistics Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {stat.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Quick Action Cards + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Evaluations List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Student Assessments
              </h3>
              <p className="text-xs text-slate-400">
                Latest ATP evaluations logged to the database
              </p>
            </div>

            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 hover:underline"
            >
              View Full History
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentRecords.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No evaluation records available yet.
              </div>
            ) : (
              recentRecords.slice(0, 4).map((rec) => (
                <div
                  key={rec._id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {rec.studentName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {rec.studentName}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {rec.rollNumber} • {rec.department}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-extrabold text-brand-700 text-sm">
                        {rec.calculatedScore}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Grade {rec.grade}
                      </span>
                    </div>
                    <span
                      className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        rec.passed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {rec.passed ? 'Passed' : 'Needs Review'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Reference / Architecture Summary */}
        <div className="space-y-6">
          {/* Architecture Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              Formula Modularity
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              The ATP calculation logic is isolated in a standalone server module:
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
              <p className="text-brand-700 font-semibold">// server/utils/atpCalculator.js</p>
              <p>calculateATPScore(inputData)</p>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              If your college provides a custom formula (e.g. different weights or equation), replace the calculation function without modifying any UI or database schema.
            </p>

            <button
              onClick={onOpenAbout}
              className="w-full py-2 text-center text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-colors"
            >
              Learn How to Update Formula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
