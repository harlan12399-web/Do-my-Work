export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface SolvedItem {
  id: number;
  questionNumber: string;
  questionText: string;
  answer: string;
  workings?: string;
  box?: BoundingBox;
}

export interface SolvedWorksheetData {
  title: string;
  subject: string;
  gradeLevel?: string;
  summary: string;
  studentName?: string;
  date?: string;
  items: SolvedItem[];
  formattedCopyText: string;
}

export interface WorksheetSession {
  id: string;
  timestamp: string;
  imageUrl?: string;
  rawText?: string;
  data: SolvedWorksheetData;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'boy' | 'girl';
  yearGroup: string;
  celestial: 'auto' | 'sun' | 'flower' | 'moon';
  isVip: boolean;
  onboardingCompleted: boolean;
}

export interface DailyUsage {
  date: string;
  usedCount: number;
}

export const DAILY_LIMIT = 15;
export const VIP_CODE = '6856';
