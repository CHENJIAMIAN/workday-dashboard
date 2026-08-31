import type { MilestoneView } from '../components/types';

export interface MilestoneEditorProps {
  open: boolean;
  value?: MilestoneView;
  onClose: () => void;
  onSave: (value: { id?: string; title: string; date?: string; note: string }) => void;
}

export function MilestoneEditor({ open, value, onClose, onSave }: MilestoneEditorProps) {
  if (!open) return null;
  return (
    <div className="modal-layer" role="presentation">
      <form
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-editor-title"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const date = String(data.get('date') ?? '');
          onSave({
            id: value?.id,
            title: String(data.get('title')),
            date: date || undefined,
            note: String(data.get('note')),
          });
        }}
      >
        <div className="dialog-header">
          <h2 id="milestone-editor-title">{value ? '编辑里程碑' : '新建里程碑'}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="关闭">×</button>
        </div>
        <label>
          名称
          <input name="title" required maxLength={30} defaultValue={value?.title} placeholder="如：毕业、结婚、30 岁" autoFocus />
        </label>
        <label>
          日期
          <input name="date" type="date" defaultValue={value?.date} />
        </label>
        <label>
          备注
          <textarea name="note" rows={3} defaultValue={value?.note} placeholder="可选" />
        </label>
        <div className="dialog-actions">
          <button type="button" className="secondary-button" onClick={onClose}>取消</button>
          <button type="submit" className="primary-button">保存</button>
        </div>
      </form>
    </div>
  );
}
