import React, { useState } from 'react';
import { 
  BookOpen, Star, Award, Heart, MessageSquare, ChevronDown, Check,
  Activity, ArrowUpRight, ShieldCheck, Flame, BookText
} from 'lucide-react';
import { HEALTH_BLOGS, CORE_FAQS } from '../data/doctors';

interface AboutProps {
  accessibilityFontSize: 'standard' | 'large' | 'extra-large';
}

export default function AboutBlogFAQ({ accessibilityFontSize }: AboutProps) {
  
  // Blog likes incremental state
  const [blogLikes, setBlogLikes] = useState<Record<string, number>>({
    'blog-1': 124,
    'blog-2': 89,
    'blog-3': 215
  });

  const handleLikeBlog = (id: string) => {
    setBlogLikes(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
  };

  // FAQ Accordions active tracking
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Client testimonies list
  const TESTIMONIALS = [
    {
      name: 'Eleanor Vance',
      age: 62,
      condition: 'Cardiovascular Hypertension',
      doctor: 'Dr. Elena Rostova',
      quote: 'ApexClinic made it seamless to monitor my cardiac telemetry. The AI report helper translated my blood scans into words I could actually comprehend. Dr. Elena gave me peace of mind.',
      star: 5
    },
    {
      name: 'Gabriel Martinez',
      age: 28,
      condition: 'Acute Dermatological Shingles',
      doctor: 'Dr. Aaron Chen',
      quote: 'Excellent UI. Scheduled my video consult within two clicks. My telehealth room was robust, and Dr. Chen prescribed my ointment digitally. Seamless experience!',
      star: 5
    }
  ];

  const textScaleClass = {
    'standard': 'text-sm',
    'large': 'text-base',
    'extra-large': 'text-lg'
  }[accessibilityFontSize];

  return (
    <div className="py-12 bg-gray-50/50 dark:bg-gray-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* SECTION 1: Health Awareness Blog */}
        <div>
          <div className="uppercase tracking-wide mb-8">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">AWARENESS & WELLNESS</span>
            <h2 className="font-display text-2.5xl font-bold tracking-tight text-gray-905 dark:text-white mt-1">Health Tips from Our Faculty</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HEALTH_BLOGS.map(blog => (
              <article 
                key={blog.id} 
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-150 bg-white shadow-sm hover:shadow-md transition-all dark:border-gray-850 dark:bg-gray-900"
              >
                <div>
                  <div className="h-44 w-full overflow-hidden relative">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover saturate-[95%]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 bg-blue-600 text-white rounded px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wide">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <p className="text-[10px] font-mono text-gray-400 font-bold">{blog.date} • {blog.readTime}</p>
                    <h3 className="font-display font-bold text-sm text-gray-950 dark:text-white leading-snug hover:text-blue-600 cursor-pointer">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-350 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                    <p className="text-[10px] italic text-gray-400 pt-1">Written by {blog.author}</p>
                  </div>
                </div>

                {/* Like / Share triggers */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center dark:border-gray-800">
                  <button 
                    onClick={() => handleLikeBlog(blog.id)}
                    className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <span className="font-mono font-bold">{blogLikes[blog.id]} likes</span>
                  </button>
                  <span className="text-[10px] text-blue-600 flex items-center font-bold hover:underline cursor-pointer">
                    Read Article <ArrowUpRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* SECTION 2: FAQ and Testimonials Dual Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 items-start">
          
          {/* FAQ Accordion list */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">PATIENT HELP CENTRE</span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-gray-905 dark:text-white mt-1">Frequently Asked Concerns</h2>
            </div>

            <div className="space-y-3">
              {CORE_FAQS.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div 
                    key={index}
                    className="rounded-xl border border-gray-150/80 bg-white dark:bg-gray-900 dark:border-gray-850 overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full p-4 text-left flex justify-between items-center text-xs font-bold text-gray-950 dark:text-white cursor-pointer"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown className={`h-4.5 w-4.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-600 leading-relaxed dark:border-gray-800 dark:bg-gray-950/40 dark:text-gray-300">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Testimonies Trust column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono text-xs font-bold text-emerald-500">TRUST INDICATORS</span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-gray-905 dark:text-white mt-1">Voice of Healthy Families</h2>
            </div>

            <div className="space-y-3">
              {TESTIMONIALS.map((test, index) => (
                <div 
                  key={index}
                  className="rounded-2xl border border-gray-150 bg-white p-5 shadow-sm dark:bg-gray-900 dark:border-gray-850"
                >
                  <div className="flex items-center space-x-1.5 mb-2.5">
                    {[...Array(test.star)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-gray-700 italic leading-relaxed dark:text-gray-300">
                    "{test.quote}"
                  </p>

                  <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-950 dark:text-white text-xs">{test.name}, <span className="font-normal text-gray-500">{test.age} yrs</span></h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{test.condition}</p>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded dark:bg-emerald-950/20">Checked by {test.doctor.split(' ').pop()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* National accolades banner */}
            <div className="rounded-xl border border-blue-500/10 bg-blue-50/25 p-4 dark:bg-blue-950/10 flex items-center space-x-3.5">
              <Award className="h-10 w-10 text-blue-650 shrink-0" />
              <div>
                <h5 className="font-bold text-xs text-gray-900 dark:text-white">Rated #1 Telehealth Provider</h5>
                <p className="text-xs text-gray-500 mt-0.5">Recognized for digital safety and clinical triage clarity across the State.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
