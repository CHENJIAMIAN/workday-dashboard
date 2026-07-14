import { describe, expect, it } from 'vitest';
import { calculateWorkdayClock, formatRemainingTime } from '../src/services/workday-clock';

describe('工作日时钟', () => {
  it('计算剩余时间块和进度', () => {
    const clock = calculateWorkdayClock(new Date('2026-07-14T12:00:00'), { unitMinutes: 10 });
    expect(clock.remainingMinutes).toBe(360);
    expect(clock.totalBlocks).toBe(36);
    expect(clock.progress).toBe(33);
  });

  it('下班后归零', () => {
    const clock = calculateWorkdayClock(new Date('2026-07-14T19:00:00'));
    expect(clock.isComplete).toBe(true);
    expect(formatRemainingTime(clock.remainingMilliseconds)).toBe('00 : 00 : 00');
  });
});
