export function routeFromLocation({ search = '', hash = '' }) {
  const params = new URLSearchParams(search);
  if (params.has('lesson')) return { type: 'lesson', id: params.get('lesson') };
  if (params.has('chapter')) return { type: 'view', id: 'resources' };
  if (params.has('view')) {
    const view = params.get('view');
    return { type: 'view', id: view === 'dashboard' ? 'overview' : view === 'simulators' ? 'labs' : view === 'book' ? 'resources' : view };
  }
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
  '#network-engineer': 'network-engineer',
  '#career-map': 'career-map',
  '#landing-map': 'career-map',
  '#overview': 'overview',
  '#roadmap': 'roadmap',
  '#windows-security': 'windows-security',
  '#azure-admin': 'azure-admin',
  '#linux-security': 'linux-security',
  '#ethical-hacking': 'ethical-hacking',
  '#security-plus': 'security-plus',
  '#computer-technologies': 'computer-technologies',
  '#simulators': 'labs',
  '#resources': 'resources',
  '#glossary': 'glossary',
  '#labs': 'labs',
  '#certifications': 'certifications',
  '#book-extra': 'resources',
  '#book': 'resources',
  '#course': 'resources',
};
