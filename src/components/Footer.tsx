import React from 'react';
import { Stethoscope, Heart, ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setShowSOS: (show: boolean) => void;
}

export default function Footer({ setActiveTab, setShowSOS }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-gray-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-gray-150/80 dark:border-gray-850">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Stethoscope className="h-4.5 w-4.5" />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-gray-950 dark:text-white">
                APEX<span className="text-blue-600">CLINIC</span>
              </span>
            </div>
            <p className="text-xs text-gray-550 dark:text-gray-400 max-w-sm leading-relaxed">
              Leading clinical center for adult medicine, pediatrics and interventional specialty consultations. Book board-certified doctors online and consult physically or via live HIPAA-compliant video.
            </p>
            <div className="flex items-center space-x-1.5 text-[10.5px] text-gray-400 font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Registered Under Joint Commisions of Health, Lic #998-32-A</span>
            </div>
          </div>

          {/* Quick tabs links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono text-[10.5px]">Clinics & Portal</h4>
            <div className="grid grid-cols-1 gap-2 text-gray-500 font-medium dark:text-gray-400">
              <button onClick={() => { setActiveTab('home'); }} className="text-left hover:text-blue-600 transition-colors">Home Landing</button>
              <button onClick={() => { setActiveTab('doctors'); }} className="text-left hover:text-blue-600 transition-colors">Specialist Catalog</button>
              <button onClick={() => { setActiveTab('dashboard'); }} className="text-left hover:text-blue-600 transition-colors">Patient Hub Dashboard</button>
              <button onClick={() => { setActiveTab('blog'); }} className="text-left hover:text-blue-600 transition-colors">Daily Health Blog</button>
              <button onClick={() => { setShowSOS(true); }} className="text-left text-red-500 font-semibold hover:underline">Crisis SOS Center</button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider font-mono text-[10.5px]">Apex Health Group HQ</h4>
            <div className="space-y-2 text-gray-650 dark:text-gray-400">
              <p className="flex items-center"><MapPin className="h-4 w-4 text-blue-500 mr-2 shrink-0" /> 500 Medical Plaza, Suite 400, Metro Clinical Campus</p>
              <p className="flex items-center"><Phone className="h-4 w-4 text-blue-500 mr-2 shrink-0" /> General Info: +1 (800) APEX-HELP (273-9435)</p>
              <p className="flex items-center"><Mail className="h-4 w-4 text-blue-500 mr-2 shrink-0" /> Inquiries: support@apexclinicportal.com</p>
            </div>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-[10px] text-gray-400 gap-4">
          <p>© 2026 Apex Clinic Health Systems Group. All rights reserved. HIPAA Protected Data Environment.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:underline flex items-center">Privacy Policy <ExternalLink className="h-2.5 w-2.5 ml-1" /></a>
            <a href="#" className="hover:underline flex items-center">Healthcare Guidelines <ExternalLink className="h-2.5 w-2.5 ml-1" /></a>
            <a href="#" className="hover:underline">Terms of Use</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
