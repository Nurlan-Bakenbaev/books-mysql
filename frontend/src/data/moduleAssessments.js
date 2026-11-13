import { singleModuleQuestions } from './singleModuleQuestions.js';
import { introQuestions } from './introQuestions.js';
import { lessonDetails } from './lessonDetails.js';
import { beginnerLessons, beginnerModuleQuestions } from './core/beginner.js';
export function moduleQuestions(topics) {
  const beginnerIds = beginnerLessons.map((lesson) => lesson.id);
  const isBeginnerModule = topics.length === beginnerIds.length && topics.every((topic, index) => topic.id === beginnerIds[index]);
  const candidates = (isBeginnerModule && beginnerModuleQuestions) || (topics.length === 1 && singleModuleQuestions(topics[0].id)) || (topics.length === 1 && topics[0].id === 'secplus-exam-orientation' ? introQuestions : topics.flatMap(t => {
    const d=lessonDetails[t.id];
    return [
      {...d.question,context:t.title},
      {question:`${t.title}: какое действие соответствует ситуации «${d.caseStudy.situation}»?`,options:[d.caseStudy.action,'Изменить несколько независимых настроек одновременно без записи исходного состояния.','Считать гипотезу доказанной без повторной проверки.'],answer:0,explanation:d.caseStudy.result,context:t.title},
      {question:`${t.title}: какой результат ожидается после разбора ситуации?`,options:[d.caseStudy.result,'Успех команды автоматически доказывает отсутствие всех отказов.','Достаточно отсутствия сообщений об ошибке без функционального теста.'],answer:0,explanation:d.caseStudy.action,context:t.title},
      {question:`${t.title}: какое архитектурное утверждение корректно?`,options:[d.deepDive[0],'Наличие резервной копии освобождает от проверки восстановления.','Административные права всегда нужны всем пользователям сервиса.'],answer:0,explanation:d.deepDive[1],context:t.title},
      {question:`${t.title}: какое объяснение учитывает ограничения технологии?`,options:[d.deepDive[1],'Наличие шифрования автоматически решает все задачи восстановления.','Успешный ping доказывает работоспособность любого приложения.'],answer:0,explanation:d.deepDive[0],context:t.title},
    ];
  }));
  const unique=[...new Map(candidates.map(q=>[q.question,q])).values()];
  if(unique.length<10) throw new Error('В модуле недостаточно предметных вопросов');
  // Deterministic rotation preserves the correct answer after permutation.
  return unique.slice(0,10).map((q,i)=>{const shift=i%q.options.length;return {...q,options:q.options.slice(shift).concat(q.options.slice(0,shift)),answer:(q.answer-shift+q.options.length)%q.options.length};});
}
