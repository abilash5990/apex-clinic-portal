import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Stethoscope, HeartPulse, Sparkles, Activity, CheckCircle2, 
  ChevronRight, ArrowRight, ShieldCheck, PhoneCall, Volume2, Landmark
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DoctorSearch from './components/DoctorSearch';
import PatientDashboard from './components/PatientDashboard';
import TelemedicineRoom from './components/TelemedicineRoom';
import EmergencyFeatures from './components/EmergencyFeatures';
import AboutBlogFAQ from './components/AboutBlogFAQ';
import AIFeatures from './components/AIFeatures';
import Footer from './components/Footer';
import { Appointment, AccessibilitySettings, Doctor } from './types';

// Seed initial appointment for a highly realistic, complete onboarding look
const INITIAL_APPOINTMENT: Appointment = {
  id: 'appt-seed-1',
  doctorId: 'doc-1',
  doctorName: 'Dr. Sarah Jenkins',
  doctorSpecialization: 'General Medicine',
  doctorPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
  date: '2026-05-27',
  timeSlot: '10:00 AM',
  patientName: 'Jane Doe',
  patientPhone: '+1 (555) 724-4293',
  patientEmail: 'jane.doe@example.com',
  notes: 'Slight fatigue and high blood sugar history. Requesting preventive analysis.',
  consultationType: 'Video',
  status: 'Upcoming',
  paymentStatus: 'Paid',
  amount: 75
};

export default function App() {
  // Theme state synced with high fidelity
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Accessibility preferences for aging patients
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 'standard',
    highContrast: false,
    language: 'EN',
    speechSynthesisEnabled: false
  });

  // Navigation management
  const [activeTab, setActiveTab ] = useState<string>('home');
  const [showSOS, setShowSOS] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState({ query: '', specialization: '' });

  // Appointments ledger pool
  const [appointments, setAppointments] = useState<Appointment[]>([INITIAL_APPOINTMENT]);
  
  // Telehealth room controller
  const [activeMeeting, setActiveMeeting] = useState<Appointment | null>(null);

  // Sync theme changes with DOM node matching
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Adjust global document font sizing classes dynamically based on accessibility settings
  const getFontSizeClass = () => {
    switch (accessibility.fontSize) {
      case 'large':
        return 'text-base md:text-lg';
      case 'extra-large':
        return 'text-lg md:text-xl';
      default:
        return 'text-sm md:text-sm';
    }
  };

  // Add newly created appointment
  const handleAddNewAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
    // Smooth jump to the Patient Hub Dashboard tab to review confirm state
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 1500);
  };

  const handleQuickCTA = (tab: string) => {
    setActiveTab(tab);
    // Smooth scroll to target view anchors if on landing tab
    const el = document.getElementById(tab === 'doctors' ? 'doctor-search' : 'root');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handeDeepLinkedSymptomReferral = (doctor: Doctor) => {
    // Directly pre-set doctor query search parameters
    setSearchFilter({
      query: doctor.name,
      specialization: doctor.specialization
    });
    // Trigger focus catalog tab
    setActiveTab('home');
    setTimeout(() => {
      const el = document.getElementById('doctor-search');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    <div className={`min-h-screen bg-white transition-colors duration-300 dark:bg-gray-950 text-gray-900 dark:text-gray-100 ${
      accessibility.highContrast ? 'contrast-[105%]' : ''
    } ${getFontSizeClass()}`}>
      
      {/* Sticky clinician header */}
      <Navbar 
        theme={theme}
        setTheme={setTheme}
        accessibility={accessibility}
        setAccessibility={setAccessibility}
        activeTab={activeMeeting ? 'telehealth' : activeTab}
        setActiveTab={(tab) => {
          setActiveMeeting(null);
          setActiveTab(tab);
        }}
        showSOS={showSOS}
        setShowSOS={setShowSOS}
      />

      {/* Critical active SOS Alert banner block */}
      {showSOS && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 border-b border-red-500/20">
          <EmergencyFeatures 
            onClose={() => setShowSOS(false)} 
            accessibilityFontSize={accessibility.fontSize}
          />
        </div>
      )}

      {/* RENDER PHASE: If patient has joined an active video telehealth conference */}
      {activeMeeting ? (
        <TelemedicineRoom 
          appt={activeMeeting}
          onLeaveRoom={() => {
            setActiveMeeting(null);
            setActiveTab('dashboard');
          }}
          accessibilityFontSize={accessibility.fontSize}
        />
      ) : (
        <main className="relative animate-fadeIn">
          
          {/* TAB 1: Home Landing Flow */}
          {activeTab === 'home' && (
            <>
              {/* Interactive Hero section */}
              <Hero 
                onSearch={(q, s) => setSearchFilter({ query: q, specialization: s })}
                onQuickCTA={handleQuickCTA}
              />

              {/* Department Specializations Grid */}
              <section className="py-12 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-gray-150 dark:border-gray-850">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">PRACTICAL CARE DIVISION</span>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">Our Featured Departments</h3>
                    </div>
                    <p className="text-xs text-gray-500 max-w-sm mt-2 md:mt-0">Find qualified clinicians in adult geriatrics, pediatrics care, and other interventional heart fields.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { title: 'General Medicine', desc: 'Adult wellness care & diagnostic medicine protocols.', count: 14, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                      { title: 'Pediatrics', desc: 'Newborn wellness plans and behavioral pediatrics.', count: 8, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
                      { title: 'Cardiology', desc: 'Interventional cardiovascular care and stroke prevention.', count: 6, color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
                      { title: 'Neurology', desc: 'Cognitive research, migraine triage, and sleep therapies.', count: 4, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' }
                    ].map((div, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          setSearchFilter(prev => ({ ...prev, specialization: div.title }));
                          const el = document.getElementById('doctor-search');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-5 rounded-2xl border border-gray-150 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer dark:bg-gray-900 dark:border-gray-855 group"
                      >
                        <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${div.color} mb-4 relative`}>
                          <Stethoscope className="h-5.5 w-5.5" />
                        </div>
                        <h4 className="font-display font-bold text-[14.5px] text-gray-950 dark:text-white group-hover:text-blue-600 transition-colors">{div.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 lines-clamp-2 leading-relaxed">{div.desc}</p>
                        <div className="flex items-center justify-between mt-4 text-[10.5px] font-semibold text-blue-600 font-mono dark:text-blue-400">
                          <span>{div.count} Specialists Available</span>
                          <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Central Clinicians Database catalog and scheduling engine */}
              <DoctorSearch 
                onAddAppointment={handleAddNewAppointment}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                accessibilityFontSize={accessibility.fontSize}
              />
            </>
          )}

          {/* TAB 2: Specialists Grid catalog */}
          {activeTab === 'doctors' && (
            <DoctorSearch 
              onAddAppointment={handleAddNewAppointment}
              searchFilter={searchFilter}
              setSearchFilter={setSearchFilter}
              accessibilityFontSize={accessibility.fontSize}
            />
          )}

          {/* TAB 3: Interactive HIPAA Patient Dashboard and analytical tools */}
          {activeTab === 'dashboard' && (
            <PatientDashboard 
              appointments={appointments}
              setAppointments={setAppointments}
              onJoinRoom={(appt) => {
                setActiveMeeting(appt);
              }}
              accessibilityFontSize={accessibility.fontSize}
            />
          )}

          {/* TAB 4: Core Diagnostic AI Checker Dashboard (Symptom checking + smart Aura chat) */}
          {activeTab === 'blog' && (
            <div className="space-y-2 dark:bg-gray-950">
              {/* Symptom Checker section wrapper */}
              <AIFeatures 
                onBookDoctor={handeDeepLinkedSymptomReferral}
                accessibilityFontSize={accessibility.fontSize}
                speechSynthesisEnabled={accessibility.speechSynthesisEnabled}
              />
              
              {/* Blog FAQs */}
              <AboutBlogFAQ 
                accessibilityFontSize={accessibility.fontSize}
              />
            </div>
          )}

        </main>
      )}

      {/* Floating emergency shortcut helper button */}
      <button
        onClick={() => {
          setShowSOS(!showSOS);
          const target = document.getElementById('emergency-panel');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-red-650 hover:bg-red-700 text-white shadow-xl shadow-red-500/30 transition-transform active:scale-95 animate-pulse"
        title="Emergency SOS Fast Portal"
      >
        <ShieldAlert className="h-6 w-6" />
      </button>

      {/* Universal Footer */}
      <Footer 
        setActiveTab={(tab) => {
          setActiveMeeting(null);
          setActiveTab(tab);
        }}
        setShowSOS={setShowSOS}
      />

    </div>
  );
}
