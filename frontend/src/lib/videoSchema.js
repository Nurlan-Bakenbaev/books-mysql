import { z } from 'zod';

export const russianVideoSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9_-]{11}$/).optional(),
  playlistId: z.string().regex(/^PL[A-Za-z0-9_-]{16,}$/).optional(),
  title: z.string().trim().min(1),
  sourceName: z.string().trim().min(1),
  source: z.string().url().refine((value) => value.startsWith('https://'), 'Нужен HTTPS-источник'),
  focus: z.string().trim().min(1),
}).refine((item) => Boolean(item.id) !== Boolean(item.playlistId), 'Укажите либо одно видео, либо плейлист');

export const russianVideosSchema = z.record(z.string(), russianVideoSchema);
