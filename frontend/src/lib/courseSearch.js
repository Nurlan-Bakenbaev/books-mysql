import { securityVideoTopics } from '../data/securityVideoTopics.js';
import { lessons } from '../data/lessons.js';
import { courseCatalog } from '../data/catalog.js';
import { resources } from '../data/resources.js';
import { terms } from '../data/guide.js';
import { lessonHref, viewHref } from '../navigation.js';
import { createFuzzySearch } from './search.js';

export const courseSearchItems = [
  ...securityVideoTopics.map(v=>({id:`video:${v.id}`,kind:'Тема видео',title:v.title,description:v.note,context:`Security+ ${v.objective}`,href:`?lesson=${v.lessonId}#${v.anchor}`})),
  ...courseCatalog.flatMap((course) => course.topics.map((topic) => ({
    id: `lesson:${topic.id}`, kind: 'Урок', title: topic.title,
    description: topic.description, context: course.title, href: lessonHref(topic.id),
  }))),
  ...terms.map((term) => ({
    id: `term:${term.id}`, kind: 'Термин', title: term.name,
    description: term.short, context: term.category,
    href: `${viewHref('glossary')}&term=${encodeURIComponent(term.id)}`,
  })),
  ...resources.map((resource) => ({
    id: `source:${resource.id}`, kind: 'Источник', title: resource.title,
    description: resource.description, context: resource.type, href: resource.url, external: true,
  })),
];
const fuzzySearch = createFuzzySearch(courseSearchItems, [
  { name: 'title', weight: 0.7 }, { name: 'description', weight: 0.2 }, { name: 'context', weight: 0.1 },
]);

export function searchCourse(query) { const fuzzy=fuzzySearch(query); const q=query.trim().toLocaleLowerCase(); if(q.length<3)return fuzzy; const ids=new Set(fuzzy.map(x=>x.id)); return [...fuzzy,...courseSearchItems.filter(item=>item.id.startsWith("lesson:") && !ids.has(item.id) && JSON.stringify(lessons[item.id.slice(7)]).toLocaleLowerCase().includes(q))]; }
