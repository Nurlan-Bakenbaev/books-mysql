import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiChevronRight, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { phases, labs, certifications } from './data/guide';
import { lessons } from './data/lessons';
import { windowsSecurityCourse } from './data/windowsSecurity';
import { azureAdminPhases, azureAdminCourse } from './data/azureAdmin';
import { azureCurrentSnapshot } from './data/azureAdminComplete';
import { ethicalHackingCourse, ethicalHackingPhases, linuxSecurityCourse, linuxSecurityPhases } from './data/securityTracks';
import course from './data/course.json';
import { currentRoute, lessonHref, sectionHref } from './navigation';
import Roadmap from './components/Roadmap';
import Glossary from './components/Glossary';
import ResourceLibrary from './components/ResourceLibrary';
import WindowsSecurityCourse from './components/WindowsSecurityCourse';
import Simulators from './components/Simulators';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { CertificationsPage, LabsPage } from './components/UtilityPages';
import BookGuide from './components/BookGuide';
import './book-reader.css';
import './course.css';

const BookReader = lazy(() => import('./components/BookReader'));
const BookCourse = lazy(() => import('./components/BookCourse'));
const InteractiveLesson = lazy(() => import('./components/InteractiveLesson'));
const LessonPage = lazy(() => import('./components/LessonPage'));

const STORAGE_KEY = 'sysadmin-path-2026-progress';
const THEME_KEY = 'sysadmin-path-2026-theme';
const SIDEBAR_KEY = 'sysadmin-path-2026-sidebar-collapsed';
const PAGE_TITLES = {
  overview: 'Обзор обучения', roadmap: 'Путь системного администратора',
  'windows-security': 'Безопасность Windows', 'azure-admin': 'AZ-104',
  'linux-security': 'Безопасность Linux', 'ethical-hacking': 'Этичный хакинг',
  labs: 'Лабораторные работы', simulators: 'Интерактивные тренажёры',
  resources: 'Учебные материалы', book: 'Книги и PDF',
  glossary: 'Словарь IT-терминов', certifications: 'Сертификации',
};
const TRACK_COURSES = [
  { id: 'windows-security', topics: windowsSecurityCourse.topics },
  { id: 'azure-admin', topics: azureAdminCourse.topics },
  { id: 'linux-security', topics: linuxSecurityCourse.topics },
  { id: 'ethical-hacking', topics: ethicalHackingCourse.topics },
];

function readStored(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

export default function App() {
  const [completed, setCompleted] = useState(() => {
    const saved = readStored(STORAGE_KEY, []);
    return Array.isArray(saved) ? saved.filter((item) => typeof item === 'string') : [];
  });
  const [theme, setTheme] = useState(() => readStored(THEME_KEY, 'dark') === 'light' ? 'light' : 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStored(SIDEBAR_KEY, false) === true);
  const [route, setRoute] = useState(currentRoute);
  const [bookPageRequest, setBookPageRequest] = useState(null);
  const menuButtonRef = useRef(null);
  const menuWasOpen = useRef(false);

  useEffect(() => {
    const syncRoute = () => { setRoute(currentRoute()); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'instant' }); };
    const onKeyDown = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('hashchange', syncRoute); window.removeEventListener('popstate', syncRoute); window.removeEventListener('keydown', onKeyDown); };
  }, []);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch { /* Storage may be unavailable. */ } }, [completed]);
  useEffect(() => { try { localStorage.setItem(THEME_KEY, JSON.stringify(theme)); } catch { /* Storage may be unavailable. */ } }, [theme]);
  useEffect(() => { try { localStorage.setItem(SIDEBAR_KEY, JSON.stringify(sidebarCollapsed)); } catch { /* Storage may be unavailable. */ } }, [sidebarCollapsed]);
  useEffect(() => {
    if (menuOpen) {
      menuWasOpen.current = true;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => document.querySelector('.academy-sidebar .sidebar-close')?.focus());
      return () => { document.body.style.overflow = previousOverflow; };
    }
    if (menuWasOpen.current) { menuButtonRef.current?.focus(); menuWasOpen.current = false; }
    return undefined;
  }, [menuOpen]);

  const roadmapTopics = useMemo(() => phases.flatMap((phase) => phase.topics), []);
  const allTopics = useMemo(() => [...roadmapTopics, ...TRACK_COURSES.flatMap((item) => item.topics)], [roadmapTopics]);
  const topicIds = useMemo(() => allTopics.map((topic) => topic.id), [allTopics]);
  const allIds = useMemo(() => [...topicIds, ...labs.map((lab) => lab.id)], [topicIds]);
  const done = allIds.filter((id) => completed.includes(id)).length;
  const percent = allIds.length ? Math.round(done / allIds.length * 100) : 0;
  const nextTopic = allTopics.find((topic) => !completed.includes(topic.id));
  const lastCompleted = [...completed].reverse().map((id) => allTopics.find((topic) => topic.id === id)).find(Boolean);
  const activeTrack = TRACK_COURSES.find((item) => item.topics.some((topic) => topic.id === route.id));
  const track = activeTrack?.id || 'roadmap';
  const sequence = activeTrack?.topics || roadmapTopics;
  const topicIndex = sequence.findIndex((topic) => topic.id === route.id);
  const selectedTopic = topicIndex >= 0 ? sequence[topicIndex] : null;
  const selectedChapter = course.modules.flatMap((module) => module.topics).find((topic) => topic.id === route.id);
  const toggle = (id) => setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const courseProgress = (items) => ({ done: items.filter((item) => completed.includes(item.id)).length, total: items.length });

  useEffect(() => {
    const title = route.type === 'lesson' && selectedTopic ? selectedTopic.title
      : route.type === 'chapter' && selectedChapter ? selectedChapter.title
        : route.type === 'view' ? PAGE_TITLES[route.id] : null;
    document.title = title ? `${title} — Sysadmin 2026` : 'Путь системного администратора 2026';
  }, [route.type, route.id, selectedTopic, selectedChapter]);

  function navigate(to) {
    const url = new URL(to, window.location.href);
    window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    setRoute(currentRoute()); setMenuOpen(false);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  }
  function followRouteLink(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link = event.target.closest('a[data-route-link]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
    event.preventDefault(); navigate(url.href);
  }
  function openBookPage(page) {
    setBookPageRequest((previous) => ({ page, requestId: (previous?.requestId || 0) + 1 }));
    navigate(sectionHref('#book'));
  }

  const tracks = [
    { id: 'roadmap', title: 'Путь системного администратора', description: 'Фундамент, сети, Linux, Windows Server, облако, автоматизация и SecOps.', total: roadmapTopics.length, done: courseProgress(roadmapTopics).done, tone: 'cyan' },
    { id: 'windows-security', title: windowsSecurityCourse.title, description: 'Учётные записи, Defender, firewall, обновления, BitLocker, SIEM и инциденты.', total: windowsSecurityCourse.topics.length, done: courseProgress(windowsSecurityCourse.topics).done, tone: 'violet' },
    { id: 'azure-admin', title: 'AZ-104 · Azure Administrator', description: 'Идентификация, governance, storage, compute, networking, backup и monitor.', total: azureAdminCourse.topics.length, done: courseProgress(azureAdminCourse.topics).done, tone: 'blue' },
    { id: 'linux-security', title: linuxSecurityCourse.title, description: 'sudo, SSH, firewall, auditd, SELinux/AppArmor, hardening и восстановление.', total: linuxSecurityCourse.topics.length, done: courseProgress(linuxSecurityCourse.topics).done, tone: 'green' },
    { id: 'ethical-hacking', title: ethicalHackingCourse.title, description: 'Разрешённые лаборатории: recon, Nmap, web, privileges, detection и отчёт.', total: ethicalHackingCourse.topics.length, done: courseProgress(ethicalHackingCourse.topics).done, tone: 'orange' },
  ];
  const viewContent = {
    overview: <Dashboard percent={percent} done={done} total={allIds.length} nextTopic={nextTopic} lastCompleted={lastCompleted} tracks={tracks} phases={phases} />,
    roadmap: <Roadmap phases={phases} completed={completed} onToggle={toggle} />,
    'windows-security': <WindowsSecurityCourse completed={completed} onToggle={toggle} />,
    'azure-admin': <><Roadmap id="azure-admin" eyebrow="НЕОФИЦИАЛЬНЫЙ ТРЕК · СВЕРЕНО С MICROSOFTLEARNING" title={azureAdminCourse.title} description={azureAdminCourse.description} startHint="Практику выполняйте в отдельной подписке Azure с бюджетом и обязательной очисткой ресурсов." disclaimer="Структура сверена с открытым комплектом лабораторий MicrosoftLearning от 24.09.2026. Это неофициальный курс; актуальные требования экзамена и цены проверяйте у Microsoft." phases={azureAdminPhases} completed={completed} onToggle={toggle} /><p className="course-source-note"><FiCheckCircle /> Проверено по открытому комплекту: {azureCurrentSnapshot.labs} лабораторий. <a href={azureCurrentSnapshot.source} target="_blank" rel="noreferrer">Открыть официальный репозиторий</a>.</p></>,
    'linux-security': <Roadmap id="linux-security" eyebrow="ОТДЕЛЬНЫЙ ТРЕК · HARDENING И ВОССТАНОВЛЕНИЕ" title={linuxSecurityCourse.title} description={linuxSecurityCourse.description} startHint="Перед SSH, firewall, sudo и MAC сохраните console access, snapshot и вторую административную сессию." disclaimer="Команды зависят от дистрибутива. Перед изменением сверяйте manual, делайте одно изменение и проверяйте откат." phases={linuxSecurityPhases} completed={completed} onToggle={toggle} />,
    'ethical-hacking': <Roadmap id="ethical-hacking" eyebrow="ПРАКТИЧЕСКИЙ CYBER RANGE · RED И BLUE" title={ethicalHackingCourse.title} description={ethicalHackingCourse.description} startHint="Начните с письменных правил и изолированного стенда; каждый шаг завершайте detection, исправлением, retest и очисткой." disclaimer="Активные действия разрешены только на собственном стенде или при явном письменном разрешении владельца." phases={ethicalHackingPhases} completed={completed} onToggle={toggle} />,
    labs: <LabsPage labs={labs} completed={completed} onToggle={toggle} />, simulators: <Simulators />,
    resources: <ResourceLibrary />, glossary: <Glossary />, certifications: <CertificationsPage certifications={certifications} />,
    book: <section className="section utility-page book-workspace"><div className="section-heading"><div><div className="section-kicker">Дополнительное чтение</div><h1>Книги и PDF</h1><p>Книга дополняет основной учебный путь. Открывайте главы по мере необходимости и связывайте чтение с практическими уроками.</p></div></div><BookCourse /><BookReader pageRequest={bookPageRequest} /><BookGuide onOpenPage={openBookPage} /></section>,
  };
  const breadcrumb = route.type === 'view' ? PAGE_TITLES[route.id] : route.type === 'lesson' ? selectedTopic?.title : selectedChapter?.title;
  const topbar = <header className="topbar"><button ref={menuButtonRef} className="mobile-menu button-icon" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}>{menuOpen ? <FiX /> : <FiMenu />}</button><div className="topbar-breadcrumb"><span>Учебная платформа</span><FiChevronRight /><strong>{breadcrumb || 'Материал'}</strong></div><div className="topbar-actions"><span className="topbar-date"><span className="status-dot" /> ПЛАН НА 2026</span><button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</button><span className="avatar" aria-hidden="true">SA</span></div></header>;

  return <div className={`app-shell${route.type === 'landing' ? ' landing-shell' : ''}${sidebarCollapsed && route.type !== 'landing' ? ' sidebar-collapsed' : ''}`} data-theme={theme} onClick={followRouteLink}>
    <a className="skip-link" href={route.type === 'landing' ? '#landing-tracks' : '#route-main'}>Перейти к содержимому</a>
    {route.type !== 'landing' && menuOpen && <button className="sidebar-overlay" type="button" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />}
    {route.type !== 'landing' && <Sidebar route={route} track={track} menuOpen={menuOpen} collapsed={sidebarCollapsed} onClose={() => setMenuOpen(false)} onToggleCollapsed={() => setSidebarCollapsed((value) => !value)} percent={percent} completedCount={done} totalCount={allIds.length} nextTopic={nextTopic} />}
    {route.type === 'landing' && <LandingPage tracks={tracks} totalCount={topicIds.length} nextLesson={nextTopic ? { title: nextTopic.title, href: lessonHref(nextTopic.id) } : null} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}
    {route.type !== 'landing' && <main className="main" id="route-main" tabIndex="-1">{topbar}<div className="content-wrap route-content"><Suspense fallback={<p role="status">Загружаем учебный материал…</p>}>
      {route.type === 'view' && viewContent[route.id] ? <div className="standalone-view" key={route.id}>{viewContent[route.id]}</div>
        : route.type === 'lesson' && selectedTopic && lessons[selectedTopic.id] ? <LessonPage key={selectedTopic.id} topic={selectedTopic} lesson={lessons[selectedTopic.id]} isComplete={completed.includes(selectedTopic.id)} onToggle={toggle} track={track} previous={sequence[topicIndex - 1]} next={sequence[topicIndex + 1]} />
          : route.type === 'chapter' && selectedChapter ? <InteractiveLesson key={selectedChapter.id} topic={selectedChapter} onClose={() => navigate(sectionHref('#book'))} onOpenBookPage={openBookPage} />
            : <section className="route-not-found"><h1>Учебный материал не найден</h1><p>Проверьте ссылку или выберите существующий урок.</p><a className="button" href={sectionHref('#roadmap')} data-route-link>К дорожной карте <FiArrowRight /></a></section>}
    </Suspense></div></main>}
  </div>;
}
