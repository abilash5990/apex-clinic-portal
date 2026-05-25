import React, { useState } from 'react';
import { Search, Calendar, Video, CheckCircle2, ArrowRight, ShieldAlert, Activity, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { SPECIALIZATIONS, CLINICAL_DOCTORS } from '../data/doctors';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '../lib/animations';

interface HeroProps {
  onSearch: (query: string, spec: string) => void;
  onQuickCTA: (tab: string) => void;
}

const FEATURED_DOCTORS = CLINICAL_DOCTORS.filter(d => d.featured).slice(0, 4);

export default function Hero({ onSearch, onQuickCTA }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    if (val.trim().length > 1) {
      const matched = SPECIALIZATIONS.filter(s => 
        s.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (spec: string) => {
    setSearchQuery(spec);
    setSelectedSpec(spec);
    setSuggestions([]);
    onSearch(spec, spec);
    onQuickCTA('doctors');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedSpec);
    onQuickCTA('doctors');
  };

  return (
    <section className="relative overflow-hidden bg-slate-50/40 py-10 md:py-14 dark:bg-transparent">
      {/* Floating animated background orbs */}
      <motion.div
        className="absolute top-20 right-0 -z-10 h-96 w-96 rounded-full bg-blue-100/20 blur-3xl dark:bg-blue-900/10"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 left-10 -z-10 h-72 w-72 rounded-full bg-emerald-100/10 blur-3xl dark:bg-emerald-950/5"
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          
          {/* Card 1: Advanced Clinical Search & Headline (col-span-8) */}
          <motion.div 
            id="hero-search-bento"
            className="lg:col-span-8 bg-white dark:bg-gray-900/60 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-200/60 dark:hover:border-blue-800/40 hover:-translate-y-0.5 transition-all duration-300"
            variants={fadeInUp}
            custom={0}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-blue-50/50 to-transparent -z-10 dark:from-blue-950/20" />
            
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 border border-blue-100/80 dark:border-blue-900/50">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Joint Commission Accredited
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.12]">
                Book Trusted <span className="text-blue-600 dark:text-blue-400">Board-Certified</span> Doctors Online.
              </h1>
              
              <p className="max-w-xl text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                Guaranteeing medical safety, patient-friendly AI translation of lab results, instantaneous virtual emergency triages, and seamless specialist booking.
              </p>

              {/* Doctor avatars strip */}
              <div className="flex items-center space-x-3 pt-1">
                <div className="flex -space-x-2.5">
                  {FEATURED_DOCTORS.map((doc) => (
                    <img
                      key={doc.id}
                      src={doc.photo}
                      alt={doc.name}
                      className="h-9 w-9 rounded-full border-2 border-white dark:border-gray-900 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{FEATURED_DOCTORS.length} doctors</span> available now
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Clinical Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative mt-8">
              <div className="flex flex-col sm:flex-row gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:shadow-lg focus-within:shadow-blue-500/10 focus-within:border-blue-300 dark:border-gray-700 dark:bg-gray-800/80 dark:focus-within:border-blue-600/50">
                <div className="relative flex-1 flex items-center px-3 py-1.5">
                  <Search className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleQueryChange}
                    placeholder="Describe your symptoms or search a specialty..."
                    className="w-full bg-transparent text-xs sm:text-sm text-gray-900 outline-none placeholder-gray-400 dark:text-white dark:placeholder-gray-500"
                  />
                  <Sparkles className="h-4 w-4 text-blue-400/60 animate-pulse ml-1 shrink-0" />
                </div>

                <div className="hidden sm:block h-8 w-px bg-gray-200 dark:bg-gray-700 self-center" />

                <div className="relative shrink-0 px-3 py-1.5 flex items-center">
                  <select
                    value={selectedSpec}
                    onChange={(e) => setSelectedSpec(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-gray-700 outline-none dark:text-gray-300 pr-5 appearance-none cursor-pointer"
                  >
                    <option value="">All Specialties</option>
                    {SPECIALIZATIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold tracking-wide text-white transition-all hover:bg-blue-700 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Find Specialist
                </button>
              </div>

              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 z-30 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-950 transition-all">
                  <p className="text-[9px] font-bold text-gray-400 px-3 py-1.5 uppercase font-mono tracking-wider">Suggested Medical Specialties</p>
                  {suggestions.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => selectSuggestion(spec)}
                      className="flex w-full items-center px-4 py-2 text-left text-xs rounded-lg hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:hover:bg-gray-900 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mr-2 shrink-0" />
                      {spec}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </motion.div>

          {/* Card 2: Emergency SOS Hotline (col-span-4) */}
          <motion.div 
            id="emergency-bento"
            className="lg:col-span-4 bg-slate-900 dark:bg-black/80 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-0.5 transition-all duration-300"
            variants={fadeInUp}
            custom={1}
          >
            <div className="absolute top-3 right-3 flex items-center space-x-1.5 rounded-full bg-red-950/50 border border-red-500/30 px-3 py-1">
              <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping" />
              <span className="font-mono text-[9px] font-bold uppercase text-red-400 tracking-wider">Trauma Desk Active</span>
            </div>

            <div className="space-y-4 pt-4">
              <div className="h-10 w-10 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-500">
                <ShieldAlert className="h-5 w-5 animate-pulse" />
              </div>
              
              <h2 className="font-display text-2xl font-bold tracking-tight leading-tight">
                Urgent Medical Assistance?
              </h2>
              
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Connect directly with our 24/7 on-call trauma surgeons and on-site paramedics. Hit SOS for immediate telemetry dispatch.
              </p>
            </div>

            <div className="space-y-3 mt-6">
              <button
                onClick={() => {
                  const target = document.getElementById('emergency-panel');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    onQuickCTA('home');
                  }
                }}
                className="w-full flex items-center justify-between rounded-xl bg-red-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-500/10 hover:bg-red-700 hover:shadow-red-500/20 hover:scale-[1.02] transition-all active:scale-98 cursor-pointer"
              >
                <span>Trigger Emergency SOS</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center">
                <span className="font-mono text-[10px] text-slate-500 font-medium">TRAUMA UNIT DIRECT: +1 (555) 911-SURIYA</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Top Specialty Selectors (col-span-4) */}
          <motion.div
            className="lg:col-span-4 bg-white dark:bg-gray-900/60 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-blue-200/60 dark:hover:border-blue-800/40 hover:-translate-y-0.5 transition-all duration-300"
            variants={fadeInUp}
            custom={2}
          >
            <div>
              <span className="font-mono text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400">PRACTICAL CARE DIVISION</span>
              <h3 className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white mt-1">Specialties & Diagnostics</h3>
              
              <div className="mt-4 space-y-2">
                {[
                  { name: 'General Medicine', desc: 'Adult wellness care & diagnostic medicine protocols.', count: 14 },
                  { name: 'Pediatrics', desc: 'Newborn wellness plans and behavioral pediatrics.', count: 8 },
                  { name: 'Cardiology', desc: 'Interventional cardiovascular care & stroke prevention.', count: 6 },
                  { name: 'Neurology', desc: 'Cognitive research, migraine triage, and sleep therapies.', count: 4 }
                ].map((spec, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSearch(spec.name, spec.name);
                      onQuickCTA('doctors');
                    }}
                    className="w-full p-2 sm:p-2.5 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50/40 dark:hover:bg-gray-950/40 transition-all cursor-pointer flex items-center justify-between group text-left"
                  >
                    <div className="space-y-0.5">
                      <p className="text-[12.5px] font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {spec.name}
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1">{spec.desc}</p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                      <span>{spec.count} Drs</span>
                      <ChevronRightSmall />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Click a specialty slot to list clinicians</span>
              <button onClick={() => onQuickCTA('doctors')} className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">All Fields</button>
            </div>
          </motion.div>

          {/* Card 4: Treatment Statistics with sparkline (col-span-3) */}
          <motion.div
            className="lg:col-span-3 bg-blue-600 dark:bg-blue-700 rounded-3xl p-6 text-white flex flex-col justify-between relative overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
            variants={fadeInUp}
            custom={3}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            
            <div className="flex justify-between items-start">
              <motion.div
                className="h-9 w-9 rounded-lg bg-blue-500/50 border border-blue-400/30 flex items-center justify-center"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Activity className="h-5 w-5 text-white" />
              </motion.div>
              <span className="font-mono text-[9px] font-bold uppercase bg-blue-500 border border-blue-400/40 rounded px-1.5 py-0.5 tracking-wider">
                Live Rating
              </span>
            </div>

            <div className="space-y-1.5 my-4">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-display text-4xl font-extrabold tracking-tight">12.8k</span>
                <span className="text-xs font-semibold text-blue-200">Active</span>
              </div>
              <p className="text-[11px] text-blue-100 font-semibold tracking-wide">
                Patients Treated This Quarter
              </p>
            </div>

            {/* Mini sparkline chart */}
            <div className="mb-3">
              <svg viewBox="0 0 200 40" className="w-full h-8 overflow-visible">
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,30 Q20,28 40,22 T80,18 T120,24 T160,14 T200,8"
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M0,30 Q20,28 40,22 T80,18 T120,24 T160,14 T200,8 V40 H0 Z"
                  fill="url(#sparkGrad)"
                />
              </svg>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-300" />
                <span className="text-[10px] font-mono font-bold text-emerald-300">+2.4k this week</span>
              </div>
            </div>

            <div className="space-y-1 border-t border-blue-500/50 pt-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-blue-100">
                <span>Clinical Approval Rate</span>
                <span className="font-mono font-bold text-white bg-blue-500/80 px-1 rounded">99.2%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-blue-100">
                <span>National Top Safety rank</span>
                <span className="font-mono font-bold text-emerald-300">Grade A+</span>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Interactive Video Consultation Onboarding (col-span-5) */}
          <motion.div
            className="lg:col-span-5 bg-white dark:bg-gray-900/60 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-blue-200/60 dark:hover:border-blue-800/40 hover:-translate-y-0.5 transition-all duration-300"
            variants={fadeInUp}
            custom={4}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold tracking-tight text-gray-900 dark:text-white">Active Video Consultation</h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Zero waiting room delay</p>
                  </div>
                </div>
                
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Doctor preview row */}
              <div className="flex items-center space-x-3 bg-gray-50/80 dark:bg-gray-800/40 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                <img
                  src={FEATURED_DOCTORS[0]?.photo}
                  alt={FEATURED_DOCTORS[0]?.name}
                  className="h-10 w-10 rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{FEATURED_DOCTORS[0]?.name}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">{FEATURED_DOCTORS[0]?.specialization} &bull; Online now</p>
                </div>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Fully HIPAA Compliant Telemedicine Roster</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>End-to-End Encrypted HD Video Server</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Direct Digital Prescription Sync to Local Pharmacy</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onQuickCTA('doctors')}
                className="flex items-center justify-center space-x-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg px-3 py-2.5 text-xs font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Book Doctor</span>
              </button>

              <button
                onClick={() => onQuickCTA('dashboard')}
                className="flex items-center justify-center space-x-1 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-750 px-3 py-2.5 text-xs font-bold tracking-wide transition-all cursor-pointer"
              >
                <span>Dashboard Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

function ChevronRightSmall() {
  return (
    <svg className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
