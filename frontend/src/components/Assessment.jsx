import { ASSESSMENT_KEY, readJson, saveJson, readAssessment, fingerprint } from '../lib/studyProgress';
import { useId, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';

/* eslint-disable react/prop-types */
export default function Assessment({ title, questions, storageId = '', historyTitle = '' }) {
  const instanceId = useId();
  const assessmentId = storageId || title;
  const saved = readAssessment(assessmentId, questions);
  const [answers, setAnswers] = useState(saved.answers);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);
  const correct = questions.filter((item, index) => answers[index] === item.answer).length;
  const unanswered = questions.filter((_, index) => answers[index] === undefined).length;

  return <section className="assessment" aria-labelledby={`${instanceId}-title`}>
    <h3 id={`${instanceId}-title`}>{title}</h3>
    <p>Выберите ответы и проверьте объяснения. Тест можно пройти повторно.</p>
    {questions.map((item, index) => <fieldset className="assessment-question" key={`${instanceId}-${index}`}>
      <legend>{item.context && <span className="assessment-context">{item.context}</span>}{index + 1}. {item.question}</legend>
      {item.options.map((option, optionIndex) => <label className="assessment-option" key={option}>
        <input type="radio" name={`${instanceId}-${index}`} checked={answers[index] === optionIndex} onChange={() => { const next = { ...answers, [index]: optionIndex }; setAnswers(next); setChecked(false); const all = readJson(ASSESSMENT_KEY, {}); if (!saveJson(ASSESSMENT_KEY, { ...all, [assessmentId]: { ...readAssessment(assessmentId, questions), answers: next, fingerprint: fingerprint(questions) } })) setError('Ответ не сохранён: хранилище недоступно.'); }} />
        <span>{option}</span>
      </label>)}
      {checked && <p className="assessment-feedback" data-correct={answers[index] === item.answer}>
        <strong>{answers[index] === undefined ? 'Ответ не выбран.' : answers[index] === item.answer ? 'Верно.' : 'Неверно.'}</strong> {item.explanation}
      </p>}
    </fieldset>)}
    <button className="button button-primary" type="button" disabled={unanswered > 0 || checked} onClick={() => { setChecked(true); const all = readJson(ASSESSMENT_KEY, {}); const attempts = [...readAssessment(assessmentId, questions).attempts, { title: historyTitle || title, date: new Date().toISOString(), score: correct, total: questions.length }]; if (!saveJson(ASSESSMENT_KEY, { ...all, [assessmentId]: { answers, fingerprint: fingerprint(questions), attempts } })) setError('Результат не сохранён: хранилище недоступно.'); }}><FiCheckCircle aria-hidden="true" /> Проверить ответы</button>
    {checked && <button className="button" onClick={() => { setAnswers({}); setChecked(false); const all=readJson(ASSESSMENT_KEY,{}); if(!saveJson(ASSESSMENT_KEY,{...all,[assessmentId]:{...readAssessment(assessmentId,questions),answers:{},fingerprint:fingerprint(questions)}}))setError('Новая попытка не сохранена.'); }}>Повторить тест</button>}
    <p role="alert">{error}</p>
    <p className="assessment-score" role="status">{checked ? `Правильных ответов: ${correct} из ${questions.length}.${unanswered ? ` Без ответа: ${unanswered}.` : ''}` : ''}</p>
  </section>;
}
