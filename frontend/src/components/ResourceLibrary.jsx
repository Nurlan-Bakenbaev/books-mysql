import { useState } from 'react';
import { FiExternalLink, FiSearch } from 'react-icons/fi';
import { FiBookOpen, FiCompass, FiLayers } from 'react-icons/fi';
import { lessonResources, resources } from '../data/resources';
import { topicById } from '../data/catalog';
import { createFuzzySearch } from '../lib/search';
import { lessonHref } from '../navigation';

const types = ['Все', ...new Set(resources.map((resource) => resource.type))];
const usageBySource = Object.entries(lessonResources).reduce((index, [lessonId, references]) => {
  references.forEach((reference) => index.set(reference.sourceId, [...(index.get(reference.sourceId) || []), { lessonId, ...reference }]));
  return index;
}, new Map());

const searchResources = createFuzzySearch(resources.map((resource) => ({
  ...resource,
  lessonNames: (usageBySource.get(resource.id) || []).map((item) => topicById.get(item.lessonId)?.title || '').join(' '),
})), ['title', 'description', 'language', 'type', 'lessonNames']);

export default function ResourceLibrary() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Все');
  const visible = searchResources(query).filter((resource) => type === 'Все' || resource.type === type);

  return <section className="section" id="resources" aria-labelledby="resources-heading">
    <div className="section-heading"><div><span className="section-kicker">УЧЕБНАЯ БИБЛИОТЕКА · НОЯБРЬ 2026</span><h1 id="resources-heading">Материалы по темам</h1></div><span className="section-count">МАТЕРИАЛЫ: {resources.length}</span></div>
    <div className="library-guide" aria-label="Как пользоваться библиотекой"><div><FiCompass /><strong>1. Выберите тему</strong><span>Поиск работает по названию, описанию и урокам.</span></div><div><FiBookOpen /><strong>2. Прочитайте аннотацию</strong><span>Фокус подсказывает нужную главу или раздел.</span></div><div><FiLayers /><strong>3. Вернитесь к практике</strong><span>Ссылка дополняет лабораторию, а не заменяет её.</span></div></div>
    <div className="resource-controls">
      <label className="search-field" htmlFor="resource-search"><FiSearch aria-hidden="true" /><span className="sr-only">Поиск источников</span><input id="resource-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию или теме" /></label>
      <div className="filter-list" role="group" aria-label="Тип источника">{types.map((item) => <button className={`filter-button${type === item ? ' active' : ''}`} type="button" key={item} aria-pressed={type === item} onClick={() => setType(item)}>{item}</button>)}</div>
    </div>
    <p className="resource-count" role="status">Найдено: {visible.length}</p>
    {visible.length ? <div className="resource-grid">{visible.map((resource) => {
      const uses = usageBySource.get(resource.id) || [];
      const takeaway = uses.find((item) => item.takeaway)?.takeaway;
      return <article className="resource-card" key={resource.id}>
        <div className="resource-card-meta"><span className="tag">{resource.type}</span><span>{resource.language} · {resource.access}</span></div>
        <h3>{resource.title}</h3><p>{resource.description}</p>
        {takeaway && <div className="resource-takeaway"><strong>Главная идея</strong><p>{takeaway}</p></div>}
        <details className="resource-study-plan"><summary>Как использовать в курсе <span>{uses.length ? `${uses.length} уроков` : 'дополнительно'}</span></summary>
          {uses.length ? <ul>{uses.slice(0, 6).map((use) => <li key={use.lessonId}><a href={lessonHref(use.lessonId)} data-route-link>{topicById.get(use.lessonId)?.title || use.lessonId}</a><p>{use.focus}</p></li>)}</ul> : <p>Используйте материал после базового маршрута, когда понадобится более глубокая справка или альтернативное объяснение.</p>}
        </details>
        <a className="resource-external" href={resource.url} target="_blank" rel="noreferrer">Перейти к первоисточнику <FiExternalLink aria-hidden="true" /><span className="sr-only">: {resource.title} (откроется в новой вкладке)</span></a>
      </article>;
    })}</div> : <p className="empty-state">По вашему запросу ничего не найдено. Измените поиск или тип источника.</p>}
    <p className="resource-note">Подборка составлена по открытым материалам и исходникам документации. Ссылки и условия могут меняться; проверяйте команды, лицензии и стоимость на сайте автора. Не публикуйте секреты или личные данные в сообществах.</p>
  </section>;
}
