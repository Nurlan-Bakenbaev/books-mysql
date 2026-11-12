import { useState } from 'react';
import { LEARNING_KEY, readJson, saveJson } from '../lib/studyProgress';
/* eslint-disable react/prop-types */
export default function LabCompletion({id}){const [done,setDone]=useState(()=>Boolean(readJson(LEARNING_KEY,{}).labs?.[id]));const [error,setError]=useState('');return <div className="lesson-section"><label><input type="checkbox" checked={done} onChange={e=>{const next=e.target.checked;const all=readJson(LEARNING_KEY,{});if(saveJson(LEARNING_KEY,{...all,labs:{...all.labs,[id]:next}})){setDone(next);setError('');}else setError('Отметка не сохранена.');}}/> Лаборатория выполнена и результат проверен</label><p>Эта отметка отдельна от прочтения темы и результата теста.</p><p role="alert">{error}</p></div>;}
