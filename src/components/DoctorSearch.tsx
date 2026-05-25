import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, Star, MapPin, Calendar, Clock, DollarSign, 
  Video, Users, ShieldCheck, Check, ChevronRight, Sparkles, Filter, X, ShieldAlert
} from 'lucide-react';
import { CLINICAL_DOCTORS, SPECIALIZATIONS } from '../data/doctors';
import { Doctor, Appointment } from '../types';

interface DoctorSearchProps {
  onAddAppointment: (appt: Appointment) => void;
  searchFilter: { query: string; specialization: string };
  setSearchFilter: React.Dispatch<React.SetStateAction<{ query: string; specialization: string }>>;
  accessibilityFontSize: 'standard' | 'large' | 'extra-large';
}

export default function DoctorSearch({ 
  onAddAppointment, 
  searchFilter, 
  setSearchFilter,
  accessibilityFontSize
}: DoctorSearchProps) {
  
  // Filtering states
  const [selectedSpec, setSelectedSpec] = useState(searchFilter.specialization);
  const [minExp, setMinExp] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(200);
  const [ratingThreshold, setRatingThreshold] = useState<number>(0);
  const [consultType, setConsultType] = useState<'all' | 'online' | 'offline'>('all');
  const [searchQuery, setSearchQuery] = useState(searchFilter.query);

  // Booking states
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1); // 1: Date/Time, 2: Patient Info, 3: Payment, 4: Confirmed
  
  // Date and Time selection
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Patient details state
  const [pName, setPName] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pNotes, setPNotes] = useState('');
  const [pType, setPType] = useState<'Video' | 'In-Person'>('Video');
  
  // Payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [insuranceId, setInsuranceId] = useState('');
  const [useInsurance, setUseInsurance] = useState(false);
  const [notifCheck, setNotifCheck] = useState(true);

  // Sync prop changes nicely
  React.useEffect(() => {
    if (searchFilter.specialization) setSelectedSpec(searchFilter.specialization);
    if (searchFilter.query) setSearchQuery(searchFilter.query);
  }, [searchFilter]);

  // Handle slot options
  const TIME_SLOTS = [
    "09:15 AM", "10:00 AM", "11:30 AM", 
    "02:00 PM", "03:15 PM", "04:30 PM"
  ];

  // Compute filtered Doctors
  const filteredDoctors = useMemo(() => {
    return CLINICAL_DOCTORS.filter((doc) => {
      // Specialty check
      if (selectedSpec && doc.specialization !== selectedSpec) return false;
      
      // Keyword search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesSpec = doc.specialization.toLowerCase().includes(query);
        const matchesBio = doc.bio.toLowerCase().includes(query);
        const matchesDegree = doc.degree.toLowerCase().includes(query);
        if (!matchesName && !matchesSpec && !matchesBio && !matchesDegree) return false;
      }
      
      // Experience check
      if (doc.experience < minExp) return false;
      
      // Fee check
      if (doc.consultationFee > maxFee) return false;
      
      // Rating check
      if (doc.rating < ratingThreshold) return false;
      
      // Consult type check
      if (consultType === 'online' && !doc.online) return false;
      if (consultType === 'offline' && !doc.offline) return false;
      
      return true;
    });
  }, [selectedSpec, searchQuery, minExp, maxFee, ratingThreshold, consultType]);

  // Clear filters
  const resetFilters = () => {
    setSelectedSpec('');
    setMinExp(0);
    setMaxFee(200);
    setRatingThreshold(0);
    setConsultType('all');
    setSearchQuery('');
    setSearchFilter({ query: '', specialization: '' });
  };

  // Trigger booking initialization
  const startBooking = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setPType(doctor.online ? 'Video' : 'In-Person');
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTime('');
    // populate default details if any
    setPName('');
    setPPhone('');
    setPEmail('');
    setPNotes('');
    setCardNumber('');
    setCardExpiry('');
    setCardCVC('');
  };

  // Handle Booking flow actions
  const nextStep = () => {
    if (bookingStep === 1) {
      if (!selectedDate || !selectedTime) {
        alert("Please select a date and an available time slot to continue.");
        return;
      }
      setBookingStep(2);
    } else if (bookingStep === 2) {
      if (!pName || !pPhone || !pEmail) {
        alert("Please complete the required Patient Profile fields.");
        return;
      }
      setBookingStep(3);
    } else if (bookingStep === 3) {
      // Validate payment simulation or Insurance ID
      if (!useInsurance && (!cardNumber || !cardExpiry || !cardCVC)) {
        alert("Please configure a valid secure payment instrument or select insurance coverage.");
        return;
      }
      
      // Persist the finalized appointment
      if (bookingDoctor) {
        const appt: Appointment = {
          id: `appt-${Date.now()}`,
          doctorId: bookingDoctor.id,
          doctorName: bookingDoctor.name,
          doctorSpecialization: bookingDoctor.specialization,
          doctorPhoto: bookingDoctor.photo,
          date: selectedDate,
          timeSlot: selectedTime,
          patientName: pName,
          patientPhone: pPhone,
          patientEmail: pEmail,
          notes: pNotes,
          consultationType: pType,
          status: 'Upcoming',
          paymentStatus: 'Paid',
          amount: useInsurance ? 15 : bookingDoctor.consultationFee
        };
        onAddAppointment(appt);
      }
      setBookingStep(4);
    }
  };

  const textScaleClass = {
    'standard': 'text-sm',
    'large': 'text-base',
    'extra-large': 'text-lg'
  }[accessibilityFontSize];

  return (
    <div className="py-12 bg-white dark:bg-gray-950 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Lead Info Headers */}
        <div id="doctor-search" className="mb-10 text-center uppercase tracking-wide">
          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">BOARD CERTIFIED CARE</span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white mt-1">
            Browse Our Clinical Specialists
          </h2>
          <p className="mx-auto mt-2.5 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Use filters to match symptoms with real-time doctor availability details, consultation models, and ratings.
          </p>
        </div>

        {/* Core Screen Divided into Filters + Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filtration Component */}
          <div className="space-y-6 lg:col-span-1 rounded-2xl border border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/60 h-fit">
            
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-3 dark:border-gray-800">
              <span className="flex items-center text-sm font-bold text-gray-900 dark:text-white">
                <Filter className="h-4 w-4 mr-1.5 text-blue-600" />
                Refine Database
              </span>
              <button 
                onClick={resetFilters}
                className="text-[11px] font-mono tracking-wider font-bold text-blue-600 dark:text-blue-400 uppercase hover:underline"
              >
                Clear all
              </button>
            </div>

            {/* Keyword refinement */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Custom Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, degree or keywords..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none dark:border-gray-850 dark:bg-gray-950 dark:text-white"
              />
            </div>

            {/* Specialty Referral Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Department Referral
              </label>
              <select
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 outline-none dark:border-gray-850 dark:bg-gray-950 dark:text-gray-300 cursor-pointer"
              >
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Consult Type Panel */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Consultation Type
              </label>
              <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-950 p-1 rounded-lg">
                {(['all', 'online', 'offline'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setConsultType(type)}
                    className={`rounded py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                      consultType === type
                        ? 'bg-white shadow-sm text-blue-600 dark:bg-gray-850 dark:text-blue-400 font-semibold'
                        : 'text-gray-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Exp Year Slicing */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                <span>Minimum Experience</span>
                <span className="text-blue-600 font-mono">{minExp}+ Years</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={minExp}
                onChange={(e) => setMinExp(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Price Fee Threshold Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                <span>Max Consultation Fee</span>
                <span className="text-blue-600 font-mono">${maxFee}</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                step="10"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Minimum Rating Trigger */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Clinician Rating Threshold
              </label>
              <div className="flex items-center space-x-1">
                {[0, 4.5, 4.8, 4.9].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRatingThreshold(val)}
                    className={`flex-1 rounded border py-1 hover:bg-white dark:hover:bg-gray-800 transition-colors text-[10px] font-bold ${
                      ratingThreshold === val
                        ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'border-gray-200 text-gray-600 dark:border-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {val === 0 ? 'Any' : `${val} ✨`}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Doctor Cards Grid Row */}
          <div className="lg:col-span-3">
            
            {/* Filter Metrics Indicator */}
            <div className="flex items-center justify-between mb-5 bg-gray-50/50 p-3 rounded-xl dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                Matching Doctors: <span className="text-gray-900 font-bold dark:text-white">{filteredDoctors.length}</span>
              </p>
              {selectedSpec && (
                <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium dark:bg-blue-950/30 dark:text-blue-400">
                  <span>Specialty: {selectedSpec}</span>
                  <X className="h-3 w-3 cursor-pointer ml-1" onClick={() => setSelectedSpec('')} />
                </div>
              )}
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-20 p-6 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <Users className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-850 dark:text-white">No Specialized Doctors Found</p>
                <p className="text-xs text-gray-500 mt-1">Try resetting the sliding parameters or search for a less restrictive combination.</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center space-x-1 border border-gray-200 rounded-lg px-4 py-2 text-xs font-semibold hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900 dark:text-gray-200"
                >
                  Clear search parameters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredDoctors.map(doctor => (
                  <div 
                    key={doctor.id}
                    className="flex flex-col justify-between rounded-2xl border border-gray-150/80 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-200/50 dark:hover:border-blue-800/50 transition-all duration-300 dark:border-gray-850 dark:bg-gray-900"
                  >
                    <div>
                      {/* Doctor Heading Profile (photo, title, info) */}
                      <div className="flex space-x-4 mb-4">
                        <img 
                          src={doctor.photo} 
                          alt={`${doctor.name}, ${doctor.specialization} specialist`} 
                          className="h-16 w-16 rounded-xl object-cover border border-gray-150 dark:border-gray-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1">
                          <h3 className="font-display font-bold text-[15px] text-gray-900 dark:text-white leading-tight flex items-center">
                            {doctor.name}
                            <Check className="h-3.5 w-3.5 text-blue-500 bg-blue-50 dark:bg-blue-900/30 rounded-full p-0.5 ml-1.5 shrink-0" />
                          </h3>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-medium mt-0.5">{doctor.specialization}</p>
                          <p className="text-[11px] text-gray-500 mt-1">{doctor.degree}</p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
                        {doctor.bio}
                      </p>

                      {/* Metadata Metrics Row */}
                      <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50 p-2.5 rounded-lg dark:bg-gray-950 border border-gray-100 dark:border-gray-850/30">
                        <div className="flex items-center space-x-1 text-xs">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          <span className="font-bold text-gray-900 dark:text-white font-mono">{doctor.rating}</span>
                          <span className="text-[10px] text-gray-400">({doctor.reviewsCount} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-350">
                          <Clock className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span className="font-bold font-mono">{doctor.experience} Yrs Exp</span>
                        </div>
                      </div>

                      {/* Hospital Details & Rates */}
                      <div className="space-y-2 mb-4 border-t border-gray-100 pt-3 dark:border-gray-800">
                        <div className="flex items-center text-[11px] text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400 shrink-0" />
                          <span className="truncate">{doctor.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-gray-500">Consultation Fee</span>
                          <span className="font-bold text-gray-900 dark:text-white">${doctor.consultationFee}</span>
                        </div>

                        {/* Timing and days */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Available:</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">{doctor.availableTiming}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Triggers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-1">
                        {doctor.online && (
                          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-1" title="Telehealth consultation available" />
                        )}
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase font-mono">
                          {doctor.online && doctor.offline ? 'Telehealth & Clinic' : doctor.online ? 'Telehealth Only' : 'Clinic Only'}
                        </span>
                      </div>
                      <button
                        onClick={() => startBooking(doctor)}
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3.5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-center cursor-pointer active:scale-95"
                      >
                        Book Now
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Appointment Flow Modal Overlay */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-250 bg-white p-6 shadow-2xl dark:border-gray-850 dark:bg-gray-900 animate-scaleUp">
            
            {/* Modal Exit trigger */}
            <button 
              onClick={() => setBookingDoctor(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Stepper Wizard Indicator */}
            <div className="mb-6">
              <span className="text-[10px] font-bold tracking-wider text-blue-600 uppercase font-mono">Secure Appointment Engine</span>
              <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mt-0.5">Booking with {bookingDoctor.name}</h3>
              
              {/* Progressive stepper bar */}
              <div className="flex items-center justify-between mt-4">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                        bookingStep > step 
                          ? 'bg-emerald-500 text-white' 
                          : bookingStep === step 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                      }`}>
                        {bookingStep > step ? <Check className="h-3 w-3" /> : step}
                      </div>
                    </div>
                    {step < 4 && <div className={`flex-1 h-0.5 mx-2 ${bookingStep > step ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Scheduling details */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Choose Appointment Slot</p>
                
                {/* Method selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPType('Video')}
                      disabled={!bookingDoctor.online}
                      className={`rounded-xl p-3 border text-left transition-colors ${
                        pType === 'Video'
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600'
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-850 dark:text-gray-200'
                      } ${!bookingDoctor.online ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <Video className="h-5 w-5 mb-1 text-blue-600" />
                      <p className="text-xs font-bold">Video Consultation</p>
                      <p className="text-[10px] text-gray-400">Connect instantly via browser</p>
                    </button>

                    <button
                      onClick={() => setPType('In-Person')}
                      disabled={!bookingDoctor.offline}
                      className={`rounded-xl p-3 border text-left transition-colors ${
                        pType === 'In-Person'
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600'
                          : 'border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-850 dark:text-gray-200'
                      } ${!bookingDoctor.offline ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <MapPin className="h-5 w-5 mb-1 text-emerald-600" />
                      <p className="text-xs font-bold">In-Person Visit</p>
                      <p className="text-[10px] text-gray-400">Consult at clinical chamber</p>
                    </button>
                  </div>
                </div>

                {/* Calendar picker */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Select Date</label>
                  <input
                    type="date"
                    min="2026-05-25" // using local metadata standard
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm dark:border-gray-850 dark:bg-gray-950 dark:text-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Note: Dr. {bookingDoctor.name.split(' ').pop()} consults on: {bookingDoctor.availableDays.join(', ')}</p>
                </div>

                {/* Time selection blocks */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Available Time Slots</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(st => (
                      <button
                        key={st}
                        onClick={() => setSelectedTime(st)}
                        className={`rounded-lg py-2 border text-center transition-colors text-xs font-mono font-bold ${
                          selectedTime === st
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                            : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-350 dark:hover:bg-gray-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Step 2: Patient Registration Info */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Profile Registry</p>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Full Name (Required)</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs dark:border-gray-850 dark:bg-gray-950 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Mobile (Required)</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 321-456"
                        value={pPhone}
                        onChange={(e) => setPPhone(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs dark:border-gray-850 dark:bg-gray-950 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Email address</label>
                      <input
                        type="email"
                        placeholder="jane.doe@example.com"
                        value={pEmail}
                        onChange={(e) => setPEmail(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs dark:border-gray-850 dark:bg-gray-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Brief Medical Notes (Symptoms, past history...)</label>
                    <textarea
                      rows={3}
                      placeholder="Experiencing acute symptoms. Requesting follow up instructions..."
                      value={pNotes}
                      onChange={(e) => setPNotes(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs dark:border-gray-850 dark:bg-gray-950 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Checkout Gate */}
            {bookingStep === 3 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Secured Health Payment Interface</p>
                
                {/* Rates breakdown and insurance panel toggle */}
                <div className="rounded-xl border border-gray-150 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-950">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-200/50 dark:border-gray-805">
                    <span className="text-gray-500">Service Fee rate</span>
                    <span className="font-mono text-gray-900 dark:text-white">${bookingDoctor.consultationFee}</span>
                  </div>
                  
                  {/* Insurance option */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="insurance-check" 
                        checked={useInsurance} 
                        onChange={(e) => setUseInsurance(e.target.checked)}
                        className="rounded accent-blue-600"
                      />
                      <label htmlFor="insurance-check" className="text-xs font-medium text-gray-700 dark:text-gray-300">Apply Insurance Copay</label>
                    </div>
                    {useInsurance && (
                      <span className="text-xs font-mono font-bold text-emerald-600">-$ {bookingDoctor.consultationFee - 15} Copay Approved</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold pt-3 border-t border-gray-250 dark:border-gray-800 mt-2">
                    <span className="text-gray-950 dark:text-white">Amount Due Now</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">${useInsurance ? '15.00' : `${bookingDoctor.consultationFee}.00`}</span>
                  </div>
                </div>

                {/* Secure inputs */}
                {useInsurance ? (
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Insurance Provider & Member ID</label>
                    <input
                      type="text"
                      placeholder="e.g. BlueCross Shield - ID# 998242"
                      value={insuranceId}
                      onChange={(e) => setInsuranceId(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs dark:border-gray-850 dark:bg-gray-950 dark:text-white"
                    />
                    <p className="text-[10px] text-gray-500 mt-1 flex items-center">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 mr-1" /> Core healthcare program verified
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Credit / Debit Card number</label>
                      <input
                        type="text"
                        placeholder="4242 •••• •••• 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs dark:border-gray-850 dark:bg-gray-950 dark:text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Expiration</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs dark:border-gray-850 dark:bg-gray-950 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">CVC secure key</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={3}
                          value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs dark:border-gray-850 dark:bg-gray-950 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Safe badge */}
                <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-1 bg-gray-50/50 p-2 rounded-xl dark:bg-gray-950">
                  <ShieldCheck className="h-4 w-4 text-blue-500" />
                  <span>256-bit HIPAA compliance checkout and data encryption.</span>
                </div>

              </div>
            )}

            {/* Step 4: Booking Successful Response */}
            {bookingStep === 4 && (
              <div className="text-center py-4 space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Check className="h-8 w-8" />
                </div>
                
                <div>
                  <h4 className="font-display font-bold text-xl text-gray-900 dark:text-white">Appointment Confirmed!</h4>
                  <p className="text-xs text-gray-500 mt-1">Your appointment with {bookingDoctor.name} is successfully processed.</p>
                </div>

                {/* Scheduled coordinates summary dashboard */}
                <div className="rounded-xl border border-gray-150 bg-gray-50/70 p-4.5 dark:border-gray-800 dark:bg-gray-950/80 text-left space-y-2 text-xs">
                  <p className="font-mono text-[10px] font-bold text-blue-600 tracking-wider uppercase">Receipt Details</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Specialist: <span className="font-normal text-gray-700 dark:text-gray-300">{bookingDoctor.name} ({bookingDoctor.specialization})</span></p>
                  <p className="font-semibold text-gray-900 dark:text-white">Timing: <span className="font-normal text-gray-700 dark:text-gray-300">{selectedDate} at {selectedTime} ({pType} consult)</span></p>
                  <p className="font-semibold text-gray-900 dark:text-white">Patient: <span className="font-normal text-gray-700 dark:text-gray-300">{pName}</span></p>
                </div>

                {/* SMS checklist */}
                <div className="flex items-center space-x-2 bg-blue-50/40 p-3 rounded-xl border border-blue-100/50 dark:bg-blue-950/10 dark:border-blue-900/30 text-left">
                  <input
                    type="checkbox"
                    id="sms-notif"
                    checked={notifCheck}
                    onChange={(e) => setNotifCheck(e.target.checked)}
                    className="accent-blue-600 rounded"
                  />
                  <label htmlFor="sms-notif" className="text-[11px] text-gray-600 dark:text-gray-300 select-none">
                    Send immediate updates & session token link via **WhatsApp/SMS** to <span className="font-bold underline">{pPhone}</span>
                  </label>
                </div>

                {/* Reschedule tips */}
                <p className="text-[10px] text-gray-400">
                  Reschedule policies: Free modifications allowed up to 2 hours prior from the dashboard portal.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setBookingDoctor(null)}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-semibold tracking-wide text-white transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Modal Next Navigation */}
            {bookingStep < 4 && (
              <div className="flex items-center space-x-3 mt-6 border-t border-gray-100 pt-4 dark:border-gray-800">
                {bookingStep > 1 && (
                  <button
                    onClick={() => setBookingStep(prev => prev - 1)}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-750 dark:text-gray-350 dark:hover:bg-gray-800"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs text-center font-semibold tracking-wide text-white transition-colors"
                >
                  Continue to {bookingStep === 1 ? 'Patient Details' : bookingStep === 2 ? 'Payment Checkout' : 'Secure Finalize'}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
