import { useId, useRef, useState } from 'react';
import { gradeSecurityPlus, securityPlusExam, securityPlusPassPercent } from '../data/securityPlusExam';

export default function SecurityPlusExam() {
  const instance = useId();
  const heading = useRef(null);
  const result = useRef(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;
  const grade = gradeSecurityPlus(answers);
  const finish = (event) => {
    event.preventDefault();
    if (answered !== securityPlusExam.length) return;
    setSubmitted(true);
    requestAnimationFrame(() => result.current?.focus());
  };
  const retry = () => {
    setAnswers({}); setSubmitted(false);
    requestAnimationFrame(() => heading.current?.focus());
  };
  return <section className="security-exam assessment" id="security-plus-exam" aria-labelledby={`${instance}-title`}>
    <h2 id={`${instance}-title`} ref={heading} tabIndex="-1">Итоговый экзамен Security+ · 30 вопросов</h2>
    <p>Оригинальные учебные сценарии по пяти доменам: 4 / 7 / 5 / 8 / 6. Один лучший ответ в каждом вопросе. Учебный порог — {securityPlusPassPercent}% (24 из 30); это не шкала официального экзамена CompTIA. Ответы и объяснения появятся после отправки всей попытки.</p>
    <form onSubmit={finish}>
      {submitted && <div className="security-exam-result" ref={result} tabIndex="-1" role="status">
        <h3>Результат: {grade.correct} из 30 · {grade.percent}%</h3>
        <p>{grade.passed ? 'Учебный порог пройден.' : 'Учебный порог не пройден.'} Ошибок: {30 - grade.correct}. Порог: {securityPlusPassPercent}%.</p>
        <p>Ниже показаны ваши ответы, правильные варианты и объяснения каждого решения.</p>
        <button className="button" type="button" onClick={retry}>Повторить экзамен</button>
      </div>}
      {securityPlusExam.map((item, index) => <fieldset className="assessment-question" key={item.question} disabled={submitted}>
        <legend><span className="assessment-context">Домен {item.domain}</span>{index + 1}. {item.question}</legend>
        {item.options.map((option, optionIndex) => <label className="assessment-option" key={option}>
          <input required type="radio" name={`${instance}-${index}`} value={optionIndex} checked={answers[index] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} />
          <span>{option}</span>
        </label>)}
        {submitted && <div className="assessment-feedback" data-correct={answers[index] === item.answer}>
          <p><strong>{answers[index] === item.answer ? 'Верно.' : 'Ошибка.'}</strong> Ваш ответ: {item.options[answers[index]]}</p>
          <p><strong>Правильный ответ:</strong> {item.options[item.answer]}</p><p>{item.explanation}</p>
        </div>}
      </fieldset>)}
      {!submitted && <div className="security-exam-actions"><button type="submit" className="button button-primary" disabled={answered !== 30}>Завершить экзамен</button><span role="status">Отвечено: {answered} из 30</span></div>}
      {submitted && <button className="button" type="button" onClick={retry}>Начать новую попытку</button>}
    </form>
  </section>;
}
