import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowLeft, FiBookOpen, FiCheckCircle } from 'react-icons/fi';
import { Button } from './ui/button';
import VideoPlayer from './VideoPlayer';

gsap.registerPlugin(ScrollTrigger);

export type CourseTopic = {
  id: string; title: string; pdfPage: number; summary: string;
  scenes: { title: string; body: string; diagram?: string }[];
  terms: { term: string; definition: string }[];
  youtube: { queriesRu: string[]; queriesEn: string[] };
  quiz: { question: string; options: string[]; answer: number; explanation: string }[];
};
type Props = { topic: CourseTopic; onClose: () => void; onOpenBookPage: (page: number) => void };

export default function InteractiveLesson({ topic, onClose, onOpenBookPage }: Props) {
  const lessonRef = useRef<HTMLElement>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setAnswers({});
    setChecked(false);
    lessonRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }, [topic.id, reducedMotion]);

  useEffect(() => {
    if (!lessonRef.current || reducedMotion) return;
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.course-scene').forEach((scene) => {
        const indicator = scene.querySelector('.course-scene-indicator');
        if (!indicator) return;
        gsap.fromTo(indicator, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: 'left center', ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top 80%', end: 'bottom 35%', scrub: true },
        });
      });
      const media = gsap.matchMedia();
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const rail = lessonRef.current?.querySelector('.course-story-rail');
        const scenes = lessonRef.current?.querySelector('.course-story-layout');
        if (rail && scenes) ScrollTrigger.create({ trigger: scenes, pin: rail, start: 'top 18%', end: 'bottom 65%', pinSpacing: false });
      });
      return () => media.revert();
    }, lessonRef);
    ScrollTrigger.refresh();
    return () => context.revert();
  }, [topic.id, reducedMotion]);

  return <article className="course-lesson" id="course-lesson" ref={lessonRef} aria-labelledby="course-lesson-title">
    <header className="course-lesson-header"><span className="eyebrow">ИНТЕРАКТИВНЫЙ УРОК · PDF СТР. {topic.pdfPage}</span><h3 id="course-lesson-title">{topic.title}</h3><p>{topic.summary}</p><div className="course-lesson-controls"><Button variant="outline" type="button" onClick={onClose}><FiArrowLeft /> Все главы</Button><Button type="button" onClick={() => onOpenBookPage(topic.pdfPage)}><FiBookOpen /> Открыть оригинал</Button></div></header>
    <div className="course-lesson-body"><div className="course-story-layout"><aside className="course-story-rail" aria-hidden="true"><span>ПРОЧИТАЙТЕ</span><strong>{String(topic.scenes.length).padStart(2, '0')}</strong><small>СЦЕНЫ</small></aside><div className="course-scene-list">{topic.scenes.map((scene, index) => <motion.section className="course-scene" key={`${topic.id}-${index}`} initial={reducedMotion ? false : { y: 12 }} whileInView={reducedMotion ? undefined : { y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.35 }}>
      <span className="course-scene-number">СЦЕНА {String(index + 1).padStart(2, '0')}</span><h4>{scene.title}</h4><p>{scene.body}</p>
      {scene.diagram && <div className="course-diagram" aria-label={`Схема: ${scene.diagram}`}>{scene.diagram.split('→').map((item, i, items) => <span key={`${item}-${i}`}>{item.trim()}{i < items.length - 1 && <span aria-hidden="true"> →</span>}</span>)}</div>}
      <div className="course-scene-track" aria-hidden="true"><span className="course-scene-indicator" /></div>
    </motion.section>)}</div></div>
    {topic.terms.length > 0 && <section className="course-terms"><h3>Термины в этой главе</h3><dl>{topic.terms.map(({ term, definition }) => <div className="course-term" key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></section>}
    <VideoPlayer key={topic.id} topicId={topic.id} queriesRu={topic.youtube.queriesRu} queriesEn={topic.youtube.queriesEn} />
    <section className="course-quiz" aria-labelledby="quiz-title"><h3 id="quiz-title">Проверьте себя</h3><p>Выберите ответы, затем проверьте объяснения.</p>{topic.quiz.map((item, index) => <fieldset className="course-question" key={`${topic.id}-${index}`}><legend>{item.question}</legend>{item.options.map((option, optionIndex) => <label className="course-quiz-option" key={option}><input type="radio" name={`quiz-${topic.id}-${index}`} checked={answers[index] === optionIndex} onChange={() => { setAnswers((previous) => ({ ...previous, [index]: optionIndex })); setChecked(false); }} />{option}</label>)}{checked && <p className="course-quiz-feedback" data-correct={answers[index] === item.answer} role="status">{answers[index] === undefined ? 'Ответ не выбран. ' : answers[index] === item.answer ? 'Верно. ' : 'Попробуйте ещё раз. '}{item.explanation}</p>}</fieldset>)}<Button type="button" onClick={() => setChecked(true)}><FiCheckCircle /> Проверить ответы</Button></section>
    </div>
  </article>;
}
