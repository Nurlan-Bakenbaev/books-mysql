import { coreProcedures } from '../data/coreProcedures';
import CodeBlock from './CodeBlock';
/* eslint-disable react/prop-types */
export default function CoreLesson({ lesson }) {
  return <div className="core-lesson">
    <section className="lesson-section" id="lesson-context"><h2>1. Бизнес-контекст и проблематика</h2><p>{lesson.business}</p></section>
    <section className="lesson-section" id="lesson-theory"><h2>2. Архитектура и теория</h2>{lesson.theory.map(p => <p key={p}>{p}</p>)}</section>
    <section className="lesson-section" id="lesson-practice"><h2>3. Step-by-Step практика</h2><h3>Стенд и предусловия</h3><p>{lesson.setup}</p><h3>Выполнение</h3><ol className="lesson-steps">{coreProcedures[lesson.id].map(step=><li key={step}>{step}</li>)}</ol><p>Сначала проверьте существующие объекты и свободные пути. Команды с префиксом # — пояснения и конфигурационные фрагменты: создайте указанные файлы до запуска последующих команд. Не перезаписывайте существующие файлы.</p><CodeBlock label="LAB · КОМАНДЫ И КОНФИГУРАЦИЯ" code={lesson.commands} /><h3>Ожидаемый результат</h3><p>{lesson.expected}</p><p>Полный запуск этой лаборатории на вашей платформе подтверждается только её фактическим выполнением. Текст урока сам по себе не подтверждает испытание стенда.</p></section>
    <section className="lesson-section" id="lesson-troubleshooting"><h2>4. Troubleshooting</h2>{lesson.problems.map(([symptom,diagnosis]) => <div key={symptom}><h3>{symptom}</h3><p>{diagnosis}</p></div>)}</section>
    <section className="lesson-section" id="lesson-secops"><h2>5. SecOps и Best Practices</h2><p>{lesson.security}</p></section>
    <section className="lesson-section" id="lesson-independent"><h2>6. Самостоятельная лаборатория</h2><ol>{lesson.tasks.map(task => <li key={task}>{task}</li>)}</ol><p>В отчёте: исходная конфигурация, команды, фактический вывод, положительная и отрицательная проверки, точный перечень созданных объектов и результат очистки. Самооценка не равна автоматическому баллу теста.</p></section>
  </div>;
}
