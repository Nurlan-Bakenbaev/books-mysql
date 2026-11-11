// Fixed, trusted source: never interpolate user content into Mermaid syntax.
// Keep docs/sysadmin-roadmap-2026.mmd identical to this exported string.
export const sysadminRoadmapSource = `%%{init: {"theme":"base","themeVariables":{"background":"#08111f","primaryTextColor":"#eef7ff","textColor":"#eef7ff","titleColor":"#eef7ff","lineColor":"#83a8be","fontFamily":"Inter, system-ui, sans-serif","fontSize":"15px","clusterBkg":"#0c1727","clusterBorder":"#35516b","edgeLabelBackground":"#101e30"},"flowchart":{"htmlLabels":false,"curve":"linear","nodeSpacing":30,"rankSpacing":46,"padding":18,"wrappingWidth":440}}}%%
flowchart TD
  accTitle: Карта обучения системного администратора 2026
  accDescr: От оборудования, сетей и принципов ОС к Linux, Windows Server или обеим системам; далее инфраструктура, безопасность, автоматизация и практический проект. После первой роли Junior реальная практика ведёт к уровню Middle или специализации DevOps. Узлы открывают уроки и лабораторные работы сайта.
  subgraph level0["0 · ФУНДАМЕНТ — пойми, как всё устроено"]
    hardware["Оборудование компьютера и сервера<br/>CPU, RAM, диски и RAID: ресурсы и надёжность"]
    network["Сети: OSI, TCP/IP, IPv4 и IPv6<br/>DNS и DHCP: имена, адреса и путь пакета"]
    os_internals["Принципы Windows и Linux<br/>Ядро, память, процессы и файловые системы"]
    hardware --> network --> os_internals
  end

  subgraph level1["1 · ОПЕРАЦИОННЫЕ СИСТЕМЫ — выбери одну или обе"]
    os_choice["Твоя первая серверная ОС<br/>Начни с одной ветки; вторую добавь по задаче"]
    linux["Linux: Ubuntu / Debian / RHEL<br/>CLI, права, пакеты, процессы, службы и логи"]
    windows["Windows Server<br/>AD, GPO, IIS, DNS и DHCP: домен и службы"]
    os_ready["Проверка: сервер работает<br/>Настрой доступ и службу, найди ошибку в логах"]
    os_choice -->|"Linux или обе ОС"| linux
    os_choice -->|"Windows или обе ОС"| windows
    linux --> os_ready
    windows --> os_ready
  end

  subgraph level2["2 · ИНФРАСТРУКТУРА — разверни, защити и восстанови"]
    virtualization["Виртуализация: Proxmox / VMware / Hyper-V<br/>Выбери гипервизор; создай VM и виртуальную сеть"]
    containers["Контейнеры: Docker<br/>Образы, сети и тома; контейнер отличается от VM"]
    cloud["Облако: AWS / Yandex Cloud / Azure<br/>Выбери одну платформу: VM, сети, диски и затраты"]
    security["Безопасность: IAM, firewall и VPN<br/>Минимальные права, обновления и защищённый доступ"]
    backup_dr["Резервные копии и DR<br/>RPO/RTO, отдельные копии и проверка восстановления"]
    infra_ready["Проверка: инфраструктура готова<br/>Разверни сервис и восстанови его после сбоя"]
    virtualization --> containers
    virtualization --> cloud
    virtualization --> security
    security --> backup_dr
    containers --> infra_ready
    cloud --> infra_ready
    backup_dr --> infra_ready
  end

  subgraph level3["3 · АВТОМАТИЗАЦИЯ И ПРАКТИКА — закрепи базовые навыки"]
    scripts["Скрипты: Bash / Python / PowerShell<br/>Оболочка для своей ОС; Python для общих задач"]
    monitoring["Мониторинг: Zabbix / Prometheus / Grafana<br/>Метрики, панели и оповещения о проблемах"]
    git["Git: история конфигурации и кода<br/>Коммиты, ветки, проверка изменений и откат"]
    iac["Ansible и IaC<br/>Описывай желаемое состояние и повторяй развёртывание"]
    cicd["CI/CD: проверка и доставка изменений<br/>Собери простой pipeline с проверками и откатом"]
    portfolio["Практический проект и портфолио<br/>Сервис, схема, мониторинг, backup и отчёт об инциденте"]
    git --> iac --> cicd
    scripts --> portfolio
    monitoring --> portfolio
    cicd --> portfolio
  end

  subgraph career["ДАЛЬШЕ · от первой роли к самостоятельной работе"]
    junior["Junior системный администратор<br/>Базовые задачи и диагностика с наставником"]
    practice["Реальная практика и рост ответственности<br/>Инциденты, изменения, документация и командная работа"]
    middle["Middle системный администратор<br/>Самостоятельная эксплуатация и улучшение систем"]
    devops["DevOps Engineer<br/>Общие процессы разработки, доставки и эксплуатации"]
    junior --> practice
    practice --> middle
    practice --> devops
  end

  os_internals --> os_choice
  os_ready --> virtualization
  infra_ready --> scripts
  infra_ready --> monitoring
  infra_ready --> git
  portfolio --> junior

  classDef foundation fill:#102b3d,stroke:#64d4ee,color:#eefbff,stroke-width:1.5px
  classDef linuxTrack fill:#10323b,stroke:#67ded4,color:#eafffc,stroke-width:1.5px
  classDef windowsTrack fill:#292143,stroke:#b6a0f5,color:#f5efff,stroke-width:1.5px
  classDef infrastructure fill:#132d40,stroke:#70bce7,color:#eff8ff,stroke-width:1.5px
  classDef protection fill:#362137,stroke:#ed9dcc,color:#fff0fa,stroke-width:1.5px
  classDef automation fill:#28213f,stroke:#baa2f7,color:#f7f0ff,stroke-width:1.5px
  classDef checkpoint fill:#133b41,stroke:#7ce3d8,color:#edfffc,stroke-width:2px
  classDef outcome fill:#35243e,stroke:#f2afd8,color:#fff2fb,stroke-width:2px
  class hardware,network,os_internals,os_choice foundation
  class linux linuxTrack
  class windows windowsTrack
  class virtualization,containers,cloud infrastructure
  class security,backup_dr protection
  class scripts,monitoring,git,iac,cicd automation
  class os_ready,infra_ready,portfolio checkpoint
  class junior,practice,middle,devops outcome
  style level0 fill:#0b1928,stroke:#355d77,color:#c9f4ff
  style level1 fill:#111c2d,stroke:#555078,color:#e2d6ff
  style level2 fill:#0c1c29,stroke:#355d77,color:#c9f4ff
  style level3 fill:#17192c,stroke:#5e507d,color:#e5d7ff
  style career fill:#211b2c,stroke:#78506c,color:#ffd8ef
  linkStyle default stroke:#83a8be,stroke-width:1.6px

  click hardware href "?lesson=ct-computer-architecture" "Изучить оборудование" _self
  click network href "?lesson=network-models" "Изучить основы сетей" _self
  click os_internals href "?lesson=ct-os-internals" "Изучить устройство ОС" _self
  click os_choice href "?view=roadmap" "Открыть учебные направления" _self
  click linux href "?lesson=linux-basics" "Начать Linux" _self
  click windows href "?lesson=server-deployment" "Начать Windows Server" _self
  click os_ready href "?view=labs" "Проверить навыки в лаборатории" _self
  click virtualization href "?lesson=virtualization" "Создать виртуальную лабораторию" _self
  click containers href "?lesson=devops-basics" "Изучить Docker" _self
  click cloud href "?lesson=cloud-foundations" "Изучить основы облака" _self
  click security href "?lesson=zero-trust" "Изучить принципы доступа" _self
  click backup_dr href "?lesson=backup-dr" "Проверить резервирование и DR" _self
  click infra_ready href "?view=labs" "Открыть практические работы" _self
  click scripts href "?lesson=bash" "Начать автоматизацию скриптами" _self
  click monitoring href "?lesson=operations-monitoring" "Изучить мониторинг" _self
  click git href "?lesson=devops-basics" "Изучить Git" _self
  click iac href "?lesson=ansible-iac" "Изучить Ansible и IaC" _self
  click cicd href "?lesson=devops-basics" "Изучить CI/CD" _self
  click portfolio href "?lesson=incident-portfolio" "Собрать итоговый проект" _self
  click junior href "?view=labs" "Закрепить базовые навыки" _self
  click practice href "?lesson=incident-portfolio" "Отработать инцидент и документацию" _self
  click middle href "?view=roadmap" "Выбрать навыки для дальнейшего роста" _self
  click devops href "?lesson=ansible-iac" "Продолжить изучение автоматизации" _self
`;

export const sysadminRoadmapLevels = [
  { id: 0, title: 'Фундамент' },
  { id: 1, title: 'Операционные системы' },
  { id: 2, title: 'Инфраструктура' },
  { id: 3, title: 'Автоматизация и практика' },
  { id: 4, title: 'Карьера и дальнейший рост' },
];

// The same destinations remain available without interacting with the diagram.
export const sysadminRoadmapNodes = [
  { id: 'hardware', title: 'Оборудование компьютера и сервера', description: 'CPU, RAM, диски и RAID: ресурсы и надёжность.', href: '?lesson=ct-computer-architecture', level: 0 },
  { id: 'network', title: 'Сети: OSI, TCP/IP, IPv4 и IPv6', description: 'DNS и DHCP: имена, адреса и путь пакета.', href: '?lesson=network-models', level: 0 },
  { id: 'os_internals', title: 'Принципы Windows и Linux', description: 'Ядро, память, процессы и файловые системы.', href: '?lesson=ct-os-internals', level: 0 },
  { id: 'os_choice', title: 'Твоя первая серверная ОС', description: 'Начни с одной ветки; вторую добавь по задаче.', href: '?view=roadmap', level: 1 },
  { id: 'linux', title: 'Linux: Ubuntu / Debian / RHEL', description: 'CLI, права, пакеты, процессы, службы и логи.', href: '?lesson=linux-basics', level: 1 },
  { id: 'windows', title: 'Windows Server', description: 'AD, GPO, IIS, DNS и DHCP: домен и службы.', href: '?lesson=server-deployment', level: 1 },
  { id: 'os_ready', title: 'Проверка: сервер работает', description: 'Настрой доступ и службу, найди ошибку в логах.', href: '?view=labs', level: 1 },
  { id: 'virtualization', title: 'Виртуализация: Proxmox / VMware / Hyper-V', description: 'Выбери гипервизор; создай VM и виртуальную сеть.', href: '?lesson=virtualization', level: 2 },
  { id: 'containers', title: 'Контейнеры: Docker', description: 'Образы, сети и тома; контейнер отличается от VM.', href: '?lesson=devops-basics', level: 2 },
  { id: 'cloud', title: 'Облако: AWS / Yandex Cloud / Azure', description: 'Выбери одну платформу: VM, сети, диски и затраты.', href: '?lesson=cloud-foundations', level: 2 },
  { id: 'security', title: 'Безопасность: IAM, firewall и VPN', description: 'Минимальные права, обновления и защищённый доступ.', href: '?lesson=zero-trust', level: 2 },
  { id: 'backup_dr', title: 'Резервные копии и DR', description: 'RPO/RTO, отдельные копии и проверка восстановления.', href: '?lesson=backup-dr', level: 2 },
  { id: 'infra_ready', title: 'Проверка: инфраструктура готова', description: 'Разверни сервис и восстанови его после сбоя.', href: '?view=labs', level: 2 },
  { id: 'scripts', title: 'Скрипты: Bash / Python / PowerShell', description: 'Оболочка для своей ОС; Python для общих задач.', href: '?lesson=bash', level: 3 },
  { id: 'monitoring', title: 'Мониторинг: Zabbix / Prometheus / Grafana', description: 'Метрики, панели и оповещения о проблемах.', href: '?lesson=operations-monitoring', level: 3 },
  { id: 'git', title: 'Git: история конфигурации и кода', description: 'Коммиты, ветки, проверка изменений и откат.', href: '?lesson=devops-basics', level: 3 },
  { id: 'iac', title: 'Ansible и IaC', description: 'Описывай желаемое состояние и повторяй развёртывание.', href: '?lesson=ansible-iac', level: 3 },
  { id: 'cicd', title: 'CI/CD: проверка и доставка изменений', description: 'Собери простой pipeline с проверками и откатом.', href: '?lesson=devops-basics', level: 3 },
  { id: 'portfolio', title: 'Практический проект и портфолио', description: 'Сервис, схема, мониторинг, backup и отчёт об инциденте.', href: '?lesson=incident-portfolio', level: 3 },
  { id: 'junior', title: 'Junior системный администратор', description: 'Базовые задачи и диагностика с наставником.', href: '?view=labs', level: 4 },
  { id: 'practice', title: 'Реальная практика и рост ответственности', description: 'Инциденты, изменения, документация и командная работа.', href: '?lesson=incident-portfolio', level: 4 },
  { id: 'middle', title: 'Middle системный администратор', description: 'Самостоятельная эксплуатация и улучшение систем.', href: '?view=roadmap', level: 4 },
  { id: 'devops', title: 'DevOps Engineer', description: 'Общие процессы разработки, доставки и эксплуатации.', href: '?lesson=ansible-iac', level: 4 },
];
