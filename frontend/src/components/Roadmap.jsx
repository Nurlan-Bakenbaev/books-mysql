import { moduleQuestions } from '../data/moduleAssessments';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FiArrowRight, FiBookOpen, FiCheck, FiChevronDown, FiCloud, FiCode, FiCpu, FiFlag, FiServer, FiShield } from 'react-icons/fi';
import { lessonHref, lessonMaterialsHref } from '../navigation';
import Assessment from './Assessment';

const phaseIcons = [FiCpu, FiServer, FiCloud, FiCode, FiShield, FiFlag];
const laneColors = ['#38bdf8', '#22c55e', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];

/* eslint-disable react/prop-types */
export default function Roadmap({
  phases, completed, onToggle,
  id = 'roadmap', headingLevel = 'h1', eyebrow = 'НАЧНИТЕ ЗДЕСЬ · 2026',
  title = 'Дорожная карта системного администратора',
  description = 'Двигайтесь по шагам: изучите объяснение и материалы, выполните лабораторную работу и отметьте результат.',
  startHint = 'Начните с изолированной виртуальной машины. Материалы и прогресс доступны без сервера; внешние ссылки открываются через интернет.',
  disclaimer,
}) {
  const orderedTopics = phases.flatMap((phase) => phase.topics);
  const topicNumbers = new Map(orderedTopics.map((topic, index) => [topic.id, index + 1]));
  const nextTopic = orderedTopics.find((topic) => !completed.includes(topic.id));
  const [openPhases, setOpenPhases] = useState(() => {
    const activePhase = phases.find((phase) => phase.topics.some((topic) => !completed.includes(topic.id)));
    return activePhase ? [activePhase.id] : phases[0] ? [phases[0].id] : [];
  });
  const reduceMotion = useReducedMotion();
  const [paused,setPaused] = useState(false);
  const Heading = headingLevel;
  const headingId = `${id}-heading`;

  function togglePhase(phaseId) {
    setOpenPhases((current) => current.includes(phaseId) ? [] : [phaseId]);
  }
  return <section className="section" id={id} aria-labelledby={headingId}>
    <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><Heading id={headingId} tabIndex={headingLevel === 'h1' ? '-1' : undefined}>{title}</Heading><p>{description}</p></div><span className="section-count">ЭТАПЫ: {phases.length} · ТЕМЫ: {orderedTopics.length}</span></div>
    {disclaimer && <p className="course-disclaimer">{disclaimer}</p>}
    <div className="study-start">
      <div><span className="eyebrow">ВАШ СЛЕДУЮЩИЙ ШАГ</span><strong>{nextTopic ? `${String(topicNumbers.get(nextTopic.id)).padStart(2, '0')} / ${nextTopic.title}` : 'Все темы отмечены как изученные'}</strong><p>{startHint}</p></div>
      {nextTopic && <a className="button button-primary" href={lessonHref(nextTopic.id)} data-route-link>Открыть следующий урок <FiArrowRight aria-hidden="true" /></a>}
    </div>
    <button className="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused ? 'Продолжить движение линий' : 'Остановить движение линий'}</button>
    <div className={`roadmap-map skill-map-board${paused ? ' map-paused' : ''}`} style={{ '--phase-count': phases.length }} aria-label={`Интерактивная карта навыков: ${title}. Этапы соединены в порядке прохождения.`} tabIndex="0">
      <div className="roadmap-route" aria-hidden="true"><span /></div>
      <div className="skill-sequence-rail" aria-label={`Порядок этапов: ${phases.map((phase) => phase.title).join(', ')}`}>
        {phases.map((phase, index) => <div className="skill-sequence-step" style={{ '--map-index': index }} key={phase.id}><span>{String(index + 1).padStart(2, '0')}</span>{index < phases.length - 1 && <FiArrowRight aria-hidden="true" />}</div>)}
      </div>
      {phases.map((phase, phaseIndex) => {
      const isOpen = openPhases.includes(phase.id);
      const done = phase.topics.filter((topic) => completed.includes(topic.id)).length;
      const phasePercent = phase.topics.length ? Math.round(done / phase.topics.length * 100) : 0;
      const isComplete = done === phase.topics.length;
      const phaseStatus = isComplete ? 'Завершён' : done > 0 ? 'В процессе' : 'Не начат';
      const panelId = `phase-panel-${id}-${phase.id}`;
      const PhaseIcon = phaseIcons[phaseIndex % phaseIcons.length];
      return <motion.article className={`phase-card map-stop skill-column${isOpen ? ' is-open' : ''}${isComplete ? ' is-complete' : ''}`} key={phase.id} style={{ '--map-index': phaseIndex, '--lane-color': laneColors[phaseIndex % laneColors.length] }} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduceMotion ? 0 : .38, delay: reduceMotion ? 0 : phaseIndex * .055 }}>
        <div className="map-node" aria-hidden="true">{isComplete ? <FiCheck /> : <PhaseIcon />}</div>
        <button className="phase-header" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => togglePhase(phase.id)}>
          <span className="phase-number">{phase.number}</span><span className="phase-heading"><span className="phase-subtitle">ТОЧКА {phase.number} · {phase.subtitle}</span><strong>{phase.title}</strong><span className="phase-description">{phase.description}</span>{(phase.duration || phase.outcome) && <span className="phase-plan-meta">{phase.duration && <b>{phase.duration}</b>}{phase.outcome && <small>{phase.outcome}</small>}</span>}<span className="map-phase-progress" aria-label={`Прогресс этапа ${phasePercent}%`}><span style={{ width: `${phasePercent}%` }} /></span></span><span className="phase-meta"><span className={`phase-status${isComplete ? ' is-complete' : done > 0 ? ' is-progress' : ''}`}>{phaseStatus}</span><span className="phase-progress">{phasePercent}%<small>{done} / {phase.topics.length} шагов</small></span><FiChevronDown className="phase-chevron" aria-hidden="true" /></span>
        </button>
        <AnimatePresence initial={false}>{isOpen && <motion.div id={panelId} className="phase-body" initial={reduceMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, 0.36, 1] }}><div className="topic-list skill-node-list">{phase.topics.map((topic, index) => <div className={`topic-item skill-node${nextTopic?.id === topic.id ? ' is-current' : ''}${completed.includes(topic.id) ? ' is-complete' : ''}`} style={{ '--step-index': index }} key={topic.id}>
          <label className="topic-check"><input type="checkbox" checked={completed.includes(topic.id)} onChange={() => onToggle(topic.id)} aria-label={`Отметить тему «${topic.title}» как изученную`} /></label>
          <div className="topic-details"><span className="topic-step">{completed.includes(topic.id) ? 'ЗАВЕРШЕНО' : nextTopic?.id === topic.id ? 'СЛЕДУЮЩИЙ УРОК' : `УРОК ${String(topicNumbers.get(topic.id)).padStart(2, '0')}`}</span><strong>{topic.title}</strong><small>{topic.description}</small><span className="topic-actions"><a className="topic-open" href={lessonHref(topic.id)} data-route-link>Открыть <FiArrowRight aria-hidden="true" /></a><a className="topic-material" href={lessonMaterialsHref(topic.id)} data-route-link><FiBookOpen aria-hidden="true" /> Источники</a></span></div>
        </div>)}</div><details className="module-test"><summary>Пройти тест этапа «{phase.title}»</summary><Assessment title={`Тест модуля: ${phase.title}`} questions={moduleQuestions(phase.topics)} /></details></motion.div>}</AnimatePresence>
      </motion.article>;
    })}</div>
  </section>;
}
