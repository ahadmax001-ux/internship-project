import React from 'react';
import {
  X,
  GraduationCap,
  Calculator,
  Code2,
  FileCode,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PARAMETER_CONFIG } from '../utils/formulaConfig';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                ATP Score Project & Formula Documentation
              </h2>
              <p className="text-xs text-slate-500">
                Architecture, scoring rubric, and instructions for custom college formulas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Alert Box */}
        <div className="bg-brand-50 border border-brand-200/80 rounded-2xl p-4 text-xs text-brand-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-brand-800">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Configurable Formula Architecture Notice</span>
          </div>
          <p className="leading-relaxed">
            Per the project guidelines, this application strictly separates calculation logic from the user interface. If your college professor supplies an official ATP mathematical formula, you can drop it directly into <code className="font-mono font-bold bg-brand-100 px-1 py-0.5 rounded">server/utils/atpCalculator.js</code> without touching frontend React components or the MongoDB schema!
          </p>
        </div>

        {/* Current Active Rubric Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-brand-600" />
            Current 100-Point Parameter Weights
          </h3>

          <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Parameter</th>
                  <th className="py-2.5 px-3">Weightage</th>
                  <th className="py-2.5 px-3">Max Scale</th>
                  <th className="py-2.5 px-3">Academic Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PARAMETER_CONFIG.map((p) => (
                  <tr key={p.key} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {p.label}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-brand-700">
                      {p.weight}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      0 - {p.max} {p.unit}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{p.tooltip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grading Scale */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-600" />
            Grading Scale & Performance Criteria
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-800 block text-sm">A+ (&gt;=90%)</span>
              <span className="text-emerald-700 text-[11px]">Outstanding Performance</span>
            </div>
            <div className="p-2.5 rounded-xl bg-green-50 border border-green-200">
              <span className="font-bold text-green-800 block text-sm">A (80-89%)</span>
              <span className="text-green-700 text-[11px]">Excellent Performance</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <span className="font-bold text-blue-800 block text-sm">B (70-79%)</span>
              <span className="text-blue-700 text-[11px]">Very Good Standard</span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200">
              <span className="font-bold text-indigo-800 block text-sm">C (60-69%)</span>
              <span className="text-indigo-700 text-[11px]">Good / Satisfactory</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-800 block text-sm">D (50-59%)</span>
              <span className="text-amber-700 text-[11px]">Minimum Passing Threshold</span>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
              <span className="font-bold text-red-800 block text-sm">F (&lt;50%)</span>
              <span className="text-red-700 text-[11px]">Failed / Needs Remedial</span>
            </div>
          </div>
        </div>

        {/* How to Replace Formula Step-by-Step */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-brand-700" />
            How to Replace with Your Official College Formula:
          </h4>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed">
            <li>
              Open file: <code className="font-mono bg-white px-1.5 py-0.5 border rounded">server/utils/atpCalculator.js</code>
            </li>
            <li>
              Look for the banner marked: <code className="font-mono text-brand-700 font-bold">REPLACE WITH OFFICIAL ATP FORMULA</code>
            </li>
            <li>
              Adjust the weights or math formula in <code className="font-mono font-semibold">calculateATPScore(inputData)</code>
            </li>
            <li>
              Save the file. The server automatically reloads with <code className="font-mono">nodemon</code> and immediately applies your new formula!
            </li>
          </ol>
        </div>

        {/* Close footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
