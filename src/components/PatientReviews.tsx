import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/doctors';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '../lib/animations';

export default function PatientReviews() {
  return (
    <section className="py-14 bg-gray-50/50 dark:bg-gray-900/30 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">VERIFIED PATIENT EXPERIENCES</span>
          <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">What Our Patients Say</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto">
            Real reviews from verified patients who have used our telemedicine and in-person consultation services.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {TESTIMONIALS.map((test) => (
            <motion.div
              key={test.id}
              className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700 transition-all duration-300 flex flex-col justify-between"
              variants={fadeInUp}
            >
              <div>
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(test.star)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="h-5 w-5 text-blue-100 dark:text-gray-800 absolute -top-1 -left-1" />
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed pl-4">
                    {test.quote}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center space-x-3">
                <img
                  src={test.photo}
                  alt={test.name}
                  className="h-9 w-9 rounded-full object-cover border border-gray-100 dark:border-gray-800"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white text-xs truncate">
                    {test.name}, <span className="font-normal text-gray-500">{test.age} yrs</span>
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono truncate">{test.condition}</p>
                </div>
                <div className="shrink-0">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
