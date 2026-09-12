import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Eye,
  Award,
  Calendar,
  User,
  GraduationCap,
  RotateCw,
  AlertCircle,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import ScoreBreakdown from './ScoreBreakdown';

export default function HistoryTable({
  records = [],
  isLoading,
  onRefresh,
  onDeleteRecord,
  stats = {},
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Filter records locally or for instant responsiveness
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = gradeFilter === 'ALL' || r.grade === gradeFilter;

    return matchesSearch && matchesGrade;
  });

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the evaluation record for ${name}?`)) {
      setDeletingId(id);
      await onDeleteRecord(id);
      setDeletingId(null);
      if (selectedRecord?._id === id) {
        setSelectedRecord(null);
      }
    }
  };

  const getGradeBadge = (grade) => {
    const colors = {
      'A+': 'bg-emerald-100 text-emerald-800 border-emerald-300',
      A: 'bg-green-100 text-green-800 border-green-300',
      B: 'bg-blue-100 text-blue-800 border-blue-300',
      C: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      D: 'bg-amber-100 text-amber-800 border-amber-300',
      F: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[grade] || 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, roll no, topic..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right filter controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Grade:</span>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none focus:border-brand-500"
            >
              <option value="ALL">All Grades</option>
              <option value="A+">Grade A+</option>
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
              <option value="D">Grade D</option>
              <option value="F">Grade F</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="Refresh database records"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Candidate / Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Project / Title</th>
                <th className="py-3 px-4 text-center">Calculated Score</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Evaluation Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && records.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RotateCw className="w-5 h-5 animate-spin text-brand-600" />
                      <span>Loading assessment records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-600">No score records found</p>
                      <p className="text-xs text-slate-400">
                        {searchQuery || gradeFilter !== 'ALL'
                          ? 'Try resetting the search filters'
                          : 'Use the ATP Calculator to calculate and save a new evaluation!'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr
                    key={rec._id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Candidate */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px] shrink-0">
                          {rec.studentName?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <span>{rec.studentName}</span>
                          <span className="block text-[10px] font-normal text-slate-400">
                            {rec.department}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Roll Number */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {rec.rollNumber}
                    </td>

                    {/* Project / Assessment */}
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {rec.projectTitle || 'General ATP'}
                    </td>

                    {/* Calculated Score */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">
                      <span className="text-brand-700">{rec.calculatedScore}</span>
                      <span className="text-[10px] text-slate-400 font-normal"> / 100</span>
                    </td>

                    {/* Grade Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${getGradeBadge(
                          rec.grade
                        )}`}
                      >
                        {rec.grade}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(rec.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                          title="View Score Details & Breakdown"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec._id, rec.studentName)}
                          disabled={deletingId === rec._id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View (Ensures full mobile responsiveness without cutoffs) */}
      <div className="md:hidden space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400">
            <FileSpreadsheet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-600">No records found</p>
          </div>
        ) : (
          filteredRecords.map((rec) => (
            <div
              key={rec._id}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rec.studentName}</h4>
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    {rec.rollNumber}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getGradeBadge(
                    rec.grade
                  )}`}
                >
                  Grade {rec.grade}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[11px] block">Calculated ATP</span>
                  <span className="text-base font-extrabold text-brand-700">
                    {rec.calculatedScore}
                    <span className="text-xs font-normal text-slate-400"> / 100</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Status</span>
                  <span className="font-semibold text-slate-800">{rec.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{new Date(rec.createdAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRecord(rec)}
                    className="inline-flex items-center gap-1 text-brand-700 font-semibold hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </button>
                  <button
                    onClick={() => handleDelete(rec._id, rec.studentName)}
                    className="inline-flex items-center gap-1 text-red-600 font-semibold hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Single Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-base">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedRecord.studentName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedRecord.rollNumber} • {selectedRecord.department}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Highlight Box */}
            <div className="bg-linear-to-r from-brand-50 to-emerald-50 rounded-2xl p-4 border border-brand-200/60 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-brand-900 uppercase">
                  Final ATP Score
                </span>
                <div className="text-3xl font-extrabold text-brand-800 mt-0.5">
                  {selectedRecord.calculatedScore}
                  <span className="text-xs font-normal text-brand-600"> / 100</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-xl text-sm font-bold border ${getGradeBadge(
                    selectedRecord.grade
                  )}`}
                >
                  Grade {selectedRecord.grade}
                </span>
                <span className="block text-xs font-medium text-emerald-800 mt-1">
                  {selectedRecord.status}
                </span>
              </div>
            </div>

            {/* Parameter Breakdown */}
            <ScoreBreakdown breakdown={selectedRecord.breakdown} />

            {/* Remarks if any */}
            {selectedRecord.remarks && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700 block mb-1">
                  Assessment Remarks:
                </span>
                <p className="text-slate-600">{selectedRecord.remarks}</p>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
