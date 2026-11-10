import { useEffect, useState } from 'react';
import { FiActivity, FiArrowRight, FiAward, FiBook, FiBookOpen, FiChevronDown, FiChevronLeft, FiChevronRight, FiCloud, FiCommand, FiGrid, FiLayers, FiShield, FiTerminal, FiTool, FiX } from 'react-icons/fi';
import { lessonHref, viewHref } from '../navigation';

const GROUPS_KEY = 'sysadmin-path-2026-sidebar-groups';

const courseItems = [
  { id: 'roadmap', label: 'Путь системного администратора', Icon: FiActivity },
  { id: 'computer-technologies', label: 'Компьютерные технологии', Icon: FiTool },
  { id: 'windows-security', label: 'Безопасность Windows', Icon: FiShield },
  { id: 'azure-admin', label: 'Azure / AZ-104', Icon: FiCloud },
  { id: 'linux-security', label: 'Безопасность Linux', Icon: FiTerminal },
  { id: 'ethical-hacking', label: 'Этичный хакинг и защита', Icon: FiShield },
  { id: 'security-plus', label: 'CompTIA Security+', Icon: FiAward },
];

const libraryItems = [
  { id: 'resources', label: 'Учебные материалы', Icon: FiBookOpen },
  { id: 'glossary', label: 'Словарь IT-терминов', Icon: FiBook },
  { id: 'certifications', label: 'Сертификации', Icon: FiAward },
];

function readGroups() {
  try {
    const stored = JSON.parse(localStorage.getItem(GROUPS_KEY));
    return stored && typeof stored === 'object' ? stored : { courses: true, library: false };
  } catch { return { courses: true, library: false }; }
}

/* eslint-disable react/prop-types */
export default function Sidebar({ route, track, menuOpen, collapsed, onClose, onToggleCollapsed, percent, completedCount, totalCount, nextTopic }) {
  const [groups, setGroups] = useState(readGroups);
  const activeView = route.type === 'view' ? route.id : route.type === 'lesson' ? track : route.type === 'dashboard' ? 'overview' : null;
  const coursesActive = courseItems.some((item) => item.id === activeView);
  const libraryActive = libraryItems.some((item) => item.id === activeView);

  useEffect(() => {
    if (coursesActive) setGroups((current) => ({ ...current, courses: true }));
    if (libraryActive) setGroups((current) => ({ ...current, library: true }));
  }, [coursesActive, libraryActive]);

  useEffect(() => {
    try { localStorage.setItem(GROUPS_KEY, JSON.stringify(groups)); } catch { /* Storage may be unavailable. */ }
  }, [groups]);

  const toggleGroup = (id) => setGroups((current) => ({ ...current, [id]: !current[id] }));
  const itemLink = (item, nested = false) => {
    const active = activeView === item.id;
    return <a className={`academy-nav-link${nested ? ' is-nested' : ''}${active ? ' active' : ''}`} href={viewHref(item.id)} data-route-link key={item.id} aria-current={active ? 'page' : undefined} title={collapsed ? item.label : undefined}>
      <span className="academy-nav-icon"><item.Icon aria-hidden="true" /></span><span className="academy-nav-label">{item.label}</span>{active && !collapsed && <span className="academy-active-dot" aria-hidden="true" />}
    </a>;
  };

  return <aside className={`sidebar academy-sidebar${menuOpen ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`} aria-label="Навигация платформы">
    <div className="academy-brand-row"><a className="academy-brand" href="./" title={collapsed ? 'Sysadmin Academy' : undefined}><span className="academy-brand-icon"><FiCommand /></span><span className="academy-brand-copy"><strong>SYSADMIN ACADEMY</strong><small>Учебная платформа</small></span></a><button className="sidebar-close" type="button" aria-label="Закрыть меню" onClick={onClose}><FiX /></button></div>

    <div className="academy-progress" title={collapsed ? `Прогресс ${percent}%` : undefined}>
      <div className="academy-progress-title"><span>Мой прогресс</span><strong>{percent}%</strong></div>
      <div className="academy-progress-numbers"><span>Выполнено шагов</span><strong>{completedCount} / {totalCount}</strong></div>
      <div className="academy-progress-bar" role="progressbar" aria-label="Общий прогресс" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div>
      {nextTopic && <a href={lessonHref(nextTopic.id)} data-route-link>Продолжить обучение <FiArrowRight /></a>}
      {collapsed && <span className="academy-progress-compact">{percent}</span>}
    </div>

    <nav className="academy-nav" aria-label="Основная навигация">
      {itemLink({ id: 'overview', label: 'Обзор', Icon: FiGrid })}
      {itemLink({ id: 'roadmap', label: 'Мой учебный путь', Icon: FiActivity })}

      <div className={`academy-nav-group${coursesActive ? ' has-active' : ''}`}>
        <button className="academy-nav-group-toggle" type="button" onClick={() => toggleGroup('courses')} aria-expanded={groups.courses} title={collapsed ? 'Все курсы' : undefined}><span className="academy-nav-icon"><FiLayers /></span><span className="academy-nav-label">Все курсы</span>{!collapsed && <FiChevronDown className="academy-group-chevron" />}</button>
        {groups.courses && !collapsed && <div className="academy-nav-children">{courseItems.map((item) => itemLink(item, true))}</div>}
      </div>

      <div className="academy-nav-divider" />
      {itemLink({ id: 'labs', label: 'Лабораторные работы', Icon: FiTool })}

      <div className={`academy-nav-group${libraryActive ? ' has-active' : ''}`}>
        <button className="academy-nav-group-toggle" type="button" onClick={() => toggleGroup('library')} aria-expanded={groups.library} title={collapsed ? 'Библиотека' : undefined}><span className="academy-nav-icon"><FiBookOpen /></span><span className="academy-nav-label">Библиотека</span>{!collapsed && <FiChevronDown className="academy-group-chevron" />}</button>
        {groups.library && !collapsed && <div className="academy-nav-children">{libraryItems.map((item) => itemLink(item, true))}</div>}
      </div>
    </nav>

    <div className="academy-sidebar-footer"><button type="button" className="academy-collapse" onClick={onToggleCollapsed} aria-label={collapsed ? 'Развернуть боковое меню' : 'Свернуть боковое меню'} title={collapsed ? 'Развернуть меню' : 'Свернуть меню'}>{collapsed ? <FiChevronRight /> : <FiChevronLeft />}<span>{collapsed ? '' : 'Свернуть меню'}</span></button><span className="academy-system"><span className="status-dot" /> <span>Прогресс сохраняется</span></span></div>
  </aside>;
}
