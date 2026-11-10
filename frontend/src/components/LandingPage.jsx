import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiActivity, FiArrowRight, FiAward, FiBookOpen, FiCloud, FiCommand, FiCpu, FiMoon, FiPlay, FiShield, FiSun, FiTerminal } from 'react-icons/fi';
import { viewHref } from '../navigation';

gsap.registerPlugin(ScrollTrigger);

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
export default function LandingPage({ tracks, totalCount, nextLesson, theme, onToggleTheme }) {
  const pathRef = useRef(null);
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !pathRef.current || !sectionRef.current) return undefined;
    const length = pathRef.current.getTotalLength();
    const context = gsap.context(() => {
      gsap.fromTo(pathRef.current, { strokeDasharray: length, strokeDashoffset: length }, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', end: 'bottom 70%', scrub: .7 },
      });
      gsap.from('.landing-map-node', {
        scale: .55, opacity: 0, stagger: .12, duration: .45, ease: 'back.out(1.8)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
      });
    }, sectionRef);
    return () => context.revert();
  }, [reduceMotion]);

  return <div className="landing-page">
    <header className="landing-nav">
      <a className="brand" href="./" aria-label="Sysadmin 2026 — главная"><span className="brand-mark"><FiCommand /></span><span>sysadmin<span className="brand-accent">.</span></span></a>
      <nav aria-label="Навигация главной страницы"><a href="#landing-tracks">Маршруты</a><a href={viewHref('resources')} data-route-link>Библиотека</a><a href={viewHref('labs')} data-route-link>Практика</a></nav>
      <div className="landing-nav-actions"><button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</button><a className="button button-primary" href={viewHref('roadmap')} data-route-link>Начать путь <FiArrowRight /></a></div>
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

      <section className="landing-path-preview" ref={sectionRef} aria-labelledby="landing-path-title">
        <div className="landing-section-heading"><span className="eyebrow">ГЛАВНЫЙ МАРШРУТ</span><h2 id="landing-path-title">Настоящая карта профессии</h2><p>Шесть последовательных этапов: от базовой инфраструктуры до автоматизации и SecOps. Каждый узел открывает отдельные уроки, лаборатории и модульный тест.</p></div>
        <div className="landing-path-canvas">
          <svg viewBox="0 0 1100 330" role="img" aria-label="Путь от фундамента до SecOps"><path className="landing-map-base" d="M70 250 C190 250 175 85 315 85 S440 255 565 255 S690 70 815 85 S930 235 1030 120" /><path ref={pathRef} className="landing-map-line" d="M70 250 C190 250 175 85 315 85 S440 255 565 255 S690 70 815 85 S930 235 1030 120" /></svg>
          {['Фундамент', 'Сети и сервисы', 'Windows Server', 'Cloud & DevOps', 'Автоматизация', 'SecOps'].map((label, index) => <div className={`landing-map-node node-${index + 1}`} key={label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong></div>)}
        </div>
        <a className="button landing-map-button" href={viewHref('roadmap')} data-route-link>Исследовать карту из 31 урока <FiArrowRight /></a>
      </section>

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
    <footer className="landing-footer"><span><FiCommand /> sysadmin<span className="brand-accent">.</span></span><p>Путь системного администратора 2026 · самостоятельный неофициальный курс</p><a href={viewHref('roadmap')} data-route-link>Начать обучение <FiArrowRight /></a></footer>
  </div>;
}
