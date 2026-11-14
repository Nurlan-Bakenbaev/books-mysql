import { lessonDetails } from './lessonDetails.js';
import { lessons } from './lessons.js';
import { coreById } from './coreCurriculum.js';
export function lessonExercises(id) {
  const d=lessonDetails[id], l=lessons[id], core=coreById[id];
  if (core?.review) return core.review.map(([title, task, criteria]) => ({ title, task, criteria }));
  return [
    {title:'Объяснение механизма',task:'Объясните основной механизм урока своими словами. Какие компоненты участвуют и как связаны их действия?',criteria:d.deepDive[1]},
    {title:'Практическая ситуация',task:d.caseStudy.situation,criteria:`Действие: ${d.caseStudy.action} Результат: ${d.caseStudy.result}`},
    {title:'Последовательность',task:'Составьте краткий план лаборатории из раздела «Практика»: подготовка, выполнение, проверка и очистка.',criteria:`Укажите предусловия, порядок изменений и критерий: ${core?.expected || l.lab.expected}`},
    {title:'Анализ команды',task:'Выберите одну команду или операцию из блока кода лаборатории. Объясните её входные данные, действие и ожидаемый вывод.',criteria:'Укажите вход, полномочия, изменяемые объекты, stdout/stderr и проверяемый exit status. Сравните со стендом и критерием результата урока.'},
    {title:'Диагностика',task:core ? `${core.problems[0][0]}: предложите гипотезы и различающие проверки.` : `Результат отличается от ожидаемого: ${l.lab.expected} Как проверить входные данные и каждый шаг выполнения?`,criteria:core?.problems[0][1] || l.lab.pitfalls.join(' ')},
    {title:'Доказательство результата',task:`Подготовьте положительный и отрицательный тест для: ${core?.expected || l.lab.expected}`,criteria:'Приложите фактический вывод с временем, конкретный ожидаемый результат и отказ запрещённого действия. PID или открытый порт сами по себе недостаточны.'},
    {title:'Очистка и перенос',task:`Перечислите созданные объекты лаборатории и точный план возврата. Какие параметры потребуют изменения на другом стенде?`,criteria:(l.lab.cleanup || [core?.security || l.lab.pitfalls.join(' ')]).join(' ')},
  ];
}
