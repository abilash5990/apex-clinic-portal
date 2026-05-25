import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { CORE_FAQS } from '../data/doctors';
import { motion } from 'motion/react';
import { fadeInUp } from '../lib/animations';

export default function HomeFAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section className="py-14 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
        >
          <div className="text-center mb-8">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">PATIENT HELP CENTER</span>
            <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">Frequently Asked Questions</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Quick answers to common questions about our platform and services.
            </p>
          </div>

          <div className="space-y-3">
            {CORE_FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-gray-150 bg-white dark:bg-gray-900 dark:border-gray-800 overflow-hidden hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-gray-950 dark:text-white cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center space-x-2.5 pr-4">
                      <HelpCircle className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>{faq.q}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pl-11 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
