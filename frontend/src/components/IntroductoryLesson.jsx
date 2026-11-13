import CodeBlock from './CodeBlock';

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

    <section className="lesson-section" id="lesson-practice">
      <h2>3. Практика без лишнего риска</h2>
      {lesson.platformGuides?.map((guide) => <details className="beginner-guide" key={guide.title}>
        <summary>{guide.title}</summary>
        <ol className="lesson-steps">{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </details>)}
      <h3>Общий порядок</h3>
      <ol className="lesson-steps">{lesson.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      {lesson.commands && (lesson.commandsOptional ? <details className="beginner-guide"><summary>Необязательные команды после практики через интерфейс</summary><CodeBlock label="НЕОБЯЗАТЕЛЬНАЯ ПРОВЕРКА" code={lesson.commands} /></details> : <CodeBlock label="КОМАНДЫ УЧЕБНОГО СТЕНДА" code={lesson.commands} />)}
      <div className="lesson-result"><strong>Как проверить результат</strong><p>{lesson.expected}</p></div>
      <p>Текст урока и успешная сборка сайта не подтверждают выполнение лаборатории на вашей машине. Сохраняйте фактический вывод и отмечайте ограничения стенда.</p>
    </section>

    <section className="lesson-section" id="lesson-troubleshooting">
      <h2>4. Если результат отличается</h2>
      {lesson.problems.map(([symptom, diagnosis]) => <div key={symptom}><h3>{symptom}</h3><p>{diagnosis}</p></div>)}
    </section>

    <section className="lesson-section" id="lesson-secops">
      <h2>5. Границы и безопасность</h2><p>{lesson.security}</p>
    </section>

    <section className="lesson-section" id="lesson-independent">
      <h2>6. Закрепите самостоятельно</h2>
      <ol>{lesson.tasks.map((task) => <li key={task}>{task}</li>)}</ol>
      <p>В отчёте отделите то, что прочитали, от того, что выполнили и проверили самостоятельно.</p>
    </section>
  </div>;
}
