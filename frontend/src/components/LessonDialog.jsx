import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiCopy, FiX } from 'react-icons/fi';

/* eslint-disable react/prop-types */
export default function LessonDialog({ topic, lesson, isComplete, onToggle, onClose, triggerRef }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    if (topic && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
      closeRef.current?.focus();
    }
  }, [topic]);

  async function copyCommands() {
    try {
      await navigator.clipboard.writeText(lesson.lab.commands);
      setCopyStatus('Команды скопированы');
    } catch {
      setCopyStatus('Выделите команды и скопируйте их вручную');
    }
  }

  return <dialog className="lesson-dialog" ref={dialogRef} aria-labelledby="lesson-title" onClose={() => { onClose(); triggerRef.current?.focus(); }}>
    {topic && lesson && <>
      <header className="lesson-header"><div><span className="eyebrow">УРОК / ТЕОРИЯ И ПРАКТИКА</span><h2 id="lesson-title">{topic.title}</h2></div><button className="lesson-close" ref={closeRef} type="button" aria-label="Закрыть урок" onClick={() => dialogRef.current?.close()}><FiX aria-hidden="true" /></button></header>
      <div className="lesson-body"><p className="lesson-intro">{lesson.intro}</p>
        {lesson.sections.map((section) => <section className="lesson-section" key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
        <section className="lesson-section"><span className="eyebrow">ПРАКТИКА</span><h3>Домашняя лаборатория</h3><p>Выполняйте шаги в тестовой среде, где у вас есть необходимые права.</p><ol className="lesson-steps">{lesson.lab.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          {lesson.lab.commands && <div className="lesson-code"><div className="lesson-code-heading"><span>КОМАНДЫ</span><button type="button" onClick={copyCommands}><FiCopy aria-hidden="true" /> Копировать</button></div><pre><code>{lesson.lab.commands}</code></pre><span role="status">{copyStatus}</span></div>}
          <div className="lesson-result"><strong>Ожидаемый результат</strong><p>{lesson.lab.expected}</p></div>
          <div className="lesson-warning"><strong>На что обратить внимание</strong><ul>{lesson.lab.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul></div>
        </section>
      </div><footer className="lesson-actions"><span>{isComplete ? 'Тема отмечена как изученная' : 'Отметьте тему, когда изучите материал'}</span><button className="button button-primary" type="button" onClick={() => onToggle(topic.id)}><FiCheckCircle aria-hidden="true" /> {isComplete ? 'Отменить отметку' : 'Тема изучена'}</button></footer>
    </>}
  </dialog>;
}
