import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { FiActivity, FiArrowDownRight, FiArrowRight, FiAward, FiBookOpen, FiCheck, FiCheckCircle, FiChevronRight, FiCommand, FiLayers, FiMenu, FiMoon, FiServer, FiShield, FiSun, FiTerminal, FiX } from 'react-icons/fi';
import { phases, labs, certifications } from './data/guide';
import Roadmap from './components/Roadmap';
import Glossary from './components/Glossary';
const BookReader = lazy(() => import('./components/BookReader'));
import BookGuide from './components/BookGuide';
import './book-reader.css';

const STORAGE_KEY = 'sysadmin-path-2026-progress';
const THEME_KEY = 'sysadmin-path-2026-theme';

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
}

function App() {
  const [completed, setCompleted] = useState(() => {
    const saved = readStored(STORAGE_KEY, []);
    return Array.isArray(saved) ? saved.filter((item) => typeof item === 'string') : [];
  });
  const [theme, setTheme] = useState(() => readStored(THEME_KEY, 'dark') === 'light' ? 'light' : 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(() => window.location.hash || '#overview');
  useEffect(() => {
    const syncHash = () => setActiveSection(window.location.hash || '#overview');
    const onKeyDown = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('hashchange', syncHash); window.removeEventListener('keydown', onKeyDown); };
  }, []);
  const [bookPageRequest, setBookPageRequest] = useState(null);
  const openBookPage = (page) => {
    setBookPageRequest((previous) => ({ page, requestId: (previous?.requestId || 0) + 1 }));
    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch { /* Storage may be unavailable. */ } }, [completed]);
  useEffect(() => { try { localStorage.setItem(THEME_KEY, JSON.stringify(theme)); } catch { /* Storage may be unavailable. */ } }, [theme]);

  const topicIds = useMemo(() => phases.flatMap((phase) => phase.topics.map((topic) => topic.id)), []);
  const allIds = useMemo(() => [...topicIds, ...labs.map((lab) => lab.id)], [topicIds]);
  const done = allIds.filter((id) => completed.includes(id)).length;
  const topicsDone = topicIds.filter((id) => completed.includes(id)).length;
  const labsDone = labs.filter((lab) => completed.includes(lab.id)).length;
  const percent = allIds.length ? Math.round(done / allIds.length * 100) : 0;
  const toggle = (id) => setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const navItems = [
    ['#overview', 'Обзор', FiLayers], ['#roadmap', 'Дорожная карта', FiActivity], ['#book', 'Читать книгу', FiBookOpen], ['#book-guide', 'Разбор книги', FiBookOpen],
    ['#glossary', 'База знаний', FiBookOpen], ['#labs', 'Домашние лабы', FiTerminal],
    ['#certifications', 'Сертификации', FiAward],
  ];

  return (
    <div className="app-shell" data-theme={theme}>
      <a className="skip-link" href="#roadmap">Перейти к дорожной карте</a>
      {menuOpen && <button className="sidebar-overlay" type="button" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <a className="brand" href="#overview" onClick={() => setMenuOpen(false)}><span className="brand-mark"><FiCommand /></span><span>sysadmin<span className="brand-accent">.</span><small>YOUR LEARNING SPACE</small></span></a>
        <button className="sidebar-close" type="button" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)}><FiX /></button>
        <div className="sidebar-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
        <nav className="nav" aria-label="Основная навигация">
          {navItems.map(([href, label, Icon]) => <a className={`nav-link ${activeSection === href ? 'active' : ''}`} href={href} key={href} aria-current={activeSection === href ? 'location' : undefined} onClick={() => { setActiveSection(href); setMenuOpen(false); }}><Icon aria-hidden="true" /><span>{label}</span>{activeSection === href && <FiChevronRight className="nav-arrow" />}</a>)}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-note"><span className="sidebar-note-icon"><FiTerminal /></span><strong>Учись на практике</strong><p>Маленькие шаги каждый день приводят к большим результатам.</p><a href="#labs" onClick={() => setMenuOpen(false)}>Открыть лаборатории <FiArrowRight /></a></div>
          <div className="sidebar-version"><span className="status-dot" /> СИСТЕМА ГОТОВА <span>v.2026</span></div>
        </div>
      </aside>

      <main className="main" id="overview">
        <header className="topbar">
          <button className="mobile-menu button-icon" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}>{menuOpen ? <FiX /> : <FiMenu />}</button>
          <div className="topbar-breadcrumb"><span>Рабочее пространство</span><FiChevronRight /><strong>Обзор</strong></div>
          <div className="topbar-actions"><span className="topbar-date"><span className="status-dot" /> ТВОЙ ПЛАН НА 2026</span><button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</button><span className="avatar" aria-hidden="true">SA</span></div>
        </header>
        <div className="content-wrap">
          <div className="welcome-row"><div><div className="section-kicker"><span className="status-dot" /> ОБНОВЛЁННЫЙ КУРС · 23 УРОКА</div><h1>Путь системного<br className="desktop-break" /> администратора <span>2026</span></h1><p>23 подробных урока, практические задания и полный маршрут от основ сетей до облака и безопасности.</p></div><div className="welcome-icon"><FiServer /><span>SYS / 2026</span></div></div>

          <section className="hero" aria-label="Общий прогресс">
            <div className="hero-copy"><div className="hero-eyebrow"><span /> ВАШ ПРОГРЕСС</div><h2>Большой путь<br />начинается с <em>первого шага.</em></h2><p>Отмечайте изученные темы и выполненные лаборатории. Ваш прогресс сохранится на этом устройстве.</p><div className="hero-actions"><a className="button button-primary" href="#roadmap">Открыть дорожную карту <FiArrowRight /></a><a className="hero-secondary" href="#labs">Перейти к лабам <FiArrowDownRight /></a></div></div>
            <div className="hero-progress"><div className="progress-orbit"><div className="progress-ring" style={{ '--progress': percent }} role="progressbar" aria-label="Общий прогресс" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><div className="progress-ring-inner"><strong>{percent}<small>%</small></strong><span>ЗАВЕРШЕНО</span></div></div></div><div className="hero-progress-caption"><span>ОБЩИЙ ПРОГРЕСС</span><strong>{done} <small>/ {allIds.length} выполнено</small></strong></div></div>
          </section>

          <div className="stats-grid" aria-label="Статистика обучения">
            <div className="stat-card"><span className="stat-icon blue"><FiLayers /></span><div><span>ЭТАПЫ ПУТИ</span><strong className="stat-value">05</strong><small>от основ до SecOps</small></div><FiArrowDownRight className="stat-arrow" /></div>
            <div className="stat-card"><span className="stat-icon violet"><FiBookOpen /></span><div><span>ТЕМЫ ИЗУЧЕНЫ</span><strong className="stat-value">{topicsDone.toString().padStart(2, '0')} <small>/ {topicIds.length}</small></strong><small>знания шаг за шагом</small></div><FiArrowDownRight className="stat-arrow" /></div>
            <div className="stat-card"><span className="stat-icon green"><FiCheckCircle /></span><div><span>ЛАБЫ ВЫПОЛНЕНЫ</span><strong className="stat-value">{labsDone.toString().padStart(2, '0')} <small>/ {labs.length}</small></strong><small>практика в деле</small></div><FiArrowDownRight className="stat-arrow" /></div>
          </div>

          <Roadmap phases={phases} completed={completed} onToggle={toggle} />
          <Suspense fallback={<p role="status">Загружаем читалку…</p>}><BookReader pageRequest={bookPageRequest} /></Suspense>
          <BookGuide onOpenPage={openBookPage} />
          <Glossary />
          <section className="section" id="labs"><div className="section-heading"><div><div className="section-kicker">03 / ПРАКТИКА</div><h2>Домашняя лаборатория <span className="heading-icon"><FiTerminal /></span></h2><p>Закрепляйте знания в безопасной тестовой среде.</p></div><span className="section-count">{labsDone} / {labs.length} ВЫПОЛНЕНО</span></div><div className="lab-grid">{labs.map((lab, index) => <label className={`lab-card ${completed.includes(lab.id) ? 'is-complete' : ''}`} key={lab.id}><span className="lab-top"><span className="lab-number">LAB / {String(index + 1).padStart(2, '0')}</span><span className="lab-check"><input type="checkbox" checked={completed.includes(lab.id)} onChange={() => toggle(lab.id)} /><span><FiCheck /></span></span></span><strong>{lab.title}</strong><p>{lab.description}</p><span className="tag">{lab.platform}</span></label>)}</div></section>
          <section className="section" id="certifications"><div className="section-heading"><div><div className="section-kicker">04 / СЛЕДУЮЩИЙ УРОВЕНЬ</div><h2>Сертификации <span className="heading-icon"><FiAward /></span></h2><p>Подтвердите свои навыки и наметьте следующую цель.</p></div></div><div className="certifications-grid">{certifications.map((cert) => <a className="cert-card" key={cert.id} href={cert.url} target="_blank" rel="noreferrer"><span className="cert-top"><span className="tag">{cert.category}</span><FiArrowDownRight /></span><strong>{cert.name}</strong><p>{cert.description}</p><span className="cert-link">Об экзамене <FiArrowRight /></span></a>)}</div><p className="cert-note"><FiShield /> Перед регистрацией проверьте актуальную программу и требования на официальной странице экзамена.</p></section>
          <footer className="page-footer"><span><FiCommand /> sysadmin<span className="brand-accent">.</span> <small>ПУТЬ СИСТЕМНОГО АДМИНИСТРАТОРА</small></span><span>СОЗДАНО ДЛЯ ТЕХ, КТО РАЗБИРАЕТСЯ <FiActivity /></span></footer>
        </div>
      </main>
    </div>
  );
}
export default App;
