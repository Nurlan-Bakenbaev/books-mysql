import { FiArrowRight, FiShield } from 'react-icons/fi';
import { windowsSecurityCourse } from '../data/windowsSecurity';
import { lessonDetails } from '../data/lessonDetails';
import { lessonHref } from '../navigation';
import Assessment from './Assessment';

/* eslint-disable react/prop-types */
export default function WindowsSecurityCourse({ completed, onToggle }) {
  const done = windowsSecurityCourse.topics.filter((topic) => completed.includes(topic.id)).length;
  const questions = windowsSecurityCourse.topics.map((topic) => ({ ...lessonDetails[topic.id].question, context: topic.title }));

  return <section className="section security-course" id="windows-security" aria-labelledby="security-course-heading">
    <div className="section-heading">
      <div><span className="eyebrow">ОТДЕЛЬНЫЙ УЧЕБНЫЙ ТРЕК · ПО МАТЕРИАЛАМ MICROSOFT</span><h2 id="security-course-heading">{windowsSecurityCourse.title} <span className="heading-icon"><FiShield aria-hidden="true" /></span></h2><p>{windowsSecurityCourse.description}</p></div>
      <span className="section-count">{done} / {windowsSecurityCourse.topics.length} ИЗУЧЕНО</span>
    </div>
    <p className="course-disclaimer">Авторские объяснения на русском по открытой документации и лабораториям Microsoft SC-900 / SC-200; это не официальный курс или сертификат Microsoft. Для некоторых облачных упражнений потребуются отдельные лицензии и возможны расходы.</p>
    <div className="security-topic-grid">{windowsSecurityCourse.topics.map((topic) => <article className="security-topic-card" key={topic.id}>
      <label className="security-topic-check"><input type="checkbox" checked={completed.includes(topic.id)} onChange={() => onToggle(topic.id)} aria-label={`Отметить тему «${topic.title}» как изученную`} /><span>{completed.includes(topic.id) ? 'Изучено' : 'Не изучено'}</span></label>
      <h3>{topic.title}</h3><p>{topic.description}</p>
      <a className="topic-open" href={lessonHref(topic.id)} data-route-link>Открыть урок <FiArrowRight aria-hidden="true" /></a>
    </article>)}</div>
    <details className="module-test"><summary>Итоговый тест: безопасность Windows</summary><Assessment title="Тест модуля: безопасность Windows" questions={questions} /></details>
  </section>;
}
