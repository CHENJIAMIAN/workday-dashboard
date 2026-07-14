const GSI_SCRIPT_ID = 'google-identity-services'
const BACKUP_PREFIX = 'workday-dashboard-backup-'
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file'

interface TokenResponse {
  access_token?: string
  error?: string
  error_description?: string
}

interface TokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void
}

interface GoogleIdentityServices {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string
        scope: string
        callback: (response: TokenResponse) => void
        error_callback?: (error: { message?: string }) => void
      }) => TokenClient
    }
  }
}

declare global {
  interface Window {
    google?: GoogleIdentityServices
  }
}

function loadIdentityServices(): Promise<void> {
  if (window.google?.accounts.oauth2) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(GSI_SCRIPT_ID) as HTMLScriptElement | null
    const script = existing ?? document.createElement('script')
    const handleLoad = () => resolve()
    const handleError = () => reject(new Error('Google 授权服务加载失败'))

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })
    if (!existing) {
      script.id = GSI_SCRIPT_ID
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  })
}

export async function requestDriveToken(clientId: string): Promise<string> {
  if (!clientId.trim()) {
    throw new Error('请先填写 Google OAuth 客户端 ID')
  }

  await loadIdentityServices()
  return new Promise((resolve, reject) => {
    const tokenClient = window.google?.accounts.oauth2.initTokenClient({
      client_id: clientId.trim(),
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.access_token) {
          resolve(response.access_token)
        } else {
          reject(new Error(response.error_description || response.error || 'Google 授权失败'))
        }
      },
      error_callback: (error) => reject(new Error(error.message || 'Google 授权窗口未完成')),
    })

    if (!tokenClient) {
      reject(new Error('Google 授权服务尚未就绪'))
      return
    }
    tokenClient.requestAccessToken({ prompt: '' })
  })
}

export async function uploadDriveBackup(accessToken: string, content: string): Promise<void> {
  const metadata = {
    name: `${BACKUP_PREFIX}${new Date().toISOString().slice(0, 10)}.json`,
    mimeType: 'application/json',
  }
  const form = new FormData()
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
  form.append('file', new Blob([content], { type: 'application/json' }))

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  })
  if (!response.ok) {
    throw new Error(`Google Drive 上传失败（${response.status}）`)
  }
}

export async function downloadLatestDriveBackup(accessToken: string): Promise<string> {
  const query = `name contains '${BACKUP_PREFIX}' and mimeType = 'application/json' and trashed = false`
  const params = new URLSearchParams({
    q: query,
    orderBy: 'createdTime desc',
    pageSize: '1',
    fields: 'files(id,name,createdTime)',
  })
  const listResponse = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!listResponse.ok) {
    throw new Error(`Google Drive 文件列表读取失败（${listResponse.status}）`)
  }

  const payload = await listResponse.json() as { files?: Array<{ id: string }> }
  const file = payload.files?.[0]
  if (!file) {
    throw new Error('Google Drive 中没有找到 WorkDay 备份')
  }

  const downloadResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!downloadResponse.ok) {
    throw new Error(`Google Drive 备份下载失败（${downloadResponse.status}）`)
  }
  return downloadResponse.text()
}
