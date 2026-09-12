import React, { useState } from 'react';
import InputField from './InputField';
import {
  PARAMETER_CONFIG,
  DEFAULT_FORM_VALUES,
  DEMO_PRESET_VALUES,
} from '../utils/formulaConfig';
import {
  Calculator,
  Save,
  RotateCcw,
  Sparkles,
  User,
  Hash,
  Building,
  GraduationCap,
  FileCode,
  MessageSquare,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function ATPForm({
  onCalculatePreview,
  onSaveRecord,
  isCalculating,
  isSaving,
  activeResult,
}) {
  const [formData, setFormData] = useState(DEFAULT_FORM_VALUES);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // Handle student info change
  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle numeric ATP parameter change
  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [name]: value,
      },
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  // Validate form before calculation
  const validateForm = (isSubmitting = false) => {
    const newErrors = {};

    // Validate student info if submitting to database
    if (isSubmitting) {
      if (!formData.studentName.trim()) {
        newErrors.studentName = 'Student name is required to save records.';
      }
      if (!formData.rollNumber.trim()) {
        newErrors.rollNumber = 'Roll / Registration Number is required.';
      }
    }

    // Validate all numeric parameters
    for (const param of PARAMETER_CONFIG) {
      const val = formData.parameters[param.key];
      if (val === '' || val === null || val === undefined) {
        newErrors[param.key] = `${param.label} is required.`;
      } else {
        const num = Number(val);
        if (Number.isNaN(num)) {
          newErrors[param.key] = 'Must be a valid number.';
        } else if (num < param.min || num > param.max) {
          newErrors[param.key] = `Must be between ${param.min} and ${param.max} ${param.unit}.`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Real-time Instant Preview Calculation
  const handlePreviewSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateForm(false)) {
      setGeneralError('Please correct the highlighted parameter errors before calculating.');
      return;
    }
    setGeneralError('');
    onCalculatePreview(formData.parameters, formData);
  };

  // Handle Calculate & Save directly to MongoDB
  const handleSaveSubmit = (e) => {
    if (e) e.preventDefault();
    if (!validateForm(true)) {
      setGeneralError('Please fill student details and verify parameters before saving.');
      return;
    }
    setGeneralError('');
    onSaveRecord(formData);
  };

  // Reset Form
  const handleReset = () => {
    setFormData(DEFAULT_FORM_VALUES);
    setErrors({});
    setGeneralError('');
  };

  // Fill Demo Preset Data
  const handleLoadDemo = () => {
    setFormData(DEMO_PRESET_VALUES);
    setErrors({});
    setGeneralError('');
  };

  return (
    <form className="space-y-6" onSubmit={handlePreviewSubmit}>
      {/* Top Banner with Quick Actions */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-600" />
            ATP Evaluation Parameters
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter candidate assessment marks to compute weighted ATP score.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-colors active:scale-95"
            title="Populate test data for quick college demonstration"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Fill Sample Data
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset
          </button>
        </div>
      </div>

      {/* General Validation Error Alert */}
      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Student & Project Metadata Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-600" />
            Candidate & Project Information
          </h3>
          <span className="text-[11px] text-slate-400">
            Required for saving records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Student Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Student Name
            </label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleMetaChange}
              placeholder="e.g., Aarav Sharma"
              className={`w-full rounded-xl py-2 px-3 text-sm border outline-none transition-all ${
                errors.studentName
                  ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-200 bg-white hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
              }`}
            />
            {errors.studentName && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.studentName}
              </p>
            )}
          </div>

          {/* Roll Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              Roll / Registration No.
            </label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleMetaChange}
              placeholder="e.g., CS2025-042"
              className={`w-full rounded-xl py-2 px-3 text-sm border outline-none transition-all font-mono uppercase ${
                errors.rollNumber
                  ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-100'
                  : 'border-slate-200 bg-white hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
              }`}
            />
            {errors.rollNumber && (
              <p className="text-[11px] text-red-600 font-medium">
                {errors.rollNumber}
              </p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Department
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleMetaChange}
              placeholder="e.g., Computer Science"
              className="w-full rounded-xl py-2 px-3 text-sm border border-slate-200 bg-white hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>

          {/* Project Title */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <FileCode className="w-3.5 h-3.5 text-slate-400" />
              Project / Assessment Title
            </label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleMetaChange}
              placeholder="e.g., IoT Smart Campus Gateway"
              className="w-full rounded-xl py-2 px-3 text-sm border border-slate-200 bg-white hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>

          {/* Academic Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Academic Year
            </label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleMetaChange}
              placeholder="2025-2026"
              className="w-full rounded-xl py-2 px-3 text-sm border border-slate-200 bg-white hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ATP Evaluation Parameters Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Input Scoring Parameters
            </h3>
            <span className="text-[11px] font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200/60">
              6 Configured Weights
            </span>
          </div>
          <span className="text-xs text-slate-400">Total Scale: 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PARAMETER_CONFIG.map((param) => (
            <InputField
              key={param.key}
              name={param.key}
              label={param.label}
              value={formData.parameters[param.key]}
              onChange={handleParamChange}
              error={errors[param.key]}
              unit={param.unit}
              weight={param.weight}
              min={param.min}
              max={param.max}
              step={param.step}
              placeholder={param.placeholder}
              tooltip={param.tooltip}
              icon={param.icon}
            />
          ))}
        </div>

        {/* Optional Faculty Remarks */}
        <div className="pt-2 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            Faculty Remarks & Assessment Notes (Optional)
          </label>
          <input
            type="text"
            name="remarks"
            value={formData.remarks}
            onChange={handleMetaChange}
            placeholder="e.g., Excellent defense presentation, demonstrated solid technical comprehension."
            className="w-full rounded-xl py-2 px-3 text-xs border border-slate-200 bg-white hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          />
        </div>
      </div>

      {/* Calculation Controls Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          💡 Click <strong>Preview ATP Score</strong> for instant local calculation, or <strong>Save to Database</strong> to persist.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Instant Calculate Preview Button */}
          <button
            type="submit"
            disabled={isCalculating}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 rounded-xl transition-all active:scale-95 border border-slate-200"
          >
            <Calculator className="w-4 h-4 text-brand-600" />
            {isCalculating ? 'Computing Score...' : 'Preview ATP Score'}
          </button>

          {/* Calculate & Save Button */}
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveSubmit}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-linear-to-r from-brand-600 to-emerald-600 hover:from-brand-700 hover:to-emerald-700 disabled:opacity-60 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Calculating & Saving...' : 'Save & Calculate'}
          </button>
        </div>
      </div>
    </form>
  );
}
