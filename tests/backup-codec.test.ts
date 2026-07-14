import { describe, expect, it } from 'vitest';
import { decodeBackup, encodeBackup } from '../src/services/backup-codec';

describe('备份反序列化', () => {
  it('读取无 schemaVersion 的旧版 JSON', () => {
    const result = decodeBackup(JSON.stringify({
      unitMinutes: 15,
      birthDate: '1990-01-01T00:00:00.000Z',
      zones: [{ name: '专注', dots: ['dot-1'] }],
      countdowns: [{ name: '假期', date: '2027-01-01' }],
      cardOrder: ['today', 'zones'],
      exportTime: '2026-07-13T00:00:00.000Z',
    }));
    expect(result.migrated).toBe(true);
    expect(result.state.unitMinutes).toBe(15);
    expect(result.state.zones[0]).toMatchObject({ name: '专注', dots: ['dot-1'] });
    expect(result.state.countdowns[0]).toMatchObject({ name: '假期', date: '2027-01-01' });
  });

  it('隔离无效单项并保留有效内容', () => {
    const result = decodeBackup({
      zones: [{ name: '有效', dots: [] }, { dots: [] }, null],
      countdowns: [{ name: '有效', date: '2030-01-01' }, { name: '坏日期', date: '不是日期' }],
    });
    expect(result.state.zones).toHaveLength(1);
    expect(result.state.countdowns).toHaveLength(1);
    expect(result.warnings).toEqual(expect.arrayContaining(['已跳过无效分区', '已跳过无效倒计时']));
  });

  it('新导出包含 schemaVersion 且能再次读取', () => {
    const state = decodeBackup({ unitMinutes: 20 }).state;
    const encoded = encodeBackup(state);
    expect(JSON.parse(encoded).schemaVersion).toBe(1);
    expect(decodeBackup(encoded).state.unitMinutes).toBe(20);
  });

  it('拒绝非法 JSON 和非对象顶层', () => {
    expect(() => decodeBackup('{')).toThrow('备份不是有效的 JSON');
    expect(() => decodeBackup([])).toThrow('备份顶层必须是 JSON 对象');
  });
});
