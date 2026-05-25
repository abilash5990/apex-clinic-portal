import React from 'react';
import { Sparkles, Brain, ArrowRight, MessageSquare, Scan, FileSearch } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeInUp } from '../lib/animations';

interface AIAssistantTeaserProps {
  onQuickCTA: (tab: string) => void;
}

export default function AIAssistantTeaser({ onQuickCTA }: AIAssistantTeaserProps) {
  return (
    <section className="py-14 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-blue-200/60 dark:border-blue-800/40 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 dark:from-blue-950/20 dark:via-gray-900 dark:to-indigo-950/10 p-8 md:p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-blue-100/40 to-transparent -z-0 dark:from-blue-900/10" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-radial from-indigo-100/30 to-transparent -z-0 dark:from-indigo-900/10" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Content */}
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2 rounded-full bg-blue-100 dark:bg-blue-950/50 px-3 py-1 border border-blue-200/80 dark:border-blue-800/50">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Powered by Gemini AI
                </span>
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Your AI Health Assistant is Ready
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                Describe your symptoms in plain English and get instant specialty recommendations, urgency assessment, and self-care tips -- all powered by advanced medical AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onQuickCTA('blog')}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg px-5 py-3 text-xs font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <Brain className="h-4 w-4" />
                  <span>Try Symptom Checker</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onQuickCTA('blog')}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-750 px-5 py-3 text-xs font-bold tracking-wide transition-all cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat with Aura</span>
                </button>
              </div>
            </div>

            {/* Right: Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Brain, title: 'AI Symptom Triage', desc: 'Describe symptoms, get instant specialty referral and urgency level.' },
                { icon: MessageSquare, title: 'Aura Concierge', desc: 'Chat with our AI assistant for appointments, prep tips, and guidance.' },
                { icon: Scan, title: 'Lab Report Translator', desc: 'Upload lab reports and get plain-English explanations in seconds.' },
                { icon: FileSearch, title: 'Smart Prescription', desc: 'Convert shorthand prescriptions into formatted digital medicine cards.' }
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-300"
                >
                  <feat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <h5 className="font-display font-bold text-xs text-gray-900 dark:text-white mb-1">{feat.title}</h5>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
