
export enum PricingZone {
  AFRICA = 'AFRICA',
  EUROPE = 'EUROPE',
  GLOBAL = 'GLOBAL'
}

export type Language = 'fr' | 'en' | 'it' | 'es';
export type TimeFormat = '24h' | '12h' | 'seconds';

export interface Resource {
  id: string;
  title: string;
  type: 'BOOK' | 'VIDEO' | 'AUDIO';
  author: string;
  description: string;
  price: number | 'FREE';
  currency: string;
  link: string;
  thumbnail?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  neoLifeId: string;
  role: 'LEADER' | 'ADMIN' | 'PROSPECT';
  avatar?: string;
  bio?: string;
  country?: string;
  joinedDate: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string; 
  starkInsight: string;
  practicalExercise: string;
  sections?: string[]; // Segments de cours pour l'IA Professor
}

export interface AcademyModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  resources?: Resource[];
  isPremium?: boolean;
}

export interface CourseProgress {
  userId: string;
  lessonId: string;
  completedSections: number;
  totalSections: number;
  isCompleted: boolean;
  score?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read';
}

export interface ReferralContext {
  referrerId: string;
  referrerName: string;
  shopUrl?: string;
  language?: Language;
}

export interface AIPersona {
  name: string;
  role: string;
  philosophy: string;
  tonality: string;
  coreValues: string;
}

/* Fix: Adding missing ClinicalData interface for bio-scans */
export interface ClinicalData {
  biomarkers: {
    glycemia_mmol_l?: number;
    cholesterol_total_mmol_l?: number;
    bmi?: number;
  };
  protocol: Array<{
    product: string;
    dosage: string;
    duration_days: number;
  }>;
}

/* Fix: Adding missing DiagnosticReport interface for history tracking */
export interface DiagnosticReport {
  id: string;
  title: string;
  type: 'BLOOD_WORK' | 'TEXT_ANALYSIS';
  date: Date;
  status: 'ALERT' | 'NORMAL';
  fullContent: string;
  clinicalData?: ClinicalData;
  image?: string;
}

/* Fix: Adding missing AdminMonitorStats interface for master console */
export interface AdminMonitorStats {
  totalNetSaaS: number;
  aiEffectiveness: number;
  orphanLeadsCount: number;
  totalActiveHubs: number;
}

/* Fix: Adding missing WhiteLabelInstance interface for white-label factory */
export interface WhiteLabelInstance {
  id: string;
  clientName: string;
  industry: string;
  aiName: string;
  currency: string;
  primaryColor: string;
  catalogType: 'neolife' | 'custom';
  logoUrl?: string;
  setupFee: number;
  royaltyRate: number;
  isLocked: boolean;
  deploymentDate: Date;
  status: 'ACTIVE' | 'LOCKED';
}
