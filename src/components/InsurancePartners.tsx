import React from 'react';
import { ShieldCheck, Building2, Users, Stethoscope } from 'lucide-react';
import { INSURANCE_PARTNERS } from '../data/doctors';
import { motion } from 'motion/react';
import { fadeInUp } from '../lib/animations';

export default function InsurancePartners() {
  return (
    <section className="py-12 bg-white dark:bg-gray-950 transition-colors border-t border-gray-100 dark:border-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
        >
          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Users, label: 'Patient Satisfaction', value: '98.7%' },
              { icon: Stethoscope, label: 'Consultations Completed', value: '50,000+' },
              { icon: ShieldCheck, label: 'Board-Certified Doctors', value: '200+' },
              { icon: Building2, label: 'Partner Hospitals', value: '45+' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-4 rounded-xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
                <stat.icon className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <p className="font-display text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Insurance partners */}
          <div className="text-center">
            <span className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accepted Insurance Providers</span>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              {INSURANCE_PARTNERS.map((partner) => (
                <div
                  key={partner}
                  className="px-4 py-2 rounded-lg border border-gray-150 bg-gray-50/50 text-xs font-bold text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                >
                  {partner}
                </div>
              ))}
              <div className="px-4 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-400">
                + 40 more providers
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
