import React, { useState } from 'react';
import { 
  Sun, Moon, Type, Volume2, VolumeX, ShieldAlert, 
  Languages, Bell, Stethoscope, Menu, X, ShieldCheck, HelpCircle
} from 'lucide-react';
import { AccessibilitySettings } from '../types';

interface NavbarProps {
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  accessibility: AccessibilitySettings;
  setAccessibility:React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showSOS: boolean;
  setShowSOS: (show: boolean) => void;
}

export default function Navbar({
  theme,
  setTheme,
  accessibility,
  setAccessibility,
  activeTab,
  setActiveTab,
  showSOS,
  setShowSOS
}: NavbarProps) {
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Dr. Jenkins sent prescription summary", unread: true },
    { id: 2, text: "Laboratory Blood Test is ready", unread: true }
  ]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  // Toggle Theme with standard aesthetic
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleHighContrast = () => {
    setAccessibility(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };

  const handleFontSize = (size: 'standard' | 'large' | 'extra-large') => {
    setAccessibility(prev => ({
      ...prev,
      fontSize: size
    }));
  };

  const toggleVoice = () => {
    setAccessibility(prev => ({
      ...prev,
      speechSynthesisEnabled: !prev.speechSynthesisEnabled
    }));
    // Play supportive confirmation sound or announce using speech synthesis if supported
    if (!accessibility.speechSynthesisEnabled && 'speechSynthesis' in window) {
      const intro = new SpeechSynthesisUtterance("Screen reader assistance enabled.");
      intro.rate = 1.0;
      window.speechSynthesis.speak(intro);
    }
  };

  const changeLanguage = (lang: 'EN' | 'ES' | 'HI' | 'FR') => {
    setAccessibility(prev => ({
      ...prev,
      language: lang
    }));
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'doctors', label: 'Specialists' },
    { id: 'dashboard', label: 'DashboardHub' },
    { id: 'blog', label: 'Awareness' }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md transition-colors duration-200 dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Hospital Branding */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-500/20 text-white transition-transform hover:scale-105">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              APEX<span className="text-blue-600">CLINIC</span>
            </span>
            <div className="flex items-center space-x-1">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span className="font-mono text-[9px] text-gray-500 dark:text-gray-400 font-medium">Verified Health Provider</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-1 lg:space-x-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMobileMenu(false);
                }}
                className={`relative px-4 py-2 font-display text-sm font-medium tracking-wide transition-colors duration-200 rounded-lg ${
                  isActive 
                    ? 'bg-blue-50/70 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Triggers Bar */}
        <div className="flex items-center space-x-2">
          
          {/* Emergency Floating SOS Toggle (Red CTA) */}
          <button
            onClick={() => setShowSOS(!showSOS)}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 ${
              showSOS 
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-500/30 animate-pulse'
                : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Emergency SOS</span>
            {showSOS ? <X className="h-3.5 w-3.5 ml-1 inline" /> : null}
          </button>

          {/* Quick Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900 rounded-lg relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-gray-100 bg-white p-3 shadow-xl dark:border-gray-800 dark:bg-gray-950 z-50">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-100 dark:border-gray-850">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Active Notifications</span>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-[10px] text-blue-600 dark:text-blue-400"
                  >
                    Clear all
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-500 py-3 text-center">No unread notifications</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.map(notif => (
                      <div key={notif.id} className="text-xs p-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100/50 dark:border-gray-800">
                        {notif.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle with Toggle Switch Appearance */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-full">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-gray-400'}`}
              title="Light Theme"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-gray-950 text-blue-400 shadow-sm' : 'text-gray-500'}`}
              title="Dark Theme"
            >
              <Moon className="h-4 w-4" />
            </button>
          </div>

          {/* Accessibility Settings Toggle */}
          <button
            onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
            className={`p-2 rounded-lg transition-colors ${showSettingsDrawer ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900'}`}
            title="Accessibility Controls"
          >
            <Type className="h-5 w-5" />
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 md:hidden text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-950 rounded-lg"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Slide-out Accessibility Settings Panel */}
      {showSettingsDrawer && (
        <div className="border-b border-gray-200 bg-gray-50 p-4 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/90 animate-fadeIn">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Font Size Adjuster */}
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center">
                <Type className="h-4 w-4 mr-1 text-blue-500" /> Patient Text Scaling
              </p>
              <div className="flex space-x-2">
                {(['standard', 'large', 'extra-large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => handleFontSize(sz)}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium border uppercase transition-colors ${
                      accessibility.fontSize === sz
                        ? 'border-blue-600 bg-blue-500 text-white dark:border-blue-500'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750'
                    }`}
                  >
                    {sz === 'standard' ? '12px (Aa)' : sz === 'large' ? '16px' : '20px (AA+)'}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Mode for Older Viewers */}
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center">
                <ShieldAlert className="h-4 w-4 mr-1 text-amber-500" /> High Contrast Assist
              </p>
              <button
                onClick={toggleHighContrast}
                className={`w-full rounded-md py-1.5 text-xs font-medium border transition-colors ${
                  accessibility.highContrast
                    ? 'bg-amber-500 text-black border-amber-500 font-bold'
                    : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
                }`}
              >
                {accessibility.highContrast ? 'ON (Maximum Contrast)' : 'OFF (Standard Theme)'}
              </button>
            </div>

            {/* Multi-language Translation selector */}
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center">
                <Languages className="h-4 w-4 mr-1 text-emerald-500" /> Language Selector
              </p>
              <div className="grid grid-cols-4 gap-1">
                {(['EN', 'ES', 'HI', 'FR'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`rounded-md py-1.5 text-xs font-medium border text-center transition-colors ${
                      accessibility.language === lang
                        ? 'bg-emerald-500 text-white border-emerald-500 font-bold'
                        : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Speech synthesis screen assistant */}
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2 flex items-center">
                {accessibility.speechSynthesisEnabled ? (
                  <Volume2 className="h-4 w-4 mr-1 text-purple-500" />
                ) : (
                  <VolumeX className="h-4 w-4 mr-1 text-gray-400" />
                )}
                Voice Reader Assistant
              </p>
              <button
                onClick={toggleVoice}
                className={`w-full rounded-md py-1.5 text-xs font-medium border transition-colors ${
                  accessibility.speechSynthesisEnabled
                    ? 'bg-purple-600 text-white border-purple-600 font-bold'
                    : 'bg-white text-gray-700 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
                }`}
              >
                {accessibility.speechSynthesisEnabled ? 'Voice Reader ACTIVE' : 'Enable Voice Assistant'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="md:hidden border-b border-gray-150 bg-white/95 px-4 py-3 dark:border-gray-800 dark:bg-gray-950/95 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMobileMenu(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
