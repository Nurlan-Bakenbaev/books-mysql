import { useId, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

/* eslint-disable react/prop-types */
export default function Assessment({ title, questions }) {
  const instanceId = useId();
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const correct = questions.filter((item, index) => answers[index] === item.answer).length;
  const unanswered = questions.filter((_, index) => answers[index] === undefined).length;

  return <section className="assessment" aria-labelledby={`${instanceId}-title`}>
    <h3 id={`${instanceId}-title`}>{title}</h3>
    <p>Выберите ответы и проверьте объяснения. Тест можно пройти повторно.</p>
    {questions.map((item, index) => <fieldset className="assessment-question" key={`${instanceId}-${index}`}>
      <legend>{item.context && <span className="assessment-context">{item.context}</span>}{index + 1}. {item.question}</legend>
      {item.options.map((option, optionIndex) => <label className="assessment-option" key={option}>
        <input type="radio" name={`${instanceId}-${index}`} checked={answers[index] === optionIndex} onChange={() => { setAnswers((current) => ({ ...current, [index]: optionIndex })); setChecked(false); }} />
        <span>{option}</span>
      </label>)}
      {checked && <p className="assessment-feedback" data-correct={answers[index] === item.answer}>
        <strong>{answers[index] === undefined ? 'Ответ не выбран.' : answers[index] === item.answer ? 'Верно.' : 'Неверно.'}</strong> {item.explanation}
      </p>}
    </fieldset>)}
    <button className="button button-primary" type="button" onClick={() => setChecked(true)}><FiCheckCircle aria-hidden="true" /> Проверить ответы</button>
    <p className="assessment-score" role="status">{checked ? `Правильных ответов: ${correct} из ${questions.length}.${unanswered ? ` Без ответа: ${unanswered}.` : ''}` : ''}</p>
  </section>;
}
