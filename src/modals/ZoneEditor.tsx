import type { TimeZoneView } from '../components/types'

interface ZoneEditorProps {
  open: boolean
  value?: TimeZoneView
  onClose: () => void
  onSave: (value: { id?: string; name: string }) => void
}

export function ZoneEditor({ open, value, onClose, onSave }: ZoneEditorProps) {
  if (!open) return null

  return (
    <div className="modal-layer" role="presentation">
      <form
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="zone-editor-title"
        onSubmit={(event) => {
          event.preventDefault()
          const data = new FormData(event.currentTarget)
          onSave({ id: value?.id, name: String(data.get('name')).trim() })
        }}
      >
        <div className="dialog-header">
          <h2 id="zone-editor-title">{value ? '编辑分区' : '新建分区'}</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="关闭">×</button>
        </div>
        <label>
          分区名称
          <input name="name" required maxLength={30} defaultValue={value?.name} autoFocus />
        </label>
        <div className="dialog-actions">
          <button type="button" className="secondary-button" onClick={onClose}>取消</button>
          <button type="submit" className="primary-button">保存</button>
        </div>
      </form>
    </div>
  )
}
