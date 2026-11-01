import { useEffect, useRef, useState } from 'react';
import { FiArrowUpRight, FiSearch, FiX } from 'react-icons/fi';
import { terms } from '../data/guide';

const categories = ['Все', 'Сети', 'Безопасность', 'Windows', 'Облако'];

export default function Glossary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Все');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (selectedTerm && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
      closeRef.current?.focus();
    }
  }, [selectedTerm]);

  const normalizedQuery = query.trim().toLocaleLowerCase('ru');
  const filteredTerms = terms.filter((term) => {
    const matchesCategory = category === 'Все' || term.category === category;
    const searchableText = [term.name, term.short, term.description, term.how, term.when, term.example, term.check, term.caution, term.category]
      .join(' ')
      .toLocaleLowerCase('ru');
    return matchesCategory && searchableText.includes(normalizedQuery);
  });

  function openTerm(term, event) {
    triggerRef.current = event.currentTarget;
    setSelectedTerm(term);
  }

  function handleClose() {
    setSelectedTerm(null);
    triggerRef.current?.focus();
  }

  return (
    <section className="section glossary" id="glossary" aria-labelledby="glossary-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">БАЗА ЗНАНИЙ</span>
          <h2 id="glossary-title">Глоссарий терминов</h2>
          <p>Понятия, которые стоит знать каждому системному администратору.</p>
        </div>
        <span className="section-count">{terms.length} терминов</span>
      </div>

      <div className="glossary-controls">
        <label className="search-field">
          <FiSearch aria-hidden="true" />
          <span className="sr-only">Поиск по терминам</span>
          <input
            type="search"
            placeholder="Найти термин или понятие..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="filter-list" aria-label="Категории терминов">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-button${category === item ? ' active' : ''}`}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" role="status">Найдено терминов: {filteredTerms.length}</p>
      {filteredTerms.length ? (
        <div className="term-grid">
          {filteredTerms.map((term) => (
            <button className="term-card" type="button" key={term.id} onClick={(event) => openTerm(term, event)}>
              <span className="term-card-top"><span className="tag">{term.category}</span><FiArrowUpRight className="term-arrow" aria-hidden="true" /></span>
              <span className="term-name">{term.name}</span>
              <span className="term-description">{term.short}</span>
              <span className="term-more">Подробнее <span aria-hidden="true">→</span></span>
            </button>
          ))}
        </div>
      ) : (
        <div className="panel empty-state">По вашему запросу ничего не найдено. Попробуйте изменить поиск или категорию.</div>
      )}

      <dialog
        ref={dialogRef}
        className="modal"
        aria-labelledby="term-dialog-title"
        aria-describedby="term-dialog-description"
        onClose={handleClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {selectedTerm && (
          <>
            <div className="modal-header">
              <span className="tag">{selectedTerm.category}</span>
              <button ref={closeRef} type="button" className="modal-close" aria-label="Закрыть" onClick={() => dialogRef.current?.close()}><FiX aria-hidden="true" /></button>
            </div>
            <div className="modal-body">
              <h2 id="term-dialog-title">{selectedTerm.name}</h2>
              <p id="term-dialog-description">{selectedTerm.description}</p>
              <h3>Как это работает</h3><p>{selectedTerm.how}</p>
              <h3>Когда применяется</h3><p>{selectedTerm.when}</p>
              <div className="modal-example"><strong>На практике</strong><p>{selectedTerm.example}</p></div>
              <h3>Как проверить</h3><p>{selectedTerm.check}</p>
              <h3>Важный нюанс</h3><p>{selectedTerm.caution}</p>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
