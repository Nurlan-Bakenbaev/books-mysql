import { useEffect, useRef, useState } from 'react';
import { FiCheckCircle, FiCopy, FiExternalLink, FiX } from 'react-icons/fi';
import { lessonResources, resourcesById } from '../data/resources';

/* eslint-disable react/prop-types */
export default function LessonDialog({ topic, lesson, isComplete, onToggle, onClose, triggerRef }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [copyStatus, setCopyStatus] = useState({ index: -1, message: '' });

  useEffect(() => {
    if (topic && dialogRef.current && !dialogRef.current.open) {
      setCopyStatus({ index: -1, message: '' });
      dialogRef.current.showModal();
      closeRef.current?.focus();
    }
  }, [topic]);

  async function copyCommands(commands, index) {
    try {
      await navigator.clipboard.writeText(commands);
      setCopyStatus({ index, message: 'Команды скопированы' });
    } catch {
      setCopyStatus({ index, message: 'Выделите команды и скопируйте их вручную' });
    }
  }

  return <dialog className="lesson-dialog" ref={dialogRef} aria-labelledby="lesson-title" onClose={() => { onClose(); if (triggerRef.current?.isConnected) triggerRef.current.focus(); else document.getElementById('roadmap-heading')?.focus(); }}>
    {topic && lesson && <>
      <header className="lesson-header"><div><span className="eyebrow">УРОК / ТЕОРИЯ И ПРАКТИКА</span><h2 id="lesson-title">{topic.title}</h2></div><button className="lesson-close" ref={closeRef} type="button" aria-label="Закрыть урок" onClick={() => dialogRef.current?.close()}><FiX aria-hidden="true" /></button></header>
      <div className="lesson-body"><p className="lesson-intro">{lesson.intro}</p>
        {lesson.sections.map((section) => <section className="lesson-section" key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}
        <section className="lesson-section"><span className="eyebrow">ИЗУЧИТЕ ИСТОЧНИКИ</span><h3>Материалы к этому шагу</h3><p>Используйте объяснение выше как основу, затем изучите указанные разделы и выполните лабораторную работу.</p><ol className="lesson-resources">{lessonResources[topic.id].map(({ sourceId, focus, takeaway }) => {
          const resource = resourcesById[sourceId];
          return <li key={sourceId}><a href={resource.url} target="_blank" rel="noreferrer">{resource.title} <FiExternalLink aria-hidden="true" /></a><span>{resource.type} · {resource.language} · {resource.access}</span><p>{focus}</p>{takeaway && <p><strong>Ключевая идея источника:</strong> {takeaway}</p>}</li>;
        })}</ol></section>
        <section className="lesson-section"><span className="eyebrow">ПРАКТИКА</span><h3>Домашняя лаборатория</h3><p>Выполняйте шаги в тестовой среде, где у вас есть необходимые права.</p><ol className="lesson-steps">{lesson.lab.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          {[...(lesson.lab.commands ? [{ label: lesson.lab.commandsLabel || 'КОМАНДЫ', commands: lesson.lab.commands }] : []), ...(lesson.lab.extraCommands || [])].map((block, index) => <div className="lesson-code" key={block.label}><div className="lesson-code-heading"><span>{block.label}</span><button type="button" aria-label={`Копировать: ${block.label}`} onClick={() => copyCommands(block.commands, index)}><FiCopy aria-hidden="true" /> Копировать</button></div><pre><code>{block.commands}</code></pre><span role="status">{copyStatus.index === index ? copyStatus.message : ''}</span></div>)}
          <div className="lesson-result"><strong>Ожидаемый результат</strong><p>{lesson.lab.expected}</p></div>
          <div className="lesson-warning"><strong>На что обратить внимание</strong><ul>{lesson.lab.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul></div>
        </section>
      </div><footer className="lesson-actions"><span>{isComplete ? 'Тема отмечена как изученная' : 'Отметьте тему, когда изучите материал'}</span><button className="button button-primary" type="button" onClick={() => onToggle(topic.id)}><FiCheckCircle aria-hidden="true" /> {isComplete ? 'Отменить отметку' : 'Тема изучена'}</button></footer>
    </>}
  </dialog>;
}
