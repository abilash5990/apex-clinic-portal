import React, { useState } from 'react';
import { 
  ShieldAlert, Phone, Truck, Flame, Heart, Activity, 
  MapPin, Clock, Search, ChevronDown, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { HOSPITAL_BEDS, BLOOD_BANKS } from '../data/doctors';

interface EmergencyProps {
  onClose?: () => void;
  accessibilityFontSize: 'standard' | 'large' | 'extra-large';
}

export default function EmergencyFeatures({ onClose, accessibilityFontSize }: EmergencyProps) {
  
  // Ambulance states
  const [patientLocation, setPatientLocation] = useState('');
  const [dispatchState, setDispatchState] = useState<'idle' | 'dispatched' | 'arrived'>('idle');
  const [dispatchTime, setDispatchTime] = useState(12); // minutes
  const [selectedAmbulance, setSelectedAmbulance] = useState<'Standard Triage' | 'Advanced ALS Cardiac'>('Standard Triage');

  // Interactive first aid drawer
  const [activeInstruction, setActiveInstruction] = useState<string | null>('cardiac');

  // Hospital beds state (mutable for simulation realism)
  const [beds, setBeds] = useState(HOSPITAL_BEDS);

  const handleBookAmbulance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientLocation.trim()) {
      alert("Please provide the emergency street address for dispatch positioning.");
      return;
    }
    setDispatchState('dispatched');
    setDispatchTime(8 + Math.floor(Math.random() * 6));
    
    // Simulate progression countdown
    setTimeout(() => {
      setDispatchState('arrived');
    }, 12000);
  };

  const FIRST_AID_DOCS = [
    {
      id: 'cardiac',
      title: 'Cardiac Arrest / Heart attack Protocol',
      steps: [
        "1. Confirm unconsciousness and alert paramedics via Phone: 911 instantly.",
        "2. Place depth marks at midpoint of patient sternum. Begin CPR: 100-120 continuous compressions/min.",
        "3. Use a nearby automated external defibrillator (AED) immediately if available."
      ]
    },
    {
      id: 'choking',
      title: 'Choking intervention guidelines (Heimlich Maneuver)',
      steps: [
        "1. Stand firmly behind patient and wind forearms around abdominal area.",
        "2. Form a tight fist, place thumb edge directly above patient navel, below chest cavity.",
        "3. Displace fist with rapid, inward-and-upward abdominal thrusts."
      ]
    },
    {
      id: 'stroke',
      title: 'Acute Stroke Symptom Detection (F.A.S.T)',
      steps: [
        "Face drooping: Ask patient to smile. Look for asymmetrical angles.",
        "Arm weakness: Ask patient to raise both arms. Does one drift downward?",
        "Speech difficulty: Is pronunciation slurred or gargled?",
        "Time is critical: If any signs are visible, call Emergency Services immediately!"
      ]
    }
  ];

  const textScaleClass = {
    'standard': 'text-sm',
    'large': 'text-base',
    'extra-large': 'text-lg'
  }[accessibilityFontSize];

  return (
    <div id="emergency-panel" className="rounded-2xl border-2 border-red-500 bg-red-50/20 p-6 dark:bg-red-950/10 transition-colors duration-200">
      
      {/* Alert header banner with glowing state */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-red-500/20 mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/35">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-display font-black text-gray-900 dark:text-white text-base">Emergency Crisis Command Center</h3>
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 font-mono tracking-wider uppercase">Direct 24/7 Clinical Hotlines</span>
          </div>
        </div>

        {/* Call Now emergency button shortcut */}
        <div className="flex items-center gap-2">
          <a
            href="tel:911"
            className="flex items-center space-x-1.5 rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3 text-xs font-black tracking-wider uppercase text-white shadow-md active:scale-95"
          >
            <Phone className="h-4 w-4" />
            <span>Call Hotline: 911</span>
          </a>
          {onClose && (
            <button 
              onClick={onClose}
              className="px-3.5 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-505 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
            >
              Close Alert
            </button>
          )}
        </div>
      </div>

      {/* Grid of Ambulance dispatcher, bed levels, blood bank */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Module B1: Dispatch Ambulance Panel */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm dark:bg-gray-900 dark:border-red-950/20">
          <div className="flex items-center space-x-2 mb-4">
            <Truck className="h-5 w-5 text-red-650 dark:text-red-400" />
            <h4 className="font-display font-extrabold text-gray-950 dark:text-white text-sm">Ambulance SOS Locator</h4>
          </div>

          {dispatchState === 'idle' && (
            <form onSubmit={handleBookAmbulance} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Ambulance Tier Option</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Standard Triage', 'Advanced ALS Cardiac'] as const).map(tier => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedAmbulance(tier)}
                      className={`p-2 rounded-lg border text-left text-xs ${
                        selectedAmbulance === tier
                          ? 'border-red-500 bg-red-50/10 text-red-600 font-bold dark:border-red-600'
                          : 'border-gray-250 hover:bg-gray-50 text-gray-500 dark:border-gray-800'
                      }`}
                    >
                      <p className="font-bold leading-tight">{tier}</p>
                      <span className="text-[9px] text-gray-400 font-normal">{tier === 'Standard Triage' ? 'Basic transport' : 'Doctor on board'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Pick up Coordinates / Address</label>
                <div className="relative">
                  <MapPin className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={patientLocation}
                    onChange={(e) => setPatientLocation(e.target.value)}
                    placeholder="Enter urgent Street Door, Zip..."
                    className="w-full bg-gray-50/50 rounded-xl px-9 py-2 text-xs border border-gray-150 outline-none focus:ring-1 focus:ring-red-500 dark:bg-gray-950 dark:border-gray-800 dark:text-white text-gray-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black tracking-wider uppercase transition-colors"
              >
                Dispatch {selectedAmbulance} Unit
              </button>
            </form>
          )}

          {dispatchState === 'dispatched' && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 animate-ping">
                <Truck className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Ambulance Dispatched! (En Route)</p>
                <p className="text-xs text-gray-500 mt-1">Address: <span className="underline font-semibold text-gray-800 dark:text-gray-300">{patientLocation}</span></p>
                <p className="text-xs text-red-600 hover:underline cursor-pointer font-bold mt-2 font-mono flex items-center justify-center">
                  <Clock className="h-4 w-4 mr-1 shrink-0" /> Est. Arrival: ~{dispatchTime} minutes
                </p>
              </div>
            </div>
          )}

          {dispatchState === 'arrived' && (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="font-extrabold text-emerald-600 text-sm">Ambulance Unit is at Coordinates</p>
                <p className="text-xs text-gray-500">Emergency support staff has finalized arrival. Keep phone line clear.</p>
              </div>
              <button 
                onClick={() => setDispatchState('idle')}
                className="mt-2 text-xs text-gray-400 underline font-mono"
              >
                Dispatch another simulation
              </button>
            </div>
          )}
        </div>

        {/* Module B2: Live Hospital Bed availability */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm dark:bg-gray-900 dark:border-red-950/20">
          <div className="flex items-center space-x-2 mb-4 justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-gray-900 dark:text-gray-200" />
              <h4 className="font-display font-extrabold text-gray-950 dark:text-white text-sm font-bold">Trauma Bed Vacancies</h4>
            </div>
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
          </div>

          <div className="space-y-3">
            {beds.map((hospital, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                <div>
                  <h5 className="font-black text-gray-900 dark:text-white truncate max-w-[150px]">{hospital.name}</h5>
                  <p className="text-[10px] text-gray-400 font-mono">{hospital.department} • {hospital.distance}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black ${
                    hospital.beds < 4 ? 'bg-red-50 text-red-650' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {hospital.beds} Beds Free
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module B3: Blood Bank Info & Reserves */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm dark:bg-gray-900 dark:border-red-950/20">
          <div className="flex items-center space-x-2 mb-4 justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-red-650" />
              <h4 className="font-display font-extrabold text-gray-950 dark:text-white text-sm font-bold">Safe Blood Reserves</h4>
            </div>
            <span className="text-[10px] text-gray-400 font-mono uppercase">Refreshed</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {BLOOD_BANKS.map((reserve, idx) => (
              <div key={idx} className="p-2 border border-gray-100 rounded-lg dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-gray-900 dark:text-white text-xs">{reserve.type}</span>
                  <span className={`text-[8.5px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    reserve.urgency.includes('Critical') ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {reserve.urgency.split(' ')[0]}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 font-mono mt-1">{reserve.units}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* First Aid Digital handbooks */}
      <div className="mt-6 border-t border-red-500/20 pt-5">
        <span className="text-[10px] font-bold text-gray-400 font-mono uppercase tracking-wider block mb-3.5 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" /> Digital Ambulance First-Aid Instructions Book
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FIRST_AID_DOCS.map(doc => (
            <div 
              key={doc.id}
              onClick={() => setActiveInstruction(activeInstruction === doc.id ? null : doc.id)}
              className="p-3 bg-white/50 border border-gray-150-100 dark:border-gray-800 rounded-xl cursor-pointer hover:bg-white transition-colors dark:bg-gray-950/20"
            >
              <div className="flex justify-between items-center">
                <h5 className="font-semibold text-xs text-gray-950 dark:text-white">{doc.title}</h5>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeInstruction === doc.id ? 'rotate-180' : ''}`} />
              </div>
              {activeInstruction === doc.id && (
                <div className="mt-2.5 space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-2 text-[11px] text-gray-650 dark:text-gray-300">
                  {doc.steps.map((st, i) => (
                    <p key={i}>{st}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
