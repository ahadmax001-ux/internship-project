import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import ATPForm from './components/ATPForm';
import ResultCard from './components/ResultCard';
import HistoryTable from './components/HistoryTable';
import AboutModal from './components/AboutModal';
import { apiService } from './services/api';
import {
  CheckCircle2,
  AlertCircle,
  X,
  Calculator,
  History,
  LayoutDashboard,
  Layers,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Score Calculation & Form State
  const [activeResult, setActiveResult] = useState(null);
  const [activeStudentInfo, setActiveStudentInfo] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // History & Statistics State
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    avgScore: 0,
    passRate: 0,
    highestScore: 0,
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [dbStatus, setDbStatus] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Check Backend Health & Load Records on Initial Mount
  useEffect(() => {
    const initApp = async () => {
      try {
        const health = await apiService.checkHealth();
        setDbStatus(health.databaseConnected || false);
      } catch (e) {
        console.warn('Backend offline check:', e);
      }
      loadRecords();
    };

    initApp();
  }, []);

  // Fetch all ATP Records from backend
  const loadRecords = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await apiService.getAllRecords();
      if (response.success) {
        setRecords(response.data || []);
        if (response.stats) {
          setStats(response.stats);
        }
      }
    } catch (err) {
      console.warn('Using client memory fallback records:', err.message);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Local calculation fallback if backend server is temporarily not reachable
  const fallbackCalculate = (params) => {
    const specs = [
      { key: 'attendance', max: 100, weight: 0.10, label: 'Attendance' },
      { key: 'theoryScore1', max: 100, weight: 0.175, label: 'Theory Exam 1' },
      { key: 'theoryScore2', max: 100, weight: 0.175, label: 'Theory Exam 2' },
      { key: 'practicalScore', max: 100, weight: 0.25, label: 'Practical / Lab' },
      { key: 'projectScore', max: 100, weight: 0.20, label: 'Term Project' },
      { key: 'continuousAssessment', max: 100, weight: 0.10, label: 'Continuous Assessment' },
    ];

    let finalScore = 0;
    const breakdown = specs.map((s) => {
      const val = Math.max(0, Math.min(100, Number(params[s.key]) || 0));
      const earned = Number(((val / s.max) * (s.max * s.weight)).toFixed(2));
      finalScore += earned;
      return {
        key: s.key,
        parameter: s.label,
        enteredValue: val,
        unit: s.key === 'attendance' ? '%' : 'marks',
        weightPercentage: Math.round(s.weight * 100),
        maxContribution: s.max * s.weight,
        earnedContribution: earned,
      };
    });

    finalScore = Number(finalScore.toFixed(2));
    let grade = 'F';
    let status = 'Failed';
    if (finalScore >= 90) { grade = 'A+'; status = 'Outstanding'; }
    else if (finalScore >= 80) { grade = 'A'; status = 'Excellent'; }
    else if (finalScore >= 70) { grade = 'B'; status = 'Very Good'; }
    else if (finalScore >= 60) { grade = 'C'; status = 'Good'; }
    else if (finalScore >= 50) { grade = 'D'; status = 'Satisfactory (Pass)'; }

    return {
      finalScore,
      maxScore: 100,
      percentage: finalScore,
      grade,
      status,
      passed: finalScore >= 50,
      breakdown,
      calculatedAt: new Date().toISOString(),
    };
  };

  // Handle Real-time Instant Preview Calculation
  const handleCalculatePreview = async (parameters, fullForm) => {
    setIsCalculating(true);
    setIsSaved(false);
    try {
      let resultData;
      try {
        const res = await apiService.calculatePreview(parameters);
        resultData = res.data;
      } catch (apiErr) {
        console.warn('API preview error, applying formula fallback:', apiErr.message);
        resultData = fallbackCalculate(parameters);
      }

      setActiveResult(resultData);
      setActiveStudentInfo({
        studentName: fullForm.studentName || 'Candidate',
        rollNumber: fullForm.rollNumber || '',
        department: fullForm.department || '',
        projectTitle: fullForm.projectTitle || '',
      });

      showToast('ATP Score calculated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Calculation error', 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  // Handle Save to Database
  const handleSaveRecord = async (fullForm) => {
    setIsSaving(true);
    try {
      let savedRecord;
      try {
        const res = await apiService.createRecord(fullForm);
        savedRecord = res.data;
      } catch (apiErr) {
        console.warn('API save error, applying local store fallback:', apiErr.message);
        const calc = fallbackCalculate(fullForm.parameters);
        savedRecord = {
          _id: 'local-' + Date.now(),
          ...fullForm,
          calculatedScore: calc.finalScore,
          percentage: calc.percentage,
          grade: calc.grade,
          status: calc.status,
          passed: calc.passed,
          breakdown: calc.breakdown,
          createdAt: new Date().toISOString(),
        };
      }

      setActiveResult({
        finalScore: savedRecord.calculatedScore,
        maxScore: 100,
        percentage: savedRecord.percentage,
        grade: savedRecord.grade,
        status: savedRecord.status,
        passed: savedRecord.passed,
        breakdown: savedRecord.breakdown,
      });

      setActiveStudentInfo({
        studentName: savedRecord.studentName,
        rollNumber: savedRecord.rollNumber,
        department: savedRecord.department,
        projectTitle: savedRecord.projectTitle,
      });

      setIsSaved(true);
      showToast('Record saved to database successfully!', 'success');

      // Refresh records in background
      await loadRecords();
    } catch (err) {
      showToast(err.message || 'Failed to save record', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Record from History
  const handleDeleteRecord = async (id) => {
    try {
      await apiService.deleteRecord(id);
      showToast('Record deleted successfully', 'success');
      loadRecords();
    } catch (err) {
      // Local fallback removal
      setRecords((prev) => prev.filter((r) => r._id !== id));
      showToast('Record removed from view', 'success');
    }
  };

  const handleResetActiveResult = () => {
    setActiveResult(null);
    setActiveStudentInfo(null);
    setIsSaved(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : 'bg-red-900 text-red-100 border-red-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onOpenAbout={() => setIsAboutOpen(true)}
        dbStatus={dbStatus}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onOpenAbout={() => setIsAboutOpen(true)}
            stats={stats}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 min-w-0">
            {currentView === 'dashboard' && (
              <Dashboard
                stats={stats}
                recentRecords={records}
                onNavigate={setCurrentView}
                onOpenAbout={() => setIsAboutOpen(true)}
              />
            )}

            {currentView === 'calculator' && (
              <div className="space-y-8 animate-in fade-in-50 duration-200">
                {/* Header Breadcrumb */}
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      ATP Score Calculator
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Input evaluation parameters with weighted score contribution
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAboutOpen(true)}
                    className="text-xs font-semibold text-brand-700 hover:text-brand-900 underline underline-offset-2"
                  >
                    Formula Rubric
                  </button>
                </div>

                {/* Grid: Form on left/top, Result on right/bottom */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className={activeResult ? 'lg:col-span-7' : 'lg:col-span-12'}>
                    <ATPForm
                      onCalculatePreview={handleCalculatePreview}
                      onSaveRecord={handleSaveRecord}
                      isCalculating={isCalculating}
                      isSaving={isSaving}
                      activeResult={activeResult}
                    />
                  </div>

                  {/* Result Section */}
                  {activeResult && (
                    <div className="lg:col-span-5 sticky top-24">
                      <ResultCard
                        result={activeResult}
                        studentInfo={activeStudentInfo}
                        onSaveToDatabase={() =>
                          handleSaveRecord({
                            ...activeStudentInfo,
                            parameters: activeResult.breakdown.reduce(
                              (acc, item) => ({ ...acc, [item.key]: item.enteredValue }),
                              {}
                            ),
                          })
                        }
                        isSaving={isSaving}
                        isSaved={isSaved}
                        onReset={handleResetActiveResult}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentView === 'history' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Assessment Score Records
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    View, search, filter, and inspect calculated student evaluations
                  </p>
                </div>

                <HistoryTable
                  records={records}
                  isLoading={isLoadingHistory}
                  onRefresh={loadRecords}
                  onDeleteRecord={handleDeleteRecord}
                  stats={stats}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onOpenAbout={() => setIsAboutOpen(true)} />

      {/* About & Formula Documentation Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
