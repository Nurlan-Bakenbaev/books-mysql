import { FiArrowRight, FiAward, FiBook, FiBookOpen, FiPlay, FiTool } from 'react-icons/fi';
import { lessonHref, viewHref } from '../navigation';

/* eslint-disable react/prop-types */
export default function Dashboard({ percent, done, total, nextTopic, lastCompleted, tracks, phases }) {
  return <div className="academy-dashboard">
    <section className="dashboard-welcome">
      <div><span className="dashboard-eyebrow">Личный кабинет</span><h1>Ваше обучение</h1><p>Прогресс сохраняется в этом браузере. Экспортируйте его для переноса на другое устройство.</p></div>
      {nextTopic && <a className="button button-primary" href={lessonHref(nextTopic.id)} data-route-link><FiPlay /> Продолжить урок</a>}
    </section>

    <section className="dashboard-progress-card" aria-labelledby="dashboard-progress-title">
      <div className="dashboard-progress-ring" style={{ '--progress': percent }}><strong>{percent}%</strong><span>готово</span></div>
      <div className="dashboard-progress-copy"><span className="dashboard-eyebrow">Общий прогресс</span><h2 id="dashboard-progress-title">{done} из {total} учебных шагов</h2><div className="dashboard-wide-progress" role="progressbar" aria-label="Общий прогресс обучения" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><span style={{ width: `${percent}%` }} /></div><dl><div><dt>Последний завершённый</dt><dd>{lastCompleted?.title || 'Пока нет завершённых уроков'}</dd></div><div><dt>Следующий урок</dt><dd>{nextTopic?.title || 'Маршрут завершён'}</dd></div></dl></div>
    </section>

    <section className="dashboard-block" aria-labelledby="my-courses-title"><div className="dashboard-section-head"><div><span className="dashboard-eyebrow">Мои курсы</span><h2 id="my-courses-title">Учебные направления</h2></div><a href={viewHref('roadmap')} data-route-link>Весь путь <FiArrowRight /></a></div><div className="dashboard-course-grid">{tracks.map((item) => {
      const value = item.total ? Math.round(item.done / item.total * 100) : 0;
      return <a className="dashboard-course" href={viewHref(item.id)} data-route-link key={item.id}><span className={`dashboard-course-icon tone-${item.tone}`}><FiBookOpen /></span><span><strong>{item.title}</strong><small>{item.done} из {item.total} уроков · {value}%</small><i><span style={{ width: `${value}%` }} /></i></span><FiArrowRight /></a>;
    })}</div></section>

    <section className="dashboard-block" aria-labelledby="path-preview-title"><div className="dashboard-section-head"><div><span className="dashboard-eyebrow">Дорожная карта</span><h2 id="path-preview-title">Основной путь</h2></div><a href={viewHref('roadmap')} data-route-link>Открыть карту <FiArrowRight /></a></div><ol className="dashboard-path-preview">{phases.map((phase, index) => <li key={phase.id}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{phase.title}</strong><small>{phase.topics.length} уроков</small></div><FiArrowRight aria-hidden="true" /></li>)}</ol></section>

    <section className="dashboard-block" aria-labelledby="quick-title"><div className="dashboard-section-head"><div><span className="dashboard-eyebrow">Быстрый доступ</span><h2 id="quick-title">Практика и знания</h2></div></div><div className="dashboard-quick-grid"><a href={viewHref('labs')} data-route-link><FiTool /><strong>Лабораторные</strong><span>Пошаговая практика на собственном стенде</span></a><a href={viewHref('resources')} data-route-link><FiBookOpen /><strong>Материалы</strong><span>Официальная документация и книги</span></a><a href={viewHref('glossary')} data-route-link><FiBook /><strong>Термины</strong><span>Словарь системного администратора</span></a><a href={viewHref('certifications')} data-route-link><FiAward /><strong>Сертификации</strong><span>Следующая профессиональная цель</span></a></div></section>
  </div>;
}
