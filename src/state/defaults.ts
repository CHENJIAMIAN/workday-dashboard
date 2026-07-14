import { CURRENT_SCHEMA_VERSION, type WorkdayState } from '../types/workday';

export const DEFAULT_CARD_ORDER = ['countdown', 'personal', 'today', 'workday', 'zones', 'data'];

export function createDefaultState(): WorkdayState {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    unitMinutes: 10,
    birthDate: null,
    zones: [],
    countdowns: [],
    cardOrder: [...DEFAULT_CARD_ORDER],
    exportTime: null,
  };
}
