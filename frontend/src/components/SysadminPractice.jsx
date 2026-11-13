import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { sysadminPractices } from '../data/sysadminPractices';
import './SysadminPractice.css';

/* eslint-disable react/prop-types */
// Shared by every Sysadmin practice; source is rendered as text, never HTML.
export function SysadminCodeBlock({ block }) {
  const [status, setStatus] = useState('');
  const kind = { command: 'Команда', config: 'Файл / пример', output: 'Результат' }[block.kind];
  async function copy() {
    try {
      await navigator.clipboard.writeText(block.code);
      setStatus('Скопировано');
    } catch {
      setStatus('Копирование недоступно. Выделите текст и скопируйте вручную.');
    }
  }
  return <figure className="sysadmin-code" data-kind={block.kind}>
    <figcaption><span><strong>{kind} · {block.language}</strong><span>{block.title}</span></span>
      <button type="button" onClick={copy} aria-label={`Копировать: ${block.title}`}><FiCopy aria-hidden="true" /> Копировать</button>
    </figcaption>
    <pre tabIndex={0} aria-label={`${kind}: ${block.title}`}><code className={`language-${block.language}`}>{block.code}</code></pre>
    <span className="sysadmin-copy-status" role="status" aria-live="polite">{status}</span>
  </figure>;
}

export default function SysadminPractice({ lessonId }) {
  const doc = sysadminPractices[lessonId];
  if (!doc) return null;
  return <section className="lesson-section sysadmin-practice" id="lesson-practice" aria-labelledby="sysadmin-practice-title">
    <span className="eyebrow">SYSADMIN · ЛАБОРАТОРНАЯ РАБОТА</span>
    <h2 id="sysadmin-practice-title">Практика: {doc.title}</h2>
    <nav className="sysadmin-practice-nav" aria-label="Разделы практики">
      <a href="#practice-execution">Выполнение</a><a href="#practice-commands">Команды</a><a href="#practice-verification">Проверка</a><a href="#practice-cleanup">Очистка</a>
    </nav>
    <h3>1. Цель работы</h3><p>{doc.goal}</p>
    <h3>2. Что понадобится</h3><ul>{doc.requirements.map(item => <li key={item}>{item}</li>)}</ul>
    <div className="sysadmin-safety"><h3>3. Безопасность и ограничения</h3><ul>{doc.safety.map(item => <li key={item}>{item}</li>)}</ul></div>
    <h3>4. Практический сценарий</h3><p>{doc.scenario}</p>
    <h3 id="practice-execution">5. Пошаговое выполнение</h3><ol className="sysadmin-steps">{doc.steps.map(item => <li key={item}>{item}</li>)}</ol>
    <h3 id="practice-commands">6. Команды и примеры</h3>
    <p>Выполняйте командные блоки по порядку в указанной среде. Блоки «Файл / пример» сохраните в указанные файлы, а не вставляйте в терминал. Ожидаемый вывод не является командой.</p>
    {doc.blocks.map((block, index) => <SysadminCodeBlock key={index} block={block} />)}
    <h3>7. Ожидаемый результат</h3><p>{doc.expected}</p>
    {doc.output && <><p>Образец ключевых строк; значения вашего стенда могут отличаться. Это иллюстрация, а не журнал выполненной лаборатории.</p><SysadminCodeBlock block={{ language: 'text', title: 'Образец ожидаемого вывода', code: doc.output, kind: 'output' }} /></>}
    <h3 id="practice-verification">8. Проверка результата</h3><ul>{doc.verification.map(item => <li key={item}>{item}</li>)}</ul>
    <h3>9. Типичные ошибки и их исправление</h3><dl className="sysadmin-troubleshooting">{doc.troubleshooting.map(item => <div key={item.symptom}><dt>{item.symptom}</dt><dd>{item.fix}</dd></div>)}</dl>
    <h3 id="practice-cleanup">10. Очистка или возврат изменений</h3><p>{doc.cleanup}</p>
    <p>Очистку выполняйте после сохранения отчёта. Сверьте каждый путь с журналом созданных объектов; если открыли новый терминал, сначала восстановите записанные пути. После очистки проверьте отсутствие только своих объектов и сохранность исходного состояния.</p>
    {doc.cleanupBlocks.map((block, index) => <SysadminCodeBlock key={index} block={block} />)}
    <h3>11. Что сохранить в отчёт</h3><ul>{doc.report.map(item => <li key={item}>{item}</li>)}</ul>
  </section>;
}
