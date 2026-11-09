import { lazy, Suspense, useEffect, useMemo, useState, Fragment } from 'react';
import { FiActivity, FiArchive, FiArrowDownRight, FiArrowRight, FiAward, FiBook, FiBookOpen, FiCheck, FiCheckCircle, FiChevronRight, FiCloud, FiCommand, FiLayers, FiMenu, FiMoon, FiServer, FiShield, FiSun, FiTerminal, FiTool, FiX } from 'react-icons/fi';
import { phases, labs, certifications } from './data/guide';
import { lessons } from './data/lessons';
import { windowsSecurityCourse } from './data/windowsSecurity';
import { azureAdminPhases, azureAdminPlanned, azureAdminCourse } from './data/azureAdmin';
import course from './data/course.json';
import { currentRoute, sectionHref } from './navigation';
import Roadmap from './components/Roadmap';
import Glossary from './components/Glossary';
import ResourceLibrary from './components/ResourceLibrary';
import WindowsSecurityCourse from './components/WindowsSecurityCourse';
import Simulators from './components/Simulators';
const BookReader = lazy(() => import('./components/BookReader'));
const BookCourse = lazy(() => import('./components/BookCourse'));
const InteractiveLesson = lazy(() => import('./components/InteractiveLesson'));
const LessonPage = lazy(() => import('./components/LessonPage'));
import BookGuide from './components/BookGuide';
import './book-reader.css';
import './course.css';

const STORAGE_KEY = 'sysadmin-path-2026-progress';
const THEME_KEY = 'sysadmin-path-2026-theme';
// Each entry is an independent learning track with its own flat topic list;
// used to resolve the active track and its lesson sequence on `?lesson=` routes.
const TRACK_COURSES = [
  { id: 'windows-security', topics: windowsSecurityCourse.topics },
  { id: 'azure-admin', topics: azureAdminCourse.topics },
];

function readStored(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
}

// Scrolls to a `#hash` target on the home page; auto-opens a closed <details>
// ancestor first (e.g. the collapsed book section) so the scroll lands correctly.
function scrollToTarget(hash) {
  const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (!target) { window.scrollTo({ top: 0, behavior: 'instant' }); return; }
  const closedDetails = target.closest('details:not([open])');
  if (closedDetails) closedDetails.open = true;
  target.scrollIntoView();
}

function App() {
  const [completed, setCompleted] = useState(() => {
    const saved = readStored(STORAGE_KEY, []);
    return Array.isArray(saved) ? saved.filter((item) => typeof item === 'string') : [];
  });
  const [theme, setTheme] = useState(() => readStored(THEME_KEY, 'dark') === 'light' ? 'light' : 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [route, setRoute] = useState(currentRoute);
  const [activeSection, setActiveSection] = useState(() => window.location.hash || '#roadmap');
  useEffect(() => {
    const syncHash = () => setActiveSection(window.location.hash || '#roadmap');
    const syncHistory = () => {
      const next = currentRoute();
      setRoute(next);
      setMenuOpen(false);
      syncHash();
      requestAnimationFrame(() => {
        if (next.type === 'home' && window.location.hash) scrollToTarget(window.location.hash);
        else window.scrollTo({ top: 0, behavior: 'instant' });
      });
    };
    const onKeyDown = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHistory);
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('hashchange', syncHash); window.removeEventListener('popstate', syncHistory); window.removeEventListener('keydown', onKeyDown); };
  }, []);
  function navigate(to) {
    const url = new URL(to, window.location.href);
    window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    const next = currentRoute();
    setRoute(next);
    setActiveSection(url.hash || '#roadmap');
    setMenuOpen(false);
    requestAnimationFrame(() => {
      if (next.type === 'home' && url.hash) scrollToTarget(url.hash);
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }
  function followRouteLink(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link = event.target.closest('a[data-route-link]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
    event.preventDefault();
    navigate(url.href);
  }
  const [bookPageRequest, setBookPageRequest] = useState(null);
  const openBookPage = (page) => {
    setBookPageRequest((previous) => ({ page, requestId: (previous?.requestId || 0) + 1 }));
    navigate(sectionHref('#book'));
  };
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch { /* Storage may be unavailable. */ } }, [completed]);
  useEffect(() => { try { localStorage.setItem(THEME_KEY, JSON.stringify(theme)); } catch { /* Storage may be unavailable. */ } }, [theme]);

  const roadmapTopics = useMemo(() => phases.flatMap((phase) => phase.topics), []);
  const topicIds = useMemo(() => [...roadmapTopics, ...TRACK_COURSES.flatMap((item) => item.topics)].map((topic) => topic.id), [roadmapTopics]);
  const allIds = useMemo(() => [...topicIds, ...labs.map((lab) => lab.id)], [topicIds]);
  const done = allIds.filter((id) => completed.includes(id)).length;
  const topicsDone = topicIds.filter((id) => completed.includes(id)).length;
  const labsDone = labs.filter((lab) => completed.includes(lab.id)).length;
  const percent = allIds.length ? Math.round(done / allIds.length * 100) : 0;
  const toggle = (id) => setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const activeTrack = TRACK_COURSES.find((item) => item.topics.some((topic) => topic.id === route.id));
  const track = activeTrack ? activeTrack.id : 'roadmap';
  const sequence = activeTrack ? activeTrack.topics : roadmapTopics;
  const topicIndex = sequence.findIndex((topic) => topic.id === route.id);
  const selectedTopic = topicIndex >= 0 ? sequence[topicIndex] : null;
  const selectedChapter = course.modules.flatMap((module) => module.topics).find((topic) => topic.id === route.id);
  useEffect(() => {
    document.title = route.type === 'lesson' && selectedTopic ? `${selectedTopic.title} — Sysadmin 2026` : route.type === 'chapter' && selectedChapter ? `${selectedChapter.title} — Sysadmin 2026` : 'Путь системного администратора 2026';
  }, [route.type, selectedTopic, selectedChapter]);
  const navGroups = [
    { label: 'СТАРТ', items: [['#overview', 'Обзор', FiLayers]] },
    { label: 'ОБУЧЕНИЕ', items: [
      ['#roadmap', 'Путь сисадмина', FiActivity],
      ['#windows-security', 'Безопасность Windows', FiShield],
      ['#azure-admin', 'Azure AZ-104', FiCloud],
    ] },
    { label: 'ПРАКТИКА', items: [['#simulators', 'Тренажёры', FiTerminal], ['#labs', 'Домашние лабы', FiTool]] },
    { label: 'МАТЕРИАЛЫ', items: [
      ['#resources', 'Библиотека', FiBookOpen],
      ['#glossary', 'База знаний', FiBook],
      ['#book-extra', 'Книга (доп.)', FiArchive],
    ] },
    { label: 'СЕРТИФИКАЦИЯ', items: [['#certifications', 'Сертификации', FiAward]] },
  ];
  const topbar = <header className="topbar">
    <button className="mobile-menu button-icon" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}>{menuOpen ? <FiX /> : <FiMenu />}</button>
    <div className="topbar-breadcrumb"><span>Рабочее пространство</span><FiChevronRight /><strong>{route.type === 'home' ? 'Обзор' : 'Учебный материал'}</strong></div>
    <div className="topbar-actions"><span className="topbar-date"><span className="status-dot" /> ТВОЙ ПЛАН НА 2026</span><button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</button><span className="avatar" aria-hidden="true">SA</span></div>
  </header>;

  return (
    <div className="app-shell" data-theme={theme} onClick={followRouteLink}>
      <a className="skip-link" href={route.type === 'home' ? '#roadmap' : '#route-main'}>Перейти к содержимому</a>
      {menuOpen && <button className="sidebar-overlay" type="button" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'is-open' : ''}`}>
        <a className="brand" href={sectionHref('#overview')} data-route-link><span className="brand-mark"><FiCommand /></span><span>sysadmin<span className="brand-accent">.</span><small>YOUR LEARNING SPACE</small></span></a>
        <button className="sidebar-close" type="button" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)}><FiX /></button>
        <nav className="nav" aria-label="Основная навигация">
          {navGroups.map((group) => <Fragment key={group.label}>
            <div className="sidebar-label">{group.label}</div>
            {group.items.map(([href, label, Icon]) => <a className={`nav-link ${route.type === 'home' && activeSection === href ? 'active' : ''}`} href={sectionHref(href)} data-route-link key={href} aria-current={route.type === 'home' && activeSection === href ? 'location' : undefined}><Icon aria-hidden="true" /><span>{label}</span>{route.type === 'home' && activeSection === href && <FiChevronRight className="nav-arrow" />}</a>)}
          </Fragment>)}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-note"><span className="sidebar-note-icon"><FiTerminal /></span><strong>Учись на практике</strong><p>Маленькие шаги каждый день приводят к большим результатам.</p><a href={sectionHref('#labs')} data-route-link>Открыть лаборатории <FiArrowRight /></a></div>
          <div className="sidebar-version"><span className="status-dot" /> СИСТЕМА ГОТОВА <span>v.2026</span></div>
        </div>
      </aside>

      <main className="main" id="overview" hidden={route.type !== 'home'}>
        {topbar}
        <div className="content-wrap">
          <Roadmap phases={phases} completed={completed} onToggle={toggle} />
          <div className="welcome-row"><div><div className="section-kicker"><span className="status-dot" /> ОБНОВЛЁННЫЙ КУРС · ТЕМЫ: {topicIds.length}</div><h2>Путь системного<br className="desktop-break" /> администратора <span>2026</span></h2><p>Пошаговые уроки, практические задания и учебные материалы: от основ сетей и Linux до облака и безопасности.</p></div><div className="welcome-icon"><FiServer /><span>SYS / 2026</span></div></div>

          <section className="hero" aria-label="Общий прогресс">
            <div className="hero-copy"><div className="hero-eyebrow"><span /> ВАШ ПРОГРЕСС</div><h2>Большой путь<br />начинается с <em>первого шага.</em></h2><p>Отмечайте изученные темы и выполненные лаборатории. Ваш прогресс сохранится на этом устройстве.</p><div className="hero-actions"><a className="button button-primary" href="#roadmap">Открыть дорожную карту <FiArrowRight /></a><a className="hero-secondary" href="#labs">Перейти к лабам <FiArrowDownRight /></a></div></div>
            <div className="hero-progress"><div className="progress-orbit"><div className="progress-ring" style={{ '--progress': percent }} role="progressbar" aria-label="Общий прогресс" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><div className="progress-ring-inner"><strong>{percent}<small>%</small></strong><span>ЗАВЕРШЕНО</span></div></div></div><div className="hero-progress-caption"><span>ОБЩИЙ ПРОГРЕСС</span><strong>{done} <small>/ {allIds.length} выполнено</small></strong></div></div>
          </section>

          <div className="stats-grid" aria-label="Статистика обучения">
            <div className="stat-card"><span className="stat-icon blue"><FiLayers /></span><div><span>ЭТАПЫ ПУТИ</span><strong className="stat-value">{phases.length.toString().padStart(2, '0')}</strong><small>от основ до SecOps</small></div><FiArrowDownRight className="stat-arrow" /></div>
            <div className="stat-card"><span className="stat-icon violet"><FiBookOpen /></span><div><span>ТЕМЫ ИЗУЧЕНЫ</span><strong className="stat-value">{topicsDone.toString().padStart(2, '0')} <small>/ {topicIds.length}</small></strong><small>знания шаг за шагом</small></div><FiArrowDownRight className="stat-arrow" /></div>
            <div className="stat-card"><span className="stat-icon green"><FiCheckCircle /></span><div><span>ЛАБЫ ВЫПОЛНЕНЫ</span><strong className="stat-value">{labsDone.toString().padStart(2, '0')} <small>/ {labs.length}</small></strong><small>практика в деле</small></div><FiArrowDownRight className="stat-arrow" /></div>
          </div>

          <WindowsSecurityCourse completed={completed} onToggle={toggle} />
          <Roadmap
            id="azure-admin"
            headingLevel="h2"
            eyebrow="ОТДЕЛЬНЫЙ УЧЕБНЫЙ ТРЕК · MICROSOFT LEARN AZ-104"
            title={azureAdminCourse.title}
            description={azureAdminCourse.description}
            startHint="Для практики нужна бесплатная подписка Azure (Azure Free Account или подписка от учебного заведения) — её достаточно, чтобы пройти все лабораторные работы модуля."
            disclaimer="Это неофициальный конспект, составленный по публичной программе курса Microsoft Learn AZ-104. Актуальные лабораторные работы, условия ваучера и требования к экзамену всегда проверяйте на learn.microsoft.com."
            phases={azureAdminPhases}
            completed={completed}
            onToggle={toggle}
          />
          {azureAdminPlanned.length > 0 && <details className="planned-topics" id="azure-planned">
            <summary><FiCloud aria-hidden="true" /> Следующие темы AZ-104 — пока в разработке <span className="tag">{azureAdminPlanned.reduce((sum, phase) => sum + phase.topics.length, 0)} тем</span></summary>
            <p className="planned-note">Эти темы входят в программу курса, но подробные уроки для них ещё пишутся и появятся на сайте по мере готовности. До этого их можно изучать по модулям Microsoft Learn.</p>
            {azureAdminPlanned.map((phase) => <div className="planned-phase" key={phase.id}>
              <h3>{phase.number} · {phase.title}</h3>
              <ul>{phase.topics.map((topic) => <li key={topic.id}><strong>{topic.title}</strong> — {topic.description}</li>)}</ul>
            </div>)}
          </details>}
          <Simulators />
          <ResourceLibrary />
          <Glossary />
          <details className="book-extra" id="book-extra">
            <summary><FiArchive aria-hidden="true" /> Дополнительно: курс и читалка по книге «MySQL» <span className="tag">необязательно</span></summary>
            <div className="book-extra-body">
              <p className="book-extra-note">Эта книга — один из источников, которые мы использовали при подготовке уроков выше. Она не входит в основной план обучения, но доступна здесь для желающих прочитать оригинал целиком.</p>
              <Suspense fallback={<p role="status">Загружаем курс…</p>}><BookCourse /></Suspense>
              <Suspense fallback={<p role="status">Загружаем читалку…</p>}><BookReader pageRequest={bookPageRequest} /></Suspense>
              <BookGuide onOpenPage={openBookPage} />
            </div>
          </details>
          <section className="section" id="labs"><div className="section-heading"><div><div className="section-kicker">03 / ПРАКТИКА</div><h2>Домашняя лаборатория <span className="heading-icon"><FiTerminal /></span></h2><p>Закрепляйте знания в безопасной тестовой среде.</p></div><span className="section-count">{labsDone} / {labs.length} ВЫПОЛНЕНО</span></div><div className="lab-grid">{labs.map((lab, index) => <label className={`lab-card ${completed.includes(lab.id) ? 'is-complete' : ''}`} key={lab.id}><span className="lab-top"><span className="lab-number">LAB / {String(index + 1).padStart(2, '0')}</span><span className="lab-check"><input type="checkbox" checked={completed.includes(lab.id)} onChange={() => toggle(lab.id)} /><span><FiCheck /></span></span></span><strong>{lab.title}</strong><p>{lab.description}</p><span className="tag">{lab.platform}</span></label>)}</div></section>
          <section className="section" id="certifications"><div className="section-heading"><div><div className="section-kicker">04 / СЛЕДУЮЩИЙ УРОВЕНЬ</div><h2>Сертификации <span className="heading-icon"><FiAward /></span></h2><p>Подтвердите свои навыки и наметьте следующую цель.</p></div></div><div className="certifications-grid">{certifications.map((cert) => <a className="cert-card" key={cert.id} href={cert.url} target="_blank" rel="noreferrer"><span className="cert-top"><span className="tag">{cert.category}</span><FiArrowDownRight /></span><strong>{cert.name}</strong><p>{cert.description}</p><span className="cert-link">Об экзамене <FiArrowRight /></span></a>)}</div><p className="cert-note"><FiShield /> Перед регистрацией проверьте актуальную программу и требования на официальной странице экзамена.</p></section>
          <footer className="page-footer"><span><FiCommand /> sysadmin<span className="brand-accent">.</span> <small>ПУТЬ СИСТЕМНОГО АДМИНИСТРАТОРА</small></span><span>СОЗДАНО ДЛЯ ТЕХ, КТО РАЗБИРАЕТСЯ <FiActivity /></span></footer>
        </div>
      </main>
      {route.type !== 'home' && <main className="main" id="route-main" tabIndex="-1">
        {topbar}
        <div className="content-wrap route-content">
          <Suspense fallback={<p role="status">Загружаем учебный материал…</p>}>
            {route.type === 'lesson' && selectedTopic && lessons[selectedTopic.id] ? <LessonPage key={selectedTopic.id} topic={selectedTopic} lesson={lessons[selectedTopic.id]} isComplete={completed.includes(selectedTopic.id)} onToggle={toggle} track={track} previous={sequence[topicIndex - 1]} next={sequence[topicIndex + 1]} />
              : route.type === 'chapter' && selectedChapter ? <InteractiveLesson key={selectedChapter.id} topic={selectedChapter} onClose={() => navigate(sectionHref('#course'))} onOpenBookPage={openBookPage} />
                : <section className="route-not-found"><h1>Учебный материал не найден</h1><p>Проверьте ссылку или выберите существующий урок.</p><a className="button" href={sectionHref('#roadmap')} data-route-link>К дорожной карте <FiArrowRight aria-hidden="true" /></a></section>}
          </Suspense>
        </div>
      </main>}
    </div>
  );
}
export default App;
