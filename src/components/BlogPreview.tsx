import React from 'react';
import { Heart, ArrowUpRight, ChevronRight } from 'lucide-react';
import { HEALTH_BLOGS } from '../data/doctors';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from '../lib/animations';

interface BlogPreviewProps {
  onQuickCTA: (tab: string) => void;
}

export default function BlogPreview({ onQuickCTA }: BlogPreviewProps) {
  return (
    <section className="py-14 bg-gray-50/50 dark:bg-gray-900/30 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-gray-150 dark:border-gray-800">
          <div>
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">HEALTH & WELLNESS</span>
            <h3 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">Latest Health Insights</h3>
          </div>
          <button
            onClick={() => onQuickCTA('blog')}
            className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mt-2 md:mt-0 cursor-pointer"
          >
            View All Articles <ChevronRight className="h-4 w-4 ml-0.5" />
          </button>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {HEALTH_BLOGS.map(blog => (
            <motion.article
              key={blog.id}
              variants={fadeInUp}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 group cursor-pointer"
              onClick={() => onQuickCTA('blog')}
            >
              <div>
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-3 left-3 bg-blue-600 text-white rounded px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wide">
                    {blog.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-[10px] font-mono text-gray-400 font-bold">{blog.date} &bull; {blog.readTime}</p>
                  <h4 className="font-display font-bold text-sm text-gray-950 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                  <span className="font-mono font-bold">{blog.likes}</span>
                </div>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center font-bold group-hover:underline">
                  Read Article <ArrowUpRight className="h-3 w-3 ml-0.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
