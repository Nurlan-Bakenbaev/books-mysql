import { useState } from 'react';
import { courseCatalog } from '../data/catalog';
import { LEARNING_KEY, ASSESSMENT_KEY, readJson, saveJson, exportStudy, importStudy } from '../lib/studyProgress';
export default function LearningPanel() {
  const [learning, setLearning] = useState(() => readJson(LEARNING_KEY, {}));
  const [message, setMessage] = useState('');
  const [importText, setImportText] = useState('');
  const course = courseCatalog.find(c => c.id === learning.course) || courseCatalog[0];
  const attempts = Object.values(readJson(ASSESSMENT_KEY, {})).flatMap(a => a.attempts || []).sort((a,b) => b.date.localeCompare(a.date));
  function choose(id) { const next = { ...learning, course: id }; if (saveJson(LEARNING_KEY, next)) { setLearning(next); setMessage('Курс сохранён'); window.dispatchEvent(new Event('study-progress-changed')); } else setMessage('Не удалось сохранить курс'); }
  function download() { const url = URL.createObjectURL(new Blob([JSON.stringify(exportStudy(), null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'sysadmin-progress.json'; a.click(); URL.revokeObjectURL(url); }
  return <section className="lesson-section"><h2>Мой маршрут и история</h2><label>Основной курс <select value={course.id} onChange={e => choose(e.target.value)}>{courseCatalog.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></label><p><a href={`?lesson=${learning.last?.[course.id] || course.topics[0].id}`} data-route-link>Продолжить выбранный курс</a></p><button className="button" onClick={download}>Экспорт JSON</button><label>Импорт прогресса (JSON)<textarea value={importText} onChange={e => setImportText(e.target.value)} /></label><button className="button" onClick={() => { try { importStudy(JSON.parse(importText)); setLearning(readJson(LEARNING_KEY, {})); setMessage('Прогресс объединён.'); window.dispatchEvent(new Event('study-progress-changed')); } catch (e) { setMessage(e.message); } }}>Объединить прогресс</button><p role="status">{message}</p><p>Дней занятий: {learning.days?.length || 0} · Проверенных лабораторий: {Object.values(learning.labs || {}).filter(Boolean).length}</p><h3>История попыток</h3>{attempts.length ? <ul>{attempts.map((a,i) => <li key={i}>{a.date.slice(0,10)} · {a.title}: {a.score}/{a.total}{a.score / a.total < .8 ? ' · Нужно повторить' : ''}</li>)}</ul> : <p>Попыток пока нет.</p>}</section>;
}
