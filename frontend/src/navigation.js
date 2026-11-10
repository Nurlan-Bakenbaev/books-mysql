export function routeFromLocation({ search = '', hash = '' }) {
  const params = new URLSearchParams(search);
  if (params.has('lesson')) return { type: 'lesson', id: params.get('lesson') };
  if (params.has('chapter')) return { type: 'chapter', id: params.get('chapter') };
  if (params.has('view')) return { type: 'view', id: params.get('view') === 'dashboard' ? 'overview' : params.get('view') };
  const legacyView = hashToView[hash];
  if (legacyView) return { type: 'view', id: legacyView };
  return { type: 'landing', id: null };
}

export function currentRoute() {
  return routeFromLocation(window.location);
}

export function lessonHref(id) {
  return `?lesson=${encodeURIComponent(id)}`;
}

export function lessonMaterialsHref(id) {
  return `${lessonHref(id)}#lesson-sources`;
}

export function chapterHref(id) {
  return `?chapter=${encodeURIComponent(id)}`;
}

export function sectionHref(hash) {
  if (!hash) return window.location.pathname;
  const view = hashToView[hash];
  if (view) return `${window.location.pathname}?view=${encodeURIComponent(view)}`;
  return `${window.location.pathname}?view=overview${hash}`;
}

export function viewHref(view) {
  return `?view=${encodeURIComponent(view)}`;
}

const hashToView = {
  '#overview': 'overview',
  '#roadmap': 'roadmap',
  '#windows-security': 'windows-security',
  '#azure-admin': 'azure-admin',
  '#linux-security': 'linux-security',
  '#ethical-hacking': 'ethical-hacking',
  '#simulators': 'simulators',
  '#resources': 'resources',
  '#glossary': 'glossary',
  '#labs': 'labs',
  '#certifications': 'certifications',
  '#book-extra': 'book',
  '#book': 'book',
  '#course': 'book',
};
