import { useRef, useState } from 'react';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { lessons } from '../data/lessons';
import LessonDialog from './LessonDialog';

/* eslint-disable react/prop-types */
export default function Roadmap({ phases, completed, onToggle }) {
  const [openPhases, setOpenPhases] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const triggerRef = useRef(null);

  function togglePhase(id) {
    setOpenPhases((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  function openLesson(topic, event) {
    triggerRef.current = event.currentTarget;
    setSelectedTopic(topic);
  }

  return <section className="section" id="roadmap" aria-labelledby="roadmap-heading">
    <div className="section-heading"><div><span className="eyebrow">НАЧНИТЕ ЗДЕСЬ · 2026</span><h1 id="roadmap-heading">Дорожная карта системного администратора</h1><p>Выберите этап → откройте урок → выполните практику. Отмечайте пройденные темы, чтобы видеть свой прогресс.</p></div><span className="section-count">05 ЭТАПОВ · {phases.reduce((count, phase) => count + phase.topics.length, 0)} УРОКА</span></div>
    <div className="roadmap-list">{phases.map((phase) => {
      const isOpen = openPhases.includes(phase.id);
      const done = phase.topics.filter((topic) => completed.includes(topic.id)).length;
      const panelId = `phase-panel-${phase.id}`;
      return <article className={`phase-card${isOpen ? ' is-open' : ''}`} key={phase.id}>
        <button className="phase-header" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => togglePhase(phase.id)}>
          <span className="phase-number">{phase.number}</span><span className="phase-heading"><span className="phase-subtitle">ЭТАП {phase.number} · {phase.subtitle}</span><strong>{phase.title}</strong><span className="phase-description">{phase.description}</span></span><span className="phase-meta"><span className="phase-progress">{done} / {phase.topics.length}</span><FiChevronDown className="phase-chevron" aria-hidden="true" /></span>
        </button>
        <div id={panelId} className="phase-body" hidden={!isOpen}><div className="topic-list">{phase.topics.map((topic) => <div className="topic-item" key={topic.id}>
          <label className="topic-check"><input type="checkbox" checked={completed.includes(topic.id)} onChange={() => onToggle(topic.id)} aria-label={`Отметить тему «${topic.title}» как изученную`} /></label>
          <div className="topic-details"><strong>{topic.title}</strong><small>{topic.description}</small><button className="topic-open" type="button" onClick={(event) => openLesson(topic, event)} disabled={!lessons[topic.id]}>Изучить урок <FiArrowRight aria-hidden="true" /></button></div>
        </div>)}</div></div>
      </article>;
    })}</div>
    <LessonDialog topic={selectedTopic} lesson={selectedTopic ? lessons[selectedTopic.id] : null} isComplete={selectedTopic ? completed.includes(selectedTopic.id) : false} onToggle={onToggle} onClose={() => setSelectedTopic(null)} triggerRef={triggerRef} />
  </section>;
}
