import React from 'react';
import { Layers, Info, Check, Sparkles } from 'lucide-react';

export default function ScoreBreakdown({ breakdown = [] }) {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Parameter Score Breakdown & Contribution
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Total Weight: 100%
        </span>
      </div>

      <div className="space-y-4">
        {breakdown.map((item) => {
          const efficiency = item.efficiencyPercentage || Math.round((item.enteredValue / 100) * 100);

          return (
            <div key={item.key} className="space-y-1.5 group">
              {/* Top info line */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">
                    {item.parameter}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                    {item.weightPercentage}% Weight
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[11px]">
                    Entered: <strong className="text-slate-800">{item.enteredValue}</strong> {item.unit}
                  </span>
                  <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60 text-[11px]">
                    +{item.earnedContribution} / {item.maxContribution} pts
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 flex">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    efficiency >= 80
                      ? 'bg-emerald-500'
                      : efficiency >= 60
                      ? 'bg-blue-500'
                      : efficiency >= 45
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(2, efficiency))}%` }}
                ></div>
              </div>

              {/* Parameter description */}
              {item.description && (
                <p className="text-[11px] text-slate-400 leading-tight">
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Formula Explanation Callout */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 text-xs text-slate-600 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-800">
            How was this score calculated?
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
            Each raw score is scaled to its defined weightage. The sum of all weighted points yields your final ATP Score out of 100.
          </p>
        </div>
      </div>
    </div>
  );
}
