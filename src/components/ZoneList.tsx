import type { TimeZoneView } from './types';

interface ZoneListProps { zones: TimeZoneView[]; onEdit: (zone: TimeZoneView) => void; onDelete: (id: string) => void; }

export function ZoneList({ zones, onEdit, onDelete }: ZoneListProps) {
  return <div className="item-list">{zones.map((zone) => <article className="list-item" key={zone.id}><i className="color-swatch" style={{ background: zone.color }} /><div><h3>{zone.name}</h3><p>{zone.blocks} 块时间</p></div><div className="row-actions"><button type="button" onClick={() => onEdit(zone)}>编辑</button><button type="button" className="danger-link" onClick={() => onDelete(zone.id)}>删除</button></div></article>)}</div>;
}
