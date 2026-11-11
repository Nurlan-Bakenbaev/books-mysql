import { courseCatalog } from '../data/catalog.js';
import { resources } from '../data/resources.js';
import { terms } from '../data/guide.js';
import { lessonHref, viewHref } from '../navigation.js';
import { createFuzzySearch } from './search.js';

export const courseSearchItems = [
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
export const searchCourse = createFuzzySearch(courseSearchItems, [
  { name: 'title', weight: 0.7 }, { name: 'description', weight: 0.2 }, { name: 'context', weight: 0.1 },
]);
