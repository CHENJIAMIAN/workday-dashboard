import type { MilestoneView } from './types';

interface MilestoneTimelineProps { items: MilestoneView[]; onEdit: (item: MilestoneView) => void; onDelete: (id: string) => void; }

export function MilestoneTimeline({ items, onEdit, onDelete }: MilestoneTimelineProps) {
  if (!items.length) {
    return <div className="empty-state"><h3>还没有里程碑</h3><p>添加毕业、结婚、30 岁这类节点，串成自己的时间线。</p></div>;
  }
  return (
    <div className="timeline" role="list">
      {items.map((item) => (
        <article className="timeline-item" role="listitem" key={item.id}>
          <div className="timeline-marker" aria-hidden="true" />
          <div className="timeline-body">
            <p className="eyebrow">{item.date ? item.date : '未定日期'}</p>
            <h3>{item.title}</h3>
            {item.note && <p>{item.note}</p>}
          </div>
          <div className="row-actions">
            <button type="button" onClick={() => onEdit(item)}>编辑</button>
            <button type="button" className="danger-link" onClick={() => onDelete(item.id)}>删除</button>
          </div>
        </article>
      ))}
    </div>
  );
}
