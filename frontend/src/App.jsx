import { LEARNING_KEY } from './lib/studyProgress';
import LabFlow from './components/LabFlow';
import PracticeCatalog from './components/PracticeCatalog';
import { SecurityPlusSyllabus } from './components/SecurityVideoTopics';
import LearningPanel from './components/LearningPanel';
import { orderCourses } from './data/courseOrder';
import GlobalNavbar from './components/GlobalNavbar';
import CareersPage from './components/CareersPage';
import { networkEngineerCourse } from './data/networkEngineer';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiChevronRight, FiMenu, FiMoon, FiSearch, FiSun, FiX } from 'react-icons/fi';
import { phases, labs, certifications } from './data/guide';
import { lessons } from './data/lessons';
import { windowsSecurityCourse } from './data/windowsSecurity';
import { azureAdminPhases, azureAdminCourse } from './data/azureAdmin';
import { azureCurrentSnapshot } from './data/azureAdminComplete';
import { ethicalHackingCourse, ethicalHackingPhases, linuxSecurityCourse, linuxSecurityPhases } from './data/securityTracks';
import { securityPlusCourse, securityPlusPhases } from './data/securityPlus';
import { computerTechnologiesCourse, computerTechnologiesPhases } from './data/computerTechnologies';
import { currentRoute, lessonHref, sectionHref } from './navigation';
import Roadmap from './components/Roadmap';
import SecurityPlusExam from './components/SecurityPlusExam';
import Glossary from './components/Glossary';
import ResourceLibrary from './components/ResourceLibrary';
import WindowsSecurityCourse from './components/WindowsSecurityCourse';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { CertificationsPage, LabsPage } from './components/UtilityPages';

const InteractiveRoadmap = lazy(() => import('./components/InteractiveRoadmap'));
const NetworkEngineerPage = lazy(() => import('./components/NetworkEngineerPage'));
const CourseSearch = lazy(() => import('./components/CourseSearch'));
const LessonPage = lazy(() => import('./components/LessonPage'));

const STORAGE_KEY = 'sysadmin-path-2026-progress';
const THEME_KEY = 'sysadmin-path-2026-theme';
const SIDEBAR_KEY = 'sysadmin-path-2026-sidebar-collapsed';
const PAGE_TITLES = {
  careers: 'Профессии', courses: 'Все курсы', 'career-map': 'Карта профессии 2026', 'network-engineer': 'Network Engineer',
  overview: 'Обзор обучения', roadmap: 'Путь системного администратора',
  'windows-security': 'Безопасность Windows', 'azure-admin': 'AZ-104',
  'linux-security': 'Безопасность Linux', 'ethical-hacking': 'Этичный хакинг',
  'security-plus': 'CompTIA Security+ · SY0-701',
  'computer-technologies': 'Фундаментальный Computer Science',
  labs: 'Лабораторные работы',
  resources: 'Учебные материалы',
  glossary: 'Словарь IT-терминов', certifications: 'Сертификации',
};
const TRACK_COURSES = [
  { id: 'network-engineer', topics: networkEngineerCourse.topics },
  { id: 'computer-technologies', topics: computerTechnologiesCourse.topics },
  { id: 'windows-security', topics: windowsSecurityCourse.topics },
  { id: 'azure-admin', topics: azureAdminCourse.topics },
  { id: 'linux-security', topics: linuxSecurityCourse.topics },
  { id: 'ethical-hacking', topics: ethicalHackingCourse.topics },
  { id: 'security-plus', topics: securityPlusCourse.topics },
];

function readStored(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

export default function App() {
  const [learning,setLearning] = useState(() => readStored(LEARNING_KEY,{}));
  useEffect(()=>{const sync=()=>{setLearning(readStored(LEARNING_KEY,{}));setCompleted(readStored(STORAGE_KEY,[]));};window.addEventListener('study-progress-changed',sync);return()=>window.removeEventListener('study-progress-changed',sync);},[]);
  const [completed, setCompleted] = useState(() => {
    const saved = readStored(STORAGE_KEY, []);
    return Array.isArray(saved) ? saved.filter((item) => typeof item === 'string') : [];
  });
  const [storageError,setStorageError] = useState('');
  const [theme, setTheme] = useState(() => readStored(THEME_KEY, 'dark') === 'light' ? 'light' : 'dark');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavigation, setMobileNavigation] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => readStored(SIDEBAR_KEY, false) === true);
  const [route, setRoute] = useState(currentRoute);
  const menuButtonRef = useRef(null);
  const menuWasOpen = useRef(false);
  const compactSidebar = sidebarCollapsed && !mobileNavigation;
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const sync = () => { setMobileNavigation(media.matches); setMenuOpen(false); };
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      const next = currentRoute();
      if (next.type === route.type && next.id === route.id) return;
      setRoute(next); setMenuOpen(false);
      if (next.type !== 'landing' || !window.location.hash.startsWith('#landing-')) window.scrollTo({ top: 0, behavior: 'instant' });
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !document.querySelector('dialog[open]')) { event.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('keydown', onKeyDown);
    return () => { window.removeEventListener('hashchange', syncRoute); window.removeEventListener('popstate', syncRoute); window.removeEventListener('keydown', onKeyDown); };
  }, [route.type, route.id]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch { setStorageError('Отметки не сохранены: хранилище браузера недоступно. Экспортируйте прогресс перед закрытием.'); } }, [completed]);
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
  const chosenTopics = learning.course === 'roadmap' || !learning.course ? roadmapTopics : TRACK_COURSES.find(c=>c.id===learning.course)?.topics || roadmapTopics;
  const nextTopic = chosenTopics.find(topic=>topic.id===learning.last?.[learning.course]) || chosenTopics.find(topic=>!completed.includes(topic.id));
  const lastCompleted = [...completed].reverse().map((id) => allTopics.find((topic) => topic.id === id)).find(Boolean);
  const activeTrack = TRACK_COURSES.find((item) => item.topics.some((topic) => topic.id === route.id));
  const track = activeTrack?.id || 'roadmap';
  const sequence = activeTrack?.topics || roadmapTopics;
  const topicIndex = sequence.findIndex((topic) => topic.id === route.id);
  const selectedTopic = topicIndex >= 0 ? sequence[topicIndex] : null;
  const toggle = (id) => setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const courseProgress = (items) => ({ done: items.filter((item) => completed.includes(item.id)).length, total: items.length });

  useEffect(() => {
    const title = route.type === 'lesson' && selectedTopic ? selectedTopic.title
      : route.type === 'view' ? PAGE_TITLES[route.id] : null;
    document.title = title ? `${title} — Sysadmin 2026` : 'Путь системного администратора 2026';
  }, [route.type, route.id, selectedTopic]);

  function navigate(to) {
    const url = new URL(to, window.location.href);
    window.history.pushState(null, '', `${url.pathname}${url.search}${url.hash}`);
    setRoute(currentRoute()); setMenuOpen(false);
    requestAnimationFrame(() => { if (url.hash) { const el=document.getElementById(url.hash.slice(1)); if(el instanceof HTMLDetailsElement) el.open=true; el?.scrollIntoView(); } else window.scrollTo({ top: 0, behavior: 'instant' }); });
  }
  function followRouteLink(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link = event.target.closest('a[data-route-link]');
    if (!link || link.hasAttribute('download')) return;
    const target = link.getAttribute('target');
    if (target && target !== '_self') return;
    const href = link.getAttribute('href') || link.getAttribute('xlink:href');
    if (!href) return;
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
    event.preventDefault(); navigate(url.href);
  }
  const tracks = orderCourses([
    { id: 'network-engineer', title: networkEngineerCourse.title, description: 'Ethernet, IP, VLAN, OSPF/BGP, Wi-Fi, VPN, облачные сети, телеметрия и автоматизация.', total: networkEngineerCourse.topics.length, done: courseProgress(networkEngineerCourse.topics).done, tone: 'cyan' },
    { id: 'roadmap', title: 'Путь системного администратора', description: 'Фундамент, сети, Linux, Windows Server, облако, автоматизация и SecOps.', total: roadmapTopics.length, done: courseProgress(roadmapTopics).done, tone: 'cyan' },
    { id: 'computer-technologies', title: computerTechnologiesCourse.title, description: 'Архитектура ЭВМ, операционные системы, компьютерные сети, Web и REST API.', total: computerTechnologiesCourse.topics.length, done: courseProgress(computerTechnologiesCourse.topics).done, tone: 'slate' },
    { id: 'windows-security', title: windowsSecurityCourse.title, description: 'Учётные записи, Defender, firewall, обновления, BitLocker, SIEM и инциденты.', total: windowsSecurityCourse.topics.length, done: courseProgress(windowsSecurityCourse.topics).done, tone: 'violet' },
    { id: 'azure-admin', title: 'AZ-104 · Azure Administrator', description: 'Идентификация, governance, storage, compute, networking, backup и monitor.', total: azureAdminCourse.topics.length, done: courseProgress(azureAdminCourse.topics).done, tone: 'blue' },
    { id: 'linux-security', title: linuxSecurityCourse.title, description: 'sudo, SSH, firewall, auditd, SELinux/AppArmor, hardening и восстановление.', total: linuxSecurityCourse.topics.length, done: courseProgress(linuxSecurityCourse.topics).done, tone: 'green' },
    { id: 'ethical-hacking', title: ethicalHackingCourse.title, description: 'Разрешённые лаборатории: recon, Nmap, web, privileges, detection и отчёт.', total: ethicalHackingCourse.topics.length, done: courseProgress(ethicalHackingCourse.topics).done, tone: 'orange' },
    { id: 'security-plus', title: securityPlusCourse.title, description: 'Введение и пять доменов SY0-701: 37 уроков с безопасными лабораториями, тестами и открытыми источниками.', total: securityPlusCourse.topics.length, done: courseProgress(securityPlusCourse.topics).done, tone: 'magenta' },
  ]);
  const viewContent = {
    careers: <CareersPage />,
    courses: <section><h1>Все курсы</h1><div className="landing-track-grid">{tracks.map(t => <a className="landing-track-card" key={t.id} href={`?view=${t.id}`} data-route-link><h2>{t.title}</h2><p>{t.description}</p><span>{t.done} / {t.total}</span></a>)}</div></section>,
    'career-map': <InteractiveRoadmap />,
    'network-engineer': <NetworkEngineerPage completed={completed} onToggle={toggle} />,
    overview: <><LearningPanel /><Dashboard percent={percent} done={done} total={allIds.length} nextTopic={nextTopic} lastCompleted={lastCompleted} tracks={tracks} phases={phases} /></>,
    roadmap: <><Roadmap eyebrow="MASTER PLAN · СИСТЕМНЫЙ АДМИНИСТРАТОР 2026" title="Авторский учебный план системного администратора 2026" description="38 основных уроков в восьми блоках: вводная Точка 00, фундамент, сети, Linux, Windows Server, виртуализация и облака, автоматизация, SecOps. Прежние темы сохранены дополнительно." startHint="Если вы начинаете с нуля, начните с Точки 00: компьютер и ОС, учебная Linux-машина, терминал, права, службы, сети и SSH. Затем двигайтесь по следующим блокам и подтверждайте результат каждой лаборатории." phases={phases.filter(p => p.id !== 'supplemental')} completed={completed} onToggle={toggle} /><section><h2>Дополнительные материалы</h2><ul>{phases.find(p => p.id === 'supplemental').topics.map(t => <li key={t.id}><a href={lessonHref(t.id)} data-route-link>{t.title}</a></li>)}</ul></section></>,
    'computer-technologies': <Roadmap id="computer-technologies" eyebrow="ФУНДАМЕНТАЛЬНЫЙ КУРС · АРХИТЕКТУРА, ОС И СЕТИ" title={computerTechnologiesCourse.title} description={computerTechnologiesCourse.description} startHint="Двигайтесь от instruction cycle и иерархии памяти к процессам, файловым системам, маршрутизации, HTTP и REST. Каждый урок завершайте локальной проверкой." phases={computerTechnologiesPhases} completed={completed} onToggle={toggle} />,
    'windows-security': <WindowsSecurityCourse completed={completed} onToggle={toggle} />,
    'azure-admin': <><Roadmap id="azure-admin" eyebrow="НЕОФИЦИАЛЬНЫЙ ТРЕК · СВЕРЕНО С MICROSOFTLEARNING" title={azureAdminCourse.title} description={azureAdminCourse.description} startHint="Пройдите identity, compute, storage, networking и monitoring с практикой по каждому модулю." phases={azureAdminPhases} completed={completed} onToggle={toggle} /><p className="course-source-note"><FiCheckCircle /> Проверено по открытому комплекту: {azureCurrentSnapshot.labs} лабораторий. <a href={azureCurrentSnapshot.source} target="_blank" rel="noreferrer">Открыть официальный репозиторий</a>.</p></>,
    'linux-security': <Roadmap id="linux-security" eyebrow="ОТДЕЛЬНЫЙ ТРЕК · HARDENING И ВОССТАНОВЛЕНИЕ" title={linuxSecurityCourse.title} description={linuxSecurityCourse.description} startHint="Изучайте управление доступом, наблюдаемость, hardening и восстановление Linux по порядку." phases={linuxSecurityPhases} completed={completed} onToggle={toggle} />,
    'ethical-hacking': <Roadmap id="ethical-hacking" eyebrow="ПРАКТИЧЕСКИЙ CYBER RANGE · RED И BLUE" title={ethicalHackingCourse.title} description={ethicalHackingCourse.description} startHint="Начните с письменных правил и изолированного стенда; каждый шаг завершайте detection, исправлением, retest и очисткой." phases={ethicalHackingPhases} completed={completed} onToggle={toggle} />,
    'security-plus': <><SecurityPlusSyllabus /><Roadmap id="security-plus" eyebrow="АВТОРСКИЙ КУРС · COMPTIA SECURITY+ SY0-701" title={securityPlusCourse.title} description={securityPlusCourse.description} startHint="Идите по пяти доменам по порядку: каждый урок завершайте лабораторией, проверкой защитного сигнала и коротким finding." phases={securityPlusPhases} completed={completed} onToggle={toggle} /><SecurityPlusExam /></>,
    labs: <><LabFlow /><PracticeCatalog /><LabsPage labs={labs} completed={completed} onToggle={toggle} /></>,
    resources: <ResourceLibrary />, glossary: <Glossary termId={new URLSearchParams(window.location.search).get('term')} />, certifications: <CertificationsPage certifications={certifications} completed={completed} />,
  };
  const breadcrumb = route.type === 'view' ? PAGE_TITLES[route.id] : route.type === 'lesson' ? selectedTopic?.title : null;
  const topbar = <header className="topbar"><button ref={menuButtonRef} className="navigation-toggle button-icon" type="button" onClick={() => mobileNavigation ? setMenuOpen((value) => !value) : setSidebarCollapsed((value) => !value)} aria-controls="platform-navigation" aria-expanded={mobileNavigation ? menuOpen : !compactSidebar} aria-label={mobileNavigation ? (menuOpen ? 'Закрыть меню' : 'Открыть меню') : (compactSidebar ? 'Развернуть боковое меню' : 'Свернуть боковое меню')}>{mobileNavigation && menuOpen ? <FiX /> : <FiMenu />}</button><div className="topbar-breadcrumb"><span>Учебная платформа</span><FiChevronRight /><strong>{breadcrumb || 'Материал'}</strong></div><div className="topbar-actions"><button className="theme-toggle search-toggle" type="button" aria-label="Поиск по курсу" aria-haspopup="dialog" onClick={() => setSearchOpen(true)}><FiSearch aria-hidden="true" /></button><span className="topbar-date"><span className="status-dot" /> ПЛАН НА 2026</span><button className="theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}>{theme === 'dark' ? <FiSun /> : <FiMoon />}</button><span className="avatar" aria-hidden="true">SA</span></div></header>;

  return <div className={`app-shell${route.type === 'landing' ? ' landing-shell' : ''}${compactSidebar && route.type !== 'landing' ? ' sidebar-collapsed' : ''}`} data-theme={theme} onClick={followRouteLink}>
    {storageError && <p role="alert" className="storage-error">{storageError}</p>}
    {searchOpen && <Suspense fallback={<span className="sr-only" role="status">Загружаем поиск…</span>}><CourseSearch onClose={() => setSearchOpen(false)} /></Suspense>}
    <a className="skip-link" href={route.type === 'landing' ? '#landing-tracks' : '#route-main'}>Перейти к содержимому</a>
    {route.type !== 'landing' && menuOpen && <button className="sidebar-overlay" type="button" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} />}
    {route.type !== 'landing' && <Sidebar route={route} track={track} selectedCourse={learning.course || 'roadmap'} menuOpen={menuOpen} collapsed={compactSidebar} onExpand={() => setSidebarCollapsed(false)} onClose={() => setMenuOpen(false)} percent={percent} completedCount={done} totalCount={allIds.length} nextTopic={nextTopic} />}
    {route.type === 'landing' && <LandingPage onSearch={() => setSearchOpen(true)} tracks={tracks} totalCount={topicIds.length} nextLesson={nextTopic ? { title: nextTopic.title, href: lessonHref(nextTopic.id) } : null} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}
    {route.type !== 'landing' && <main className="main" id="route-main" tabIndex="-1">{topbar}<GlobalNavbar /><div className="content-wrap route-content"><Suspense fallback={<p role="status">Загружаем учебный материал…</p>}>
      {route.type === 'view' && viewContent[route.id] ? <div className="standalone-view" key={route.id}>{viewContent[route.id]}</div>
        : route.type === 'lesson' && selectedTopic && lessons[selectedTopic.id] ? <LessonPage key={selectedTopic.id} topic={selectedTopic} lesson={lessons[selectedTopic.id]} isComplete={completed.includes(selectedTopic.id)} onToggle={toggle} track={track} previous={sequence[topicIndex - 1]} next={sequence[topicIndex + 1]} />
          : <section className="route-not-found"><h1>Учебный материал не найден</h1><p>Проверьте ссылку или выберите существующий урок.</p><a className="button" href={sectionHref('#roadmap')} data-route-link>К дорожной карте <FiArrowRight /></a></section>}
    </Suspense></div></main>}
  </div>;
}
