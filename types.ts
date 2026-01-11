export enum PricingZone { AFRICA = 'AFRICA', EUROPE = 'EUROPE', GLOBAL = 'GLOBAL' }
export type Language = 'fr' | 'en' | 'it' | 'es';
export type UserRank = 'NOVICE' | 'RESTORER' | 'AMBASSADOR' | 'ELITE_DIAMOND';

export interface LeaderDNA {
  archetype: string;
  strategy: number;
  empathy: number;
  technical: number;
  influence: number;
  vision: string;
  rank: UserRank;
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
  dna?: LeaderDNA;
}

export interface Lesson {
  id: string;
  title: string;
  content: string; 
  starkInsight: string;
  practicalExercise: string;
  sections?: string[]; 
}

export interface AcademyModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isPremium?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  image?: string;
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

export interface ClinicalData {
  biomarkers: { glycemia_mmol_l?: number; cholesterol_total_mmol_l?: number; bmi?: number; };
  protocol: Array<{ product: string; dosage: string; duration_days: number; }>;
}

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

export interface AdminMonitorStats {
  totalNetSaaS: number;
  aiEffectiveness: number;
  orphanLeadsCount: number;
  totalActiveHubs: number;
}