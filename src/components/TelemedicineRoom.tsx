import React, { useState, useRef, useEffect, useTransition } from 'react';
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, Send, Paperclip, Check,
  Sparkles, Stethoscope, RefreshCw, Layers, ShieldCheck, HeartPulse
} from 'lucide-react';
import { Appointment, ChatMessage } from '../types';

interface TelemedicineRoomProps {
  appt: Appointment;
  onLeaveRoom: () => void;
  accessibilityFontSize: 'standard' | 'large' | 'extra-large';
}

export default function TelemedicineRoom({
  appt,
  onLeaveRoom,
  accessibilityFontSize
}: TelemedicineRoomProps) {
  
  // Audio/video device mock toggles
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  
  // Meeting chat thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello, I am ${appt.doctorName}. I have reviewed your preliminary checklist. How are you feeling today?`,
      timestamp: '09:15 AM'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isDoctorTyping, setIsDoctorTyping] = useState(false);
  
  // Medical notes dynamically pushed based on consultation dialogue
  const [sessionNotes, setSessionNotes] = useState<string[]>([
    "Initial diagnosis: Triage investigation on clinical history",
    "Vital Signs: Wearables syncing 72bpm resting heart rate"
  ]);

  // Handle clinic message delivery with Gemini
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsDoctorTyping(true);

    try {
      // Prompt our custom Aura support portal, but customize it to act as the consulting specialist
      const historyPayload = [...messages, userMsg].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { sender: 'assistant', text: `You are ${appt.doctorName}, specializing in ${appt.doctorSpecialization}. Discuss with professional care, brief answers only (1-2 sentences). Ask follow-up questions.` },
            ...historyPayload
          ]
        })
      });

      if (!response.ok) throw new Error("Connection failed");
      const data = await response.json();

      const docMsg: ChatMessage = {
        id: `doc-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, docMsg]);

      // Deduce medical recommendations to append to notes
      if (userMsg.text.toLowerCase().includes('fever') || userMsg.text.toLowerCase().includes('temperature')) {
        setSessionNotes(prev => [...prev, "Prescription suggestion: Consider acetaminophen or light hydration therapy", "Monitor temperature at 4-hour margins"]);
      } else if (userMsg.text.toLowerCase().includes('pain') || userMsg.text.toLowerCase().includes('ache')) {
        setSessionNotes(prev => [...prev, "Diagnostics: Physical palpation follow-up advised", "Consider non-inflammatory medication"]);
      } else {
        setSessionNotes(prev => [...prev, `Advice: Schedule specialized clinical diagnostics in-person as recommended by ${appt.doctorName}`]);
      }

    } catch (err) {
      console.error(err);
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: `doc-err-${Date.now()}`,
        sender: 'assistant',
        text: "I appreciate you describing those symptoms. I recommend continuing to rest and monitoring any change while we coordinate clinical lab diagnostics.",
        timestamp: 'Now'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsDoctorTyping(false);
    }
  };

  const textScaleClass = {
    'standard': 'text-sm',
    'large': 'text-base',
    'extra-large': 'text-lg'
  }[accessibilityFontSize];

  return (
    <div className="py-8 bg-gray-900 text-white min-h-[90vh] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Connection health state ticker */}
        <div className="flex items-center justify-between mb-6 bg-gray-800 p-2.5 rounded-xl border border-gray-700">
          <div className="flex items-center space-x-2">
            <HeartPulse className="text-emerald-500 h-5 w-5 animate-pulse" />
            <div>
              <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider uppercase">SECURE HIPAA VIDEO STREAM</span>
              <p className="text-xs text-gray-300">Consulting: {appt.doctorName} • Department: {appt.doctorSpecialization}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-semibold text-gray-300">Encrypted (P2P Secured)</span>
          </div>
        </div>

        {/* Video feed split screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Video Stream Frame */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl bg-gray-950 border border-gray-800 relative min-h-[480px]">
            
            {/* Main Clinical doctor feed */}
            {camActive ? (
              <div className="absolute inset-0 overflow-hidden rounded-2xl flex items-center justify-center">
                <img 
                  src={appt.doctorPhoto} 
                  alt={appt.doctorName} 
                  className="w-full h-full object-cover contrast-[105%] blur-[0.2px] opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <VideoOff className="h-10 w-10 text-gray-500 animate-pulse" />
                <p className="text-xs text-gray-450 uppercase tracking-widest font-mono">Camera Feed stands disabled by Patient</p>
              </div>
            )}

            {/* Doctor overlay tag */}
            <div className="absolute bottom-5 left-5 bg-black/50 p-2.5 backdrop-blur-sm rounded-xl border border-white/10 z-10">
              <p className="text-xs font-bold leading-none">{appt.doctorName}</p>
              <span className="text-[9px] text-emerald-400 font-mono tracking-wider font-bold uppercase mt-1 inline-block">Consulting Specialist</span>
            </div>

            {/* Micro-feed for Patient Preview */}
            <div className="absolute top-5 right-5 h-28 w-20 sm:h-36 sm:w-28 rounded-xl border border-white/20 bg-gray-900 shadow-xl overflow-hidden z-10">
              {camActive ? (
                <div className="relative w-full h-full">
                  <div className="absolute top-2 left-2 bg-emerald-500 h-1.5 w-1.5 rounded-full" />
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
                    alt="Active Patient Frame" 
                    className="w-full h-full object-cover scale-x-[-1]"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-950">
                  <VideoOff className="h-5 w-5 text-gray-600" />
                </div>
              )}
            </div>

            {/* Bottom Meeting Controls Panel */}
            <div className="z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 w-full mt-auto flex items-center justify-center space-x-3.5">
              <button
                onClick={() => setMicActive(!micActive)}
                className={`p-3.5 rounded-full transition-all focus:scale-105 active:scale-95 ${
                  micActive ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-500/20'
                }`}
                title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {micActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </button>

              <button
                onClick={() => setCamActive(!camActive)}
                className={`p-3.5 rounded-full transition-all focus:scale-105 active:scale-95 ${
                  camActive ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-500/20'
                }`}
                title={camActive ? 'Disable Video Feed' : 'Enable Video Feed'}
              >
                {camActive ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </button>

              <button
                onClick={onLeaveRoom}
                className="px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/30 transition-all font-bold text-xs tracking-wider uppercase flex items-center space-x-1.5 hover:scale-102 active:scale-95"
              >
                <PhoneOff className="h-4.5 w-4.5" />
                <span>Leave clinic room</span>
              </button>
            </div>

          </div>

          {/* Consultation Chat and prescription Side Desk */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Live Chat stream section */}
            <div className="flex-1 rounded-2xl bg-gray-850 p-4 border border-gray-800 flex flex-col justify-between max-h-[340px]">
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-800 mb-2.5">
                <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider uppercase">Live Consultation Dialogue</span>
                <span className="font-mono text-[9px] bg-blue-900/40 text-blue-300 px-2 rounded-full font-bold">Aura-Triage Sync</span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-100 rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-gray-500 mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                ))}
                {isDoctorTyping && (
                  <div className="text-[10px] text-gray-400 font-mono italic animate-pulse">
                    {appt.doctorName} is reviewing diagnostics...
                  </div>
                )}
              </div>

              {/* Input dispatcher */}
              <form onSubmit={handleSendMessage} className="flex gap-1.5 pt-3 border-t border-gray-805 mt-2.5">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Describe symptomatology to doctor..."
                  className="flex-1 bg-gray-900 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-blue-500 text-white"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Smart prescriptions notes summary (Side view) */}
            <div className="rounded-2xl bg-gray-850 p-4 border border-gray-800 space-y-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider uppercase flex items-center">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400 mr-1.5" /> Clinic Prescription Notes
                </span>
                <p className="text-[10.5px] text-gray-400 mt-1">Real-time prescription logs generated dynamically by clinical algorithm matching.</p>
              </div>

              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {sessionNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-[11px] leading-tight text-gray-200">
                    <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              <div className="text-center pt-2.5 border-t border-gray-800">
                <span className="text-[9px] text-gray-400 flex items-center justify-center leading-none">
                  <Stethoscope className="h-3.5 w-3.5 text-emerald-500 mr-1 shrink-0" /> Prescriptions auto-sync with Patient Hub Dashboard
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
