import { networkEngineerFoundations } from './networkEngineerFoundations.js';
import { networkEngineerAdvanced } from './networkEngineerAdvanced.js';
import { networkEngineerResources, networkEngineerCertifications } from './networkEngineerSources.js';

export { networkEngineerResources, networkEngineerCertifications };

const profiles = [...networkEngineerFoundations, ...networkEngineerAdvanced];
const byId = new Map(profiles.map((profile) => [profile.id, profile]));
const groups = [
  ['ne-foundation', '01', 'Фундамент сети', 'PACKET · ETHERNET · IP', 'Поймите путь пакета, физическую среду и адресацию до настройки оборудования.', ['ne-foundations', 'ne-media-ethernet', 'ne-ipv4-subnetting', 'ne-ipv6']],
  ['ne-campus', '02', 'Протоколы и локальная сеть', 'TCP/UDP · SERVICES · SWITCHING', 'Свяжите транспорт и сетевые службы с VLAN, trunk и защитой от петель.', ['ne-transport-applications', 'ne-services-dns-dhcp-ntp', 'ne-switching-vlans', 'ne-stp-redundancy']],
  ['ne-routing', '03', 'Маршрутизация и проектирование', 'OSPF · BGP · DESIGN · WI-FI', 'Изучите выбор маршрута, границы доменов отказа, WAN и беспроводной доступ.', ['ne-routing-ospf', 'ne-bgp-wan', 'ne-design-availability', 'ne-wireless']],
  ['ne-secops', '04', 'Защита и эксплуатация', 'ACL · VPN · CAPTURE · TELEMETRY', 'Проверяйте политику доступа, защищённые туннели и наблюдаемость по фактам.', ['ne-security-access', 'ne-vpn', 'ne-linux-packet-analysis', 'ne-monitoring-telemetry']],
  ['ne-professional', '05', 'Автоматизация и профессиональная практика', 'CLOUD · API · CHANGE · PORTFOLIO', 'Перенесите принципы в облако, автоматизируйте проверки и защитите итоговый проект.', ['ne-cloud-sdn', 'ne-automation', 'ne-troubleshooting-change', 'ne-capstone-career']],
];

export const networkEngineerPhases = groups.map(([id, number, title, subtitle, description, ids]) => ({
  id, number, title, subtitle, description,
  topics: ids.map((topicId) => {
    const profile = byId.get(topicId);
    return { id: profile.id, title: profile.title, description: profile.description };
  }),
}));
export const networkEngineerCourse = {
  id: 'network-engineer', title: 'Network Engineer · Сетевой инженер',
  description: 'Авторский маршрут по тематике roadmap.sh: 20 уроков от Ethernet, IPv4/IPv6 и VLAN до OSPF/BGP, Wi-Fi, VPN, телеметрии, облачных сетей и автоматизации. Бесплатные материалы, практические задания и ориентиры сертификации.',
  topics: networkEngineerPhases.flatMap((phase) => phase.topics),
};
export const networkEngineerProfiles = networkEngineerCourse.topics.map((topic) => byId.get(topic.id));

export const networkEngineerLessons = Object.fromEntries(networkEngineerProfiles.map((profile) => [profile.id, {
  intro: profile.description,
  sections: [
    { title: 'Как это работает', paragraphs: [profile.theory[0]] },
    { title: 'Основные термины', paragraphs: profile.terms.map(({ term, definition }) => `${term} — ${definition}`) },
  ],
  lab: {
    ...profile.lab,
    commandsLabel: 'BASH · PYTHON 3',
    pitfalls: [profile.lab.limitations],
  },
}]));
export const networkEngineerDetails = Object.fromEntries(networkEngineerProfiles.map((profile) => [profile.id, {
  goals: profile.goals, deepDive: profile.theory.slice(1), terms: profile.terms,
  diagram: profile.diagram, caseStudy: profile.caseStudy,
  practiceTasks: profile.practiceTasks, question: profile.question,
}]));
export const networkEngineerWalkthroughs = Object.fromEntries(networkEngineerProfiles.map((profile) => [profile.id, {
  title: `План проверки: ${profile.title}`,
  context: `Подготовка: ${profile.lab.prerequisites.join(' ')}`,
  steps: [
    `Определите границы проверки и сформулируйте наблюдаемый критерий успеха до любых действий. Проверяемая цель этого упражнения: ${profile.goals[0]}`,
    `Прочтите исходные данные упражнения и предскажите результат до запуска. Свяжите каждый шаг схемы с термином урока и его уровнем работы: ${profile.terms.slice(0, 3).map(({ term }) => term).join(', ')}.`,
    'Выполните лабораторию ниже, сохраните фактический вывод и сравните его с ожидаемым. При несовпадении меняйте только один параметр за раз и объясняйте результат через данные и правила протокола.',
    'Завершите очистку по инструкции лаборатории и оформите короткий отчёт: гипотеза → проверка → факт → вывод. Отдельно укажите, какие свойства реального оборудования модель не проверяет и как проверить их на стенде.',

  ],
  verification: profile.lab.expected,
  troubleshooting: profile.lab.troubleshooting.join(' '),
}]));
export const networkEngineerLessonResources = Object.fromEntries(networkEngineerProfiles.map((profile) => [profile.id,
  [...new Set(['ne-roadmap', ...profile.sourceIds])].map((sourceId, index) => ({
    sourceId,
    focus: sourceId === 'ne-roadmap' ? `Найдите тему «${profile.title}» в Network Engineer roadmap; затем выполните конкретное чтение и практику из этого урока.` : profile.focus,
    ...(index === 1 ? { takeaway: profile.theory[0] } : {}),
  })),
]));
