import SysadminPractice from './SysadminPractice';

/* eslint-disable react/prop-types */
export default function IntroductoryLesson({ lesson }) {
  return <div className="core-lesson introductory-lesson">
    <section className="lesson-section" id="lesson-context">
      <span className="eyebrow">ТОЧКА 00 · С САМЫХ АЗОВ</span>
      <h2>1. Зачем нужен этот урок</h2>
      <p>{lesson.business}</p>
      <div className="lesson-lab-preparation"><h3>Что понадобится</h3><p>{lesson.setup}</p></div>
    </section>

    <section className="lesson-section" id="lesson-theory">
      <h2>2. Разбираемся по шагам</h2>
      {lesson.sections.map((section) => <div className="theory-part" key={section.title}>
        <h3>{section.title}</h3>
        {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>)}
    </section>

    <figure className="lesson-diagram">
      <figcaption><strong>Связь понятий</strong></figcaption>
      <ol>{lesson.diagram.map((step) => <li key={step}><span>{step}</span></li>)}</ol>
    </figure>

    <SysadminPractice lessonId={lesson.id} />

    <section className="lesson-section" id="lesson-troubleshooting">
      <h2>4. Если результат отличается</h2>
      {lesson.problems.map(([symptom, diagnosis]) => <div key={symptom}><h3>{symptom}</h3><p>{diagnosis}</p></div>)}
    </section>

    <section className="lesson-section" id="lesson-secops">
      <h2>5. Границы и безопасность</h2><p>{lesson.security}</p>
    </section>


  </div>;
}
