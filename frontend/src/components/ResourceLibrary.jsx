import { useMemo, useState } from 'react';
import { FiExternalLink, FiSearch } from 'react-icons/fi';
import { lessonResources, resources } from '../data/resources';
import { topicById } from '../data/catalog';
import { createFuzzySearch } from '../lib/search';
import { lessonHref } from '../navigation';
import { buildLibrary, libraryCategories } from '../lib/resourceLibrary';
import './ResourceLibrary.css';

const types = ['Все', ...libraryCategories];
const PAGE_SIZE = 24;
const usageBySource = Object.entries(lessonResources).reduce((index, [lessonId, references]) => {
  references.forEach((reference) => index.set(reference.sourceId, [...(index.get(reference.sourceId) || []), { lessonId, ...reference }]));
  return index;
}, new Map());

const library = buildLibrary(resources).map((resource) => ({
  ...resource,
  lessons: [...new Set(resource.sourceIds.flatMap((id) => (usageBySource.get(id) || []).map((item) => item.lessonId)))],
}));
const searchResources = createFuzzySearch(library.map((resource) => ({
  ...resource,
  lessonNames: resource.lessons.map((id) => topicById.get(id)?.title || '').join(' '),
})), ['title', 'description', 'language', 'category', 'lessonNames']);

export default function ResourceLibrary() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Все');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const matches = useMemo(() => searchResources(query).filter((resource) => type === 'Все' || resource.category === type), [query, type]);
  const visible = matches.slice(0, limit);

  return <section className="section" id="resources" aria-labelledby="resources-heading">
    <div className="section-heading"><div><span className="section-kicker">БИБЛИОТЕКА</span><h1 id="resources-heading">Видео, курсы, книги и документация</h1></div><span className="section-count">{library.length} материалов</span></div>
    <div className="resource-controls">
      <label className="search-field" htmlFor="resource-search"><FiSearch aria-hidden="true" /><span className="sr-only">Поиск источников</span><input id="resource-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} placeholder="Название или тема" /></label>
      <div className="filter-list" role="group" aria-label="Тип источника">{types.map((item) => <button className={`filter-button${type === item ? ' active' : ''}`} type="button" key={item} aria-pressed={type === item} onClick={() => { setType(item); setLimit(PAGE_SIZE); }}>{item}</button>)}</div>
    </div>
    <p className="resource-count" role="status">Найдено: {matches.length}{matches.length > visible.length && ` · Показано: ${visible.length}`}</p>
    {visible.length ? <div className="resource-grid">{visible.map((resource) => {
      return <article className="resource-card" key={resource.id}>
        <div className="resource-card-meta"><span className="tag">{resource.category}</span><span>{resource.language} · {resource.access}</span></div>
        <h3>{resource.title}</h3><p>{resource.description}</p>
        {resource.lessons.length > 0 && <details className="resource-study-plan"><summary>Связанные уроки <span>{resource.lessons.length}</span></summary>
          <ul>{resource.lessons.map((id) => <li key={id}><a href={lessonHref(id)} data-route-link>{topicById.get(id)?.title || id}</a></li>)}</ul>
        </details>}
        <a className="resource-external" href={resource.url} target="_blank" rel="noreferrer">Открыть <FiExternalLink aria-hidden="true" /><span className="sr-only">: {resource.title} (откроется в новой вкладке)</span></a>
      </article>;
    })}</div> : <p className="empty-state">По вашему запросу ничего не найдено. Измените поиск или тип источника.</p>}
    {visible.length < matches.length && <div className="library-more"><button className="button" type="button" onClick={() => setLimit((current) => current + PAGE_SIZE)}>Показать ещё {Math.min(PAGE_SIZE, matches.length - visible.length)}</button></div>}
  </section>;
}
