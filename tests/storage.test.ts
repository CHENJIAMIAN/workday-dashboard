import { describe, expect, it } from 'vitest';
import { LEGACY_STORAGE_KEYS, STATE_STORAGE_KEY, loadState, saveState } from '../src/services/storage';

describe('本地存储', () => {
  it('恢复旧版分散存储', () => {
    localStorage.clear();
    localStorage.setItem(LEGACY_STORAGE_KEYS.unitMinutes, '25');
    localStorage.setItem(LEGACY_STORAGE_KEYS.zones, JSON.stringify([{ name: '收尾', dots: [] }]));
    const state = loadState(localStorage);
    expect(state.unitMinutes).toBe(25);
    expect(state.zones[0].name).toBe('收尾');
  });

  it('保存并读取统一状态', () => {
    localStorage.clear();
    const state = loadState(localStorage);
    saveState({ ...state, unitMinutes: 30 }, localStorage);
    expect(localStorage.getItem(STATE_STORAGE_KEY)).toBeTruthy();
    expect(loadState(localStorage).unitMinutes).toBe(30);
  });
});
