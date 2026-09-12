import React from 'react';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Percent,
} from 'lucide-react';

export default function ScoreCard({ result, studentInfo }) {
  if (!result) return null;

  const { finalScore, maxScore = 100, grade, status, passed } = result;

  // Color mapping based on grade
  const colorSchemes = {
    'A+': {
      bg: 'from-emerald-500 to-teal-600',
      ring: 'text-emerald-500',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      statusColor: 'text-emerald-600',
    },
    A: {
      bg: 'from-emerald-500 to-green-600',
      ring: 'text-green-500',
      badge: 'bg-green-100 text-green-800 border-green-300',
      statusColor: 'text-green-600',
    },
    B: {
      bg: 'from-blue-500 to-indigo-600',
      ring: 'text-blue-500',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      statusColor: 'text-blue-600',
    },
    C: {
      bg: 'from-indigo-500 to-purple-600',
      ring: 'text-indigo-500',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      statusColor: 'text-indigo-600',
    },
    D: {
      bg: 'from-amber-500 to-orange-600',
      ring: 'text-amber-500',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      statusColor: 'text-amber-600',
    },
    F: {
      bg: 'from-red-500 to-rose-600',
      ring: 'text-red-500',
      badge: 'bg-red-100 text-red-800 border-red-300',
      statusColor: 'text-red-600',
    },
  };

  const scheme = colorSchemes[grade] || colorSchemes['B'];

  // Calculate SVG circle stroke parameters
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, finalScore)) / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div
        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-20 bg-linear-to-br ${scheme.bg}`}
      ></div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left: Circular Progress Gauge */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background Track Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-100"
            />
            {/* Animated Value Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`${scheme.ring} transition-all duration-1000 ease-out`}
            />
          </svg>

          {/* Center Score Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {finalScore}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              out of {maxScore}
            </span>
          </div>
        </div>

        {/* Right: Academic Status, Grade & Evaluation Badges */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          {studentInfo?.studentName && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Evaluation Result For
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {studentInfo.studentName}
                {studentInfo.rollNumber && (
                  <span className="ml-2 text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {studentInfo.rollNumber}
                  </span>
                )}
              </h3>
              {studentInfo.projectTitle && (
                <p className="text-xs text-slate-500 truncate max-w-md">
                  {studentInfo.projectTitle}
                </p>
              )}
            </div>
          )}

          {/* Grade & Status Callout */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold text-sm border ${scheme.badge}`}
            >
              <Award className="w-4 h-4" />
              <span>Grade {grade}</span>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
                passed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {passed ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              )}
              <span>{passed ? 'Passed Examination' : 'Needs Retest'}</span>
            </div>

            <span className="text-xs font-medium text-slate-500">
              Status: <strong className={scheme.statusColor}>{status}</strong>
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 max-w-xs">
            <div className="text-xs">
              <span className="text-slate-400 block text-[11px]">Percentage</span>
              <span className="font-bold text-slate-800">{finalScore}%</span>
            </div>
            <div className="text-xs">
              <span className="text-slate-400 block text-[11px]">Formula Scale</span>
              <span className="font-bold text-slate-800">100-Point Model</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
