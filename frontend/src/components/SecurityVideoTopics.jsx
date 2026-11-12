import { useEffect } from 'react';
import { securityVideoTopics } from '../data/securityVideoTopics';
/* eslint-disable react/prop-types */
export default function SecurityVideoTopics({lessonId}) {
 const topics=securityVideoTopics.filter(v=>v.lessonId===lessonId);
 useEffect(()=>{const open=()=>{const element=document.getElementById(location.hash.slice(1));if(element instanceof HTMLDetailsElement){element.open=true;element.scrollIntoView();}};const timer=setTimeout(open,300);window.addEventListener('hashchange',open);return()=>{clearTimeout(timer);window.removeEventListener('hashchange',open);};},[lessonId]);
 if(!topics.length)return null;
 return <section className="lesson-section"><h2>Темы Professor Messer · авторский конспект</h2><p>Публичные названия и ID сверены с каталогом источника. Эти пояснения написаны для курса; они не являются транскриптами. Воспроизведение всех роликов не подтверждено.</p>{topics.map(v=><details id={v.anchor} key={v.id}><summary>{v.objective} · {v.title}</summary><p>{v.note}</p><p><strong>Правило:</strong> {v.rule}</p><p><strong>Пример:</strong> {v.example}</p><a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer">Видео · {v.duration}</a></details>)}</section>;
}
export function SecurityPlusSyllabus(){return <section className="lesson-section"><h2>121 тема с видео и авторскими объяснениями</h2><p>37 практических уроков с лабораториями. Введение и пять доменов; 29 пунктов программы, включая 4.9 — анализ журналов. Это не 121 самостоятельная лаборатория.</p><details><summary>Открыть индекс всех 121 тем</summary><ol>{securityVideoTopics.map(v=><li key={v.id}><a href={`?lesson=${v.lessonId}#${v.anchor}`} data-route-link>{v.objective} · {v.title}</a></li>)}</ol></details></section>;}
