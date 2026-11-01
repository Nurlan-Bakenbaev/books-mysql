import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

/** A phase can be opened independently so learners can compare stages. */
// The shape is defined by the shared guide data and supplied by the dashboard.
/* eslint-disable react/prop-types */
export default function Roadmap({ phases, completed, onToggle }) {
  const [openPhases, setOpenPhases] = useState(() => phases[0] ? [phases[0].id] : []);

  function togglePhase(id) {
    setOpenPhases((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  }

  return (
    <section className="section" id="roadmap" aria-labelledby="roadmap-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ВАШ МАРШРУТ</span>
          <h2 id="roadmap-heading">Дорожная карта</h2>
          <p>От основ инфраструктуры до защиты и автоматизации. Открывайте этапы и отмечайте изученные темы.</p>
        </div>
        <span className="section-count">05 этапов</span>
      </div>
      <div className="roadmap-list">
        {phases.map((phase) => {
          const isOpen = openPhases.includes(phase.id);
          const done = phase.topics.filter((topic) => completed.includes(topic.id)).length;
          const panelId = `phase-panel-${phase.id}`;
          return (
            <article className={`phase-card${isOpen ? ' is-open' : ''}`} key={phase.id}>
              <button
                className="phase-header"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => togglePhase(phase.id)}
              >
                <span className="phase-number">{phase.number}</span>
                <span className="phase-heading">
                  <span className="phase-subtitle">ЭТАП {phase.number} · {phase.subtitle}</span>
                  <strong>{phase.title}</strong>
                  <span className="phase-description">{phase.description}</span>
                </span>
                <span className="phase-meta">
                  <span className="phase-progress">{done} / {phase.topics.length}</span>
                  <FiChevronDown className="phase-chevron" aria-hidden="true" />
                </span>
              </button>
              <div id={panelId} className="phase-body" hidden={!isOpen}>
                <div className="topic-list">
                  {phase.topics.map((topic) => (
                    <label className="topic-item" key={topic.id}>
                      <input
                        type="checkbox"
                        checked={completed.includes(topic.id)}
                        onChange={() => onToggle(topic.id)}
                      />
                      <span><strong>{topic.title}</strong><small>{topic.description}</small></span>
                    </label>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
