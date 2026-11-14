export const libraryCategories = ['Видео', 'Курсы', 'Книги', 'Документация'];

const categoryByType = new Map([
  ['Видео', 'Видео'],
  ['Курс', 'Курсы'],
  ['Видеокурс', 'Курсы'],
  ['Книга', 'Книги'],
  ['Открытая книга', 'Книги'],
  ...['Документация', 'Справочник', 'Руководство', 'RFC', 'Стандарт', 'Стандарты', 'Фреймворк'].map((type) => [type, 'Документация']),
]);

// These older records are labelled broadly, but link to actual documentation.
const documentationIds = new Set(['sp-wstg', 'sp-ms-zerotrust', 'sp-ms-resilience', 'sp-ms-shared', 'sp-ms-identity']);
const excludedIds = new Set(['postmortem-templates', 'mitre-attack-docs']);

export function resourceCategory(resource) {
  if (excludedIds.has(resource.id)) return null;
  return documentationIds.has(resource.id) ? 'Документация' : categoryByType.get(resource.type) || null;
}

export function buildLibrary(resources) {
  const byUrl = new Map();
  for (const resource of resources) {
    const category = resourceCategory(resource);
    if (!category) continue;
    const key = new URL(resource.url).href.replace(/\/$/, '');
    const existing = byUrl.get(key);
    if (existing) existing.sourceIds.push(resource.id);
    else byUrl.set(key, { ...resource, category, sourceIds: [resource.id] });
  }
  return [...byUrl.values()];
}
