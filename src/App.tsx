import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Stethoscope, HeartPulse, Sparkles, Activity, CheckCircle2, 
  ChevronRight, ArrowRight, ShieldCheck, PhoneCall, Volume2, Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DoctorSearch from './components/DoctorSearch';
import PatientDashboard from './components/PatientDashboard';
import TelemedicineRoom from './components/TelemedicineRoom';
import EmergencyFeatures from './components/EmergencyFeatures';
import AboutBlogFAQ from './components/AboutBlogFAQ';
import AIFeatures from './components/AIFeatures';
import Footer from './components/Footer';
import TopDoctors from './components/TopDoctors';
import PatientReviews from './components/PatientReviews';
import InsurancePartners from './components/InsurancePartners';
import HowItWorks from './components/HowItWorks';
import BlogPreview from './components/BlogPreview';
import AIAssistantTeaser from './components/AIAssistantTeaser';
import HomeFAQ from './components/HomeFAQ';
import { Appointment, AccessibilitySettings, Doctor } from './types';
import { staggerContainer, fadeInUp } from './lib/animations';

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    fontSize: 'standard',
    highContrast: false,
    language: 'EN',
    speechSynthesisEnabled: false
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [showSOS, setShowSOS] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState({ query: '', specialization: '' });
  const [appointments, setAppointments] = useState<Appointment[]>([INITIAL_APPOINTMENT]);
  const [activeMeeting, setActiveMeeting] = useState<Appointment | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

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

  const handleAddNewAppointment = (newAppt: Appointment) => {
    setAppointments(prev => [newAppt, ...prev]);
    setTimeout(() => {
      setActiveTab('dashboard');
    }, 1500);
  };

  const handleQuickCTA = (tab: string) => {
    setActiveTab(tab);
    const el = document.getElementById(tab === 'doctors' ? 'doctor-search' : 'root');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handeDeepLinkedSymptomReferral = (doctor: Doctor) => {
    setSearchFilter({
      query: doctor.name,
      specialization: doctor.specialization
    });
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

      {showSOS && (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 border-b border-red-500/20">
          <EmergencyFeatures 
            onClose={() => setShowSOS(false)} 
            accessibilityFontSize={accessibility.fontSize}
          />
        </div>
      )}

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
        <main role="main" className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >

              {/* TAB 1: Home Landing Flow */}
              {activeTab === 'home' && (
                <>
                  <Hero 
                    onSearch={(q, s) => setSearchFilter({ query: q, specialization: s })}
                    onQuickCTA={handleQuickCTA}
                  />

                  {/* Trust bar */}
                  <section className="py-6 border-y border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                        {[
                          { icon: ShieldCheck, text: 'HIPAA Compliant' },
                          { icon: ShieldCheck, text: 'Joint Commission Accredited' },
                          { icon: ShieldCheck, text: 'AMA Verified' },
                          { icon: ShieldCheck, text: 'SOC 2 Certified' }
                        ].map((badge, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                            <badge.icon className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{badge.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Department Specializations Grid */}
                  <section className="py-12 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-gray-150 dark:border-gray-800">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">PRACTICAL CARE DIVISION</span>
                          <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">Our Featured Departments</h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-2 md:mt-0">Find qualified clinicians in adult geriatrics, pediatrics care, and other interventional heart fields.</p>
                      </div>

                      <motion.div
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                      >
                        {[
                          { title: 'General Medicine', desc: 'Adult wellness care & diagnostic medicine protocols.', count: 14, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
                          { title: 'Pediatrics', desc: 'Newborn wellness plans and behavioral pediatrics.', count: 8, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
                          { title: 'Cardiology', desc: 'Interventional cardiovascular care and stroke prevention.', count: 6, color: 'text-red-500 bg-red-50 dark:bg-red-950/30' },
                          { title: 'Neurology', desc: 'Cognitive research, migraine triage, and sleep therapies.', count: 4, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' }
                        ].map((div, idx) => (
                          <motion.div 
                            key={idx}
                            variants={fadeInUp}
                            role="button"
                            tabIndex={0}
                            aria-label={`Browse ${div.title} specialists`}
                            onClick={() => {
                              setSearchFilter(prev => ({ ...prev, specialization: div.title }));
                              setActiveTab('doctors');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setSearchFilter(prev => ({ ...prev, specialization: div.title }));
                                setActiveTab('doctors');
                              }
                            }}
                            className="p-5 rounded-2xl border border-gray-150 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer dark:bg-gray-900 dark:border-gray-800 group"
                          >
                            <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${div.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                              <Stethoscope className="h-5 w-5" />
                            </div>
                            <h4 className="font-display font-bold text-[14.5px] text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{div.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{div.desc}</p>
                            <div className="flex items-center justify-between mt-4 text-[10.5px] font-semibold text-blue-600 font-mono dark:text-blue-400">
                              <span>{div.count} Specialists Available</span>
                              <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </section>

                  {/* Top Doctors Showcase */}
                  <TopDoctors onQuickCTA={handleQuickCTA} />

                  {/* Patient Reviews */}
                  <PatientReviews />

                  {/* How It Works */}
                  <HowItWorks />

                  {/* Insurance Partners & Stats */}
                  <InsurancePartners />

                  {/* AI Health Assistant Teaser */}
                  <AIAssistantTeaser onQuickCTA={handleQuickCTA} />

                  {/* Health Blog Preview */}
                  <BlogPreview onQuickCTA={handleQuickCTA} />

                  {/* FAQ */}
                  <HomeFAQ />
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

              {/* TAB 3: Patient Dashboard */}
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

              {/* TAB 4: AI Checker + Blog */}
              {activeTab === 'blog' && (
                <div className="space-y-2 dark:bg-gray-950">
                  <AIFeatures 
                    onBookDoctor={handeDeepLinkedSymptomReferral}
                    accessibilityFontSize={accessibility.fontSize}
                    speechSynthesisEnabled={accessibility.speechSynthesisEnabled}
                  />
                  <AboutBlogFAQ 
                    accessibilityFontSize={accessibility.fontSize}
                  />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      )}

      {/* Floating emergency SOS button */}
      <button
        onClick={() => {
          setShowSOS(!showSOS);
          const target = document.getElementById('emergency-panel');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        aria-label="Emergency SOS - click for immediate medical assistance"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-500/30 transition-all duration-300 active:scale-95 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/40 sos-glow"
        title="Emergency SOS Fast Portal"
      >
        <ShieldAlert className="h-6 w-6" />
      </button>

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
