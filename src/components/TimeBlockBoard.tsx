import { Minus, Plus } from 'lucide-react';
import type { TimeZoneView } from './types';

interface TimeBlockBoardProps {
  totalBlocks: number;
  unitMinutes: number;
  zones: TimeZoneView[];
  selectedZoneId?: string;
  onSelectZone: (id: string) => void;
  onIncrementZone: (id: string) => void;
  onDecrementZone: (id: string) => void;
  onAddZone: () => void;
  onCompletePlan: () => void;
  canCompletePlan: boolean;
}

export function TimeBlockBoard({ totalBlocks, unitMinutes, zones, selectedZoneId, onSelectZone, onIncrementZone, onDecrementZone, onAddZone, onCompletePlan, canCompletePlan }: TimeBlockBoardProps) {
  const assigned = zones.reduce((sum, zone) => sum + zone.blocks, 0);
  return (
    <section className="board-grid">
      <div className="panel block-panel">
        <div className="section-heading"><div><p className="eyebrow">时间容量</p><h2>剩余时间块</h2></div><strong>{totalBlocks}</strong></div>
        <div className="block-cloud" aria-label={`共 ${totalBlocks} 个时间块`}>
          {Array.from({ length: totalBlocks }, (_, index) => <span key={index} className={index < assigned ? 'is-assigned' : ''} />)}
        </div>
        <p className="muted">每块 {unitMinutes} 分钟，已分配 {Math.min(assigned, totalBlocks)} 块</p>
      </div>
      <div className="panel allocation-panel">
        <div className="section-heading"><div><p className="eyebrow">执行清单</p><h2>今日分配</h2></div></div>
        <div className="allocation-list">
          {zones.map((zone) => (
            <div key={zone.id} className={selectedZoneId === zone.id ? 'allocation-row is-selected' : 'allocation-row'}>
              <button className="allocation-main" type="button" onClick={() => onSelectZone(zone.id)}>
                <i style={{ background: zone.color }} />
                <span>{zone.name}</span>
                <strong>{zone.blocks} 块</strong>
              </button>
              <div className="allocation-controls">
                <button type="button" onClick={() => onDecrementZone(zone.id)} disabled={zone.blocks === 0} aria-label={`减少 ${zone.name} 的时间块`} title="减少时间块">
                  <Minus aria-hidden="true" size={16} />
                </button>
                <button type="button" onClick={() => onIncrementZone(zone.id)} disabled={assigned >= totalBlocks} aria-label={`增加 ${zone.name} 的时间块`} title="增加时间块">
                  <Plus aria-hidden="true" size={16} />
                </button>
              </div>
            </div>
          ))}
          {totalBlocks > assigned && <div className="allocation-row muted-row"><i /><span>未分配</span><strong>{totalBlocks - assigned} 块</strong></div>}
        </div>
      </div>
      <div className="board-actions"><button className="secondary-button" type="button" onClick={onAddZone}>＋ 新建分区</button><button className="primary-button" type="button" onClick={onCompletePlan} disabled={!canCompletePlan}>完成今天的安排</button></div>
    </section>
  );
}
