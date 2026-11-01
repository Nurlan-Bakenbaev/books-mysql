// Stable identifiers keep saved progress intact when the presentation changes.
export const phases = [
  {
    id: 'foundation', number: '01', title: 'Фундамент', subtitle: 'Networking & Hardware Essentials',
    description: 'Разберитесь, как устройства обмениваются данными и из чего состоит надёжная инфраструктура.',
    topics: [
      { id: 'network-models', title: 'Модели OSI и TCP/IP', description: 'Уровни моделей, инкапсуляция, порты и протоколы TCP и UDP. Проследите путь запроса от приложения до сети.' },
      { id: 'ip-addressing', title: 'IPv4, IPv6 и подсети', description: 'Адресация, маски и префиксы CIDR, шлюзы и диапазоны. Рассчитайте подсети и объясните различия IPv4 и IPv6.' },
      { id: 'routing-vlan', title: 'Маршрутизация, VLAN и firewall', description: 'Статические маршруты, сегментация сети, правила брандмауэра и принцип минимально необходимого доступа.' },
      { id: 'network-troubleshooting', title: 'Диагностика сети', description: 'Применяйте ping, tracert, nslookup и netstat; анализируйте DNS и сетевые пакеты в Wireshark.' },
      { id: 'hardware-storage', title: 'Серверы и хранение данных', description: 'Компоненты серверов, RAID, NAS и SAN. Различайте отказоустойчивость массива и резервное копирование.' },
    ],
  },
  {
    id: 'windows', number: '02', title: 'Windows Server', subtitle: 'Core Infrastructure',
    description: 'Постройте управляемую инфраструктуру идентификации и сетевых служб на Windows Server 2022 / 2025.',
    topics: [
      { id: 'server-deployment', title: 'Развёртывание Windows Server', description: 'Установка Windows Server 2022 / 2025, Server Core, роли, обновления и удалённое администрирование.' },
      { id: 'ad-ds', title: 'Active Directory Domain Services', description: 'Домены, леса, OU, контроллеры домена, репликация и жизненный цикл учётных записей.' },
      { id: 'gpo', title: 'Групповые политики', description: 'Создание и область действия GPO, наследование, фильтрация и диагностика применения политик.' },
      { id: 'dns-dhcp-nps', title: 'DNS, DHCP и NPS', description: 'Настройте зоны DNS, области DHCP и политики сетевого доступа NPS; проверьте работу клиентской машины.' },
      { id: 'iam-rbac-laps', title: 'IAM, RBAC и Windows LAPS', description: 'Делегируйте права по ролям, применяйте принцип минимальных привилегий и управляйте паролями локальных администраторов через LAPS.' },
    ],
  },
  {
    id: 'hybrid', number: '03', title: 'Гибридное облако', subtitle: 'Hybrid & Cloud Ops',
    description: 'Соедините локальные службы, виртуализацию и облако в устойчивую инфраструктуру.',
    topics: [
      { id: 'virtualization', title: 'Hyper-V и VMware vSphere / ESXi', description: 'Создавайте виртуальные машины и сети, управляйте ресурсами, снимками и шаблонами.' },
      { id: 'backup-dr', title: 'Резервное копирование и DR', description: 'Применяйте стратегию 3-2-1, изучите Veeam, определите RPO и RTO и регулярно проверяйте восстановление.' },
      { id: 'entra-id', title: 'Microsoft Entra ID', description: 'Пользователи, группы, приложения и роли облачного каталога; различия с локальным AD DS.' },
      { id: 'hybrid-identity', title: 'Гибридная идентификация', description: 'Изучите Entra Connect Sync, гибридную аутентификацию, MFA и единый вход SSO.' },
      { id: 'devops-basics', title: 'Docker, Git и CI/CD', description: 'Запускайте контейнеры, храните конфигурации в Git и проверяйте изменения инфраструктуры в простом конвейере CI/CD.' },
    ],
  },
  {
    id: 'automation', number: '04', title: 'Автоматизация', subtitle: 'PowerShell & CLI',
    description: 'Превращайте повторяемые задачи в понятные и проверяемые сценарии.',
    topics: [
      { id: 'powershell', title: 'Продвинутый PowerShell', description: 'Объекты и конвейер, функции, обработка ошибок, работа со службами и удалённое управление.' },
      { id: 'powershell-ad', title: 'Автоматизация Active Directory', description: 'Используйте модуль ActiveDirectory для поиска и массового создания пользователей из CSV; сначала проверяйте изменения с WhatIf.' },
      { id: 'logs-scripting', title: 'Разбор логов', description: 'Собирайте и фильтруйте события, формируйте отчёты и планируйте регулярное выполнение сценариев.' },
      { id: 'bash', title: 'Bash и кроссплатформенное управление', description: 'Освойте оболочку, права, процессы, SSH и базовые сценарии для Linux и смешанных сред.' },
    ],
  },
  {
    id: 'security', number: '05', title: 'Кибербезопасность', subtitle: 'Cybersecurity & SecOps',
    description: 'Защищайте доступ, наблюдайте за событиями и готовьтесь к реагированию на инциденты.',
    topics: [
      { id: 'zero-trust', title: 'Zero Trust и наименьшие привилегии', description: 'Проверяйте идентичность и контекст каждого запроса, ограничивайте доступ и регулярно пересматривайте привилегии.' },
      { id: 'hardening', title: 'Укрепление Windows и серверов', description: 'Отключайте ненужные службы, настраивайте аудит безопасности, используйте BitLocker и проверенные базовые конфигурации.' },
      { id: 'security-monitoring', title: 'Мониторинг и реагирование', description: 'Изучите Event Viewer, Sysmon и SIEM; разберите обнаружение и расследование в Defender for Endpoint и Microsoft Sentinel.' },
      { id: 'patch-management', title: 'Уязвимости и обновления', description: 'Инвентаризация, приоритизация уязвимостей, тестирование и развёртывание обновлений через WSUS, Intune или сторонние решения.' },
    ],
  },
]

export const terms = [
  { id: 'active-directory', name: 'Active Directory', category: 'Windows', short: 'Каталог пользователей, компьютеров и политик домена.', description: 'AD DS централизованно хранит объекты инфраструктуры и поддерживает аутентификацию и авторизацию в домене Windows.', example: 'Создайте OU для отдела и добавьте в неё тестового пользователя и компьютер.' },
  { id: 'gpo-term', name: 'GPO', category: 'Windows', short: 'Групповая политика для централизованной настройки.', description: 'Group Policy Object содержит параметры для пользователей и компьютеров, применяемые к сайтам, доменам или организационным подразделениям.', example: 'Привяжите политику блокировки экрана к тестовому OU и проверьте её через gpresult.' },
  { id: 'kerberos', name: 'Kerberos', category: 'Windows', short: 'Протокол аутентификации на основе билетов.', description: 'Kerberos использует центр распределения ключей и временные билеты, чтобы подтверждать идентичность без передачи пароля каждому сервису.', example: 'Проверьте полученные билеты командой klist на доменном клиенте.' },
  { id: 'zero-trust-term', name: 'Zero Trust', category: 'Безопасность', short: 'Непрерывная проверка доступа по контексту.', description: 'Модель предполагает явную проверку каждого запроса, минимальные привилегии и готовность к компрометации независимо от расположения пользователя.', example: 'Требуйте MFA и соответствие устройства политике перед доступом к корпоративному приложению.' },
  { id: 'vlan', name: 'VLAN', category: 'Сети', short: 'Логическая сегментация локальной сети.', description: 'Виртуальная локальная сеть разделяет широковещательные домены на общей физической инфраструктуре. Для связи между VLAN нужна маршрутизация.', example: 'Разделите клиентские устройства и серверы по VLAN и разрешите только необходимые соединения.' },
  { id: 'subnetting', name: 'Subnetting', category: 'Сети', short: 'Разделение IP-сети на подсети.', description: 'Маска или префикс CIDR отделяет сетевую часть адреса от адресов узлов и помогает планировать маршрутизацию.', example: 'Разделите сеть 192.168.1.0/24 на две подсети /25.' },
  { id: 'siem', name: 'SIEM', category: 'Безопасность', short: 'Сбор и корреляция событий безопасности.', description: 'Security Information and Event Management объединяет журналы из разных источников, помогает обнаруживать угрозы и расследовать инциденты.', example: 'Создайте правило для нескольких неудачных входов с последующим успешным входом.' },
  { id: 'mfa', name: 'MFA', category: 'Безопасность', short: 'Проверка личности несколькими факторами.', description: 'Многофакторная аутентификация сочетает независимые категории факторов: знание, владение или биометрический признак.', example: 'Защитите административную учётную запись ключом безопасности или приложением-аутентификатором.' },
  { id: 'entra', name: 'Microsoft Entra ID', category: 'Облако', short: 'Облачная служба управления идентификацией.', description: 'Entra ID, ранее Azure AD, управляет доступом к облачным приложениям и может работать совместно с локальным AD DS.', example: 'Создайте тестовую группу и назначьте ей доступ к корпоративному приложению.' },
  { id: 'syslog', name: 'Syslog', category: 'Сети', short: 'Стандарт передачи и хранения системных событий.', description: 'Syslog позволяет устройствам и службам отправлять сообщения на централизованный сервер с указанием источника и важности события.', example: 'Направьте журналы тестового маршрутизатора на сборщик и найдите события смены конфигурации.' },
  { id: 'laps', name: 'Windows LAPS', category: 'Безопасность', short: 'Управление паролями локальных администраторов.', description: 'Windows Local Administrator Password Solution автоматически управляет паролями локальных администраторов и поддерживает их регулярную ротацию.', example: 'Настройте LAPS для тестового OU и ограничьте право чтения пароля отдельной группой поддержки.' },
]

export const labs = [
  { id: 'lab-network', title: 'Соберите виртуальную сеть', platform: 'Hyper-V / VirtualBox', description: 'Создайте две VM, настройте адреса и проверьте связность с помощью ping и Wireshark.' },
  { id: 'lab-ad', title: 'Поднимите домен AD DS', platform: 'Windows Server', description: 'Установите контроллер домена и DNS, создайте OU и присоедините тестовый клиент.' },
  { id: 'lab-gpo', title: 'Примените первую GPO', platform: 'Windows Server', description: 'Настройте политику для тестового OU и проверьте результат на клиенте.' },
  { id: 'lab-dhcp', title: 'Настройте DNS и DHCP', platform: 'Windows Server', description: 'Создайте область DHCP и проверьте получение адреса и разрешение имён.' },
  { id: 'lab-backup', title: 'Проверьте восстановление', platform: 'Hyper-V / VirtualBox', description: 'Создайте резервную копию тестовой VM и выполните пробное восстановление.' },
  { id: 'lab-powershell', title: 'Автоматизируйте пользователей', platform: 'PowerShell', description: 'Подготовьте CSV и сценарий массового создания тестовых учётных записей с предварительной проверкой.' },
  { id: 'lab-entra', title: 'Изучите облачную идентификацию', platform: 'Azure / Entra ID', description: 'В тестовом тенанте настройте группу, доступ к приложению и MFA согласно доступным лицензиям.' },
  { id: 'lab-security', title: 'Исследуйте события безопасности', platform: 'Windows / Sysmon', description: 'Соберите тестовые события, отфильтруйте их и задокументируйте признаки подозрительной активности.' },
]

export const certifications = [
  { id: 'ccna', name: 'Cisco CCNA', category: 'Сети', description: 'Сетевая база: адресация, маршрутизация, безопасность и автоматизация.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html' },
  { id: 'az900', name: 'AZ-900', category: 'Облако', description: 'Основы Azure: облачные концепции, сервисы, безопасность и управление.', url: 'https://learn.microsoft.com/credentials/certifications/azure-fundamentals/' },
  { id: 'az104', name: 'AZ-104', category: 'Облако', description: 'Практика администратора Azure: идентификация, сети, хранилище и вычисления.', url: 'https://learn.microsoft.com/credentials/certifications/azure-administrator/' },
  { id: 'securityplus', name: 'CompTIA Security+', category: 'Безопасность', description: 'Основы защиты инфраструктуры, управления рисками и реагирования.', url: 'https://www.comptia.org/en-us/certifications/security/' },
  { id: 'sc900', name: 'SC-900', category: 'Безопасность', description: 'Базовые концепции безопасности, соответствия и идентификации Microsoft.', url: 'https://learn.microsoft.com/credentials/certifications/security-compliance-and-identity-fundamentals/' },
  { id: 'sc200', name: 'SC-200', category: 'Безопасность', description: 'Операции безопасности: расследование и реагирование с инструментами Microsoft.', url: 'https://learn.microsoft.com/credentials/certifications/security-operations-analyst/' },
]
