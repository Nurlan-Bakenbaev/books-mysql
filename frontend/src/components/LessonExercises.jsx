import { useState } from 'react';
import { lessonExercises } from '../data/lessonExercises';
import { LEARNING_KEY, readJson, saveJson } from '../lib/studyProgress';
/* eslint-disable react/prop-types */
export default function LessonExercises({id}) {
  const [answers,setAnswers]=useState(()=>readJson(LEARNING_KEY,{}).exercises?.[id] || {});
  const [error,setError]=useState('');
  function update(index,value){const next={...answers,[index]:value};setAnswers(next);const all=readJson(LEARNING_KEY,{});if(!saveJson(LEARNING_KEY,{...all,exercises:{...all.exercises,[id]:next}}))setError('Ответ не сохранён: проверьте доступность хранилища.');else setError('');}
  return <section className="lesson-section"><h2>Восемь заданий урока</h2><p>Задание 1 — автоматически проверяемый вопрос в разделе «Тест». Задания 2–8 — письменная практика и самооценка; она не прибавляется к автоматическому баллу.</p>{lessonExercises(id).map((e,i)=><div key={e.title}><h3>{i+2}. {e.title}</h3><label>{e.task}<textarea rows={4} value={answers[i]?.text || ''} onChange={event=>update(i,{...answers[i],text:event.target.value})}/></label>{answers[i]?.text?.trim() && <details><summary>Критерии самопроверки</summary><p>{e.criteria}</p><label>Самооценка <select value={answers[i]?.rating || ''} onChange={event=>update(i,{...answers[i],rating:event.target.value})}><option value="">Выберите</option><option value="meets">Соответствует критериям</option><option value="repeat">Нужно повторить</option></select></label></details>}</div>)}<p role="alert">{error}</p></section>;
}
