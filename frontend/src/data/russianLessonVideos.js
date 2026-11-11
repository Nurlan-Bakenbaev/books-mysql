// Russian alternatives are independent lessons/courses, not dubbed translations.
// Only use IDs actually listed by the linked catalogue. Do not invent durations.
const devopsSource = 'https://github.com/allozavrr/LearningDevOpsUkraine/blob/master/README.md';
const coursesSource = 'https://github.com/rootya802/devops-courses/blob/main/README.md';
const playlist = (playlistId, title, source = devopsSource) => ({ playlistId, title, source, sourceName: 'Каталог русскоязычных видеокурсов' });
const video = (id, title, source = devopsSource) => ({ id, title, source, sourceName: 'Каталог русскоязычных видеокурсов' });

export const russianVideoLibrary = {
  networks: playlist('PLtPJ9lKvJ4oiNMvYbOzCmWy6cRzYAh9B1', 'Компьютерные сети — Андрей Созыкин', coursesSource),
  networkPractice: playlist('PLtPJ9lKvJ4oiKPQ9GXOvntj44Eu8IGAJK', 'Компьютерные сети: практика — Андрей Созыкин'),
  tls: playlist('PLtPJ9lKvJ4oiFnWCsVRElorOLt69YDEnv', 'Защищённые сетевые протоколы — Андрей Созыкин'),
  linux: playlist('PLg5SS_4L6LYuE4z-3BgLYGkZrs-cF4Tep', 'Linux для начинающих — ADV-IT'),
  linuxAdvanced: video('hb1jtBm71MY', 'Linux НЕ для начинающих — ADV-IT'),
  powershell: playlist('PL1aqAoC4A0sXnzbnAvIa36s8P3Ogo8FR_', 'Командная оболочка PowerShell: путь к силе'),
  docker: video('I18TNwZ2Nqg', 'Основы Docker — ADV-IT', coursesSource),
  ansible: playlist('PLg5SS_4L6LYufspdPupdynbMQTBnZd31N', 'Ansible для начинающих — ADV-IT'),
  aws: playlist('PLg5SS_4L6LYsxrZ_4xE_U95AtGsIB96k9', 'AWS на русском языке — ADV-IT', coursesSource),
  prometheus: video('Fj2ifSWuPJc', 'Prometheus: быстрый старт — OTUS'),
  security: playlist('PLMiVLClzZDbTWSsxWfVvrvdyHgSa7Wvaw', 'Кибербезопасность с нуля до аналитика DevSecOps', 'https://github.com/allozavrr/LearningDevOpsUkraine/blob/master/DevSecOps.md'),
};

// Explicit lesson associations keep broad courses from becoming silent fallbacks
// for unrelated Windows/Azure/product-specific topics.
export const russianLessonVideos = {
  'ne-foundations': { ...russianVideoLibrary.networks, focus: 'Вводные занятия по компьютерным сетям и моделям OSI/TCP/IP.' },
  'ne-media-ethernet': { ...russianVideoLibrary.networks, focus: 'Общий курс по сетям дополняет тему Ethernet. Параметры оптики и кабеля сверяйте с источниками урока.' },
  'ne-ipv4-subnetting': { ...russianVideoLibrary.networks, focus: 'Выберите разделы IPv4, адресации и подсетей; затем проверьте расчёты в лаборатории.' },
  'ne-services-dns-dhcp-ntp': { ...russianVideoLibrary.networks, focus: 'Базовые сетевые службы. Детали NTP дополнительно разобраны в тексте и RFC урока.' },
  'ne-transport-applications': { ...russianVideoLibrary.tls, focus: 'Материал о защищённых протоколах дополняет часть урока про TLS/HTTPS; это отдельный видеокурс.' },
  'ne-linux-packet-analysis': { ...russianVideoLibrary.networkPractice, focus: 'Практические занятия по сетям дополняют анализ пакетов; фильтры Wireshark сверяйте с руководством урока.' },
  'ne-monitoring-telemetry': { ...russianVideoLibrary.prometheus, focus: 'Введение в метрики Prometheus; SNMP и потоковая телеметрия дополнительно разбираются в тексте.' },
  'ne-cloud-sdn': { ...russianVideoLibrary.aws, focus: 'Облачные основы на примере AWS. Это общий курс, а не полный разбор SDN, VNet или гибридной сети.' },
  'ne-automation': { ...russianVideoLibrary.ansible, focus: 'Основы Ansible дополняют автоматизацию. NETCONF, RESTCONF и другие API разобраны в тексте урока.' },
  'network-models': { ...russianVideoLibrary.networks, focus: 'В курсе выберите разбор моделей OSI и TCP/IP.' },
  'ip-addressing': { ...russianVideoLibrary.networks, focus: 'В курсе выберите IP-адресацию и подсети.' },
  'routing-vlan': { ...russianVideoLibrary.networks, focus: 'Дополнительный курс по сетям; найдите разделы коммутации и маршрутизации.' },
  'network-troubleshooting': { ...russianVideoLibrary.networkPractice, focus: 'Практика по сетям дополняет диагностику из урока.' },
  'dns-dhcp-nps': { ...russianVideoLibrary.networks, focus: 'Общие основы сетевых служб. Это не инструкция по настройке Windows NPS.' },
  'linux-basics': { ...russianVideoLibrary.linux, focus: 'Начните с командной строки, файлов и прав доступа.' },
  'linux-services': { ...russianVideoLibrary.linuxAdvanced, focus: 'Дополнительный материал по администрированию Linux; это длинное видео.' },
  bash: { ...russianVideoLibrary.linux, focus: 'Выберите занятия по оболочке и Bash. Это курс из нескольких видео.' },
  powershell: { ...russianVideoLibrary.powershell, focus: 'Курс по объектному конвейеру и командлетам PowerShell.' },
  'powershell-ad': { ...russianVideoLibrary.powershell, focus: 'Сначала освойте сам PowerShell. Работа с AD дополнительно разобрана в тексте урока.' },
  'logs-scripting': { ...russianVideoLibrary.linuxAdvanced, focus: 'Дополнительный курс по администрированию Linux; примеры автоматизации сверяйте с уроком.' },
  'devops-basics': { ...russianVideoLibrary.docker, focus: 'Объясняет часть урока о Docker. Git и CI/CD разбираются отдельно в тексте.' },
  'ansible-iac': { ...russianVideoLibrary.ansible, focus: 'Выберите занятия про inventory, playbook и повторяемую настройку.' },
  'operations-monitoring': { ...russianVideoLibrary.prometheus, focus: 'Введение в мониторинг Prometheus; это отдельный вебинар.' },
  'cloud-foundations': { ...russianVideoLibrary.aws, focus: 'Основы облака на примере AWS. Интерфейс и названия сервисов отличаются от Azure.' },
  'web-services': { ...russianVideoLibrary.tls, focus: 'Дополняет часть урока о HTTPS и защите соединения. Настройка веб-сервера разобрана в тексте.' },
  'security-monitoring': { ...russianVideoLibrary.prometheus, focus: 'База по метрикам Prometheus. Это не курс по SIEM и корреляции событий безопасности.' },
  'winsec-foundations': { ...russianVideoLibrary.security, focus: 'Общее введение в ИБ. Настройки защиты Windows изучайте по тексту и источникам урока.' },
  'lsec-threat-model': { ...russianVideoLibrary.security, focus: 'Общее введение в кибербезопасность; это не отдельный разбор модели угроз Linux.' },
  'lsec-users-sudo': { ...russianVideoLibrary.linux, focus: 'Выберите занятия о пользователях, правах и sudo.' },
  'lsec-logging-auditd': { ...russianVideoLibrary.linuxAdvanced, focus: 'Администрирование Linux как база. Конфигурация auditd дополнительно разобрана в тексте.' },
  'secplus-crypto-pki': { ...russianVideoLibrary.tls, focus: 'Защищённые протоколы дополняют тему криптографии и PKI. Курс не покрывает весь SY0-701.' },
  'secplus-threats-social': { ...russianVideoLibrary.security, focus: 'Вводный курс по кибербезопасности, а не подготовка по всем целям SY0-701.' },
  'az-container-instances': { ...russianVideoLibrary.docker, focus: 'Базовые принципы Docker. Настройка Azure Container Instances разобрана в тексте урока.' },
  'az-container-apps': { ...russianVideoLibrary.docker, focus: 'Базовые принципы Docker. Возможности Azure Container Apps изучайте по документации урока.' },
  'az-monitor-alerts': { ...russianVideoLibrary.prometheus, focus: 'Общие принципы метрик на примере Prometheus. Интерфейс Azure Monitor отличается.' },
  'ct-network-hardware': { ...russianVideoLibrary.networks, focus: 'Курс по компьютерным сетям дополняет тему сетевого оборудования.' },
  'ct-os-internals': { ...russianVideoLibrary.linuxAdvanced, focus: 'Практика Linux дополняет тему ОС. Внутреннее устройство Windows разбирается в тексте.' },
  'ct-troubleshooting-capstone': { ...russianVideoLibrary.networkPractice, focus: 'Сетевая часть диагностики. Аппаратные неисправности разобраны в тексте урока.' },
};

export function videoUrls(item) {
  return item.playlistId ? {
    embed: `https://www.youtube-nocookie.com/embed/videoseries?list=${item.playlistId}&rel=0`,
    watch: `https://www.youtube.com/playlist?list=${item.playlistId}`,
  } : {
    embed: `https://www.youtube-nocookie.com/embed/${item.id}?rel=0`,
    watch: `https://www.youtube.com/watch?v=${item.id}`,
  };
}
