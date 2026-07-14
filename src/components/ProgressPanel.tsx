import type { InsightView } from './types';

interface ProgressPanelProps { items: InsightView[]; }

export function ProgressPanel({ items }: ProgressPanelProps) {
  return <div className="insight-grid">{items.map((item) => <article className="panel insight-card" key={item.label}><p className="eyebrow">{item.label}</p><strong>{item.value}</strong><p>{item.detail}</p>{item.progress !== undefined && <div className="progress-track"><span style={{ width: `${Math.max(0, Math.min(100, item.progress))}%` }} /></div>}</article>)}</div>;
}
