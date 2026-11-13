// Fixed, trusted source: never interpolate user content into Mermaid syntax.
// Keep docs/sysadmin-roadmap-2026.mmd identical to this exported string.
export const sysadminRoadmapSource = `%%{init: {"theme":"base","layout":"elk","themeVariables":{"background":"#08111f","primaryTextColor":"#eef7ff","textColor":"#eef7ff","titleColor":"#eef7ff","lineColor":"#83a8be","fontFamily":"Inter, system-ui, sans-serif","fontSize":"16px","clusterBkg":"#0c1727","clusterBorder":"#35516b","edgeLabelBackground":"#101e30"},"flowchart":{"defaultRenderer":"elk","htmlLabels":false,"curve":"linear","nodeSpacing":14,"rankSpacing":24,"padding":10,"wrappingWidth":180},"htmlLabels":false}}%%
flowchart TD
  accTitle: Карта обучения системного администратора 2026
  accDescr: Пять уровней: фундамент, Linux или Windows, инфраструктура, автоматизация и рост от Junior к Middle или DevOps. Первые три уровня находятся в верхнем ряду; после них переходите к нижнему ряду. Нажмите узел, чтобы открыть соответствующий урок.
  subgraph row0[" "]
    direction LR
    subgraph level0["0 · ФУНДАМЕНТ"]
      direction TD
      hardware["ПК и сервер"]
      network["Сети"]
      os_internals["Устройство ОС"]
      hardware --> network --> os_internals
    end
    subgraph level1["1 · ОПЕРАЦИОННЫЕ СИСТЕМЫ"]
      direction TD
      os_choice["Выбор ОС"]
      linux["Linux"]
      windows["Windows Server"]
      os_ready["Сервер готов"]
      os_choice -->|"Linux или обе ОС"| linux
      os_choice -->|"Windows или обе ОС"| windows
      linux --> os_ready
      windows --> os_ready
    end
    subgraph level2["2 · ИНФРАСТРУКТУРА"]
      direction TD
      virtualization["Виртуализация"]
      containers["Docker"]
      cloud["Облако"]
      security["Защита"]
      backup_dr["Backup / DR"]
      infra_ready["Сервис готов"]
      virtualization --> containers
      virtualization --> cloud
      virtualization --> security
      security --> backup_dr
      containers --> infra_ready
      cloud --> infra_ready
      backup_dr --> infra_ready
    end
    level0 --> level1 --> level2
  end
  subgraph row1[" "]
    direction LR
    subgraph level3["3 · АВТОМАТИЗАЦИЯ"]
      direction TD
      scripts["Скрипты"]
      monitoring["Мониторинг"]
      git["Git"]
      iac["Ansible / IaC"]
      cicd["CI/CD"]
      portfolio["Проект"]
      git --> iac --> cicd
      scripts --> portfolio
      monitoring --> portfolio
      cicd --> portfolio
    end
    subgraph career["4 · ПРОФЕССИОНАЛЬНЫЙ РОСТ"]
      direction TD
      junior["Junior"]
      practice["Практика"]
      middle["Middle"]
      devops["DevOps"]
      junior --> practice
      practice --> middle
      practice --> devops
    end
    level3 --> career
  end

  row0 --> row1
  style row0 fill:transparent,stroke:transparent
  style row1 fill:transparent,stroke:transparent
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

  click hardware href "?lesson=csf-cpu-architecture" "Устройство ПК и CPU: ALU, блок управления, регистры и instruction cycle." _self
  click network href "?lesson=network-models" "Сети: OSI, TCP/IP, IPv4 и IPv6: DNS и DHCP: имена, адреса и путь пакета." _self
  click os_internals href "?lesson=csf-kernel-processes" "Ядро, системные вызовы, процессы, потоки и планировщик." _self
  click os_choice href "?view=roadmap" "Твоя первая серверная ОС: Начни с одной ветки; вторую добавь по задаче." _self
  click linux href "?lesson=linux-basics" "Linux: Ubuntu / Debian / RHEL: CLI, права, пакеты, процессы, службы и логи." _self
  click windows href "?lesson=server-deployment" "Windows Server: AD, GPO, IIS, DNS и DHCP: домен и службы." _self
  click os_ready href "?view=labs" "Проверка: сервер работает: Настрой доступ и службу, найди ошибку в логах." _self
  click virtualization href "?lesson=virtualization" "Виртуализация: Proxmox / VMware / Hyper-V: Выбери гипервизор; создай VM и виртуальную сеть." _self
  click containers href "?lesson=devops-basics" "Контейнеры: Docker: Образы, сети и тома; контейнер отличается от VM." _self
  click cloud href "?lesson=cloud-foundations" "Облако: AWS / Yandex Cloud / Azure: Выбери одну платформу: VM, сети, диски и затраты." _self
  click security href "?lesson=zero-trust" "Безопасность: IAM, firewall и VPN: Минимальные права, обновления и защищённый доступ." _self
  click backup_dr href "?lesson=backup-dr" "Резервные копии и DR: RPO/RTO, отдельные копии и проверка восстановления." _self
  click infra_ready href "?view=labs" "Проверка: инфраструктура готова: Разверни сервис и восстанови его после сбоя." _self
  click scripts href "?lesson=bash" "Скрипты: Bash / Python / PowerShell: Оболочка для своей ОС; Python для общих задач." _self
  click monitoring href "?lesson=operations-monitoring" "Мониторинг: Zabbix / Prometheus / Grafana: Метрики, панели и оповещения о проблемах." _self
  click git href "?lesson=devops-basics" "Git: история конфигурации и кода: Коммиты, ветки, проверка изменений и откат." _self
  click iac href "?lesson=ansible-iac" "Ansible и IaC: Описывай желаемое состояние и повторяй развёртывание." _self
  click cicd href "?lesson=devops-basics" "CI/CD: проверка и доставка изменений: Собери простой pipeline с проверками и откатом." _self
  click portfolio href "?lesson=incident-portfolio" "Практический проект и портфолио: Сервис, схема, мониторинг, backup и отчёт об инциденте." _self
  click junior href "?view=labs" "Junior системный администратор: Базовые задачи и диагностика с наставником." _self
  click practice href "?lesson=incident-portfolio" "Реальная практика и рост ответственности: Инциденты, изменения, документация и командная работа." _self
  click middle href "?view=roadmap" "Middle системный администратор: Самостоятельная эксплуатация и улучшение систем." _self
  click devops href "?lesson=ansible-iac" "DevOps Engineer: Общие процессы разработки, доставки и эксплуатации." _self

  %% Пояснения к узлам: подробные темы сохраняются рядом с краткими подписями.
  %% hardware: ПК и сервер — CPU · RAM · диски · RAID
  %% network: Основы сетей — OSI · TCP/IP · IPv4/IPv6 · DNS · DHCP
  %% os_internals: Как работает ОС — Windows / Linux · процессы · память
  %% os_choice: Выбери серверную ОС — Одна ветка или обе
  %% linux: Linux: Ubuntu / Debian / RHEL — CLI · права · службы · логи
  %% windows: Windows Server — AD · GPO · IIS · DNS · DHCP
  %% os_ready: Сервер готов — Доступ · служба · диагностика
  %% virtualization: Виртуализация — Proxmox · VMware · Hyper-V
  %% containers: Docker — Образы · сети · тома
  %% cloud: Облако: выбери одно — AWS · Yandex Cloud · Azure
  %% security: Безопасность — IAM · firewall · VPN
  %% backup_dr: Резервные копии и DR — RPO/RTO · тест восстановления
  %% infra_ready: Инфраструктура готова — Сервис · защита · восстановление
  %% scripts: Скрипты — Bash · Python · PowerShell
  %% monitoring: Мониторинг — Zabbix · Prometheus · Grafana
  %% git: Git — История · ветки · откат
  %% iac: Ansible и IaC — Повторяемая конфигурация
  %% cicd: CI/CD — Проверка · доставка · откат
  %% portfolio: Проект в портфолио — Сервис · мониторинг · backup
  %% junior: Junior Sysadmin — Задачи с наставником
  %% practice: Работающая инфраструктура — Инциденты · изменения · команда
  %% middle: Middle Sysadmin — Самостоятельная эксплуатация
  %% devops: DevOps Engineer — Разработка · доставка · эксплуатация
`;

export const sysadminRoadmapLevels = [
  { id: 0, title: 'Фундамент', shortTitle: 'Фундамент', tone: 'cyan', description: 'Разберитесь, как связаны оборудование, сеть и операционная система.', outcome: 'Вы можете объяснить путь от аппаратных ресурсов до работающей программы.' },
  { id: 1, title: 'Операционные системы', shortTitle: 'Системы', tone: 'teal', description: 'Начните с Linux или Windows Server. Вторую ветку добавьте, когда освоите первую.', outcome: 'Вы настраиваете сервер, доступ и службу, а затем находите ошибку в логах.' },
  { id: 2, title: 'Инфраструктура', shortTitle: 'Инфраструктура', tone: 'blue', description: 'Соедините виртуализацию, контейнеры и облако. Добавьте защиту и проверяемое восстановление.', outcome: 'Сервис развёрнут, доступ ограничен, восстановление после сбоя проверено.' },
  { id: 3, title: 'Автоматизация и практика', shortTitle: 'Автоматизация', tone: 'violet', description: 'Уберите повторяющуюся ручную работу и научитесь наблюдать за результатом изменений.', outcome: 'В портфолио есть воспроизводимый проект с мониторингом и планом отката.' },
  { id: 4, title: 'Карьера и дальнейший рост', shortTitle: 'Профессия', tone: 'pink', description: 'Перенесите навыки в реальные задачи. Ответственность и практика определяют дальнейший рост.', outcome: 'От Junior — к самостоятельной работе Middle или специализации DevOps.' },
];

// The same destinations remain available without interacting with the diagram.
export const sysadminRoadmapNodes = [
  { id: 'hardware', title: 'Устройство ПК и CPU', description: 'ALU, блок управления, регистры и instruction cycle.', href: '?lesson=csf-cpu-architecture', level: 0 },
  { id: 'network', title: 'Сети: OSI, TCP/IP, IPv4 и IPv6', description: 'DNS и DHCP: имена, адреса и путь пакета.', href: '?lesson=network-models', level: 0 },
  { id: 'os_internals', title: 'Ядро, процессы и потоки', description: 'System calls, процессы, потоки и планировщик.', href: '?lesson=csf-kernel-processes', level: 0 },
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

const stageNodeLabels = {
  "hardware": "ПК и сервер<br/>CPU · RAM · диски · RAID",
  "network": "Основы сетей<br/>OSI · TCP/IP · IPv4/IPv6 · DNS · DHCP",
  "os_internals": "Как работает ОС<br/>Windows / Linux · процессы · память",
  "os_choice": "Выбери серверную ОС<br/>Одна ветка или обе",
  "linux": "Linux: Ubuntu / Debian / RHEL<br/>CLI · права · службы · логи",
  "windows": "Windows Server<br/>AD · GPO · IIS · DNS · DHCP",
  "os_ready": "Сервер готов<br/>Доступ · служба · диагностика",
  "virtualization": "Виртуализация<br/>Proxmox · VMware · Hyper-V",
  "containers": "Docker<br/>Образы · сети · тома",
  "cloud": "Облако: выбери одно<br/>AWS · Yandex Cloud · Azure",
  "security": "Безопасность<br/>IAM · firewall · VPN",
  "backup_dr": "Резервные копии и DR<br/>RPO/RTO · тест восстановления",
  "infra_ready": "Инфраструктура готова<br/>Сервис · защита · восстановление",
  "scripts": "Скрипты<br/>Bash · Python · PowerShell",
  "monitoring": "Мониторинг<br/>Zabbix · Prometheus · Grafana",
  "git": "Git<br/>История · ветки · откат",
  "iac": "Ansible и IaC<br/>Повторяемая конфигурация",
  "cicd": "CI/CD<br/>Проверка · доставка · откат",
  "portfolio": "Проект в портфолио<br/>Сервис · мониторинг · backup",
  "junior": "Junior Sysadmin<br/>Задачи с наставником",
  "practice": "Работающая инфраструктура<br/>Инциденты · изменения · команда",
  "middle": "Middle Sysadmin<br/>Самостоятельная эксплуатация",
  "devops": "DevOps Engineer<br/>Разработка · доставка · эксплуатация"
};

// Stage diagrams are extracted from the same fixed source: no separate path can drift.
export const sysadminRoadmapStageSources = Object.fromEntries(sysadminRoadmapLevels.map((level, index) => {
  const lines = sysadminRoadmapSource.split('\n');
  const block = [...sysadminRoadmapSource.matchAll(/^ {4}subgraph [^\n]+\n[\s\S]*?^ {4}end/gm)][index][0]
    .replace(/(\w+)\["[^"]+"\]/g, (match, id) => stageNodeLabels[id] ? `${id}["${stageNodeLabels[id]}"]` : match);
  const ids = new Set(sysadminRoadmapNodes.filter((node) => node.level === level.id).map((node) => node.id));
  const classes = lines.filter((line) => /^ {2}classDef /.test(line));
  for (const line of lines.filter((item) => /^ {2}class /.test(item))) {
    const [, names, style] = line.trim().split(/\s+/);
    const selected = names.split(',').filter((name) => ids.has(name));
    if (selected.length) classes.push(`  class ${selected.join(',')} ${style}`);
  }
  const links = lines.filter((line) => /^ {2}click /.test(line) && ids.has(line.trim().split(/\s+/)[1]));
  const settingsObject = JSON.parse(lines[0].match(/^%%\{init: (.*)\}%%$/)[1]);
  settingsObject.themeVariables.fontSize = '15px';
  Object.assign(settingsObject.flowchart, { nodeSpacing: 38, rankSpacing: 54, padding: 20, wrappingWidth: 270 });
  const settings = `%%{init: ${JSON.stringify(settingsObject)}}%%`;
  return [level.id, [settings, 'flowchart TD', `  accTitle: ${level.title}`, `  accDescr: ${level.description}`, block, ...classes, ...links,
    '  linkStyle default stroke:#83a8be,stroke-width:1.6px'].join('\n')];
}));
