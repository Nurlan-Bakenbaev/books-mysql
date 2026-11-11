import { motion, useReducedMotion } from 'motion/react';
import { FiActivity, FiArrowRight, FiAward, FiBookOpen, FiCloud, FiCommand, FiCpu, FiMoon, FiPlay, FiSearch, FiShield, FiSun, FiTerminal } from 'react-icons/fi';
import InteractiveRoadmap from './InteractiveRoadmap';
import { viewHref } from '../navigation';



const iconByTrack = {
  roadmap: FiActivity,
  'windows-security': FiShield,
  'azure-admin': FiCloud,
  'linux-security': FiTerminal,
  'ethical-hacking': FiShield,
  'security-plus': FiAward,
  'computer-technologies': FiCpu,
};

/* eslint-disable react/prop-types */
export default function LandingPage({ tracks, totalCount, nextLesson, theme, onToggleTheme, onSearch }) {
  const reduceMotion = useReducedMotion();

  return <div className="landing-page">
    <header className="landing-nav">
      <a className="brand" href="./" aria-label="Sysadmin 2026 — главная"><span className="brand-mark"><FiCommand /></span><span>sysadmin<span className="brand-accent">.</span></span></a>
      <nav aria-label="Навигация главной страницы"><a href="#landing-map">Карта</a><a href="#landing-tracks">Маршруты</a><a href={viewHref('resources')} data-route-link>Библиотека</a><a href={viewHref('labs')} data-route-link>Практика</a></nav>
      <div className="landing-nav-actions"><button className="theme-toggle search-toggle" type="button" aria-label="Поиск по курсу" aria-haspopup="dialog" onClick={onSearch}><FiSearch aria-hidden="true" /></button><button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</button><a className="button button-primary" href={viewHref('roadmap')} data-route-link>Начать путь <FiArrowRight /></a></div>
    </header>

    <main>
      <section className="landing-hero">
        <motion.div className="landing-hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <span className="landing-badge"><span className="status-dot" /> {totalCount} ПОДРОБНЫХ УРОКОВ · ОБНОВЛЕНО 10.11.2026</span>
          <h1>Станьте системным<br />администратором <em>шаг за шагом.</em></h1>
          <p>Полноценная учебная платформа на русском: теория, схемы, команды с пояснениями, безопасные лаборатории, диагностика, тесты и проверенные первоисточники.</p>
          <div className="landing-hero-actions"><a className="button button-primary landing-primary" href={viewHref('roadmap')} data-route-link><FiPlay /> Открыть путь сисадмина</a>{nextLesson && <a className="landing-text-link" href={nextLesson.href} data-route-link>Продолжить: {nextLesson.title} <FiArrowRight /></a>}</div>
        </motion.div>
      </section>

      <section className="landing-proof" aria-label="Состав курса"><div><strong>{totalCount}</strong><span>отдельных уроков</span></div><div><strong>{tracks.length}</strong><span>учебных маршрутов</span></div><div><strong>100%</strong><span>уроков с практикой</span></div><div><strong>2+</strong><span>источника к уроку</span></div></section>

      <InteractiveRoadmap />

      <section className="landing-tracks" id="landing-tracks" aria-labelledby="landing-tracks-title">
        <div className="landing-section-heading"><span className="eyebrow">ВЫБЕРИТЕ НАПРАВЛЕНИЕ</span><h2 id="landing-tracks-title">Семь учебных направлений</h2></div>
        <div className="landing-track-grid">{tracks.map((track, index) => {
          const Icon = iconByTrack[track.id] || FiBookOpen;
          const trackPercent = track.total ? Math.round(track.done / track.total * 100) : 0;
          return <motion.a className={`landing-track-card track-${track.tone}`} href={viewHref(track.id)} data-route-link key={track.id} initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .45, delay: index * .06 }} whileHover={reduceMotion ? undefined : { y: -6 }}>
            <span className="landing-track-icon"><Icon /></span><span className="landing-track-index">0{index + 1}</span><h3>{track.title}</h3><p>{track.description}</p><div className="landing-track-meta"><span>{track.total} уроков</span><span>{trackPercent}% пройдено</span></div><div className="landing-track-progress"><span style={{ width: `${trackPercent}%` }} /></div><strong className="landing-track-link">Открыть маршрут <FiArrowRight /></strong>
          </motion.a>;
        })}</div>
      </section>

    </main>
    <footer className="landing-footer"><span><FiCommand /> sysadmin<span className="brand-accent">.</span></span><p>Авторский учебный план системного администратора 2026</p><a href={viewHref('roadmap')} data-route-link>Начать обучение <FiArrowRight /></a></footer>
  </div>;
}
