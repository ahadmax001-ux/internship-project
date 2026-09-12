import React from 'react';
import {
  CalendarCheck,
  FileText,
  BookOpen,
  FlaskConical,
  FolderGit2,
  Award,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP = {
  CalendarCheck,
  FileText,
  BookOpen,
  FlaskConical,
  FolderGit2,
  Award,
};

export default function InputField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  unit = 'marks',
  weight = '',
  min = 0,
  max = 100,
  step = 1,
  placeholder = '',
  tooltip = '',
  icon = 'FileText',
  required = true,
  disabled = false,
}) {
  const IconComponent = ICON_MAP[icon] || FileText;

  return (
    <div className="space-y-1.5">
      {/* Label and Weightage Header */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={id || name}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700"
        >
          <IconComponent className="w-3.5 h-3.5 text-slate-400" />
          <span>{label}</span>
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>

        <div className="flex items-center gap-2">
          {weight && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Weight: {weight}
            </span>
          )}
          {tooltip && (
            <span
              title={tooltip}
              className="text-slate-400 hover:text-slate-600 cursor-help"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>

      {/* Input container with trailing unit and icons */}
      <div className="relative rounded-xl shadow-2xs">
        <input
          type="number"
          id={id || name}
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder || `${min} - ${max}`}
          className={`block w-full rounded-xl py-2.5 pl-3.5 pr-14 text-sm font-medium transition-all duration-150 border outline-none ${
            error
              ? 'border-red-400 bg-red-50/30 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200'
              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
          } ${disabled ? 'opacity-60 bg-slate-50 cursor-not-allowed' : ''}`}
        />

        {/* Trailing unit badge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-xs font-semibold text-slate-400 uppercase">
            {unit}
          </span>
        </div>
      </div>

      {/* Validation Message or Field Hint */}
      <div className="min-h-4 flex items-center justify-between text-[11px]">
        {error ? (
          <p className="flex items-center gap-1 text-red-600 font-medium animate-in fade-in duration-150">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </p>
        ) : (
          <p className="text-slate-400">
            Range: {min} - {max} {unit}
          </p>
        )}

        {/* Real-time Percentage Indicator */}
        {value !== '' && !Number.isNaN(Number(value)) && (
          <span
            className={`font-semibold text-[10px] ${
              Number(value) >= 75
                ? 'text-emerald-600'
                : Number(value) >= 50
                ? 'text-amber-600'
                : 'text-red-500'
            }`}
          >
            {Math.round((Math.max(0, Math.min(max, Number(value))) / max) * 100)}%
          </span>
        )}
      </div>
    </div>
  );
}
