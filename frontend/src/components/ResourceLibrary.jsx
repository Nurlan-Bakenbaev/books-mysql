import { useState } from 'react';
import { FiExternalLink, FiSearch } from 'react-icons/fi';
import { resources } from '../data/resources';

const types = ['Все', ...new Set(resources.map((resource) => resource.type))];

export default function ResourceLibrary() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('Все');
  const search = query.trim().toLocaleLowerCase('ru');
  const visible = resources.filter((resource) => {
    const matchesType = type === 'Все' || resource.type === type;
    const text = `${resource.title} ${resource.description} ${resource.language} ${resource.type}`.toLocaleLowerCase('ru');
    return matchesType && text.includes(search);
  });

  return <section className="section" id="resources" aria-labelledby="resources-heading">
    <div className="section-heading"><div><span className="section-kicker">БИБЛИОТЕКА · НОЯБРЬ 2026</span><h2 id="resources-heading">Книги, курсы и сообщества</h2><p>Открытые материалы, на которые опираются уроки: официальная документация, практические курсы, книги и обсуждения. Язык и условия доступа указаны у каждого источника.</p></div><span className="section-count">ИСТОЧНИКИ: {resources.length}</span></div>
    <div className="resource-controls">
      <label className="search-field" htmlFor="resource-search"><FiSearch aria-hidden="true" /><span className="sr-only">Поиск источников</span><input id="resource-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию или теме" /></label>
      <div className="filter-list" role="group" aria-label="Тип источника">{types.map((item) => <button className={`filter-button${type === item ? ' active' : ''}`} type="button" key={item} aria-pressed={type === item} onClick={() => setType(item)}>{item}</button>)}</div>
    </div>
    <p className="resource-count" role="status">Найдено: {visible.length}</p>
    {visible.length ? <div className="resource-grid">{visible.map((resource) => <article className="resource-card" key={resource.id}>
      <div className="resource-card-meta"><span className="tag">{resource.type}</span><span>{resource.language} · {resource.access}</span></div>
      <h3>{resource.title}</h3><p>{resource.description}</p>
      <a href={resource.url} target="_blank" rel="noreferrer">Открыть источник <FiExternalLink aria-hidden="true" /><span className="sr-only">: {resource.title} (откроется в новой вкладке)</span></a>
    </article>)}</div> : <p className="empty-state">По вашему запросу ничего не найдено. Измените поиск или тип источника.</p>}
    <p className="resource-note">Подборка составлена по открытым материалам и исходникам документации. Ссылки и условия могут меняться; проверяйте команды, лицензии и стоимость на сайте автора. Не публикуйте секреты или личные данные в сообществах.</p>
  </section>;
}
