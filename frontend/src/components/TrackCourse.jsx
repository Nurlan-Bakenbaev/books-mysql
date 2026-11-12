import { moduleQuestions } from '../data/moduleAssessments';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { lessonHref, lessonMaterialsHref } from '../navigation';
import Assessment from './Assessment';

// Generic flat-grid course section, generalized from WindowsSecurityCourse.jsx so the
// same markup/behaviour can render the Linux security and ethical hacking tracks too.
/* eslint-disable react/prop-types */
export default function TrackCourse({ course, sectionId, eyebrow, disclaimer, icon, completed, onToggle }) {
  const headingId = `${sectionId}-heading`;
  const done = course.topics.filter((topic) => completed.includes(topic.id)).length;
  const questions = moduleQuestions(course.topics);

  return <section className="section security-course" id={sectionId} aria-labelledby={headingId}>
    <div className="section-heading">
      <div><span className="eyebrow">{eyebrow}</span><h2 id={headingId}>{course.title} {icon && <span className="heading-icon">{icon}</span>}</h2><p>{course.description}</p></div>
      <span className="section-count">{done} / {course.topics.length} ИЗУЧЕНО</span>
    </div>
    {disclaimer && <p className="course-disclaimer">{disclaimer}</p>}
    <div className="security-topic-grid">{course.topics.map((topic) => <article className="security-topic-card" key={topic.id}>
      <label className="security-topic-check"><input type="checkbox" checked={completed.includes(topic.id)} onChange={() => onToggle(topic.id)} aria-label={`Отметить тему «${topic.title}» как изученную`} /><span>{completed.includes(topic.id) ? 'Изучено' : 'Не изучено'}</span></label>
      <h3>{topic.title}</h3><p>{topic.description}</p>
      <span className="topic-actions"><a className="topic-open" href={lessonHref(topic.id)} data-route-link>Открыть урок <FiArrowRight aria-hidden="true" /></a><a className="topic-material" href={lessonMaterialsHref(topic.id)} data-route-link><FiBookOpen aria-hidden="true" /> Материалы</a></span>
    </article>)}</div>
    <details className="module-test"><summary>Итоговый тест: {course.title}</summary><Assessment title={`Тест модуля: ${course.title}`} questions={questions} /></details>
  </section>;
}
