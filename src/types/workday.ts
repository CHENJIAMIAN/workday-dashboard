export const CURRENT_SCHEMA_VERSION = 1 as const;

export interface Zone {
  id: string;
  name: string;
  dots: string[];
  color?: string;
}

export interface Countdown {
  id: string;
  name: string;
  date: string;
  note?: string;
}

export interface Milestone {
  id: string;
  name: string;
  date?: string;
  note?: string;
}

export interface WorkdayState {
  schemaVersion: typeof CURRENT_SCHEMA_VERSION;
  unitMinutes: number;
  birthDate: string | null;
  zones: Zone[];
  countdowns: Countdown[];
  milestones: Milestone[];
  cardOrder: string[];
  exportTime: string | null;
}

export interface BackupDecodeResult {
  state: WorkdayState;
  warnings: string[];
  migrated: boolean;
}
