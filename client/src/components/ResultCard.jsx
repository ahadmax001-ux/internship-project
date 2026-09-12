import React from 'react';
import ScoreCard from './ScoreCard';
import ScoreBreakdown from './ScoreBreakdown';
import {
  Save,
  CheckCircle2,
  Printer,
  RotateCcw,
  Clock,
  Database,
} from 'lucide-react';

export default function ResultCard({
  result,
  studentInfo,
  onSaveToDatabase,
  isSaving,
  isSaved,
  onReset,
}) {
  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
      {/* Save Success Banner */}
      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 flex items-center justify-between text-emerald-800 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Record successfully saved to MongoDB database!</span>
          </div>
          <span className="text-[11px] text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-md font-mono">
            Synced
          </span>
        </div>
      )}

      {/* Main Score Radial Card */}
      <ScoreCard result={result} studentInfo={studentInfo} />

      {/* Detailed Weighted Breakdown */}
      <ScoreBreakdown breakdown={result.breakdown} />

      {/* Action Buttons Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>Calculated on {new Date().toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>

          {!isSaved && (
            <button
              type="button"
              disabled={isSaving}
              onClick={onSaveToDatabase}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving to Database...' : 'Save to MongoDB'}
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New Calculation
          </button>
        </div>
      </div>
    </div>
  );
}
