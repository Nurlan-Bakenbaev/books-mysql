import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FiArrowRight, FiCheck, FiCloud, FiCode, FiCpu, FiFlag, FiServer, FiShield } from 'react-icons/fi';
import { lessonHref } from '../navigation';
import './RoadmapMap.css';

const phaseIcons = [FiCpu, FiServer, FiCloud, FiCode, FiShield, FiFlag];
const laneColors = ['#38bdf8', '#22c55e', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6'];
const signalDurations = [2.8, 5.7, 3.35, 7.2, 4.4, 6.35, 3.05];
const signalDelays = [-.3, -2.8, -1.05, -5.4, -1.7, -3.55, -.75];
const signalPatterns = ['2 18', '3 25', '1.5 13', '3 31', '2.5 21'];

/* eslint-disable react/prop-types */
export default function Roadmap({
  phases, completed,
  id = 'roadmap', headingLevel = 'h1', eyebrow = 'НАЧНИТЕ ЗДЕСЬ · 2026',
  title = 'Дорожная карта системного администратора',
  description = 'Двигайтесь по шагам: изучите объяснение и материалы, выполните лабораторную работу и отметьте результат.',
  startHint = 'Начните с изолированной виртуальной машины. Материалы и прогресс доступны без сервера; внешние ссылки открываются через интернет.',
  disclaimer,
}) {
  const orderedTopics = phases.flatMap((phase) => phase.topics);
  const topicNumbers = new Map(orderedTopics.map((topic, index) => [topic.id, index + 1]));
  const nextTopic = orderedTopics.find((topic) => !completed.includes(topic.id));
  const [openPhases, setOpenPhases] = useState([]);
  const selectedPhase = phases.find((phase) => openPhases.includes(phase.id));
  const selectedPhaseIndex = selectedPhase ? phases.indexOf(selectedPhase) : -1;
  const reduceMotion = useReducedMotion();
  const lessonsPanelRef = useRef(null);
  const mapRef = useRef(null);
  const [mapColumns, setMapColumns] = useState(1);
  const [mapGeometry, setMapGeometry] = useState({ width: 1, height: 1, connections: [] });
  const Heading = headingLevel;
  const headingId = `${id}-heading`;
  const lessonsPanelId = `${id}-selected-lessons`;

  function togglePhase(phaseId) {
    setOpenPhases((current) => current.includes(phaseId) ? [] : [phaseId]);
  }
  useEffect(() => {
    if (!selectedPhase) return undefined;
    const frame = requestAnimationFrame(() => lessonsPanelRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, [selectedPhase, reduceMotion]);

  useLayoutEffect(() => {
    const board = mapRef.current;
    let frame;
    const measure = () => {
      const boardBox = board.getBoundingClientRect();
      const cards = [...board.querySelectorAll(':scope > .skill-column')].map((card) => card.getBoundingClientRect());
      const connections = cards.slice(0, -1).map((card, index) => {
        const next = cards[index + 1];
        const sameRow = Math.floor(index / mapColumns) === Math.floor((index + 1) / mapColumns);
        let startX, startY, endX, endY, path;
        if (sameRow) {
          const forward = next.left > card.left;
          startX = (forward ? card.right : card.left) - boardBox.left;
          endX = (forward ? next.left : next.right) - boardBox.left;
          startY = card.top + card.height / 2 - boardBox.top;
          endY = next.top + next.height / 2 - boardBox.top;
          const middleX = (startX + endX) / 2;
          path = `M${startX} ${startY}H${middleX}V${endY}H${endX}`;
        } else {
          startX = card.left + card.width / 2 - boardBox.left;
          endX = next.left + next.width / 2 - boardBox.left;
          startY = card.bottom - boardBox.top;
          endY = next.top - boardBox.top;
          const middleY = (startY + endY) / 2;
          path = `M${startX} ${startY}V${middleY}H${endX}V${endY}`;
        }
        return { path, startX, startY, endX, endY };
      });
      const nextGeometry = { width: boardBox.width, height: boardBox.height, connections };
      setMapGeometry((previous) => JSON.stringify(previous) === JSON.stringify(nextGeometry) ? previous : nextGeometry);
    };
    const update = () => {
      const wideColumns = Math.floor((board.clientWidth - 16) / 237);
      const compactColumns = Math.floor((board.clientWidth - 8) / 160);
      setMapColumns(Math.max(1, Math.min(4, phases.length, wideColumns >= 2 ? wideColumns : Math.min(2, compactColumns))));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(update);
    observer.observe(board);
    board.querySelectorAll(':scope > .skill-column').forEach((card) => observer.observe(card));
    update();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [phases, mapColumns]);
  return <section className="section" id={id} aria-labelledby={headingId}>
    <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><Heading id={headingId} tabIndex={headingLevel === 'h1' ? '-1' : undefined}>{title}</Heading><p>{description}</p></div><span className="section-count">ЭТАПЫ: {phases.length} · ТЕМЫ: {orderedTopics.length}</span></div>
    {disclaimer && <p className="course-disclaimer">{disclaimer}</p>}
    <div className="study-start">
      <div><span className="eyebrow">ВАШ СЛЕДУЮЩИЙ ШАГ</span><strong>{nextTopic ? `${String(topicNumbers.get(nextTopic.id)).padStart(2, '0')} / ${nextTopic.title}` : 'Все темы отмечены как изученные'}</strong><p>{startHint}</p></div>
      {nextTopic && <a className="button button-primary" href={lessonHref(nextTopic.id)} data-route-link>Открыть следующий урок <FiArrowRight aria-hidden="true" /></a>}
    </div>
    <div ref={mapRef} className={`roadmap-map skill-map-board compact-skill-map${openPhases.length ? ' has-open-phase' : ''}`} style={{ '--map-columns': mapColumns }} role="group" aria-label={`Карта модулей: ${title}. Порядок прохождения: ${phases.map((phase) => phase.title).join(', ')}.`}>
      <svg className="roadmap-connections" viewBox={`0 0 ${mapGeometry.width} ${mapGeometry.height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>{mapGeometry.connections.map((connection, index) => <linearGradient key={index} id={`${id}-connection-${index}`} gradientUnits="userSpaceOnUse" x1={connection.startX} y1={connection.startY} x2={connection.endX} y2={connection.endY}><stop stopColor={laneColors[index % laneColors.length]} /><stop offset="1" stopColor={laneColors[(index + 1) % laneColors.length]} /></linearGradient>)}</defs>
        {mapGeometry.connections.map((connection, index) => {
          return <g key={index}>
            <path className="roadmap-connection-base" d={connection.path} stroke={`url(#${id}-connection-${index})`} />
            <path className={`roadmap-connection-signal${index % 3 === 1 ? ' is-reversed' : ''}`} pathLength="100" d={connection.path} style={{
              '--connection-color': laneColors[index % laneColors.length],
              '--signal-duration': `${signalDurations[index % signalDurations.length]}s`,
              '--signal-delay': `${signalDelays[index % signalDelays.length]}s`,
              '--signal-pattern': signalPatterns[index % signalPatterns.length],
            }} />
          </g>;
        })}
      </svg>
      {phases.map((phase, phaseIndex) => {
      const isOpen = openPhases.includes(phase.id);
      const done = phase.topics.filter((topic) => completed.includes(topic.id)).length;
      const phasePercent = phase.topics.length ? Math.round(done / phase.topics.length * 100) : 0;
      const isComplete = done === phase.topics.length;
      const phaseStatus = isComplete ? 'Завершён' : done > 0 ? 'В процессе' : 'Не начат';
      const PhaseIcon = phaseIcons[phaseIndex % phaseIcons.length];
      const row = Math.floor(phaseIndex / mapColumns);
      const column = row % 2 ? mapColumns - phaseIndex % mapColumns : phaseIndex % mapColumns + 1;
      return <motion.article className={`phase-card map-stop skill-column${isOpen ? ' is-open' : ''}${isComplete ? ' is-complete' : ''}`} key={phase.id} style={{ gridRow: row + 1, gridColumn: column, '--map-index': phaseIndex, '--map-stagger': mapColumns > 1 && column % 2 === 0 ? '16px' : '0px', '--lane-color': laneColors[phaseIndex % laneColors.length] }} initial={reduceMotion ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: reduceMotion ? 0 : .42, delay: reduceMotion ? 0 : phaseIndex * .055 }}>
        <div className="map-node" aria-hidden="true">{isComplete ? <FiCheck /> : <PhaseIcon />}</div>
        <button className="phase-header" type="button" aria-pressed={isOpen} aria-expanded={isOpen} aria-controls={lessonsPanelId} onClick={() => togglePhase(phase.id)}>
          <span className="phase-number">{phase.number}</span><span className="phase-heading"><span className="phase-subtitle">{phase.subtitle}</span><strong>{phase.title}</strong><span className="phase-description">{phase.description}</span>{(phase.duration || phase.outcome) && <span className="phase-plan-meta">{phase.duration && <b>{phase.duration}</b>}{phase.outcome && <small>{phase.outcome}</small>}</span>}<span className="map-phase-progress" aria-label={`Прогресс этапа ${phasePercent}%`}><span style={{ width: `${phasePercent}%` }} /></span></span><span className="phase-meta"><span className={`phase-status${isComplete ? ' is-complete' : done > 0 ? ' is-progress' : ''}`}>{phaseStatus}</span><span className="phase-progress">{phasePercent}%<small>{done} / {phase.topics.length} уроков</small></span></span>
        </button>
      </motion.article>;
    })}</div>
    <AnimatePresence initial={false} mode="wait">
      {selectedPhase && <motion.section ref={lessonsPanelRef} id={lessonsPanelId} key={selectedPhase.id} className="roadmap-lessons-panel" style={{ '--lane-color': laneColors[selectedPhaseIndex % laneColors.length] }} aria-labelledby={`${lessonsPanelId}-title`} initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }} transition={{ duration: reduceMotion ? 0 : .34, ease: [0.16, 1, 0.3, 1] }}>
        <div className="roadmap-lessons-heading"><span className="eyebrow">УРОКИ ВЫБРАННОГО МОДУЛЯ</span><h3 id={`${lessonsPanelId}-title`}>{selectedPhase.title}</h3></div>
        <div className="roadmap-lessons-grid">{selectedPhase.topics.map((topic) => {
          const isDone = completed.includes(topic.id);
          return <a className={`roadmap-lesson-link${isDone ? ' is-complete' : ''}`} href={lessonHref(topic.id)} data-route-link key={topic.id}>
            <span className="roadmap-lesson-number">УРОК {String(topicNumbers.get(topic.id)).padStart(2, '0')}</span><strong>{topic.title}</strong><small>{topic.description}</small><span className="roadmap-lesson-action">{isDone ? 'Изучен' : 'Открыть урок'} <FiArrowRight aria-hidden="true" /></span>
          </a>;
        })}</div>
      </motion.section>}
    </AnimatePresence>
  </section>;
}
