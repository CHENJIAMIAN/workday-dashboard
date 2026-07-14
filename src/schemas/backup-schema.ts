import { z } from 'zod';

export const backupEnvelopeSchema = z.object({
  schemaVersion: z.number().int().nonnegative().optional(),
  unitMinutes: z.unknown().optional(),
  birthDate: z.unknown().optional(),
  zones: z.unknown().optional(),
  countdowns: z.unknown().optional(),
  cardOrder: z.unknown().optional(),
  exportTime: z.unknown().optional(),
}).passthrough();

export type BackupEnvelope = z.infer<typeof backupEnvelopeSchema>;
