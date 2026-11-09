export function currentRoute() {
  const params = new URLSearchParams(window.location.search);
  if (params.has('lesson')) return { type: 'lesson', id: params.get('lesson') };
  if (params.has('chapter')) return { type: 'chapter', id: params.get('chapter') };
  return { type: 'home', id: null };
}

export function lessonHref(id) {
  return `?lesson=${encodeURIComponent(id)}`;
}

export function chapterHref(id) {
  return `?chapter=${encodeURIComponent(id)}`;
}

export function sectionHref(hash) {
  return `${window.location.pathname}${hash}`;
}
