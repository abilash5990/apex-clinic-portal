import React from 'react';
import { Search, CalendarCheck, Video, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '../lib/animations';

const STEPS = [
  {
    icon: Search,
    title: 'Search Specialist',
    desc: 'Browse board-certified doctors by specialty, rating, or availability. Use our AI symptom matcher for instant recommendations.',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400',
    accent: 'border-blue-200 dark:border-blue-800'
  },
  {
    icon: CalendarCheck,
    title: 'Book Appointment',
    desc: 'Pick your preferred date, time slot, and consultation type -- video call or in-person visit. Secure checkout in seconds.',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
    accent: 'border-emerald-200 dark:border-emerald-800'
  },
  {
    icon: Video,
    title: 'Consult Your Doctor',
    desc: 'Join a HIPAA-compliant HD video room or visit the clinic. Chat, share reports, and discuss your health in real-time.',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400',
    accent: 'border-purple-200 dark:border-purple-800'
  },
  {
    icon: FileText,
    title: 'Get Digital Prescription',
    desc: 'Receive your prescription digitally, synced to your nearest pharmacy. Track follow-ups from your patient dashboard.',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
    accent: 'border-amber-200 dark:border-amber-800'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-14 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">SIMPLE & SEAMLESS</span>
          <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">How It Works</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
            From search to prescription in four simple steps. No queues, no paperwork.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className={`relative p-6 rounded-2xl border ${step.accent} bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
            >
              {/* Step number */}
              <div className="absolute top-4 right-4 font-display text-4xl font-extrabold text-gray-100 dark:text-gray-800 select-none">
                {idx + 1}
              </div>

              <div className={`h-12 w-12 rounded-xl ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="h-6 w-6" />
              </div>

              <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white mb-2">{step.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>

              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-200 dark:bg-gray-800" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
