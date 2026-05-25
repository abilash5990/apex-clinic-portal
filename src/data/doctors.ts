import { Doctor, BlogArticle, Testimonial } from '../types';

export const SPECIALIZATIONS = [
  'General Medicine',
  'Pediatrics',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Ophthalmology'
];

export const SPECIALTY_ICONS: Record<string, string> = {
  'General Medicine': 'Stethoscope',
  'Pediatrics': 'Baby',
  'Cardiology': 'Heart',
  'Dermatology': 'Sparkles',
  'Neurology': 'Brain',
  'Orthopedics': 'Activity',
  'Psychiatry': 'Smile',
  'Ophthalmology': 'Eye'
};

export const INSTANT_DISEASES = [
  { name: 'Common Cold', category: 'General Medicine', urgency: 'Low', recommendation: 'Stay hydrated, rest, and use OTC remedies' },
  { name: 'Pediatric Fever', category: 'Pediatrics', urgency: 'Medium', recommendation: 'If above 101F, consult pediatrician. Monitor fluid intake' },
  { name: 'Chest Tightness', category: 'Cardiology', urgency: 'High', recommendation: 'Seek IMMEDIATE emergency care. Do not wait!' },
  { name: 'Acute Migraine', category: 'Neurology', urgency: 'Medium', recommendation: 'Rest in a dark quiet room, take pain relief, stay hydrated' },
  { name: 'Severe Back Injury', category: 'Orthopedics', urgency: 'High', recommendation: 'Avoid sudden movements. Consult orthopedic expert immediately' }
];

export const CLINICAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    degree: 'MD, FACP (Harvard Medical)',
    specialization: 'General Medicine',
    experience: 14,
    rating: 4.9,
    reviewsCount: 312,
    availableTiming: '09:00 AM - 01:00 PM',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    consultationFee: 75,
    location: 'Metropolitan Health Center, Suite 402',
    online: true,
    offline: true,
    bio: 'Dr. Jenkins specializes in comprehensive adult care, preventive medicine, and chronic disease management. Recognized multiple times as a Top Clinician in Internal Medicine.',
    featured: true
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    degree: 'MD, FAAP (Johns Hopkins)',
    specialization: 'Pediatrics',
    experience: 12,
    rating: 4.8,
    reviewsCount: 245,
    availableTiming: '10:00 AM - 04:00 PM',
    availableDays: ['Mon', 'Wed', 'Fri'],
    consultationFee: 80,
    location: 'St. Jude Pediatrics Clinic, pediatric wing',
    online: true,
    offline: true,
    bio: 'Dedicated to compassionate pediatric care. Specializes in newborn wellness plans, behavioral pediatrics, and childhood asthma management.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    photo: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400',
    degree: 'MD, FACC (Stanford Medicine)',
    specialization: 'Cardiology',
    experience: 18,
    rating: 4.95,
    reviewsCount: 420,
    availableTiming: '02:00 PM - 06:00 PM',
    availableDays: ['Tue', 'Thu'],
    consultationFee: 150,
    location: 'Heart & Vascular Institute, Room 101',
    online: false,
    offline: true,
    bio: 'Renowned expert in interventional cardiology and cardiac failure prevention. Devoted to patient-centric treatment frameworks with evidence-based diagnostics.',
    featured: true
  },
  {
    id: 'doc-4',
    name: 'Dr. Aaron Chen',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    degree: 'MD, FAAD (UCSF School of Medicine)',
    specialization: 'Dermatology',
    experience: 9,
    rating: 4.7,
    reviewsCount: 182,
    availableTiming: '08:30 AM - 12:30 PM',
    availableDays: ['Mon', 'Tue', 'Thu'],
    consultationFee: 90,
    location: 'ClearSkin Dermatology Center, Flat 2B',
    online: true,
    offline: true,
    bio: 'Expertise in medical dermatology, clinical skin screenings, acne treatment pathways, and minimally invasive aesthetic corrections.'
  },
  {
    id: 'doc-5',
    name: 'Dr. Sophia Martinez',
    photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
    degree: 'MD, Ph.D. (Mayo Clinic College)',
    specialization: 'Neurology',
    experience: 16,
    rating: 4.9,
    reviewsCount: 290,
    availableTiming: '01:00 PM - 05:00 PM',
    availableDays: ['Wed', 'Thu', 'Fri'],
    consultationFee: 160,
    location: 'NeuroScience Research Hospital, Level 3',
    online: true,
    offline: false,
    bio: 'Lead investigator in neurological rehabilitation and cognitive care. Dr. Martinez treats migraine, sleep disorders, and complex epilepsy syndromes.',
    featured: true
  },
  {
    id: 'doc-6',
    name: 'Dr. Raymond Holt',
    photo: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=400',
    degree: 'MD, FAAOS (Yale Medical)',
    specialization: 'Orthopedics',
    experience: 20,
    rating: 4.85,
    reviewsCount: 388,
    availableTiming: '09:00 AM - 03:00 PM',
    availableDays: ['Mon', 'Tue', 'Wed'],
    consultationFee: 120,
    location: 'Holt Orthopedic Clinic & Sports Rehab',
    online: false,
    offline: true,
    bio: 'Specializing in orthopedic joint reconstructions, sports injuries, and spine health. Dr. Holt has treated numerous professional athletes.'
  },
  {
    id: 'doc-7',
    name: 'Dr. Amira Kanaan',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    degree: 'MD, APA Fellow (Columbia University)',
    specialization: 'Psychiatry',
    experience: 11,
    rating: 4.75,
    reviewsCount: 154,
    availableTiming: '11:00 AM - 05:00 PM',
    availableDays: ['Tue', 'Wed', 'Fri'],
    consultationFee: 110,
    location: 'SereneMind Mental Wellness Portal Group',
    online: true,
    offline: true,
    bio: 'Specializes in clinical therapeutics, anxiety management schedules, neurofeedback options, and cognitive behavioral treatments across all age groups.'
  },
  {
    id: 'doc-8',
    name: 'Dr. Keith Patel',
    photo: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400',
    degree: 'MD, FACS (Northwestern University)',
    specialization: 'Ophthalmology',
    experience: 15,
    rating: 4.88,
    reviewsCount: 267,
    availableTiming: '01:00 PM - 04:30 PM',
    availableDays: ['Mon', 'Wed', 'Thu'],
    consultationFee: 95,
    location: 'Patel Advanced Eye Center & Laser Clinic',
    online: true,
    offline: true,
    bio: 'Highly trained micro-surgeon specializing in laser vision correction, advanced cataract procedures, and diabetic retinopathy screenings.',
    featured: true
  }
];

export const HEALTH_BLOGS: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Navigating Preventive Heart Care: Daily Strategies',
    excerpt: 'Simple cardiovascular tips that can extend active living, lower blood pressure, and reverse arterial stress.',
    content: 'Cardiovascular wellness is largely built on daily preventive patterns. Dr. Elena Rostova recommends focusing on three specific pillars: metabolic movement, optimal hydration, and restorative sleep. At least 30 minutes of moderate-intensity endurance training a day drastically reduces heart workloads, improving blood flow and reducing insulin resistance.',
    category: 'Cardiology',
    author: 'Dr. Elena Rostova',
    date: 'May 12, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400',
    likes: 124
  },
  {
    id: 'blog-2',
    title: 'Recognizing Early Childhood Milestones and Nutrition',
    excerpt: 'Key pediatric checklists for young parents, centering on clean nutrition, speech tracks, and cognitive games.',
    content: 'Pediatric care involves observing physical developmental benchmarks along with solid macro-nourishment. Modern research suggests early interactive play combined with dietary fatty acids promotes exceptional neural synapses. Ensuring children avoid highly processed sugars shields them from pediatric insulin sensitivity later in life.',
    category: 'Pediatrics',
    author: 'Dr. Marcus Vance',
    date: 'Apr 28, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400',
    likes: 89
  },
  {
    id: 'blog-3',
    title: 'The Neurological Benefits of Modern Mindfulness',
    excerpt: 'How controlled breaths and meditation physically down-regulate stress pathways in the cerebral cortex.',
    content: 'Dr. Sophia Martinez investigates brain morphology alterations. Controlled mindfulness techniques, such as the 4-7-8 breathing loop, have been scientifically proven to reduce active cortisol levels. Over several weeks, this helps clear focus blocks, decreases standard neural inflammation and protects the hippocampus.',
    category: 'Neurology',
    author: 'Dr. Sophia Martinez',
    date: 'May 04, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=400',
    likes: 215
  }
];

export const CORE_FAQS = [
  {
    q: 'How do I start a telehealth video appointment?',
    a: 'It is simple! Select a medical specialist, choose an available time slot labeled "Video Consultation," and complete the checkout. Once done, navigate to your Patient Dashboard and click "Join Telehealth Room" at the appointed hour.'
  },
  {
    q: 'Can the AI Symptom Checker diagnose diseases?',
    a: 'No. The AI system is programmed to perform informational screening and match symptoms with logical specialties. It is built as a smart support tool. Always consult a board-certified clinician for diagnostic assessments.'
  },
  {
    q: 'How long does a typical laboratory report summary take?',
    a: 'The AI report analyzer runs instantaneously. As soon as you drag a report file or raw clinical text into the upload dashboard, a simple English translation is generated within seconds.'
  },
  {
    q: 'What should I do in case of an immediate medical emergency?',
    a: 'Our homepage contains red emergency shortcuts. Click "Emergency Help" or the Floating SOS button to locate active ambulances, check nearby hospital bed availability, or read life-saving first-aid guidelines immediately.'
  }
];

export const HOSPITAL_BEDS = [
  { name: 'City Central trauma hospital', distance: '1.2 miles', beds: 14, department: 'Cardiology Center', isOccupied: false },
  { name: 'St. Jude General Medical', distance: '2.8 miles', beds: 8, department: 'Pediatric Unit', isOccupied: false },
  { name: 'Grace Clinical Emergency', distance: '4.5 miles', beds: 2, department: 'Emergency Trauma', isOccupied: true },
  { name: 'Mercy Community Clinic', distance: '5.1 miles', beds: 19, department: 'Outpatient Triage', isOccupied: false }
];

export const BLOOD_BANKS = [
  { type: 'O-Negative', units: '12 bags remaining', urgency: 'Critical Priority', color: 'text-red-500' },
  { type: 'A-Positive', units: '34 bags remaining', urgency: 'Standard Supply', color: 'text-green-500' },
  { type: 'B-Negative', units: '4 bags remaining', urgency: 'Urgent Alert', color: 'text-amber-500' },
  { type: 'AB-Positive', units: '21 bags remaining', urgency: 'Fully Stocked', color: 'text-green-500' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Eleanor Vance',
    age: 62,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    condition: 'Cardiovascular Hypertension',
    doctor: 'Dr. Elena Rostova',
    quote: 'Suriya made it seamless to monitor my cardiac telemetry. The AI report helper translated my blood scans into words I could actually comprehend. Dr. Elena gave me peace of mind.',
    star: 5
  },
  {
    id: 'test-2',
    name: 'Gabriel Martinez',
    age: 28,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    condition: 'Acute Dermatological Shingles',
    doctor: 'Dr. Aaron Chen',
    quote: 'Excellent UI. Scheduled my video consult within two clicks. My telehealth room was robust, and Dr. Chen prescribed my ointment digitally. Seamless experience!',
    star: 5
  },
  {
    id: 'test-3',
    name: 'Priya Sharma',
    age: 35,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    condition: 'Pediatric Consultation for Son',
    doctor: 'Dr. Marcus Vance',
    quote: 'Dr. Vance was incredibly patient with my 3-year-old. The video consultation felt as personal as an in-person visit. Highly recommend for any parent!',
    star: 5
  },
  {
    id: 'test-4',
    name: 'Robert Kim',
    age: 45,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    condition: 'Chronic Migraine Management',
    doctor: 'Dr. Sophia Martinez',
    quote: 'After years of suffering, Dr. Martinez finally helped me find a treatment plan that works. The AI symptom checker pointed me to neurology right away. Life-changing platform.',
    star: 5
  }
];

export const INSURANCE_PARTNERS = [
  'Aetna',
  'BlueCross BlueShield',
  'UnitedHealthcare',
  'Cigna',
  'Humana',
  'Kaiser Permanente',
  'Anthem',
  'Medicare'
];
