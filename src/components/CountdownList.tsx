import type { CountdownView } from './types';

interface CountdownListProps { items: CountdownView[]; onEdit: (item: CountdownView) => void; onDelete: (id: string) => void; }

export function CountdownList({ items, onEdit, onDelete }: CountdownListProps) {
  if (!items.length) return <div className="empty-state"><h3>还没有长期计划</h3><p>新建一个值得期待的日期。</p></div>;
  return <div className="countdown-grid">{items.map((item) => <article className="countdown-card" key={item.id}><p className="eyebrow">{item.targetDate}</p><h3>{item.title}</h3><strong>{item.daysLeft >= 0 ? item.daysLeft : Math.abs(item.daysLeft)}<small> 天{item.daysLeft < 0 ? '前' : ''}</small></strong>{item.note && <p>{item.note}</p>}<div className="row-actions"><button type="button" onClick={() => onEdit(item)}>编辑</button><button type="button" className="danger-link" onClick={() => onDelete(item.id)}>删除</button></div></article>)}</div>;
}
