import { createDefaultState } from '../state/defaults';
import type { WorkdayState } from '../types/workday';
import { decodeBackup } from './backup-codec';

export const STATE_STORAGE_KEY = 'workday-state';
export const LEGACY_STORAGE_KEYS = {
  unitMinutes: 'countdown-unit-minutes',
  birthDate: 'countdown-birthdate',
  zones: 'countdown-zones',
  countdowns: 'countdown-days',
  cardOrder: 'workday-dashboard-card-order',
} as const;

function browserStorage(): Storage | null {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function parseStored(value: string | null): unknown {
  if (value === null) return undefined;
  try { return JSON.parse(value); } catch { return value; }
}

export function loadState(storage: Storage | null = browserStorage()): WorkdayState {
  if (!storage) return createDefaultState();
  const current = storage.getItem(STATE_STORAGE_KEY);
  if (current) {
    try { return decodeBackup(current).state; } catch { /* 尝试恢复旧版分散存储。 */ }
  }
  const legacy = {
    unitMinutes: parseStored(storage.getItem(LEGACY_STORAGE_KEYS.unitMinutes)),
    birthDate: parseStored(storage.getItem(LEGACY_STORAGE_KEYS.birthDate)),
    zones: parseStored(storage.getItem(LEGACY_STORAGE_KEYS.zones)),
    countdowns: parseStored(storage.getItem(LEGACY_STORAGE_KEYS.countdowns)),
    cardOrder: parseStored(storage.getItem(LEGACY_STORAGE_KEYS.cardOrder)),
  };
  const hasLegacyData = Object.values(legacy).some((value) => value !== undefined);
  return hasLegacyData ? decodeBackup(legacy).state : createDefaultState();
}

export function saveState(state: WorkdayState, storage: Storage | null = browserStorage()): void {
  storage?.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
}

export function clearState(storage: Storage | null = browserStorage()): void {
  storage?.removeItem(STATE_STORAGE_KEY);
}
