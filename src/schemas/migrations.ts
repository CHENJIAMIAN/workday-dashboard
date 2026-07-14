import { CURRENT_SCHEMA_VERSION } from '../types/workday';
import type { BackupEnvelope } from './backup-schema';

export function migrateBackup(source: BackupEnvelope): BackupEnvelope {
  // 无版本号即为旧版备份；第一个版本保持旧字段，避免破坏已有文件。
  return { ...source, schemaVersion: CURRENT_SCHEMA_VERSION };
}
