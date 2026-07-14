import type { ClockView } from './types';

interface WorkdayHeroProps { clock: ClockView; }

export function WorkdayHero({ clock }: WorkdayHeroProps) {
  const progress = Math.max(0, Math.min(100, clock.progress));
  return (
    <section className="workday-hero" aria-labelledby="workday-title">
      <div className="hero-heading">
        <div><p className="eyebrow">{clock.isComplete ? '今天辛苦了' : clock.label}</p><h1 id="workday-title">{clock.value}</h1></div>
        <span className="target-chip">{clock.targetLabel}</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>
      <div className="hero-meta"><span>{clock.remainingMinutes} 分钟待安排</span><strong>{Math.round(progress)}%</strong></div>
    </section>
  );
}
