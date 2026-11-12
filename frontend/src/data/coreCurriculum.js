import { coreQuestions } from './coreQuestions.js';
import foundations from './core/foundations.js';
import networks from './core/networks.js';
import linux from './core/linux.js';
import windows from './core/windows.js';
import platforms from './core/platforms.js';
import operations from './core/operations.js';
const groups = [
 ['Фундамент', foundations], ['Корпоративные сети', networks], ['Linux-администрирование', linux],
 ['Windows Server', windows], ['Виртуализация и облака', platforms], ['Автоматизация', operations.slice(0,4)], ['SecOps, мониторинг и backup', operations.slice(4)],
];
export const coreLessons = [...foundations, ...networks, ...linux, ...windows, ...platforms, ...operations];
export const coreById = Object.fromEntries(coreLessons.map(l => [l.id,l]));
export const corePhases = groups.map(([title, lessons], i) => ({ id:`core-${i+1}`, number:String(i+1).padStart(2,'0'), title, subtitle:'ОСНОВНАЯ ПРОГРАММА', description:lessons.map(l => l.title).join(' · '), topics:lessons.map(l => ({ id:l.id,title:l.title,description:l.business })) }));
export const coreResources = coreLessons.flatMap(l => l.sources.map((url,i) => ({ id:`core-${l.id}-${i}`,title:`${l.title} · первоисточник ${i+1}`,description:`Документация для инженерного разбора: ${l.title}.`,url,type:'Документация',language:'English',access:'Бесплатно' })));
export const coreReferences = Object.fromEntries(coreLessons.map(l => [l.id,l.sources.map((url,i) => ({ sourceId:`core-${l.id}-${i}`,focus:l.theory[i % l.theory.length],takeaway:l.expected }))]));
export const coreLessonData = Object.fromEntries(coreLessons.map(l => [l.id,{intro:l.business,sections:[{title:'Архитектура и теория',paragraphs:l.theory}],lab:{prerequisites:[l.setup],steps:l.tasks,commands:l.commands,expected:l.expected,pitfalls:[l.security],troubleshooting:l.problems.map(([a,b])=>`${a}: ${b}`),cleanup:['Удалите только созданные в этом опыте объекты по журналу изменений; исходные файлы и учётные записи сохраните.']}}]));
export const coreDetails = Object.fromEntries(coreLessons.map(l => [l.id,{goals:l.tasks.length >= 3 ? l.tasks : [...l.tasks,`Объяснить и диагностировать: ${l.problems[0][0]}.`],deepDive:l.theory,diagram:['Бизнес-требование','Архитектура','Изменение в lab','Проверка и откат'],caseStudy:{situation:l.business,action:l.tasks[0],result:l.expected},question:coreQuestions[l.id] || {question:`${l.title}: что подтверждает успешное выполнение лаборатории?`,options:[l.expected,`Достаточно, что команда не вывела ошибок; прикладную проверку можно пропустить.`,`Состояние процесса автоматически доказывает доступность и безопасность сервиса.`],answer:0,explanation:`Проверяется конкретный результат: ${l.expected}`}}]));
export const coreWalkthroughs = Object.fromEntries(coreLessons.map(l => [l.id,{title:`Практика: ${l.title}`,context:l.setup,steps:[l.setup,...l.tasks,'Сопоставьте фактический результат с критерием приёмки и восстановите исходное состояние lab.'],verification:l.expected,troubleshooting:l.problems.map(([a,b])=>`${a}: ${b}`).join('\n')} ]));
