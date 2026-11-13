import adminBasics from './adminBasics.js';
import beginnerLinux from './beginnerLinux.js';
import beginnerNetworks from './beginnerNetworks.js';

export const beginnerLessons = [adminBasics, ...beginnerLinux, ...beginnerNetworks].map((lesson) => ({
  ...lesson,
  introductory: true,
  theory: lesson.sections.flatMap((section) => section.paragraphs),
  diagram: lesson.diagram || ['Понятие', 'Наблюдение', 'Безопасное действие', 'Проверяемый результат'],
}));

export const beginnerQuestions = {
  'admin-engineering': { question: 'Где сохраняется содержимое notes.txt после штатного выключения компьютера?', options: ['На накопителе в файловой системе', 'Только в оперативной памяти', 'В процессоре'], answer: 0, explanation: 'RAM хранит рабочие данные временно, а файл после сохранения находится на накопителе.' },
  'first-linux-vm': { question: 'Что является гостевой операционной системой в лаборатории?', options: ['Ubuntu внутри VirtualBox', 'Основная ОС физического компьютера', 'ISO-файл после завершения установки'], answer: 0, explanation: 'Ubuntu работает как гость на виртуальном оборудовании, которое предоставляет VirtualBox.' },
  'linux-first-commands': { question: 'Чем оператор >> отличается от >?', options: ['>> дописывает, а > заменяет содержимое файла', '>> удаляет каталог', '> только читает файл'], answer: 0, explanation: 'Оба оператора перенаправляют вывод, но > открывает файл на замену, а >> — на добавление.' },
  'linux-first-permissions': { question: 'Что означает режим файла 640?', options: ['Владелец rw, группа r, остальные без прав', 'Все пользователи rwx', 'Только root может читать'], answer: 0, explanation: 'Цифры 6, 4 и 0 описывают права владельца, группы и остальных соответственно.' },
  'linux-first-services': { question: 'Что лучше всего подтверждает работу локального Nginx?', options: ['Ожидаемый HTTP-ответ curl', 'Только наличие процесса', 'Только успешный ping'], answer: 0, explanation: 'Прикладной запрос проверяет полезный результат; PID и ICMP не проверяют HTTP-содержимое.' },
  'network-first-steps': { question: 'Что доказывает успешный ping 127.0.0.1?', options: ['Работу локального IP-стека', 'Доступность любого сайта', 'Исправность физического кабеля'], answer: 0, explanation: 'Loopback остаётся внутри машины и не проверяет внешнюю сеть или приложение.' },
  'ssh-first-connection': { question: 'Где должен храниться закрытый пользовательский SSH-ключ?', options: ['Только на клиенте под защитой владельца', 'На сервере рядом с authorized_keys', 'В общем сетевом каталоге'], answer: 0, explanation: 'Серверу передают открытый ключ; закрытый ключ не покидает доверенный клиент.' },
};

export const beginnerProcedures = Object.fromEntries(beginnerLessons.map((lesson) => [lesson.id, lesson.steps]));

export const beginnerModuleQuestions = [
  beginnerQuestions['admin-engineering'], beginnerQuestions['first-linux-vm'], beginnerQuestions['linux-first-commands'],
  beginnerQuestions['linux-first-permissions'], beginnerQuestions['linux-first-services'], beginnerQuestions['network-first-steps'],
  beginnerQuestions['ssh-first-connection'],
  { question: 'Какой порядок соответствует вводному маршруту?', options: ['Компьютер и ОС → VM → терминал → права → службы → сеть → SSH', 'SSH → RAID → компьютер → терминал', 'SLA → Veeam → учётная запись'], answer: 0, explanation: 'Каждый следующий шаг опирается на понятия и стенд предыдущего.' },
  { question: 'Как безопасно проверить изменение в учебной лаборатории?', options: ['Записать исходное состояние, выполнить узкое изменение и проверить результат', 'Сразу применить несколько советов с административными правами', 'Считать отсутствие сообщения об ошибке достаточным'], answer: 0, explanation: 'Наблюдаемая проверка и точная граница изменения позволяют диагностировать и вернуть стенд.' },
  { question: 'Что верно для практик VM, SSH и Nginx в этом курсе?', options: ['Текст даёт инструкцию, а выполнение подтверждается только на подходящем стенде', 'Опубликованный текст доказывает успешное выполнение лаборатории', 'Любой облачный контейнер эквивалентен двум VirtualBox VM'], answer: 0, explanation: 'Описание, прошедший тесты интерфейс и фактически выполненная лаборатория — разные уровни подтверждения.' },
];

export default beginnerLessons;
