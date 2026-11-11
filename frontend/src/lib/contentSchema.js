import { z } from 'zod';

const text = z.string().trim().min(1, 'Ожидается непустой текст');
const uniqueText = (items) => new Set(items.map((item) => item.trim().toLocaleLowerCase())).size === items.length;
export const questionSchema = z.object({
  question: text, options: z.array(text).min(3), answer: z.number().int().nonnegative(), explanation: text,
}).superRefine((item, ctx) => {
  if (item.answer >= item.options.length) ctx.addIssue({ code: 'custom', path: ['answer'], message: 'Индекс ответа выходит за границы вариантов' });
  if (!uniqueText(item.options)) ctx.addIssue({ code: 'custom', path: ['options'], message: 'Варианты должны быть уникальны' });
});
const topicSchema = z.object({ id: text, title: text, description: text });
const sourceSchema = z.object({
  id: text, title: text, description: text, type: text, language: text, access: text,
  url: z.string().url().refine((url) => /^https:\/\//i.test(url), 'Нужна HTTPS-ссылка'),
});
const labSchema = z.object({
  steps: z.array(text).min(1), commands: z.string(), expected: text, pitfalls: z.array(text).min(1),
  extraCommands: z.array(z.object({ label: text, commands: text })).optional(),
});
const lessonSchema = z.object({
  intro: text, sections: z.array(z.object({ title: text, paragraphs: z.array(text).min(1) })).min(1), lab: labSchema,
});
const detailSchema = z.object({
  goals: z.array(text).min(3), deepDive: z.array(text).min(2), diagram: z.array(text).min(3),
  caseStudy: z.object({ situation: text, action: text, result: text }),
  practiceTasks: z.array(z.object({ task: text, hint: text, solution: text })).optional(),
  question: questionSchema,
});
const referenceSchema = z.object({ sourceId: text, focus: text, takeaway: text.optional() });
export const curriculumSchema = z.object({
  topics: z.array(topicSchema).min(1),
  terms: z.array(z.object({ id: text, name: text, short: text, category: text, description: text, how: text, when: text, example: text, check: text, caution: text })),
  labs: z.array(z.object({ id: text, title: text, description: text, expected: text, prerequisites: z.array(text).min(1), steps: z.array(z.object({ title: text, text, command: text.optional() })).min(1), verify: z.array(text).min(1), troubleshooting: z.array(text).min(1), rollback: z.array(text).min(1) })),
  lessons: z.record(z.string(), lessonSchema),
  details: z.record(z.string(), detailSchema),
  walkthroughs: z.record(z.string(), z.object({ title: text, context: text, steps: z.array(text).min(3), verification: text, troubleshooting: text })),
  resources: z.array(sourceSchema), references: z.record(z.string(), z.array(referenceSchema).min(2)),
  exam: z.array(questionSchema.and(z.object({ domain: z.number().int().min(1).max(5), options: z.array(text).length(4) }))).length(30),
}).superRefine((data, ctx) => {
  const issue = (path, message) => ctx.addIssue({ code: 'custom', path, message });
  const topicIds = data.topics.map((topic) => topic.id);
  const sourceIds = data.resources.map((source) => source.id);
  for (const key of ['terms', 'labs']) {
    const ids = data[key].map((item) => item.id);
    if (new Set(ids).size !== ids.length) issue([key], 'Повторяются ID');
  }
  if (new Set(topicIds).size !== topicIds.length) issue(['topics'], 'Повторяются ID уроков');
  if (new Set(sourceIds).size !== sourceIds.length) issue(['resources'], 'Повторяются ID источников');
  for (const key of ['lessons', 'details', 'walkthroughs', 'references']) {
    for (const id of topicIds) if (!data[key][id]) issue([key, id], 'Нет данных опубликованного урока');
    for (const id of Object.keys(data[key])) if (!topicIds.includes(id)) issue([key, id], 'Неизвестный ID урока');
  }
  for (const [id, refs] of Object.entries(data.references)) {
    if (new Set(refs.map((ref) => ref.sourceId)).size !== refs.length) issue(['references', id], 'Источник повторяется в уроке');
    for (const ref of refs) if (!sourceIds.includes(ref.sourceId)) issue(['references', id, ref.sourceId], 'Источник не существует');
  }
  if (!uniqueText(data.exam.map((item) => item.question))) issue(['exam'], 'Повторяются вопросы экзамена');
  const expected = [4, 7, 5, 8, 6];
  for (let domain = 1; domain <= 5; domain++) {
    if (data.exam.filter((item) => item.domain === domain).length !== expected[domain - 1]) issue(['exam'], `Неверное число вопросов домена ${domain}`);
  }
});
