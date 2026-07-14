export interface GoogleDriveDialogProps {
  open: boolean;
  connected: boolean;
  busy?: boolean;
  clientId: string;
  message?: string;
  error?: string;
  onClientIdChange: (value: string) => void;
  onClose: () => void;
  onConnect: () => void;
  onUpload: () => void;
  onDownload: () => void;
}

export function GoogleDriveDialog({ open, connected, busy, clientId, message, error, onClientIdChange, onClose, onConnect, onUpload, onDownload }: GoogleDriveDialogProps) {
  if (!open) return null;
  return <div className="modal-layer"><div className="dialog" role="dialog" aria-modal="true" aria-labelledby="drive-dialog-title"><div className="dialog-header"><h2 id="drive-dialog-title">Google Drive</h2><button className="icon-button" type="button" onClick={onClose} aria-label="关闭">×</button></div><p>{connected ? '已连接，可上传当前数据或恢复最新云端备份。' : '使用你自己的 Google OAuth 客户端 ID 连接私人云端空间。'}</p>{!connected && <label>OAuth 客户端 ID<input type="text" value={clientId} onChange={(event) => onClientIdChange(event.target.value)} placeholder="123456.apps.googleusercontent.com" /></label>}{message && <p className="success-message" role="status">{message}</p>}{error && <p className="error-message" role="alert">{error}</p>}{!connected ? <button className="primary-button full-button" disabled={busy || !clientId.trim()} type="button" onClick={onConnect}>{busy ? '连接中…' : '连接 Google Drive'}</button> : <div className="stack-actions"><button className="primary-button" disabled={busy} type="button" onClick={onUpload}>上传当前数据</button><button className="secondary-button" disabled={busy} type="button" onClick={onDownload}>恢复最新备份</button></div>}</div></div>;
}
