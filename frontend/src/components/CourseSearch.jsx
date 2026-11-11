import { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiSearch, FiX } from 'react-icons/fi';
import { searchCourse } from '../lib/courseSearch.js';

/* eslint-disable react/prop-types */
export default function CourseSearch({ onClose }) {
  const dialog = useRef(null);
  const input = useRef(null);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('Все');
  const results = query.trim() ? searchCourse(query).filter((item) => kind === 'Все' || item.kind === kind) : [];
  useEffect(() => {
    const element = dialog.current;
    if (!element.open) element.showModal();
    input.current?.focus();
  }, []);
  return <dialog ref={dialog} className="course-search modal" aria-labelledby="course-search-title" onClose={onClose} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
    <div className="modal-header"><h2 id="course-search-title">Поиск по курсу</h2><button className="modal-close" type="button" aria-label="Закрыть поиск" onClick={() => dialog.current?.close()}><FiX aria-hidden="true" /></button></div>
    <div className="modal-body">
      <label className="search-field"><FiSearch aria-hidden="true" /><span className="sr-only">Урок, термин или источник</span><input ref={input} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, криптография или PowerShell" /></label>
      <div className="filter-list" role="group" aria-label="Раздел поиска">{['Все', 'Урок', 'Термин', 'Источник'].map((value) => <button type="button" className={`filter-button${kind === value ? ' active' : ''}`} key={value} aria-pressed={kind === value} onClick={() => setKind(value)}>{value}</button>)}</div>
      <p className="resource-count" role="status">{query.trim() ? `Найдено: ${results.length}${results.length > 12 ? '. Показаны первые 12.' : ''}` : 'Поиск по урокам, терминам и источникам — можно с опечаткой.'}</p>
      {results.length > 0 && <ul className="course-search-results">{results.slice(0, 12).map((item) => <li key={item.id}><a href={item.href} data-route-link={!item.external || undefined} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} onClick={() => dialog.current?.close()}>
        <span className="course-search-meta">{item.kind} · {item.context}</span><strong>{item.title}{item.external && <FiArrowUpRight aria-hidden="true" />}</strong><span>{item.description}</span>{item.external && <span className="sr-only">Откроется в новой вкладке</span>}
      </a></li>)}</ul>}
      {query.trim() && !results.length && <p className="empty-state">Ничего не найдено. Попробуйте другое слово или раздел.</p>}
    </div>
  </dialog>;
}
