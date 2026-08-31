import { CURRENT_SCHEMA_VERSION } from '../types/workday';
import type { BackupEnvelope } from './backup-schema';

export function migrateBackup(source: BackupEnvelope): BackupEnvelope {
  // 无版本号即为旧版备份；第一个版本保持旧字段，避免破坏已有文件。
  // 旧版备份没有 milestones 字段，补齐空数组保证新版 UI 可直接使用。
  const milestones = Array.isArray(source.milestones) ? source.milestones : [];
  return { ...source, milestones, schemaVersion: CURRENT_SCHEMA_VERSION };
}
