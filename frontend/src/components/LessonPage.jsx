import { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiBookOpen, FiCheckCircle, FiExternalLink, FiPlay } from 'react-icons/fi';
import { lessonDetails } from '../data/lessonDetails';
import { lessonWalkthroughs } from '../data/lessonWalkthroughs';
import { lessonResources, resourcesById } from '../data/resources';
import { lessonVideos } from '../data/lessonVideos';
import { russianLessonVideos, videoUrls } from '../data/russianLessonVideos';
import { getTrackMeta } from '../data/tracks';
import { lessonHref, sectionHref } from '../navigation';
import Assessment from './Assessment';
import CodeBlock from './CodeBlock';

/* eslint-disable react/prop-types */
function LessonVideo({ video: englishVideo, russianVideo }) {
  // Deliberately not persisted: every lesson opening/reload starts in English.
  const [language, setLanguage] = useState('en');
  const video = language === 'en' ? englishVideo : russianVideo;
  const urls = video ? videoUrls(video) : null;
  return <section className="lesson-section lesson-video-first" id="lesson-video" aria-labelledby="lesson-video-title">
    <span className="eyebrow">ВИДЕОУРОК · YOUTUBE</span><h2 id="lesson-video-title">Начните с видео по теме</h2>
    <div className="video-language-switch" role="group" aria-label="Язык видео">{[['en', 'English'], ['ru', 'Русский']].map(([id, label]) => <button type="button" className="button" key={id} aria-pressed={language === id} onClick={() => setLanguage(id)}>{label}</button>)}</div>
    <p className="video-language-note">По умолчанию — English. Русский материал — отдельное объяснение или курс по теме.</p>
    {video ? <div className="curated-video" key={language}><div className="video-card-heading"><strong>{video.title}</strong><span>{language === 'en' ? 'English' : 'Русский'} · {video.playlistId ? 'Видеокурс' : video.duration || 'Видео'}</span></div>{video.focus && <p>{video.focus}</p>}<p><a href={video.source} target="_blank" rel="noreferrer">Источник: {video.sourceName} <FiExternalLink aria-hidden="true" /></a></p>
      <div className="video-frame"><iframe title={`Видео (${language === 'en' ? 'English' : 'Русский'}): ${video.title}`} src={urls.embed} loading="eager" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
      <div className="video-actions"><a className="button" href={urls.watch} target="_blank" rel="noreferrer"><FiPlay aria-hidden="true" /> {video.playlistId ? 'Открыть курс на YouTube' : 'Открыть на YouTube'} <FiExternalLink aria-hidden="true" /></a></div>
    </div> : <p className="video-unavailable" role="status">Русское видео для этого урока пока не подобрано. Доступны английское видео, русскоязычный текст урока и учебные материалы ниже.</p>}
  </section>;
}

function TerminalWindow({ terminal }) {
  if (!terminal) return null;
  return <figure className="lesson-screenshot lesson-terminal">
    <div className="terminal-window">
      <div className="terminal-titlebar"><span className="terminal-dot dot-red" aria-hidden="true" /><span className="terminal-dot dot-yellow" aria-hidden="true" /><span className="terminal-dot dot-green" aria-hidden="true" /><span className="terminal-title">{terminal.prompt}</span></div>
      <div className="terminal-body">{terminal.lines.map((line, index) => <div className={`terminal-line terminal-${line.type}`} key={`${index}-${line.text}`}>{line.type === 'input' ? <><span className="terminal-prompt">{terminal.prompt}</span> {line.text}</> : line.text}</div>)}</div>
    </div>
    <figcaption>{terminal.caption}</figcaption>
  </figure>;
}

function UiMockup({ mockup }) {
  if (!mockup) return null;
  return <figure className="lesson-screenshot lesson-ui-mockup">
    <div className="ui-mockup">
      <div className="ui-mockup-breadcrumb">{mockup.breadcrumb}</div>
      <div className="ui-mockup-header">{mockup.panelTitle}</div>
      <dl className="ui-mockup-rows">{mockup.rows.map((row) => <div className="ui-mockup-row" key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
    </div>
    <figcaption>{mockup.helpText}</figcaption>
  </figure>;
}

function PracticeTasks({ tasks }) {
  if (!tasks?.length) return null;
  return <section className="lesson-section" id="lesson-extra-practice">
    <span className="eyebrow">ДОПОЛНИТЕЛЬНАЯ ПРАКТИКА</span><h2>Закрепите самостоятельно</h2>
    <p>Не подглядывайте в решение сразу — сначала попробуйте сами, подсказка и решение скрыты под спойлером.</p>
    <ol className="practice-tasks">{tasks.map((item, index) => <li className="practice-task" key={item.task}>
      <p className="practice-task-text"><strong>Задание {index + 1}.</strong> {item.task}</p>
      <details><summary>Показать подсказку</summary><p>{item.hint}</p></details>
      <details><summary>Показать решение</summary><p>{item.solution}</p></details>
    </li>)}</ol>
  </section>;
}

export default function LessonPage({ topic, lesson, isComplete, onToggle, track, previous, next }) {
  const headingRef = useRef(null);
  const detail = lessonDetails[topic.id];
  const walkthrough = lessonWalkthroughs[topic.id];
  const video = lessonVideos[topic.id];
  const meta = getTrackMeta(track);

  useEffect(() => {
    if (window.location.hash === '#lesson-sources') {
      requestAnimationFrame(() => document.getElementById('lesson-sources')?.scrollIntoView());
    } else {
      headingRef.current?.focus();
    }
  }, [topic.id]);

  return <article className="lesson-page" aria-labelledby="lesson-page-title">
    <header className="lesson-page-header">
      <a className="lesson-back" href={sectionHref(meta.hash)} data-route-link><FiArrowLeft aria-hidden="true" /> {meta.back}</a>
      <span className="eyebrow">{meta.label} · ОТДЕЛЬНЫЙ УРОК</span>
      <h1 id="lesson-page-title" ref={headingRef} tabIndex="-1">{topic.title}</h1>
      <p>{lesson.intro}</p>
      <nav className="lesson-jump" aria-label="Разделы урока"><a href="#lesson-video"><FiPlay aria-hidden="true" /> Видео</a><a href="#lesson-theory">Теория</a><a href="#lesson-practice">Практика</a><a href="#lesson-check">Тест</a><a className="lesson-material-link" href="#lesson-sources"><FiBookOpen aria-hidden="true" /> Учебные материалы · {lessonResources[topic.id].length}</a></nav>
    </header>
    <div className="lesson-page-content">
      <LessonVideo key={topic.id} video={video} russianVideo={russianLessonVideos[topic.id]} />
      <section className="lesson-section" id="lesson-goals"><span className="eyebrow">ЦЕЛИ УРОКА</span><h2>После урока вы сможете</h2><ul className="lesson-goals">{detail.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></section>
      <section className="lesson-section" id="lesson-theory"><span className="eyebrow">ТЕОРИЯ ПО ШАГАМ</span><h2>Разбираемся в теме</h2>{lesson.sections.map((section) => <div className="theory-part" key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>)}<div className="theory-part"><h3>Подробный разбор</h3>{detail.deepDive.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
      <figure className="lesson-diagram"><figcaption><strong>Схема процесса</strong></figcaption><ol>{detail.diagram.map((step, index) => <li key={`${step}-${index}`}><span>{step}</span>{index < detail.diagram.length - 1 && <FiArrowRight aria-hidden="true" />}</li>)}</ol></figure>
      <UiMockup mockup={detail.uiMockup} />
      <section className="lesson-section"><span className="eyebrow">ПРИМЕР ИЗ ПРАКТИКИ</span><h2>Разберём ситуацию</h2><p><strong>Ситуация.</strong> {detail.caseStudy.situation}</p><p><strong>Действия.</strong> {detail.caseStudy.action}</p><p><strong>Что должно получиться.</strong> {detail.caseStudy.result}</p></section>
      <section className="lesson-section"><span className="eyebrow">ПОШАГОВЫЙ РАЗБОР</span><h2>{walkthrough.title}</h2><p>{walkthrough.context}</p><ol className="lesson-steps">{walkthrough.steps.map((step) => <li key={step}>{step}</li>)}</ol><div className="lesson-result"><strong>Как проверить результат</strong><p>{walkthrough.verification}</p></div><p><strong>Если результат отличается.</strong> {walkthrough.troubleshooting}</p></section>
      {detail.example && <section className="lesson-section"><span className="eyebrow">ПОЛНЫЙ ПРИМЕР</span><h2>{detail.example.title}</h2><p>{detail.example.introduction}</p><CodeBlock label={detail.example.language} code={detail.example.code} /><div className="lesson-result"><strong>Ожидаемый результат</strong><p>{detail.example.expected}</p></div><p>{detail.example.explanation}</p>{detail.example.screenshot && <figure className="lesson-screenshot"><img src={`${import.meta.env.BASE_URL}study-images/${detail.example.screenshot}`} alt={`Снимок выполнения учебного примера: ${detail.example.expected}`} loading="lazy" /><figcaption>Скриншот выполнения учебного примера. На вашей системе оформление терминала может отличаться.</figcaption></figure>}<TerminalWindow terminal={detail.terminal} /></section>}
      <section className="lesson-section" id="lesson-practice"><span className="eyebrow">ПРАКТИКА</span><h2>Домашняя лаборатория</h2><p>Выполняйте шаги только в изолированной тестовой среде, где у вас есть необходимые права. Не используйте реальные пароли и конфиденциальные данные.</p><ol className="lesson-steps">{lesson.lab.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        {[...(lesson.lab.commands ? [{ label: lesson.lab.commandsLabel || 'КОМАНДЫ', commands: lesson.lab.commands }] : []), ...(lesson.lab.extraCommands || [])].map((block) => <CodeBlock key={block.label} label={block.label} code={block.commands} />)}
        <div className="lesson-result"><strong>Ожидаемый результат</strong><p>{lesson.lab.expected}</p></div><div className="lesson-warning"><strong>На что обратить внимание</strong><ul>{lesson.lab.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul></div>
        {detail.labScreenshot && <figure className="lesson-screenshot"><img src={`${import.meta.env.BASE_URL}study-images/${detail.labScreenshot}`} alt={`Снимок выполнения лабораторной работы: ${lesson.lab.expected}`} loading="lazy" /><figcaption>Скриншот выполнения лабораторного примера в учебной среде.</figcaption></figure>}
        {!detail.example && <TerminalWindow terminal={detail.terminal} />}
      </section>
      <PracticeTasks tasks={detail.practiceTasks} />
      <section className="lesson-section" id="lesson-check"><Assessment key={topic.id} title="Проверьте себя" questions={[detail.question]} /></section>
      <section className="lesson-section lesson-section-secondary" id="lesson-sources"><span className="eyebrow">УЧЕБНЫЕ МАТЕРИАЛЫ · ПЕРВОИСТОЧНИКИ</span><h2>Документация по теме</h2><ol className="lesson-resources">{lessonResources[topic.id].map(({ sourceId, focus, takeaway }) => {
        const resource = resourcesById[sourceId];
        return <li key={sourceId}><a href={resource.url} target="_blank" rel="noreferrer">{resource.title} <FiExternalLink aria-hidden="true" /></a><span>{resource.type} · {resource.language} · {resource.access}</span><p>{focus}</p>{takeaway && <p><strong>Ключевая идея источника:</strong> {takeaway}</p>}</li>;
      })}</ol></section>
      <div className="lesson-completion"><span>{isComplete ? 'Тема отмечена как изученная' : 'Отметьте тему после изучения и выполнения практики'}</span><button className="button button-primary" type="button" onClick={() => onToggle(topic.id)}><FiCheckCircle aria-hidden="true" /> {isComplete ? 'Отменить отметку' : 'Тема изучена'}</button></div>
      <nav className="lesson-neighbors" aria-label="Соседние уроки">{previous ? <a href={lessonHref(previous.id)} data-route-link><FiArrowLeft aria-hidden="true" /> {previous.title}</a> : <span />}{next && <a href={lessonHref(next.id)} data-route-link>{next.title} <FiArrowRight aria-hidden="true" /></a>}</nav>
    </div>
  </article>;
}
