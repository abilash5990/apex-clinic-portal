import React, { useState, useRef, useTransition, useMemo } from 'react';
import { 
  Calendar, FileText, Activity, ShieldAlert, Video, Trash2, ArrowUpRight, 
  Upload, FileSearch, CheckCircle2, ChevronRight, Sparkles, Heart, RefreshCw, Eye, EyeOff, BrainCircuit, Pill
} from 'lucide-react';
import { Appointment, MedicalReport, Prescription, HealthMetric } from '../types';

interface PatientDashboardProps {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  onJoinRoom: (appt: Appointment) => void;
  accessibilityFontSize: 'standard' | 'large' | 'extra-large';
}

const DEFAULT_METRIC: HealthMetric = {
  date: "Today",
  heartRate: 72,
  bloodPressure: "120/80",
  bloodSugar: 98,
  steps: 8420,
  weight: 68
};

export default function PatientDashboard({
  appointments,
  setAppointments,
  onJoinRoom,
  accessibilityFontSize
}: PatientDashboardProps) {
  
  const [activeTab, setActiveTab] = useState<'appointments' | 'reports' | 'tracking' | 'prescriptions'>('appointments');
  const [userMetrics, setUserMetrics] = useState<HealthMetric>(DEFAULT_METRIC);
  const [metricLogs, setMetricLogs] = useState<HealthMetric[]>([
    { date: 'Mon', heartRate: 74, bloodPressure: '122/82', bloodSugar: 102, steps: 6200, weight: 68.2 },
    { date: 'Tue', heartRate: 71, bloodPressure: '118/79', bloodSugar: 94, steps: 8400, weight: 68.0 },
    { date: 'Wed', heartRate: 75, bloodPressure: '121/80', bloodSugar: 98, steps: 7100, weight: 67.9 },
    { date: 'Thu', heartRate: 73, bloodPressure: '125/83', bloodSugar: 105, steps: 9000, weight: 68.1 },
    { date: 'Fri', heartRate: 72, bloodPressure: '120/80', bloodSugar: 98, steps: 8420, weight: 68.0 }
  ]);
  
  // File Upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedReports, setUploadedReports] = useState<MedicalReport[]>([
    {
      id: 'rep-1',
      fileName: 'blood_panel_lipid_04_2026.txt',
      fileSize: '1.2 KB',
      uploadedAt: '2026-04-12',
      type: 'Lab Report',
      summary: 'Lipid panel indicates optimal total cholesterol, slightly borderline LDL. High density lipoproteins are highly protective.',
      rawText: 'LIPID PANEL READINGS:\nTOTAL CHOLESTEROL: 198 mg/dL (Normal Range < 200)\nHDL: 58 mg/dL (Protect > 40)\nLDL: 112 mg/dL (Borderline 100-129)\nTRIGLYCERIDES: 140 mg/dL (Normal < 150)'
    }
  ]);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(uploadedReports[0]);
  
  // AI report output states
  const [reportText, setReportText] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [analyzingFile, setAnalyzingFile] = useState(false);

  // Smart prescription reader states
  const [prescriptionNotesText, setPrescriptionNotesText] = useState('Tab. Amoxicillin 500mg tid x 5 days, Cap. Omeprazole 20mg daily ac x 14 days, Tab. Paracetamol 650mg prn pain q6h');
  const [processedPrescription, setProcessedPrescription] = useState<any | null>(null);
  const [analyzingPrescription, setAnalyzingPrescription] = useState(false);

  // Handle Drag events as per upload guidelines
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  // Convert uploaded text files/scans context to raw text string simulating drag
  const handleFileSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const textContent = event.target?.result as string || "CHOL: 240, HDL: 45, Triglycerides: 185";
      const newReport: MedicalReport = {
        id: `rep-${Date.now()}`,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        type: file.name.includes('blood') || file.name.includes('test') ? 'Lab Report' : 'Scan',
        rawText: textContent
      };
      setUploadedReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
      setReportText(textContent);
    };
    reader.readAsText(file);
  };

  // Trigger Gemini Triage translational physician summary
  const runAIReportAnalyzer = async (report: MedicalReport) => {
    if (!report.rawText) return;
    setAnalyzingFile(true);
    setAiAnalysisResult(null);

    try {
      const response = await fetch('/api/summarize-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText: report.rawText,
          filename: report.fileName
        })
      });

      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();
      setAiAnalysisResult(data);
      
      // Save analysis of report inside uploaded state
      setUploadedReports(prev => prev.map(rep => {
        if (rep.id === report.id) {
          return { ...rep, summary: data.summary };
        }
        return rep;
      }));
    } catch (err) {
      console.error(err);
      alert("The clinical AI translator could not parse this document format. Please test with text parameters.");
    } finally {
      setAnalyzingFile(false);
    }
  };

  // Trigger Smart prescription read
  const runPrescriptionReader = async () => {
    if (!prescriptionNotesText.trim()) return;
    setAnalyzingPrescription(true);
    setProcessedPrescription(null);

    try {
      const response = await fetch('/api/smart-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prescriptionNotesText })
      });

      if (!response.ok) throw new Error("Script processing failed");
      const data = await response.json();
      setProcessedPrescription(data);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze digital dosage instructions.");
    } finally {
      setAnalyzingPrescription(false);
    }
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm("Are you sure you want to cancel this clinical appointment?")) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  // Plot custom SVG path coordinates for Heart rate stats
  const bpmPath = useMemo(() => {
    const width = 500;
    const height = 120;
    const padding = 20;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;
    
    const minVal = 60;
    const maxVal = 130;
    
    const stepX = usableWidth / (metricLogs.length - 1);
    
    const points = metricLogs.map((log, i) => {
      const x = padding + i * stepX;
      // Normalizing heart rate value to SVG height
      const y = padding + usableHeight - ((log.heartRate - minVal) / (maxVal - minVal)) * usableHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }, [metricLogs]);

  const textScaleClass = {
    'standard': 'text-sm',
    'large': 'text-base',
    'extra-large': 'text-lg'
  }[accessibilityFontSize];

  return (
    <div className="py-10 bg-gray-50/40 dark:bg-gray-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hub welcome header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200/80 pb-6 mb-8 dark:border-gray-800">
          <div>
            <div className="inline-flex items-center space-x-1 border border-blue-500/20 bg-blue-50/50 px-2 py-0.5 rounded-full dark:bg-blue-900/10">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">HIPAA Clinician Portal</span>
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">Patient Health Hub</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Keep track of prescriptions, wellness timelines, and join secure telemedicine meetings.</p>
          </div>
          
          {/* Quick Metrics Capsule */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0 bg-white p-3 rounded-2xl border border-gray-150 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500 animate-pulse shrink-0" />
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Heart rate</p>
                <p className="text-xs font-bold font-mono text-gray-900 dark:text-white">{userMetrics.heartRate} bpm</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Blood Pressure</p>
              <p className="text-xs font-bold font-mono text-gray-900 dark:text-white">{userMetrics.bloodPressure}</p>
            </div>
          </div>
        </div>

        {/* Dashboard inner layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tab Selection rail */}
          <div className="lg:col-span-1 space-y-1">
            {[
              { id: 'appointments', label: 'Appointments Tracker', icon: Calendar, color: 'text-blue-500' },
              { id: 'reports', label: 'AI Diagnostic Reports', icon: FileText, color: 'text-emerald-500' },
              { id: 'prescriptions', label: 'Prescription Reader', icon: Pill, color: 'text-purple-500' },
              { id: 'tracking', label: 'Health Indicators', icon: Activity, color: 'text-rose-500' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-xs font-semibold tracking-wide transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <tab.icon className={`h-4.5 w-4.5 ${activeTab === tab.id ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </button>
            ))}
          </div>

          {/* Active Pane Display Area */}
          <div className="lg:col-span-3 rounded-2xl bg-white p-6 border border-gray-150/80 shadow-sm dark:bg-gray-900 dark:border-gray-850">
            
            {/* TAB: Appointments Panel */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Scheduled Appointments ({appointments.length})</h3>
                  <span className="font-mono text-[10px] text-gray-400">Updates hourly</span>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-14">
                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-500">No active healthcare consultations found</p>
                    <p className="text-[11px] text-gray-450 mt-1">Book a clinician from the Specialists catalog to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appt) => (
                      <div 
                        key={appt.id} 
                        className="p-4 rounded-xl border border-gray-150 bg-gray-50/50 flex flex-col md:flex-row md:items-center md:justify-between dark:border-gray-800 dark:bg-gray-950/40"
                      >
                        <div className="flex items-center space-x-3.5 mb-3 md:mb-0">
                          <img 
                            src={appt.doctorPhoto} 
                            alt={appt.doctorName} 
                            className="h-12 w-12 rounded-lg object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full dark:bg-blue-950/30 dark:text-blue-400 font-bold uppercase">{appt.doctorSpecialization}</span>
                            <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm mt-0.5">{appt.doctorName}</h4>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <Calendar className="h-3.5 w-3.5 mr-1" /> {appt.date} at {appt.timeSlot} • <span className="font-semibold text-blue-600 dark:text-blue-400 ml-1">{appt.consultationType} consultation</span>
                            </p>
                          </div>
                        </div>

                        {/* Actions block */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {appt.consultationType === 'Video' ? (
                            <button
                              onClick={() => onJoinRoom(appt)}
                              className="flex-1 md:flex-initial py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs tracking-wide shadow-md shadow-emerald-500/10 flex items-center justify-center space-x-1"
                            >
                              <Video className="h-4 w-4" />
                              <span>Join Telehealth Room</span>
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-gray-500 px-3 bg-gray-100 rounded py-2 dark:bg-gray-900">Clinic Visit Slot</span>
                          )}
                          
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg"
                            title="Cancel appointment slot"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: AI Clinical Reports summaries */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">AI Translational Medical Summaries</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Drag diagnostic reports or medical text documents, and translate them into layman plain English instantly.</p>
                </div>

                {/* Upload zone with Drag and Drop as requested */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
                      : 'border-gray-200 hover:border-blue-400 dark:border-gray-800'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.doc"
                  />
                  <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Drag & Drop Laboratory File here, or click to browse</p>
                  <p className="text-[10px] text-gray-400 mt-1">Supports clinical raw text files (.txt, .doc) up to 10MB</p>
                </div>

                {/* Simulated Quick Text Box if the patient has no file nearby */}
                <div className="bg-gray-50 p-4 rounded-xl dark:bg-gray-950 border border-gray-150 dark:border-gray-850">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-gray-550 dark:text-gray-400">Paste raw medical parameters directly (e.g., Blood chemistry results)</span>
                    <button 
                      onClick={() => setReportText("HB: 10.4 g/dL (Low), GLUCOSE FASTING: 142 mg/dL (High), BUN: 22 (Borderline), URINE PROTEIN: Trace")}
                      className="text-[10px] text-blue-600 underline font-mono dark:text-blue-400"
                    >
                      Fill sample raw report
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="WBC: 11.2 (High), PLT: 250 (Normal). Patient reports acute throat soreness..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    className="w-full bg-white rounded-lg p-2 text-xs border border-gray-150 outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-800 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      const rep: MedicalReport = {
                        id: `rep-${Date.now()}`,
                        fileName: 'pasted_blood_chemistry.txt',
                        fileSize: '120 bytes',
                        uploadedAt: 'Today',
                        type: 'Lab Report',
                        rawText: reportText
                      };
                      setUploadedReports(prev => [rep, ...prev]);
                      setSelectedReport(rep);
                      runAIReportAnalyzer(rep);
                    }}
                    disabled={!reportText || analyzingFile}
                    className="mt-3 py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer ml-auto"
                  >
                    {analyzingFile ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <BrainCircuit className="h-3.5 w-3.5" />}
                    <span>Translate into Plain English</span>
                  </button>
                </div>

                {/* Uploaded History Files List and translation screen */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                  <div className="md:col-span-4 border-r border-gray-100 pr-4 space-y-2 dark:border-gray-800">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Piles of Reports</p>
                    {uploadedReports.map(rep => (
                      <button
                        key={rep.id}
                        onClick={() => setSelectedReport(rep)}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-start space-x-2 ${
                          selectedReport?.id === rep.id
                            ? 'border-blue-500 bg-blue-50/20 text-blue-600 dark:bg-blue-950/20'
                            : 'border-gray-100 hover:bg-gray-50 text-gray-700 dark:border-gray-800 dark:hover:bg-gray-950 dark:text-gray-300'
                        }`}
                      >
                        <FileText className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
                        <div>
                          <p className="font-bold truncate max-w-[120px]">{rep.fileName}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{rep.uploadedAt} • {rep.fileSize}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Document translation output details */}
                  <div className="md:col-span-8 bg-blue-50/20 rounded-xl p-4.5 border border-blue-500/10 dark:bg-gray-950">
                    {selectedReport ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">Active File: {selectedReport.fileName}</h4>
                          {!selectedReport.summary && !aiAnalysisResult && (
                            <button
                              onClick={() => runAIReportAnalyzer(selectedReport)}
                              disabled={analyzingFile}
                              className="px-2.5 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 flex items-center space-x-1"
                            >
                              {analyzingFile ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                              <span>Analyze now</span>
                            </button>
                          )}
                        </div>

                        {/* Raw preview */}
                        <div>
                          <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-400">Raw Clinical Output Preview</span>
                          <p className="p-2 border border-gray-150/40 bg-white dark:bg-gray-900 text-[10px] font-mono text-gray-600 dark:text-gray-350 rounded overflow-x-auto max-h-32">
                            {selectedReport.rawText || "No readable alphanumeric details available."}
                          </p>
                        </div>

                        {/* Translating loader */}
                        {analyzingFile && (
                          <div className="text-center py-6">
                            <RefreshCw className="h-6 w-6 text-blue-500 animate-spin mx-auto mb-2" />
                            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Translating complex terms into secure explanations...</p>
                            <p className="text-[10px] text-gray-400">Powered by Clinician-Translate-3.5</p>
                          </div>
                        )}

                        {/* AI Transliterated explanation */}
                        {(aiAnalysisResult || selectedReport.summary) && (
                          <div className="space-y-4 pt-1 border-t border-dashed border-gray-150/60 dark:border-gray-800">
                            <div>
                              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-emerald-600 flex items-center">
                                <Sparkles className="h-3.5 w-3.5 mr-1" /> Plain English Interpretation
                              </span>
                              <p className={`text-xs text-gray-700 mt-1 dark:text-gray-300 leading-relaxed`}>
                                {aiAnalysisResult?.summary || selectedReport.summary}
                              </p>
                            </div>

                            {aiAnalysisResult?.keyMetrics && (
                              <div>
                                <span className="text-[9px] uppercase font-mono tracking-black text-gray-400 font-bold">Identified Biological Readings</span>
                                <div className="space-y-1.5 mt-1.5">
                                  {aiAnalysisResult.keyMetrics.map((met: any, idx: number) => (
                                    <div key={idx} className="flex justify-between p-2 rounded-lg bg-white border border-gray-150 dark:bg-gray-900 text-xs dark:border-gray-800">
                                      <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{met.metric}</p>
                                        <p className="text-[10px] text-gray-400">{met.comment}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-mono font-bold text-gray-950 dark:text-white">{met.value}</p>
                                        <span className={`text-[9px] font-extrabold font-mono tracking-wider px-1.5 py-0.5 rounded ${
                                          met.status === 'Optimal' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                          {met.status}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {aiAnalysisResult?.clinicalVocabulary && (
                              <div>
                                <span className="text-[9px] uppercase font-mono tracking-black text-gray-400 font-bold">Medical Vocabulary Decoded</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                  {aiAnalysisResult.clinicalVocabulary.map((voc: any, idx: number) => (
                                    <div key={idx} className="p-2 border border-blue-100 rounded-lg bg-blue-50/20 text-xs dark:bg-gray-900 dark:border-gray-805">
                                      <p className="font-bold text-blue-700 dark:text-blue-400 font-mono text-[11px]">{voc.latinWord}</p>
                                      <p className="text-gray-550 dark:text-gray-350 text-[10px] leading-snug mt-0.5">{voc.explanation}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-450 p-6 text-center">Select or upload a blood scan/report to review structured translations.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB: Prescription Reader */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Smart Prescription Reader</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5">Translate messy, shorthand doctor prescriptions instantly into clear digital calendars.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Notes inputs */}
                  <div className="md:col-span-5 space-y-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">Shorthand handwritten text inputs</label>
                    <textarea
                      rows={5}
                      value={prescriptionNotesText}
                      onChange={(e) => setPrescriptionNotesText(e.target.value)}
                      className="w-full bg-gray-50/50 hover:bg-white rounded-xl p-3 text-xs border border-gray-150 outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                      placeholder="e.g. Tab. Metformin 500mg daily ac..."
                    />
                    <button
                      onClick={runPrescriptionReader}
                      disabled={analyzingPrescription || !prescriptionNotesText.trim()}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      {analyzingPrescription ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Pill className="h-4 w-4" />}
                      <span>Format Shorthand Guidelines</span>
                    </button>
                    
                    <div className="rounded-xl bg-gray-100 p-3 text-[11px] text-gray-600 dark:bg-gray-950 dark:text-gray-300">
                      <p className="font-bold">Medical shorthand tips:</p>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>**tid**: Three times daily</li>
                        <li>**ac**: Before meals</li>
                        <li>**prn**: As needed</li>
                        <li>**q6h**: Every 6 hours</li>
                      </ul>
                    </div>
                  </div>

                  {/* Formatted guideline card */}
                  <div className="md:col-span-7 bg-purple-50/10 rounded-2xl p-5 border border-purple-500/10 dark:bg-gray-950/80">
                    {analyzingPrescription && (
                      <div className="text-center py-10 space-y-2">
                        <RefreshCw className="h-8 w-8 text-purple-500 animate-spin mx-auto" />
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Formulating precise digital schedules...</p>
                      </div>
                    )}

                    {!analyzingPrescription && !processedPrescription && (
                      <div className="text-center py-14 space-y-2 text-gray-400">
                        <FileSearch className="h-10 w-10 mx-auto" />
                        <p className="text-xs">No active formatted prescriptions. Paste shorthand notes and click "Format".</p>
                      </div>
                    )}

                    {processedPrescription && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2 dark:border-gray-800">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">Clinically Formatted Digital Script</span>
                            <h4 className="font-display font-black text-gray-900 dark:text-white text-sm">Diagnosis: {processedPrescription.diagnosis}</h4>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>

                        <div className="space-y-3">
                          {processedPrescription.medicines.map((med: any, idx: number) => (
                            <div key={idx} className="p-3 bg-white hover:shadow-sm rounded-xl border border-gray-150 flex justify-between items-start dark:bg-gray-900 dark:border-gray-800">
                              <div>
                                <h5 className="font-black text-gray-900 dark:text-white text-xs">{med.name}</h5>
                                <p className="text-[10px] text-gray-400 mt-0.5">{med.instructions}</p>
                              </div>
                              <div className="text-right space-y-1">
                                <span className="text-[10.5px] font-bold font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-900/10 dark:text-blue-400">{med.dosage}</span>
                                <p className="text-[10px] text-gray-600 dark:text-gray-400">{med.frequency} • <span className="font-semibold text-gray-800 dark:text-gray-200">{med.duration}</span></p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Health Indicators Telemetry & charting */}
            {activeTab === 'tracking' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm">Historical Health Telemetry</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">Visualize biometric logs synced from patient monitoring wearables.</p>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-mono font-bold dark:bg-emerald-950/20">Fitbit Active Integration</span>
                </div>

                {/* Grid stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 text-center dark:bg-gray-950 dark:border-gray-850">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Resting BPM</p>
                    <p className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">72 <span className="text-xs text-gray-400">bpm</span></p>
                    <span className="text-[10px] text-emerald-500 font-bold">Stable Range</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 text-center dark:bg-gray-950 dark:border-gray-850">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Blood Sugar</p>
                    <p className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">98 <span className="text-xs text-gray-400">mg/dL</span></p>
                    <span className="text-[10px] text-emerald-500 font-bold">Optimal Fasting</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 text-center dark:bg-gray-950 dark:border-gray-850">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Daily Movement</p>
                    <p className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">8,420 <span className="text-xs text-gray-405">steps</span></p>
                    <span className="text-[10px] text-blue-500 font-bold">84% of Goal achieved</span>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 text-center dark:bg-gray-950 dark:border-gray-850">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono">Weight Index</p>
                    <p className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">68.0 <span className="text-xs text-gray-400">kg</span></p>
                    <span className="text-[10px] text-gray-400">BMI 21.4 (Normal)</span>
                  </div>
                </div>

                {/* SVG Heart Rate Area Charting for absolute responsive density compliance */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">My rest heart-rate trend over the week (BPM)</span>
                  <div className="mt-2 w-full h-[140px] bg-gray-50 rounded-xl border border-gray-100 p-2 dark:bg-gray-950 dark:border-gray-850 relative">
                    <svg className="w-full h-full max-h-[120px]" viewBox="0 0 500 120" preserveAspectRatio="none">
                      {/* Gradient definition */}
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      <line x1="20" y1="20" x2="480" y2="20" stroke="#9ca3af" strokeDasharray="3,3" strokeOpacity="0.15" />
                      <line x1="20" y1="60" x2="480" y2="60" stroke="#9ca3af" strokeDasharray="3,3" strokeOpacity="0.15" />
                      <line x1="20" y1="100" x2="480" y2="100" stroke="#9ca3af" strokeDasharray="3,3" strokeOpacity="0.15" />
                      
                      {/* Shaded Area fill */}
                      <path d={`${bpmPath} L 480 100 L 20 100 Z`} fill="url(#chartGrad)" />
                      {/* Blue Line path */}
                      <path d={bpmPath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>

                    {/* Chart axis label tags */}
                    <div className="absolute inset-x-0 bottom-1 flex justify-between px-6 text-[10px] font-mono text-gray-400">
                      <span>Mon (74)</span>
                      <span>Tue (71)</span>
                      <span>Wed (75)</span>
                      <span>Thu (73)</span>
                      <span>Fri (72)</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
