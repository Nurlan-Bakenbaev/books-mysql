import SysadminPractice from './SysadminPractice';
import IntroductoryLesson from './IntroductoryLesson';
/* eslint-disable react/prop-types */
export default function CoreLesson({ lesson }) {
  if (lesson.introductory) return <IntroductoryLesson lesson={lesson} />;
  return <div className="core-lesson">
    <section className="lesson-section" id="lesson-context"><h2>1. Бизнес-контекст и проблематика</h2><p>{lesson.business}</p></section>
    <section className="lesson-section" id="lesson-theory"><h2>2. Архитектура и теория</h2>{lesson.theory.map(p => <p key={p}>{p}</p>)}</section>
    <SysadminPractice lessonId={lesson.id} />
    <section className="lesson-section" id="lesson-troubleshooting"><h2>4. Troubleshooting</h2>{lesson.problems.map(([symptom,diagnosis]) => <div key={symptom}><h3>{symptom}</h3><p>{diagnosis}</p></div>)}</section>
    <section className="lesson-section" id="lesson-secops"><h2>5. SecOps и Best Practices</h2><p>{lesson.security}</p></section>

  </div>;
}
