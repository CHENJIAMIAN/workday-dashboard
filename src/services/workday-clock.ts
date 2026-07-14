export interface WorkdayClock {
  target: Date;
  remainingMilliseconds: number;
  remainingMinutes: number;
  totalBlocks: number;
  progress: number;
  isComplete: boolean;
}

export interface WorkdayClockOptions {
  startHour?: number;
  endHour?: number;
  unitMinutes?: number;
}

export function calculateWorkdayClock(now: Date, options: WorkdayClockOptions = {}): WorkdayClock {
  const startHour = options.startHour ?? 9;
  const endHour = options.endHour ?? 18;
  const unitMinutes = options.unitMinutes ?? 10;
  const start = new Date(now);
  start.setHours(startHour, 0, 0, 0);
  const target = new Date(now);
  target.setHours(endHour, 0, 0, 0);
  const duration = Math.max(1, target.getTime() - start.getTime());
  const remainingMilliseconds = Math.max(0, target.getTime() - now.getTime());
  const remainingMinutes = Math.ceil(remainingMilliseconds / 60_000);
  const elapsed = Math.min(duration, Math.max(0, now.getTime() - start.getTime()));
  return {
    target,
    remainingMilliseconds,
    remainingMinutes,
    totalBlocks: unitMinutes > 0 ? Math.floor(remainingMinutes / unitMinutes) : 0,
    progress: Math.round((elapsed / duration) * 100),
    isComplete: remainingMilliseconds === 0,
  };
}

export function formatRemainingTime(milliseconds: number): string {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = seconds % 60;
  return [hours, minutes, rest].map((value) => String(value).padStart(2, '0')).join(' : ');
}
