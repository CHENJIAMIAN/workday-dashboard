import { ProgressPanel } from '../components/ProgressPanel';
import type { InsightView } from '../components/types';
export interface InsightsPageProps { insights: InsightView[]; }
export function InsightsPage({ insights }: InsightsPageProps) { return <main className="page"><div className="page-heading"><div><p className="eyebrow">时间视角</p><h1>洞察</h1><p>用更长的尺度看今天所在的位置。</p></div></div><ProgressPanel items={insights} /></main>; }
