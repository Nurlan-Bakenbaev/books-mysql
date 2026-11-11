import { accuracyResources, accuracyLessonResources } from './accuracyResources.js';
import { trackResources, trackLessonResources } from './trackContent.js';

// Ссылки ведут к открытым материалам авторов; объяснения уроков написаны самостоятельно.
const baseResources = [
  {
    id: 'linux-course', title: 'Linux Upskill Challenge', type: 'Курс', language: 'EN', access: 'Бесплатно',
    description: 'Пошаговый курс по Linux-серверу: SSH, права, службы, сеть, журналы и сценарии.',
    url: 'https://github.com/livialima/linuxupskillchallenge',
  },
  {
    id: 'command-line-ru', title: 'Искусство командной строки', type: 'Справочник', language: 'RU', access: 'Бесплатно',
    description: 'Русская версия справочника по работе в командной строке и типичным административным задачам.',
    url: 'https://github.com/jlevy/the-art-of-command-line/blob/master/README-ru.md',
  },
  {
    id: 'bash-book', title: 'Introduction to Bash Scripting', type: 'Книга', language: 'EN', access: 'Бесплатно',
    description: 'Открытая книга с главами о переменных, условиях, циклах, отладке и практических сценариях Bash.',
    url: 'https://github.com/bobbyiliev/introduction-to-bash-scripting',
  },
  {
    id: 'linux-book', title: 'Linux Insides', type: 'Книга', language: 'EN', access: 'Бесплатно',
    description: 'Дополнительная книга для углублённого изучения ядра и устройства Linux после освоения основ.',
    url: 'https://github.com/0xAX/linux-insides',
  },
  {
    id: 'book-index', title: 'Каталог свободных книг на русском', type: 'Книга', language: 'RU', access: 'Бесплатно',
    description: 'Указатель открытых книг по программированию и смежным темам; проверяйте актуальность отдельных ссылок.',
    url: 'https://github.com/EbookFoundation/free-programming-books/blob/main/books/free-programming-books-ru.md',
  },
  {
    id: 'network-roadmap', title: 'Network Engineer Roadmap', type: 'Карта', language: 'EN', access: 'Бесплатно',
    description: 'Карта сетевых тем: адресация, протоколы, маршрутизация, диагностика и безопасность.',
    url: 'https://github.com/nilbuild/developer-roadmap/tree/master/roadmaps/network-engineer/content',
  },
  {
    id: 'devops-roadmap', title: 'DevOps Roadmap', type: 'Карта', language: 'EN', access: 'Бесплатно',
    description: 'Обзор Linux, облаков, автоматизации, контейнеров и мониторинга; выбирайте технологии по задаче.',
    url: 'https://github.com/nilbuild/developer-roadmap/tree/master/roadmaps/devops/content',
  },
  {
    id: 'network-guide', title: 'Microsoft: Core Network Guide', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Руководство по планированию сетевых служб и базовой инфраструктуры Windows Server.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/networking/core-network-guide/core-network-guide-windows-server.md',
  },
  {
    id: 'storage-docs', title: 'Microsoft: Storage documentation', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Документация по дискам, файловым службам, хранилищам и репликации Windows Server.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/tree/main/WindowsServerDocs/storage',
  },
  {
    id: 'hyperv-docs', title: 'Microsoft: Hyper-V overview', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Обзор гипервизора, виртуальных машин, сетей и функций Hyper-V.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/virtualization/hyper-v/overview.md',
  },
  {
    id: 'server-core', title: 'Microsoft: Server Core', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Назначение Server Core, варианты управления и особенности установки Windows Server.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/administration/server-core/what-is-server-core.md',
  },
  {
    id: 'ad-docs', title: 'Microsoft: администрирование AD DS', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Документация по управлению доменными службами Active Directory и их объектами.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/identity/ad-ds/manage/AD-DS-Simplified-Administration.md',
  },
  {
    id: 'gpo-docs', title: 'Microsoft: Group Policy overview', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Основы групповой политики и централизованного управления настройками.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/identity/ad-ds/manage/group-policy/group-policy-overview.md',
  },
  {
    id: 'dns-docs', title: 'Microsoft: DNS overview', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Назначение DNS-сервера и разрешения имён в инфраструктуре Windows.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/networking/dns/dns-overview.md',
  },
  {
    id: 'dhcp-docs', title: 'Microsoft: DHCP overview', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Служба DHCP, автоматическое назначение адресов и параметры клиентов.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/networking/technologies/dhcp/dhcp-top.md',
  },
  {
    id: 'nps-docs', title: 'Microsoft: политики NPS', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Условия, ограничения и обработка политик сетевого доступа в Network Policy Server.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/networking/technologies/nps/nps-np-overview.md',
  },
  {
    id: 'laps-docs', title: 'Microsoft: Windows LAPS', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Управление и ротация паролей локальных администраторов поддерживаемых устройств.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/identity/laps/laps-overview.md',
  },
  {
    id: 'backup-docs', title: 'Microsoft: восстановление леса AD', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Планирование резервного копирования и восстановления Active Directory после серьёзного сбоя.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/identity/ad-ds/manage/forest-recovery-guide/ad-forest-recovery-guide.md',
  },
  {
    id: 'entra-docs', title: 'Microsoft: основы IAM', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Идентичности, аутентификация, авторизация, роли и жизненный цикл доступа.',
    url: 'https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/fundamentals/identity-fundamental-concepts.md',
  },
  {
    id: 'hybrid-docs', title: 'Microsoft: гибридная идентификация', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Обзор сценариев и инструментов гибридной идентификации Microsoft Entra.',
    url: 'https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/identity/hybrid/get-started.md',
  },
  {
    id: 'powershell-course', title: 'Microsoft: PowerShell 101', type: 'Курс', language: 'EN', access: 'Бесплатно',
    description: 'Учебные главы о командах, объектах, конвейере, функциях и удалённом управлении.',
    url: 'https://github.com/MicrosoftDocs/PowerShell-Docs/tree/main/reference/docs-conceptual/learn/ps101',
  },
  {
    id: 'powershell-ad', title: 'Microsoft: PowerShell для AD DS', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Справочник команд модуля ActiveDirectory для Windows Server 2025, включая Get-ADUser и New-ADUser.',
    url: 'https://github.com/MicrosoftDocs/windows-powershell-docs/tree/main/docset/winserver2025-ps/ActiveDirectory',
  },
  {
    id: 'http-docs', title: 'MDN: HTTP', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Обзор HTTP, структуры запросов и ответов; ссылка открывает исходник документации MDN.',
    url: 'https://github.com/mdn/content/blob/main/files/en-us/web/http/index.md',
  },
  {
    id: 'http-evolution', title: 'MDN: эволюция HTTP и HTTP/3', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Версии HTTP и различия TCP и QUIC при передаче запросов.',
    url: 'https://github.com/mdn/content/blob/main/files/en-us/web/http/guides/evolution_of_http/index.md',
  },
  {
    id: 'postgres-backup', title: 'PostgreSQL: Backup and Restore', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Исходник официальной главы о дампах, файловых копиях и архивировании; на GitHub показан формат SGML.',
    url: 'https://github.com/postgres/postgres/blob/master/doc/src/sgml/backup.sgml',
  },
  {
    id: 'docker-docs', title: 'Docker: обзор платформы', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Контейнеры, образы, архитектура Docker и жизненный цикл приложения.',
    url: 'https://github.com/docker/docs/blob/main/content/get-started/docker-overview.md',
  },
  {
    id: 'kubernetes-basics', title: 'Kubernetes: основы', type: 'Курс', language: 'EN', access: 'Бесплатно',
    description: 'Дополнительное направление: основы развёртывания, масштабирования и обновления контейнерных приложений в кластере.',
    url: 'https://github.com/kubernetes/website/blob/main/content/en/docs/tutorials/kubernetes-basics/_index.md',
  },
  {
    id: 'ansible-docs', title: 'Ansible: первые шаги', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Официальные материалы о контроллере, inventory, модулях и playbook.',
    url: 'https://github.com/ansible/ansible-documentation/tree/devel/docs/docsite/rst/getting_started',
  },
  {
    id: 'prometheus-docs', title: 'Prometheus: обзор', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Сбор метрик во временные ряды, компоненты и основы оповещения.',
    url: 'https://github.com/prometheus/docs/blob/main/docs/introduction/overview.md',
  },
  {
    id: 'secops-docs', title: 'Microsoft: операции безопасности Entra', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Подход к мониторингу идентичностей, привилегий и гибридной инфраструктуры.',
    url: 'https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/architecture/security-operations-introduction.md',
  },
  {
    id: 'hardening-docs', title: 'Microsoft: Secured-core server', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Обзор поддерживаемых защитных возможностей Windows Server и оборудования.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/security/secured-core-server.md',
  },
  {
    id: 'wsus-docs', title: 'Microsoft: Windows Server Update Services', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Централизованное распространение обновлений; WSUS объявлен устаревшим, но поддерживается согласно жизненному циклу.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/administration/windows-server-update-services/get-started/windows-server-update-services-wsus.md',
  },
  {
    id: 'postmortem-templates', title: 'Шаблоны разбора инцидентов', type: 'Справочник', language: 'EN', access: 'Бесплатно',
    description: 'Примеры структур postmortem и ссылки на материалы по анализу отказов.',
    url: 'https://github.com/dastergon/postmortem-templates',
  },
  {
    id: 'linux-community', title: 'Linux Upskill: обсуждения', type: 'Сообщество', language: 'EN', access: 'Чтение бесплатно; вход для публикации',
    description: 'Вопросы и обсуждения участников учебного курса по администрированию Linux.',
    url: 'https://github.com/livialima/linuxupskillchallenge/discussions',
  },
  {
    id: 'powershell-community', title: 'PowerShell: обсуждения', type: 'Сообщество', language: 'EN', access: 'Чтение бесплатно; вход для публикации',
    description: 'Сообщество проекта PowerShell: вопросы, обмен опытом и обсуждение инструмента.',
    url: 'https://github.com/PowerShell/PowerShell/discussions',
  },
  {
    id: 'ansible-community', title: 'Ansible Community: обсуждения', type: 'Сообщество', language: 'EN', access: 'Чтение бесплатно; вход для публикации',
    description: 'Обсуждения сообщества Ansible и ссылки на ресурсы проекта.',
    url: 'https://github.com/ansible-community/community-topics/discussions',
  },
  {
    id: 'network-open-book', title: 'Computer Networks: A Systems Approach', type: 'Книга', language: 'EN', access: 'Бесплатно',
    description: 'Открытая цифровая книга Ларри Петерсона и Брюса Дэви о сетях и протоколах; исходники и сведения о лицензии доступны авторам на GitHub.',
    url: 'https://github.com/SystemsApproach/book',
  },
  {
    id: 'ansible-ru', title: 'Пособие по Ansible', type: 'Книга', language: 'RU', access: 'Бесплатно',
    description: 'Русскоязычное пособие по inventory, модулям и playbook из каталога свободных учебных материалов.',
    url: 'https://github.com/freetonik/ansible-tuto-rus',
  },
  {
    id: 'progit-ru', title: 'Pro Git на русском', type: 'Книга', language: 'RU', access: 'Бесплатно',
    description: 'Исходники русскоязычной версии книги Pro Git: история изменений, ветви и совместная работа.',
    url: 'https://github.com/progit/progit2-ru',
  },
  {
    id: 'ms-sc900', title: 'Microsoft Learning: лаборатории SC-900', type: 'Курс', language: 'EN', access: 'Материалы бесплатно; учебный арендатор может быть платным',
    description: 'Официальные инструкции Microsoft по основам безопасности, идентичности и соответствия. Некоторые лаборатории требуют подготовленного арендатора и лицензий.',
    url: 'https://github.com/MicrosoftLearning/SC-900-Microsoft-Security-Compliance-and-Identity-Fundamentals',
  },
  {
    id: 'ms-sc200', title: 'Microsoft Learning: лаборатории SC-200', type: 'Курс', language: 'EN', access: 'Материалы бесплатно; облачные службы могут быть платными',
    description: 'Официальные лабораторные инструкции для изучения операций безопасности, Defender и Sentinel; проверяйте требования к лицензиям.',
    url: 'https://github.com/MicrosoftLearning/SC-200T00A-Microsoft-Security-Operations-Analyst',
  },
  {
    id: 'ms-defender-status', title: 'Microsoft: Get-MpComputerStatus', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Справочник PowerShell для просмотра состояния антивирусного компонента Defender.',
    url: 'https://github.com/MicrosoftDocs/windows-powershell-docs/blob/main/docset/winserver2025-ps/Defender/Get-MpComputerStatus.md',
  },
  {
    id: 'ms-firewall-profile', title: 'Microsoft: Get-NetFirewallProfile', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Справочник PowerShell для просмотра настроек профилей брандмауэра Windows.',
    url: 'https://github.com/MicrosoftDocs/windows-powershell-docs/blob/main/docset/winserver2025-ps/NetSecurity/Get-NetFirewallProfile.md',
  },
  {
    id: 'ms-bitlocker-volume', title: 'Microsoft: Get-BitLockerVolume', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Справочник просмотра состояния томов BitLocker без публикации ключей восстановления.',
    url: 'https://github.com/MicrosoftDocs/windows-powershell-docs/blob/main/docset/winserver2025-ps/BitLocker/Get-BitLockerVolume.md',
  },
  {
    id: 'ms-mfa', title: 'Microsoft: как работает MFA', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Объяснение многофакторной аутентификации Microsoft Entra и доступных методов.',
    url: 'https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/identity/authentication/concept-mfa-howitworks.md',
  },
  {
    id: 'ms-windows-security', title: 'Microsoft: безопасность Windows Server', type: 'Документация', language: 'EN', access: 'Бесплатно',
    description: 'Официальный указатель материалов по укреплению сервера, защите учётных данных и сетевой безопасности; включает ссылку на книгу Windows Server 2025 Security.',
    url: 'https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/security/security-and-assurance.yml',
  },
  {
    id: 'cisco-packet-tracer', title: 'Cisco Networking Academy: Packet Tracer', type: 'Курс', language: 'EN', access: 'Регистрация и условия Cisco',
    description: 'Официальная отправная точка Cisco для обучения Packet Tracer. Наличие версий, регистрация и порядок скачивания определяются Cisco.',
    url: 'https://www.netacad.com/courses/packet-tracer',
  },
];

export const resources = [...baseResources, ...trackResources, ...accuracyResources];

export const resourcesById = Object.fromEntries(resources.map((resource) => [resource.id, resource]));

// Подсказка указывает, какую часть источника связать с конкретным уроком.
const baseLessonResources = {
  'network-models': [
    { sourceId: 'network-roadmap', focus: 'Найдите разделы OSI, TCP/IP, TCP и UDP; сопоставьте уровни с путём запроса из урока.', takeaway: 'Сетевые функции удобно разбирать по уровням: адресация и маршрутизация отличаются от транспортной доставки данных.' },
    { sourceId: 'network-guide', focus: 'Просмотрите назначение сетевых служб и определите роль DNS в инфраструктуре.' },
    { sourceId: 'http-evolution', focus: 'Сравните HTTP/1.1 и HTTP/2 с разделом об HTTP/3.', takeaway: 'HTTP/3 использует QUIC поверх UDP, в отличие от HTTP/2 поверх TCP.' },
    { sourceId: 'network-open-book', focus: 'Найдите введение, разделы об архитектуре и многоуровневых протоколах.' },
  ],
  'ip-addressing': [
    { sourceId: 'network-roadmap', focus: 'Изучите разделы IP addressing, IPv4/IPv6 и CIDR; повторите расчёт подсетей.', takeaway: 'CIDR задаёт длину сетевого префикса; адрес и префикс вместе позволяют определить принадлежность узла подсети.' },
    { sourceId: 'network-guide', focus: 'Обратите внимание на планирование адресов и шлюзов для клиентских машин.' },
    { sourceId: 'network-open-book', focus: 'Найдите разделы об IP и маршрутизации, затем сравните их с расчётом CIDR в тренажёре.' },
  ],
  'routing-vlan': [
    { sourceId: 'network-roadmap', focus: 'Сравните темы маршрутизации, VLAN и ACL: они решают разные задачи.', takeaway: 'VLAN разделяет канальные сегменты, маршрутизация соединяет сети, а ACL ограничивает разрешённый трафик.' },
    { sourceId: 'network-guide', focus: 'Сверьте требования к сетевым службам и сегментам перед построением лаборатории.' },
  ],
  'network-troubleshooting': [
    { sourceId: 'network-roadmap', focus: 'Найдите разделы диагностики сети, DNS и распространённых проблем.', takeaway: 'Диагностику полезно разделять на проверку имени, адреса, маршрута и доступности конкретной службы.' },
    { sourceId: 'linux-course', focus: 'В уроке Day 9 посмотрите проверку портов; выполняйте её только в своей лаборатории.' },
  ],
  'hardware-storage': [
    { sourceId: 'storage-docs', focus: 'Просмотрите разделы дисков и хранилищ; сравните их назначение с резервной копией.', takeaway: 'Управление дисками, файловые службы и репликация — разные компоненты инфраструктуры хранения.' },
    { sourceId: 'backup-docs', focus: 'Посмотрите, почему для восстановления инфраструктуры нужен отдельный план и проверенная копия.' },
  ],
  virtualization: [
    { sourceId: 'hyperv-docs', focus: 'Изучите понятия гипервизора, VM и виртуальной сети.', takeaway: 'Гипервизор предоставляет виртуальным машинам вычислительные ресурсы и виртуальное оборудование на общем хосте.' },
    { sourceId: 'linux-course', focus: 'В Day 0 сравните варианты учебной среды; для начала выберите локальную VM.' },
  ],
  'linux-basics': [
    { sourceId: 'linux-course', focus: 'Пройдите Days 1–4 и 13–14: навигация, пакеты, пользователи и права.', takeaway: 'Пользователи, группы и разрешения определяют, кто может читать, изменять и выполнять файлы.' },
    { sourceId: 'command-line-ru', focus: 'Прочитайте основы командной строки и найдите команды для навигации и помощи.' },
    { sourceId: 'linux-community', focus: 'При необходимости задайте вопрос, предварительно удалив из вывода секреты и личные данные.' },
  ],
  'linux-services': [
    { sourceId: 'linux-course', focus: 'Сопоставьте Days 7, 10 и 18 с управлением службами, расписаниями и журналами.', takeaway: 'Служба имеет собственное состояние и журналы; их проверяют вместе с результатом обращения к приложению.' },
    { sourceId: 'command-line-ru', focus: 'Найдите команды просмотра процессов, ресурсов и текстовых файлов.' },
  ],
  'web-services': [
    { sourceId: 'http-docs', focus: 'Прочитайте про запросы, ответы и роль HTTP; сопоставьте с выводом curl.', takeaway: 'Клиент отправляет HTTP-запрос, а сервер возвращает ответ с кодом состояния, заголовками и возможным содержимым.' },
    { sourceId: 'linux-course', focus: 'Посмотрите Day 7 о службе и журналах веб-сервера; не открывайте учебный порт в интернет.' },
  ],
  'database-operations': [
    { sourceId: 'postgres-backup', focus: 'Найдите разделы SQL Dump, файловых копий и непрерывного архивирования; сравните подходы.', takeaway: 'PostgreSQL описывает три разных подхода к резервированию: SQL-дамп, копирование файлов и непрерывное архивирование.' },
    { sourceId: 'storage-docs', focus: 'Отличите хранилище базы от проверенной резервной копии и процедуры восстановления.' },
  ],
  'server-deployment': [
    { sourceId: 'server-core', focus: 'Сравните Server Core с вариантом установки с графической оболочкой.', takeaway: 'Server Core предоставляет вариант установки без полного графического интерфейса и поддерживает удалённое управление.' },
    { sourceId: 'hyperv-docs', focus: 'Разберитесь с VM и виртуальной сетью до развёртывания сервера.' },
  ],
  'ad-ds': [
    { sourceId: 'ad-docs', focus: 'Изучите управление объектами и административными задачами AD DS.', takeaway: 'AD DS позволяет централизованно управлять объектами каталога и выполнять административные задачи с помощью поддерживаемых инструментов.' },
    { sourceId: 'dns-docs', focus: 'Повторите роль DNS в поиске служб домена и разрешении имён.' },
  ],
  gpo: [
    { sourceId: 'gpo-docs', focus: 'Прочитайте обзор групповой политики и определите, где применяется GPO.', takeaway: 'Групповая политика применяет параметры к пользователям и компьютерам в определённой области действия.' },
    { sourceId: 'ad-docs', focus: 'Сопоставьте область действия политики с объектами и структурой домена.' },
  ],
  'dns-dhcp-nps': [
    { sourceId: 'dns-docs', focus: 'Изучите назначение DNS-сервера и проверьте разрешение имени.', takeaway: 'DNS связывает имена с ресурсными записями, необходимыми клиентам для поиска адресов и служб.' },
    { sourceId: 'dhcp-docs', focus: 'Сопоставьте области DHCP и параметры, полученные клиентом.' },
    { sourceId: 'nps-docs', focus: 'Разберите условия и ограничения сетевой политики NPS и порядок их обработки.' },
  ],
  'iam-rbac-laps': [
    { sourceId: 'entra-docs', focus: 'Различайте аутентификацию, авторизацию, роли и жизненный цикл идентичности.', takeaway: 'Аутентификация подтверждает идентичность, а авторизация определяет разрешённые ей действия.' },
    { sourceId: 'laps-docs', focus: 'Изучите хранение и ротацию пароля локального администратора и ограничения доступа к нему.' },
  ],
  'backup-dr': [
    { sourceId: 'backup-docs', focus: 'Посмотрите план восстановления леса и требования к резервным копиям AD DS.', takeaway: 'Восстановление леса AD требует заранее подготовленного плана и подходящих резервных копий контроллеров домена.' },
    { sourceId: 'postgres-backup', focus: 'Сравните стратегии копирования данных и важность проверки восстановления.' },
  ],
  'cloud-foundations': [
    { sourceId: 'devops-roadmap', focus: 'Найдите разделы cloud providers, networking и infrastructure as code.', takeaway: 'Облачные платформы предоставляют API для управления инфраструктурой в границах безопасности и учёта ресурсов.' },
    { sourceId: 'entra-docs', focus: 'Обратите внимание на роли и идентичности пользователей, устройств и приложений.' },
  ],
  'entra-id': [
    { sourceId: 'entra-docs', focus: 'Прочитайте об идентичностях, аутентификации и авторизации.', takeaway: 'Помимо людей, идентичности могут представлять устройства и программные рабочие нагрузки.' },
    { sourceId: 'hybrid-docs', focus: 'Сравните облачную идентичность с гибридным сценарием.' },
  ],
  'hybrid-identity': [
    { sourceId: 'hybrid-docs', focus: 'Изучите сценарии синхронизации и зависимости гибридной идентификации.', takeaway: 'Гибридная идентификация связывает локальную инфраструктуру каталогов с облачными сценариями доступа.' },
    { sourceId: 'ad-docs', focus: 'Повторите структуру локального AD DS, прежде чем соединять каталоги.' },
  ],
  bash: [
    { sourceId: 'bash-book', focus: 'Пройдите главы о переменных, условиях, циклах и отладке сценариев.', takeaway: 'Переменные, условия, циклы и функции помогают объединять команды в повторяемые сценарии.' },
    { sourceId: 'command-line-ru', focus: 'Сверьте использование конвейеров и инструментов обработки текста.' },
  ],
  powershell: [
    { sourceId: 'powershell-course', focus: 'Изучите главы 2–4 об объектах, справке и конвейере, затем функции.', takeaway: 'Конвейер PowerShell передаёт между командами объекты с доступными свойствами и методами.' },
    { sourceId: 'powershell-community', focus: 'Посмотрите обсуждения и формулируйте вопросы с минимальным безопасным примером.' },
  ],
  'powershell-ad': [
    { sourceId: 'powershell-ad', focus: 'Найдите Get-ADUser и New-ADUser; изучите их параметры и примеры для тестового домена.', takeaway: 'Модуль ActiveDirectory предоставляет команды для работы с объектами каталога и автоматизации повторяемых операций.' },
    { sourceId: 'powershell-course', focus: 'Повторите конвейер и функции; перед изменениями используйте тестовые данные и WhatIf, если команда его поддерживает.' },
  ],
  'logs-scripting': [
    { sourceId: 'powershell-course', focus: 'Примените фильтрацию объектов и конвейер к учебным событиям.', takeaway: 'Свойства объектов PowerShell можно отбирать и передавать дальше по конвейеру для формирования отчёта.' },
    { sourceId: 'linux-course', focus: 'В Day 18 изучите журналы и их ротацию на Linux.' },
  ],
  'devops-basics': [
    { sourceId: 'docker-docs', focus: 'Сравните образ, контейнер и хост; изучите жизненный цикл контейнера.', takeaway: 'Контейнер упаковывает приложение и его окружение для запуска на хосте, но не равен полноценной виртуальной машине.' },
    { sourceId: 'devops-roadmap', focus: 'Найдите Git, CI/CD и контейнеры; определите их роль в проверке изменений.' },
    { sourceId: 'kubernetes-basics', focus: 'Дополнительно посмотрите, как кластер развёртывает и масштабирует контейнерное приложение.' },
    { sourceId: 'progit-ru', focus: 'Прочитайте введение, основы фиксаций и ветвления Git на русском языке.' },
  ],
  'ansible-iac': [
    { sourceId: 'ansible-docs', focus: 'Пройдите введение, inventory и первый playbook; сравните результаты повторных запусков.', takeaway: 'Inventory задаёт управляемые узлы, а playbook описывает задачи, выполняемые модулями Ansible.' },
    { sourceId: 'devops-roadmap', focus: 'Найдите configuration management и infrastructure as code и сравните задачи этих подходов.' },
    { sourceId: 'ansible-community', focus: 'Изучите обсуждения сообщества, не публикуя конфигурации с секретами.' },
    { sourceId: 'ansible-ru', focus: 'Сверьте понятия inventory и playbook с русскоязычным пособием.' },
  ],
  'operations-monitoring': [
    { sourceId: 'prometheus-docs', focus: 'Прочитайте о метриках, временных рядах и компонентах системы оповещения.', takeaway: 'Prometheus хранит измерения как временные ряды с метками и собирает их у настроенных целей.' },
    { sourceId: 'linux-course', focus: 'Повторите Days 1 и 18: ресурсы сервера, журналы и диагностика.' },
  ],
  'zero-trust': [
    { sourceId: 'entra-docs', focus: 'Повторите различие идентификации, аутентификации и авторизации.', takeaway: 'Подтверждение идентичности и решение о доступе — отдельные части управления доступом.' },
    { sourceId: 'secops-docs', focus: 'Изучите роль идентичности, непрерывного мониторинга и привилегированных учётных записей.' },
  ],
  hardening: [
    { sourceId: 'hardening-docs', focus: 'Посмотрите защитные возможности и требования к поддерживаемому оборудованию.', takeaway: 'Защита сервера может сочетать возможности оборудования, встроенного ПО и операционной системы.' },
    { sourceId: 'laps-docs', focus: 'Разберите защиту локальных административных паролей и права на их чтение.' },
  ],
  'security-monitoring': [
    { sourceId: 'secops-docs', focus: 'Найдите источники сигналов, мониторинг привилегированных учётных записей и план реагирования.', takeaway: 'Мониторинг идентичностей охватывает пользователей, привилегированные учётные записи, приложения, устройства и инфраструктуру.' },
    { sourceId: 'prometheus-docs', focus: 'Сравните числовые метрики доступности с событиями безопасности и журналами.' },
  ],
  'patch-management': [
    { sourceId: 'wsus-docs', focus: 'Изучите назначение WSUS и примечание об устаревании.', takeaway: 'WSUS больше не получает новые функции, но остаётся поддерживаемым согласно жизненному циклу продукта.' },
    { sourceId: 'linux-course', focus: 'В Days 4 и 15 повторите работу с пакетами и источниками обновлений Linux.' },
  ],
  'incident-portfolio': [
    { sourceId: 'postmortem-templates', focus: 'Выберите структуру с влиянием, хронологией и действиями после инцидента.', takeaway: 'Шаблон разбора помогает зафиксировать влияние, последовательность событий и последующие улучшения.' },
    { sourceId: 'prometheus-docs', focus: 'Определите, какие метрики помогли бы обнаружить отказ учебного сервиса.' },
  ],
  'winsec-foundations': [
    { sourceId: 'ms-sc900', focus: 'Изучите вводные материалы о безопасности и идентичности; отдельно проверьте требования к лабораториям.', takeaway: 'Безопасность, идентичность и соответствие рассматриваются совместно, а учебные облачные лаборатории требуют подходящей среды.' },
    { sourceId: 'ms-windows-security', focus: 'Просмотрите разделы защиты Windows Server и выберите защитные слои для учебной схемы.' },
  ],
  'winsec-accounts': [
    { sourceId: 'entra-docs', focus: 'Сравните аутентификацию, авторизацию, идентичности и роли.', takeaway: 'Подтверждение личности и предоставление прав — разные действия.' },
    { sourceId: 'ms-windows-security', focus: 'Найдите раздел управления привилегированным доступом и защиты учётных данных.' },
  ],
  'winsec-defender': [
    { sourceId: 'ms-defender-status', focus: 'Изучите назначение команды, её свойства и примеры просмотра состояния.', takeaway: 'Get-MpComputerStatus показывает состояние установленного антивирусного компонента.' },
    { sourceId: 'ms-sc200', focus: 'Ознакомьтесь со структурой лабораторий по операциям безопасности и требованиями к среде.' },
  ],
  'winsec-firewall': [
    { sourceId: 'ms-firewall-profile', focus: 'Изучите параметры профилей и примеры команды просмотра.', takeaway: 'У разных профилей брандмауэра могут быть разные настройки по умолчанию.' },
    { sourceId: 'network-roadmap', focus: 'Повторите разделы firewall, TCP и порты, прежде чем анализировать правило.' },
  ],
  'winsec-patching': [
    { sourceId: 'wsus-docs', focus: 'Уточните статус устаревания и поддерживаемый жизненный цикл WSUS.', takeaway: 'WSUS объявлен устаревшим, но поддерживается согласно жизненному циклу продукта.' },
    { sourceId: 'ms-windows-security', focus: 'Просмотрите материалы об укреплении системы и ограничениях защитных настроек.' },
  ],
  'winsec-identity': [
    { sourceId: 'ms-mfa', focus: 'Изучите типы факторов и поддерживаемые способы проверки.', takeaway: 'Многофакторная аутентификация использует дополнительные независимые факторы подтверждения личности.' },
    { sourceId: 'ms-sc900', focus: 'Найдите лабораторию Conditional Access и заранее прочитайте требования и предупреждения.' },
  ],
  'winsec-encryption': [
    { sourceId: 'ms-bitlocker-volume', focus: 'Изучите описание свойств томов и параметры команды.', takeaway: 'Get-BitLockerVolume показывает сведения о защищаемых томах; ключи восстановления необходимо хранить безопасно.' },
    { sourceId: 'backup-docs', focus: 'Сравните задачу шифрования с подготовкой и проверкой восстановления данных.' },
  ],
  'winsec-detection': [
    { sourceId: 'ms-sc200', focus: 'Изучите список лабораторий по анализу сигналов и требования к учебному окружению.', takeaway: 'Для расследования важно сопоставлять события и использовать доступные источники данных в настроенной среде.' },
    { sourceId: 'secops-docs', focus: 'Просмотрите введение в операции безопасности и мониторинг идентичностей.' },
  ],
  'winsec-response': [
    { sourceId: 'ms-sc200', focus: 'Посмотрите, как учебные лаборатории связывают обнаружение и дальнейшее расследование.', takeaway: 'Сбор сигналов и последующее расследование требуют заранее подготовленных процессов и источников данных.' },
    { sourceId: 'postmortem-templates', focus: 'Выберите шаблон и заполните хронологию и последующие действия без реальных секретов.' },
  ],
};

export const lessonResources = Object.fromEntries(Object.entries({ ...baseLessonResources, ...trackLessonResources }).map(([id, references]) => [id, [...references, ...(accuracyLessonResources[id] || [])]]));
