import { FiArrowRight } from 'react-icons/fi';
import course from '../data/course.json';
import { chapterHref } from '../navigation';
import Assessment from './Assessment';

export default function BookCourse() {
  return <section className="course-section" id="course" aria-labelledby="course-title"><header className="course-header"><div><span className="eyebrow">КУРС ПО КНИГЕ · 5 ЧАСТЕЙ / 21 ГЛАВА</span><h2 id="course-title">Изучайте книгу шаг за шагом</h2><p>{course.meta.description}</p></div></header>
    <div className="course-module-grid">{course.modules.map((module, moduleIndex) => <details className="course-module" key={module.id} open={moduleIndex === 0 ? true : undefined}><summary><span className="course-module-number">{String(moduleIndex + 1).padStart(2, '0')}</span>{module.title}</summary><p>{module.description}</p><ul className="course-topic-list">{module.topics.map((topic) => <li key={topic.id}><a className="course-topic-button" href={chapterHref(topic.id)} data-route-link><span>{topic.title}</span><FiArrowRight aria-hidden="true" /></a></li>)}</ul><details className="module-test"><summary>Пройти тест модуля</summary><Assessment title={`Тест модуля: ${module.title}`} questions={module.topics.map((topic) => ({ ...topic.quiz[0], context: topic.title }))} /></details></details>)}</div>
  </section>;
}
