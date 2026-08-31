import type { CountdownView } from './types';

interface CountdownListProps { items: CountdownView[]; onEdit: (item: CountdownView) => void; onDelete: (id: string) => void; }

function CountdownDuration({ daysLeft }: { daysLeft: number }) {
  if (daysLeft === 0) return <strong>就是今天!</strong>;

  const absoluteDays = Math.abs(daysLeft);
  const years = Math.floor(absoluteDays / 365);
  const remainingDays = years > 0 ? absoluteDays % 365 : absoluteDays;

  return (
    <strong>
      <small>{daysLeft > 0 ? '还剩 ' : '已过 '}</small>
      {years > 0 && <>{years}<small>年</small></>}
      {remainingDays}<small>{years > 0 ? '天' : ' 天'}</small>
    </strong>
  );
}

export function CountdownList({ items, onEdit, onDelete }: CountdownListProps) {
  if (!items.length) return <div className="empty-state"><h3>还没有长期计划</h3><p>新建一个值得期待的日期。</p></div>;
  return <div className="item-list">{items.map((item) => <article className="list-item" key={item.id}><div><h3>{item.title}</h3><p className="eyebrow">{item.targetDate}{item.note ? ` · ${item.note}` : ''}</p></div><CountdownDuration daysLeft={item.daysLeft} /><div className="row-actions"><button type="button" onClick={() => onEdit(item)}>编辑</button><button type="button" className="danger-link" onClick={() => onDelete(item.id)}>删除</button></div></article>)}</div>;
}
