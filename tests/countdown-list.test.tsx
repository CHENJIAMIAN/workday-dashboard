import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CountdownList } from '../src/components/CountdownList';
import type { CountdownView } from '../src/components/types';

function renderCountdown(daysLeft: number) {
  const item: CountdownView = {
    id: 'countdown-1',
    title: '测试日期',
    targetDate: '2030-01-01',
    daysLeft,
  };

  render(<CountdownList items={[item]} onEdit={vi.fn()} onDelete={vi.fn()} />);
  return screen.getByRole('article');
}

describe('长期倒计时显示', () => {
  it('未来超过一年时显示剩余年数和天数', () => {
    expect(renderCountdown(2 * 365 + 3)).toHaveTextContent('还剩 2年3天');
  });

  it('过去超过一年时显示已过年数和天数', () => {
    expect(renderCountdown(-(3 * 365 + 12))).toHaveTextContent('已过 3年12天');
  });

  it('不足一年时只显示天数', () => {
    expect(renderCountdown(42)).toHaveTextContent('还剩 42 天');
  });

  it('目标日期是当天时显示当天提示', () => {
    expect(renderCountdown(0)).toHaveTextContent('就是今天!');
  });
});
