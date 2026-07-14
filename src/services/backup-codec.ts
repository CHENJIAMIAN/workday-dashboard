import { createDefaultState } from '../state/defaults';
import { backupEnvelopeSchema } from '../schemas/backup-schema';
import { migrateBackup } from '../schemas/migrations';
import { CURRENT_SCHEMA_VERSION, type BackupDecodeResult, type Countdown, type WorkdayState, type Zone } from '../types/workday';

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function validDate(value: unknown): string | null {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return null;
  return value;
}

function makeId(prefix: string, index: number): string {
  return `${prefix}-${index + 1}`;
}

function decodeZone(value: unknown, index: number): Zone | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const name = text(item.name);
  if (!name) return null;
  const dots = Array.isArray(item.dots) ? item.dots.filter((dot): dot is string => typeof dot === 'string') : [];
  const color = text(item.color) ?? undefined;
  return { id: text(item.id) ?? makeId('zone', index), name, dots, ...(color ? { color } : {}) };
}

function decodeCountdown(value: unknown, index: number): Countdown | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const name = text(item.name) ?? text(item.title);
  const date = validDate(item.date) ?? validDate(item.targetDate);
  if (!name || !date) return null;
  const note = text(item.note) ?? undefined;
  return { id: text(item.id) ?? makeId('countdown', index), name, date, ...(note ? { note } : {}) };
}

export function decodeBackup(input: string | unknown): BackupDecodeResult {
  let raw: unknown = input;
  if (typeof input === 'string') {
    try { raw = JSON.parse(input); } catch { throw new Error('备份不是有效的 JSON'); }
  }
  const parsed = backupEnvelopeSchema.safeParse(raw);
  if (!parsed.success) throw new Error('备份顶层必须是 JSON 对象');
  const legacy = parsed.data.schemaVersion === undefined;
  const source = migrateBackup(parsed.data);
  const defaults = createDefaultState();
  const warnings: string[] = [];

  const unit = typeof source.unitMinutes === 'number' ? source.unitMinutes : Number(source.unitMinutes);
  const unitMinutes = Number.isFinite(unit) && unit > 0 && unit <= 1440 ? unit : defaults.unitMinutes;
  if (source.unitMinutes !== undefined && unitMinutes === defaults.unitMinutes && unit !== defaults.unitMinutes) warnings.push('unitMinutes 无效，已使用默认值');

  const zonesInput = Array.isArray(source.zones) ? source.zones : [];
  const zones = zonesInput.map(decodeZone).filter((item): item is Zone => item !== null);
  if (zones.length !== zonesInput.length) warnings.push('已跳过无效分区');
  const countdownInput = Array.isArray(source.countdowns) ? source.countdowns : [];
  const countdowns = countdownInput.map(decodeCountdown).filter((item): item is Countdown => item !== null);
  if (countdowns.length !== countdownInput.length) warnings.push('已跳过无效倒计时');

  const birthDate = source.birthDate == null ? null : validDate(source.birthDate);
  if (source.birthDate != null && !birthDate) warnings.push('birthDate 无效，已清空');
  const exportTime = source.exportTime == null ? null : validDate(source.exportTime);
  const cardOrder = Array.isArray(source.cardOrder)
    ? [...new Set(source.cardOrder.filter((item): item is string => typeof item === 'string' && item.trim().length > 0))]
    : defaults.cardOrder;

  const state: WorkdayState = { schemaVersion: CURRENT_SCHEMA_VERSION, unitMinutes, birthDate, zones, countdowns, cardOrder, exportTime };
  return { state, warnings, migrated: legacy || parsed.data.schemaVersion !== CURRENT_SCHEMA_VERSION };
}

export function encodeBackup(state: WorkdayState): string {
  return JSON.stringify({ ...state, schemaVersion: CURRENT_SCHEMA_VERSION, exportTime: new Date().toISOString() }, null, 2);
}
