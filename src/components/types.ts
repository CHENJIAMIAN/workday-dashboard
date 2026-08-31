export type AppPage = 'today' | 'plans' | 'insights';

export interface TimeZoneView {
  id: string;
  name: string;
  color: string;
  blocks: number;
}

export interface CountdownView {
  id: string;
  title: string;
  targetDate: string;
  daysLeft: number;
  note?: string;
}

export interface MilestoneView {
  id: string;
  title: string;
  date?: string;
  note?: string;
}

export interface ClockView {
  label: string;
  value: string;
  targetLabel: string;
  progress: number;
  remainingMinutes: number;
  isComplete?: boolean;
}

export interface InsightView {
  label: string;
  value: string;
  detail: string;
  progress?: number;
}
