import React from 'react';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';
import { CLINICAL_DOCTORS } from '../data/doctors';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '../lib/animations';

interface TopDoctorsProps {
  onQuickCTA: (tab: string) => void;
}

const FEATURED = CLINICAL_DOCTORS.filter(d => d.featured);

export default function TopDoctors({ onQuickCTA }: TopDoctorsProps) {
  return (
    <section className="py-14 bg-white dark:bg-gray-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-gray-150 dark:border-gray-800">
          <div>
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">MEET OUR SPECIALISTS</span>
            <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">Top-Rated Doctors</h3>
          </div>
          <button
            onClick={() => onQuickCTA('doctors')}
            className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2 md:mt-0 cursor-pointer"
          >
            View All Specialists <ChevronRight className="h-4 w-4 ml-0.5" />
          </button>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {FEATURED.map((doctor) => (
            <motion.div
              key={doctor.id}
              className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-200/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800/40 transition-all duration-300 cursor-pointer group"
              variants={fadeInUp}
              onClick={() => onQuickCTA('doctors')}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <img
                    src={doctor.photo}
                    alt={`${doctor.name}, ${doctor.specialization} specialist`}
                    className="h-14 w-14 rounded-xl object-cover border border-gray-100 dark:border-gray-800"
                    referrerPolicy="no-referrer"
                  />
                  {doctor.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 animate-pulse" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {doctor.name}
                  </h4>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-medium">{doctor.specialization}</p>
                  <p className="text-[10px] text-gray-400 truncate">{doctor.degree}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs mb-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-gray-900 dark:text-white font-mono">{doctor.rating}</span>
                  <span className="text-[10px] text-gray-400">({doctor.reviewsCount})</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono text-[10px]">{doctor.experience} yrs</span>
                </div>
              </div>

              <div className="flex items-center text-[10px] text-gray-400 mb-3">
                <MapPin className="h-3 w-3 mr-1 shrink-0" />
                <span className="truncate">{doctor.location}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <span className="text-xs font-mono font-bold text-gray-900 dark:text-white">${doctor.consultationFee}</span>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center">
                  Book Now <ChevronRight className="h-3 w-3 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
