import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import course from '../data/course.json';
import InteractiveLesson, { type CourseTopic } from './InteractiveLesson';

type Props = { onOpenBookPage: (page: number) => void };
export default function BookCourse({ onOpenBookPage }: Props) {
  const [selected, setSelected] = useState<CourseTopic | null>(null);
  return <section className="course-section" id="course" aria-labelledby="course-title"><header className="course-header"><div><span className="eyebrow">КУРС ПО КНИГЕ · 5 ЧАСТЕЙ / 21 ГЛАВА</span><h2 id="course-title">Изучайте книгу шаг за шагом</h2><p>{course.meta.description}</p></div></header>
    <div className="course-module-grid">{course.modules.map((module, moduleIndex) => <details className="course-module" key={module.id} open={moduleIndex === 0 ? true : undefined}><summary><span className="course-module-number">{String(moduleIndex + 1).padStart(2, '0')}</span>{module.title}</summary><p>{module.description}</p><ul className="course-topic-list">{module.topics.map((topic) => <li key={topic.id}><button type="button" className="course-topic-button" aria-pressed={selected?.id === topic.id} onClick={() => setSelected(topic)}><span>{topic.title}</span><FiArrowRight aria-hidden="true" /></button></li>)}</ul></details>)}</div>
    {selected && <InteractiveLesson key={selected.id} topic={selected} onClose={() => { setSelected(null); document.getElementById('course-title')?.scrollIntoView({ block: 'start' }); }} onOpenBookPage={onOpenBookPage} />}
  </section>;
}
