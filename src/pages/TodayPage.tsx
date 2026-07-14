import { TimeBlockBoard } from '../components/TimeBlockBoard';
import { WorkdayHero } from '../components/WorkdayHero';
import type { ClockView, TimeZoneView } from '../components/types';

export interface TodayPageProps { clock: ClockView; totalBlocks: number; unitMinutes: number; zones: TimeZoneView[]; selectedZoneId?: string; onSelectZone: (id: string) => void; onIncrementZone: (id: string) => void; onDecrementZone: (id: string) => void; onAddZone: () => void; onCompletePlan: () => void; canCompletePlan: boolean; }
export function TodayPage(props: TodayPageProps) { return <main className="page page-today"><WorkdayHero clock={props.clock} /><TimeBlockBoard {...props} /></main>; }
