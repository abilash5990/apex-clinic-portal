export interface Doctor {
  id: string;
  name: string;
  photo: string;
  degree: string;
  specialization: string;
  experience: number; // in years
  rating: number;
  reviewsCount: number;
  availableTiming: string;
  availableDays: string[]; // e.g., ["Mon", "Wed", "Fri"]
  consultationFee: number;
  location: string;
  online: boolean;
  offline: boolean;
  bio: string;
}

export type Specialization = 
  | 'Cardiology'
  | 'Pediatrics'
  | 'Dermatology'
  | 'Neurology'
  | 'Orthopedics'
  | 'General Medicine'
  | 'Psychiatry'
  | 'Ophthalmology';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorPhoto: string;
  date: string;
  timeSlot: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  notes?: string;
  consultationType: 'Video' | 'In-Person';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending';
  amount: number;
}

export interface MedicalReport {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  type: 'Scan' | 'Lab Report' | 'Prescription' | 'Other';
  summary?: string;
  rawText?: string;
}

export interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
}

export interface HealthMetric {
  date: string;
  heartRate: number;
  bloodPressure: string;
  bloodSugar: number;
  steps: number;
  weight: number;
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  likes: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export type Theme = 'light' | 'dark';

export interface AccessibilitySettings {
  fontSize: 'standard' | 'large' | 'extra-large';
  highContrast: boolean;
  language: 'EN' | 'ES' | 'HI' | 'FR';
  speechSynthesisEnabled: boolean;
}
