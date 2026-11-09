import { useState } from 'react';
import { FiArrowRight, FiChevronDown } from 'react-icons/fi';
import { lessonDetails } from '../data/lessonDetails';
import { lessonHref } from '../navigation';
import Assessment from './Assessment';

/* eslint-disable react/prop-types */
export default function Roadmap({
  phases, completed, onToggle,
  id = 'roadmap', headingLevel = 'h1', eyebrow = 'НАЧНИТЕ ЗДЕСЬ · 2026',
  title = 'Дорожная карта системного администратора',
  description = 'Двигайтесь по шагам: изучите объяснение и материалы, выполните лабораторную работу и отметьте результат.',
  startHint = 'Начните с изолированной виртуальной машины. Материалы и прогресс доступны без сервера; внешние ссылки открываются через интернет.',
  disclaimer,
}) {
  const [openPhases, setOpenPhases] = useState(() => {
    const nextPhase = phases.find((phase) => phase.topics.some((topic) => !completed.includes(topic.id)));
    return nextPhase ? [nextPhase.id] : [];
  });
  const orderedTopics = phases.flatMap((phase) => phase.topics);
  const topicNumbers = new Map(orderedTopics.map((topic, index) => [topic.id, index + 1]));
  const nextTopic = orderedTopics.find((topic) => !completed.includes(topic.id));
  const Heading = headingLevel;
  const headingId = `${id}-heading`;

  function togglePhase(phaseId) {
    setOpenPhases((current) => current.includes(phaseId) ? current.filter((item) => item !== phaseId) : [...current, phaseId]);
  }
  return <section className="section" id={id} aria-labelledby={headingId}>
    <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><Heading id={headingId} tabIndex={headingLevel === 'h1' ? '-1' : undefined}>{title}</Heading><p>{description}</p></div><span className="section-count">ЭТАПЫ: {phases.length} · ТЕМЫ: {orderedTopics.length}</span></div>
    {disclaimer && <p className="course-disclaimer">{disclaimer}</p>}
    <div className="study-start">
      <div><span className="eyebrow">ВАШ СЛЕДУЮЩИЙ ШАГ</span><strong>{nextTopic ? `${String(topicNumbers.get(nextTopic.id)).padStart(2, '0')} / ${nextTopic.title}` : 'Все темы отмечены как изученные'}</strong><p>{startHint}</p></div>
      {nextTopic && <a className="button button-primary" href={lessonHref(nextTopic.id)} data-route-link>Открыть следующий урок <FiArrowRight aria-hidden="true" /></a>}
    </div>
    <div className="roadmap-list">{phases.map((phase) => {
      const isOpen = openPhases.includes(phase.id);
      const done = phase.topics.filter((topic) => completed.includes(topic.id)).length;
      const panelId = `phase-panel-${id}-${phase.id}`;
      return <article className={`phase-card${isOpen ? ' is-open' : ''}`} key={phase.id}>
        <button className="phase-header" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => togglePhase(phase.id)}>
          <span className="phase-number">{phase.number}</span><span className="phase-heading"><span className="phase-subtitle">ЭТАП {phase.number} · {phase.subtitle}</span><strong>{phase.title}</strong><span className="phase-description">{phase.description}</span></span><span className="phase-meta"><span className="phase-progress">{done} / {phase.topics.length}</span><FiChevronDown className="phase-chevron" aria-hidden="true" /></span>
        </button>
        <div id={panelId} className="phase-body" hidden={!isOpen}><div className="topic-list">{phase.topics.map((topic, index) => <div className={`topic-item${nextTopic?.id === topic.id ? ' is-current' : ''}`} style={{ '--step-index': index }} key={topic.id}>
          <label className="topic-check"><input type="checkbox" checked={completed.includes(topic.id)} onChange={() => onToggle(topic.id)} aria-label={`Отметить тему «${topic.title}» как изученную`} /></label>
          <div className="topic-details"><span className="topic-step">ШАГ {String(topicNumbers.get(topic.id)).padStart(2, '0')}{nextTopic?.id === topic.id ? ' · СЛЕДУЮЩИЙ' : ''}</span><strong>{topic.title}</strong><small>{topic.description}</small><a className="topic-open" href={lessonHref(topic.id)} data-route-link>Изучить урок <FiArrowRight aria-hidden="true" /></a></div>
        </div>)}</div><details className="module-test"><summary>Пройти тест этапа «{phase.title}»</summary><Assessment title={`Тест модуля: ${phase.title}`} questions={phase.topics.map((topic) => ({ ...lessonDetails[topic.id].question, context: topic.title }))} /></details></div>
      </article>;
    })}</div>
  </section>;
}
