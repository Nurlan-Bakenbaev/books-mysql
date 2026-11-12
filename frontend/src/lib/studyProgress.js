export const LEARNING_KEY = 'sysadmin-path-2026-learning-v1';
export const ASSESSMENT_KEY = 'sysadmin-path-2026-assessments-v1';
export const PROGRESS_KEY = 'sysadmin-path-2026-progress';
export function readJson(key, fallback, storage = localStorage) {
  try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch { return fallback; }
}
export function saveJson(key, value, storage = localStorage) {
  try { storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
export const fingerprint = questions => JSON.stringify(questions.map(q => [q.question, q.options, q.answer]));
export function readAssessment(id, questions, storage = localStorage) {
  const all = readJson(ASSESSMENT_KEY, {}, storage);
  const saved = all[id] || {};
  return { answers: saved.fingerprint === fingerprint(questions) ? saved.answers || {} : {}, attempts: Array.isArray(saved.attempts) ? saved.attempts : [] };
}
export function validateAttempt(a) {
  return a && typeof a.title === 'string' && a.title.trim().length > 0 && a.title.length <= 500 && typeof a.date === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(a.date) && Number.isFinite(Date.parse(a.date)) && Number.isInteger(a.total) && a.total > 0 && a.total <= 10000 && Number.isInteger(a.score) && a.score >= 0 && a.score <= a.total;
}
export function exportStudy(storage = localStorage) {
  return { version: 1, progress: readJson(PROGRESS_KEY, [], storage), learning: readJson(LEARNING_KEY, {}, storage), assessments: readJson(ASSESSMENT_KEY, {}, storage) };
}
const record = value => value && typeof value === 'object' && !Array.isArray(value);
export function importStudy(data, storage = localStorage) {
  if (data?.version !== 1 || !Array.isArray(data.progress) || data.progress.some(x => typeof x !== 'string') || !record(data.learning) || !record(data.assessments)) throw new Error('Неверный формат файла прогресса');
  for (const a of Object.values(data.assessments)) if (!record(a) || !Array.isArray(a.attempts) || !a.attempts.every(validateAttempt)) throw new Error('Неверная история попыток');
  if (data.learning.course !== undefined && typeof data.learning.course !== 'string') throw new Error('Неверный курс');
  for (const [key, values] of Object.entries(data.learning)) {
    if (['__proto__','constructor','prototype'].includes(key)) throw new Error('Недопустимый ключ');
    if (key === 'positions' && (!record(values) || Object.values(values).some(v => !Number.isFinite(v) || v < 0))) throw new Error('Неверные позиции чтения');
    if (key === 'last' && (!record(values) || Object.values(values).some(v => typeof v !== 'string'))) throw new Error('Неверная история уроков');
  }
  const old = [PROGRESS_KEY, LEARNING_KEY, ASSESSMENT_KEY].map(key => [key, storage.getItem(key)]);
  const current = exportStudy(storage);
  const assessments = { ...current.assessments };
  for (const [id, a] of Object.entries(data.assessments)) {
    if (['__proto__', 'constructor', 'prototype'].includes(id)) throw new Error('Недопустимый ключ');
    const attempts = [...(assessments[id]?.attempts || []), ...a.attempts];
    assessments[id] = { ...assessments[id], attempts: [...new Map(attempts.map(x => [JSON.stringify(x), x])).values()] };
  }
  const mergedLearning = { ...data.learning, ...current.learning };
  for (const key of ['last','positions','exercises','labs']) if (data.learning[key] || current.learning[key]) mergedLearning[key] = { ...data.learning[key], ...current.learning[key] };
  if (data.learning.days || current.learning.days) mergedLearning.days = [...new Set([...(current.learning.days || []), ...(data.learning.days || [])])];
  const next = [[PROGRESS_KEY, [...new Set([...current.progress, ...data.progress])]], [LEARNING_KEY, mergedLearning], [ASSESSMENT_KEY, assessments]];
  try { for (const [key, value] of next) storage.setItem(key, JSON.stringify(value)); }
  catch {
    let restored = true;
    for (const [key, value] of old) { try { if (value === null) storage.removeItem(key); else storage.setItem(key, value); } catch { restored = false; } }
    throw new Error(restored ? 'Сохранить импорт не удалось; прежний прогресс восстановлен.' : 'Ошибка хранилища. Импорт не завершён; сохраните экспорт и проверьте доступное место.');
  }
}
