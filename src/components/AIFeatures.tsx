import React, { useState } from 'react';
import { 
  BrainCircuit, Sparkles, Send, Mic, Activity, CheckCircle, 
  Stethoscope, ShieldAlert, ArrowRight, BookOpen, Volume2, Landmark, RefreshCw
} from 'lucide-react';
import { Doctor } from '../types';
import { CLINICAL_DOCTORS } from '../data/doctors';

interface AIFeaturesProps {
  onBookDoctor: (doc: Doctor) => void;
  accessibilityFontSize: 'standard' | 'large' | 'extra-large';
  speechSynthesisEnabled: boolean;
}

export default function AIFeatures({ onBookDoctor, accessibilityFontSize, speechSynthesisEnabled }: AIFeaturesProps) {
  
  // Triage state
  const [symptomText, setSymptomText] = useState('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [triageLoading, setTriageLoading] = useState(false);
  const [triageResponse, setTriageResponse] = useState<any | null>(null);

  // Chatbot state
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hello! I am Aura, your clinical concierge. Ask me anything about doctor specialties, appointment preparation, or general clinical FAQs." }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Handle Symptom analysis
  const handleAnalyzeSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    setTriageLoading(true);
    setTriageResponse(null);

    try {
      const response = await fetch('/api/check-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomText,
          patientAge: age,
          gender: gender
        })
      });

      if (!response.ok) throw new Error("Symptom screening failed");
      const data = await response.json();
      setTriageResponse(data);
      
      // Perform readback announcement if speech synthesis is enabled
      if (speechSynthesisEnabled && 'speechSynthesis' in window) {
        const textToSpeak = `Triage complete. Recommended department is ${data.specialty}. Triage urgency is classified as ${data.urgency}. ${data.analysis}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        window.speechSynthesis.speak(utterance);
      }

    } catch (err) {
      console.error(err);
      alert("The clinical AI triage generator could not complete. Please formulate simpler text descriptions.");
    } finally {
      setTriageLoading(false);
    }
  };

  // Handle chatbot concierge messages
  const handleConciergeChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const historyPayload = [...chatMessages, userMsg].map(m => ({
        sender: m.role === 'user' ? 'user' : 'assistant',
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPayload })
      });

      if (!response.ok) throw new Error("Concierge failed");
      const data = await response.json();

      const assistantMsg = { role: 'assistant', text: data.reply };
      setChatMessages(prev => [...prev, assistantMsg]);

      // Speak reply if requested
      if (speechSynthesisEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        window.speechSynthesis.speak(utterance);
      }

    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'assistant', text: "I apologize, our concierge database connection is temporarily lagging. How else can I guide you?" }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Match clinicians to triaged specialty
  const matchedDoctors = React.useMemo(() => {
    if (!triageResponse || !triageResponse.specialty) return [];
    return CLINICAL_DOCTORS.filter(d => 
      d.specialization.toLowerCase() === triageResponse.specialty.toLowerCase()
    );
  }, [triageResponse]);

  const textScaleClass = {
    'standard': 'text-sm',
    'large': 'text-base',
    'extra-large': 'text-lg'
  }[accessibilityFontSize];

  return (
    <div className="py-12 bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Core Header section */}
        <div className="text-center uppercase tracking-wide mb-10">
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">SMART TRIAGE PORTAL</span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white mt-1">
            Clinical AI Symptom Screening
          </h2>
          <p className="mx-auto mt-2.5 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Ask our medical algorithms to parse symptom structures and direct you to the optimal clinical specialist.
          </p>
        </div>

        {/* Dynamic Split Checker and Chat box layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: AI Symptom Checker */}
          <div className="lg:col-span-7 bg-gray-50/50 p-6 rounded-2xl border border-gray-150 dark:bg-gray-900/60 dark:border-gray-800">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-gray-200 dark:border-gray-850 mb-5">
              <BrainCircuit className="h-5.5 w-5.5 text-blue-600" />
              <div>
                <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white">AI Medical Symptom Analyzer</h3>
                <span className="text-[10px] font-mono text-gray-400">Symptom-referral-3.5 engine</span>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAnalyzeSymptoms} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Describe symptoms in detail
                </label>
                <textarea
                  rows={3}
                  required
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="e.g., Dull pain behind the right eye accompanied by light sensitivity, lasting for 12 hours..."
                  className="w-full bg-white rounded-xl p-3 text-xs border border-gray-250 outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                />
              </div>

              {/* Bio details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Patient Biological Age</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-white rounded-xl px-3.5 py-2 text-xs border border-gray-250 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Biological Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-white rounded-xl px-3 py-2 text-xs border border-gray-255 text-gray-700 outline-none dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center bg-blue-50/20 p-3.5 border border-blue-100 rounded-xl dark:bg-blue-950/10 dark:border-blue-900/40">
                <span className="text-[10px] text-gray-400 max-w-[280px]">Disclaimers: Triage diagnostic results are informational; always consult standard physicians for medical certitude.</span>
                <button
                  type="submit"
                  disabled={triageLoading}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide px-5 py-3 transition-colors flex items-center space-x-1"
                >
                  {triageLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Screening...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="h-4 w-4" />
                      <span>Analyze Triage</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Analysis Output Result */}
            {triageResponse && (
              <div className="mt-6 border-t border-dashed border-gray-200 dark:border-gray-800 pt-5 space-y-4 animate-scaleUp">
                
                {/* Referral badge */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Recommended Referral Clinic</span>
                    <h4 className="font-display font-black text-gray-900 dark:text-white text-[15px] flex items-center mt-0.5">
                      <Stethoscope className="h-4 w-4 text-blue-600 mr-1.5" />
                      {triageResponse.specialty} Department
                    </h4>
                  </div>
                  
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Estimated Urgency Flag</span>
                    <p className={`text-xs font-black uppercase font-mono tracking-widest mt-0.5 flex items-center ${
                      triageResponse.urgency === 'Low' ? 'text-green-500' : triageResponse.urgency === 'Medium' ? 'text-amber-500' : 'text-red-500 animate-pulse'
                    }`}>
                      <ShieldAlert className="h-4 w-4 mr-1 pb-0.5" />
                      {triageResponse.urgency} Priority
                    </p>
                  </div>
                </div>

                {/* Educational synopsis */}
                <div className="p-4 bg-blue-50/20 rounded-xl border border-blue-500/10 text-xs text-gray-700 leading-relaxed dark:bg-gray-950 dark:text-gray-300">
                  <p className="font-bold text-blue-700 dark:text-blue-400 mb-1">Clinical Screening Interpretation:</p>
                  {triageResponse.analysis}
                  <p className="text-[10.5px] italic text-gray-400 mt-2">Triage Reasoning: {triageResponse.matchReasoning}</p>
                </div>

                {/* Self Care tips list */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider">Actionable Self care tips</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                    {triageResponse.selfCare?.map((tip: string, id: number) => (
                      <div key={id} className="p-3 bg-white border border-gray-150 rounded-xl leading-relaxed text-[11px] text-gray-600 dark:bg-gray-950 dark:border-gray-850 dark:text-gray-350">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 mb-1" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinician Recommendation booking shortcut */}
                {matchedDoctors.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase font-mono tracking-wider block mb-3">Available {triageResponse.specialty} Specialists</span>
                    <div className="space-y-2">
                      {matchedDoctors.map(doc => (
                        <div key={doc.id} className="p-3 bg-white border border-gray-150 rounded-xl flex items-center justify-between dark:bg-gray-950 dark:border-gray-800">
                          <div className="flex items-center space-x-3">
                            <img src={doc.photo} alt={doc.name} className="h-10 w-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <h5 className="font-bold text-gray-900 text-xs dark:text-white">{doc.name}</h5>
                              <p className="text-[10px] text-gray-400 font-mono">{doc.degree} • Rating: {doc.rating} ⭐</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onBookDoctor(doc)}
                            className="text-[11px] font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-colors flex items-center"
                          >
                            <span>Book Consultation</span>
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Column 2: Aura Virtual Medical Concierge chatbot */}
          <div className="lg:col-span-5 bg-gray-50/50 p-6 rounded-2xl border border-gray-150 dark:bg-gray-900/60 dark:border-gray-800 self-stretch flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-205 dark:border-gray-850 mb-4">
                <div className="flex items-center space-x-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <div>
                    <h3 className="font-display font-extrabold text-sm text-gray-950 dark:text-white">Aura virtual Clinical Concierge</h3>
                    <span className="text-[10px] font-mono text-gray-400">Speech synthesizer assistance option</span>
                  </div>
                </div>

                {speechSynthesisEnabled && (
                  <span className="text-[9.5px] font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full dark:bg-purple-950/20 dark:text-purple-400 font-bold flex items-center space-x-1">
                    <Volume2 className="h-3.5 w-3.5 mr-0.5" />
                    <span>TTS ACTIVE</span>
                  </span>
                )}
              </div>

              {/* Chat screen */}
              <div className="space-y-3.5 max-h-[310px] overflow-y-auto pr-1">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-150 text-gray-800 rounded-bl-none dark:bg-gray-950 dark:border-gray-800 dark:text-gray-250'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="text-[10px] text-gray-400 italic animate-pulse">Aura Concierge is processing documentation...</div>
                )}
              </div>
            </div>

            {/* Input bar */}
            <form onSubmit={handleConciergeChat} className="flex gap-1.5 pt-4 border-t border-gray-150 mt-4 dark:border-gray-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask e.g. Do I need to fast before a lipid panel?"
                className="flex-1 bg-white rounded-xl p-3 text-xs border border-gray-200 outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:bg-gray-950 dark:border-gray-800 dark:text-white"
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors font-bold text-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
