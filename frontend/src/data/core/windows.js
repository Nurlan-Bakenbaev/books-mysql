export default [
  {
    "id": "server-deployment",
    "title": "Windows Server: роли, компоненты и Server Core",
    "business": "Новый файловый сервер должен работать без ненужных служб. Каждая дополнительная роль увеличивает объём обслуживания и поверхность атаки. Server Core уменьшает число GUI-компонентов, но требует заранее подготовленного удалённого управления.",
    "theory": [
      "Роли предоставляют серверные функции, компоненты дополняют возможности платформы. Server Core и Desktop Experience выбираются при установке; в актуальных версиях Windows Server переключение после установки обычно не поддерживается. WinRM, PowerShell Remoting и RSAT позволяют управлять системой без локального рабочего стола.",
      "Перед вводом в домен проверяют время, DNS, имя и сеть. Установка обновлений может требовать перезагрузки. Успешный Install-WindowsFeature не означает, что служба запущена и доступна клиентам. Каналы управления, пользовательских данных и резервного копирования следует разделять."
    ],
    "setup": "Windows Server 2022/2025 Evaluation VM, консоль, 2 vCPU, не менее 4 GiB RAM и отдельный lab vSwitch; snapshot до опыта, без подключения к рабочему домену.",
    "commands": "Get-ComputerInfo | Select-Object WindowsProductName,WindowsVersion,CsName # редакция и имя\nGet-NetIPConfiguration # адрес и DNS\nGet-WindowsFeature | Where-Object Installed # установленные роли\nGet-Service WinRM # служба управления\nTest-WSMan localhost # локальный тест управления\n# Install-WindowsFeature FS-FileServer -IncludeManagementTools — nur im dedizierten Fileserver-Lab\nGet-WinEvent -LogName Setup -MaxEvents 10 # события установки",
    "expected": "Зафиксированы имя, IP/DNS, роли и результат WinRM. Разрешённый management-клиент управляет сервером, посторонняя сеть — нет.",
    "problems": [
      [
        "Не работает Remoting",
        "Test-WSMan, WinRM Operational, DNS и профиль сети отделяют транспорт от аутентификации. Исправьте Kerberos/сертификат и узкое правило firewall, повторите remote inventory; не задавайте TrustedHosts=*."
      ],
      [
        "Роль требует reboot",
        "Проверьте RestartNeeded и Setup log. Выполните согласованную перезагрузку, затем проверьте роль, службу и запрос клиента."
      ],
      [
        "Не находится домен",
        "Get-DnsClientServerAddress и Resolve-DnsName SRV покажут неверный resolver. Укажите внутренний DNS, проверьте время, повторите Join."
      ]
    ],
    "security": "Управление из отдельной сети и admin identity, минимальные роли и поддерживаемые обновления. Evaluation не заменяет production-лицензирование.",
    "tasks": [
      "Установите Core VM и получите inventory/Eventlog удалённо с разрешённого management-клиента.",
      "Установите только Fileserver role, опишите новые порты/службы и удалите роль после проверки."
    ],
    "sources": [
      "https://learn.microsoft.com/windows-server/administration/server-core/what-is-server-core",
      "https://learn.microsoft.com/windows-server/administration/server-core/server-core-sconfig"
    ]
  },
  {
    "id": "ad-ds",
    "title": "AD DS: леса, домены и сайты",
    "business": "Нескольким площадкам нужен общий каталог идентификации. Единственный DC и случайные настройки DNS создают точку отказа: архитектуру, репликацию и восстановление нужно проверить до массового создания пользователей.",
    "theory": [
      "Лес — граница безопасности с общей схемой и Configuration Partition; домен — область репликации и администрирования, но не полная защита от администраторов леса. OU организует объекты для делегирования и применения GPO. Сайты описывают физические сети и влияют на выбор DC и репликацию.",
      "Kerberos использует билеты, работающий DNS и достаточно точное время. DC Locator находит службы через SRV. AD использует multimaster-репликацию с отдельными FSMO-ролями; SYSVOL реплицируется отдельно через DFSR. Второй DC повышает доступность, но не заменяет System State Backup и проверенный план восстановления леса."
    ],
    "setup": "Две изолированные Server VM, lab.example, DC1 192.0.2.10 и DC2 .11; уникальные имена, внутренний DNS и консоль. Promotion только в собственном стенде.",
    "commands": "Get-ADForest # лес и FSMO\nGet-ADDomain # домен и роли\nGet-ADDomainController -Filter * | Select-Object HostName,Site,IPv4Address # список DC\nResolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.lab.example # поиск DC\nrepadmin /replsummary # сводка репликации\ndcdiag /test:DNS # проверка DNS\nGet-SmbShare -Name SYSVOL,NETLOGON # доменные общие папки",
    "expected": "Найдены оба DC, SRV указывает доступные узлы, replsummary не содержит необъяснённых ошибок. Новая lab OU появляется на обоих DC.",
    "problems": [
      [
        "Клиент не находит DC",
        "Проверьте SRV, ipconfig /all и DNS logs; исправьте внутренний resolver и повторите DC Locator."
      ],
      [
        "Ошибки репликации",
        "repadmin /showrepl сообщает партнёра и код; Directory Service log, время и сеть уточняют причину. Исправьте её и подтвердите replsummary."
      ],
      [
        "Файлы GPO отсутствуют",
        "Проверьте SYSVOL/NETLOGON и DFS Replication log. Восстановите DFSR по процедуре Microsoft и подтвердите обе части репликации."
      ]
    ],
    "security": "DC — привилегированная инфраструктура: без повседневных приложений и входов обычных пользователей. Не откатывайте DC случайными snapshots вместо recovery процедуры.",
    "tasks": [
      "Поднимите два DC: SRV, репликация и новая OU подтверждены с обоих узлов.",
      "Смоделируйте два Site с lab подсетями и подтвердите выбор DC клиентом."
    ],
    "sources": [
      "https://learn.microsoft.com/windows-server/identity/ad-ds/plan/understanding-the-active-directory-logical-model",
      "https://learn.microsoft.com/windows-server/identity/ad-ds/manage/troubleshoot/troubleshooting-active-directory-replication-problems"
    ]
  },
  {
    "id": "iam-rbac-laps",
    "title": "Объекты AD и ролевая модель доступа",
    "business": "Новые сотрудники должны получать доступ к папке отдела, а уволенные — терять его вовремя. Прямые ACL на каждого пользователя усложняют отзыв и аудит; модель доступа должна опираться на роли и отдельные группы ресурсов.",
    "theory": [
      "AGDLP связывает Accounts с Global groups, затем Domain Local groups и Permissions. В нескольких доменах может применяться AGUDLP с Universal groups. OU задаёт область делегирования и GPO, но не является группой доступа. SID устойчиво идентифицирует субъект: переименование не меняет SID.",
      "Access Token содержит группы на момент входа. После изменения членства может понадобиться новая сессия. Для SMB совместно действуют права share и NTFS. Windows LAPS отдельно управляет паролями локальных администраторов; право читать сохранённый пароль высокопривилегированно и требует делегирования и аудита."
    ],
    "setup": "AD lab с RSAT и OU Lab-Users/Workstations; создавайте только новые тестовые объекты. Существующие учётные записи не менять.",
    "commands": "$base = \"DC=lab,DC=example\" # свой lab домен\nNew-ADOrganizationalUnit -Name Lab-Users -Path $base # только если отсутствует\nNew-ADOrganizationalUnit -Name Workstations -Path $base # цель GPO\nNew-ADGroup -Name GG-Lab-Readers -GroupScope Global -Path \"OU=Lab-Users,$base\" # роль\nNew-ADGroup -Name DL-Lab-Share-Read -GroupScope DomainLocal -Path \"OU=Lab-Users,$base\" # ресурс\nAdd-ADGroupMember DL-Lab-Share-Read GG-Lab-Readers # вложить группу\nGet-ADGroupMember DL-Lab-Share-Read # проверить связь",
    "expected": "Ролевая группа входит в ресурсную. После настройки Read ACL тестовый пользователь читает, но не пишет; контрольный пользователь доступа не имеет.",
    "problems": [
      [
        "Группа есть, доступа нет",
        "whoami /groups, Get-ADGroupMember и icacls проверяют token и ACL. Исправьте ресурсную группу, выполните новый вход и отдельно проверьте чтение/запись."
      ],
      [
        "Helpdesk имеет лишние права",
        "Проверьте делегирование lab OU через dsacls. Оставьте нужные object/property permissions и подтвердите отказ запрещённой операции."
      ],
      [
        "Пароль LAPS читает лишний пользователь",
        "Проверьте ACL и LAPS delegation; ограничьте чтение уполномоченной группой, повторите тест обычным пользователем."
      ]
    ],
    "security": "Не используйте Domain Admins для обычной работы и пароли в CSV. Удаляйте только фактически созданные объекты по GUID/DN, не всю OU.",
    "tasks": [
      "Реализуйте AGDLP для Read/Modify: три аккаунта, положительные и отрицательные проверки.",
      "Helpdesk может сбросить пароль lab пользователя, но не изменить группы доступа; подтвердите оба исхода."
    ],
    "sources": [
      "https://learn.microsoft.com/windows-server/identity/ad-ds/manage/understand-security-groups",
      "https://learn.microsoft.com/windows-server/identity/laps/laps-overview"
    ]
  },
  {
    "id": "gpo",
    "title": "GPO: применение и диагностика",
    "business": "Политика безопасности применяется лишь к части компьютеров. Вместо ручной установки параметра нужно определить область действия, обработку на клиенте и выигравшую политику, сохранив централизованное управление.",
    "theory": [
      "LSDOU описывает базовый порядок Local, Site, Domain, OU; наследование, Link Order, Enforced и Block Inheritance меняют итог. Security Filtering требует Read и Apply Group Policy; WMI Filter задаёт дополнительные условия. Пользовательская и компьютерная части обрабатываются для соответствующего объекта.",
      "GPO состоит из метаданных AD и файлов в SYSVOL. Client-Side Extensions применяют параметры при запуске, входе или обновлении; некоторые требуют перезагрузки. Loopback Merge/Replace выбирает пользовательские настройки по расположению компьютера и не исправляет ошибочную OU автоматически. Resultant Set of Policy показывает фактическую обработку; значение Registry само по себе не объясняет источник."
    ],
    "setup": "Учебный домен, клиент в Workstations и отдельный пользователь в Lab-Users; новую GPO связывать только с тестовой OU.",
    "commands": "Get-GPO -All | Select-Object DisplayName,Id # список GPO\ngpupdate /target:user /force # только пользовательская политика\ngpresult /r /scope:user # применённые и отклонённые GPO\ngpresult /h \"$env:TEMP\\lab-gpo.html\" /f # отчёт в доступном каталоге\nGet-WinEvent -LogName Microsoft-Windows-GroupPolicy/Operational -MaxEvents 30 # обработка",
    "expected": "gpresult содержит Lab-GPO и причины фильтрации; HTML создаётся в TEMP нужного пользователя, настройка видна в его сессии.",
    "problems": [
      [
        "GPO не появляется",
        "Проверьте OU, Link, User/Computer part, denied list gpresult и Security Filtering. Исправьте scope и повторите вход."
      ],
      [
        "GPO применена, параметр другой",
        "HTML gpresult показывает winning GPO; проверьте Link Order/Enforced/CSE logs. Устраните конфликт и повторно проверьте Resultant Policy."
      ],
      [
        "Различие между DC",
        "repadmin и DFSR logs выявляют расхождение AD/SYSVOL. Исправьте репликацию и повторите тест при согласованных версиях."
      ]
    ],
    "security": "Сначала маленькая test OU, backup GPO и change log. Не экспериментируйте с доменными политиками и не используйте Enforced как универсальное исправление.",
    "tasks": [
      "User GPO применяется к test OU, но не к пользователю вне её.",
      "Уберите Apply у lab группы, докажите причину через gpresult, восстановите разрешение и исходную конфигурацию."
    ],
    "sources": [
      "https://learn.microsoft.com/windows-server/identity/ad-ds/manage/group-policy/group-policy-overview",
      "https://learn.microsoft.com/windows-server/administration/windows-commands/gpresult"
    ]
  },
  {
    "id": "pki-ca",
    "title": "PKI и центры сертификации",
    "business": "У внутреннего HTTPS-сервиса истёк сертификат. Привычка обходить предупреждения скрывает реальные проблемы идентичности. PKI должна обеспечивать выпуск, обновление, отзыв и доверие, а не только создание сертификата.",
    "theory": [
      "X.509 связывает публичный ключ с именем или идентичностью, сроком действия, SAN, Key Usage и EKU. Клиент проверяет цепочку доверия, время, имя и policy; корректной подписи недостаточно. Root CA является trust anchor, Intermediate CA ограничивает ежедневное использование корневого ключа.",
      "Закрытый ключ остаётся у владельца, CSR содержит публичный ключ и запрошенные атрибуты. CA проверяет заявителя и допустимые имена. CRL/OCSP сообщают об отзыве в рамках политики клиента. Шаблоны AD CS с широким Enrollment и произвольными именами для Authentication могут позволить повышение привилегий."
    ],
    "setup": "Ubuntu VM с OpenSSL; самоподписанный сертификат только для lab, без импорта в системное доверие и без установки CA в рабочей сети.",
    "commands": "umask 077 # закрытый файл только владельцу\nwork=$(mktemp -d) # свои PKI файлы\nopenssl req -x509 -newkey rsa:3072 -nodes -days 1 -subj \"/CN=lab.example\" -addext \"subjectAltName=DNS:lab.example\" -keyout \"$work/key.pem\" -out \"$work/cert.pem\" # краткоживущий lab сертификат\nopenssl x509 -in \"$work/cert.pem\" -noout -subject -issuer -dates -ext subjectAltName # метаданные\nopenssl verify -CAfile \"$work/cert.pem\" \"$work/cert.pem\" # явное доверие только lab\nrm \"$work/key.pem\" \"$work/cert.pem\" # удалить созданные ключи\nrmdir \"$work\" # системное доверие не менялось",
    "expected": "SAN содержит lab.example, срок — один день. Verify сообщает OK только с явным lab CAfile; публичное доверие этим не подтверждается.",
    "problems": [
      [
        "Неизвестная CA",
        "openssl s_client -showcerts и клиентский журнал выявляют пропущенный Intermediate/Root. Настройте полную цепочку и согласованный trust, повторите без -k."
      ],
      [
        "Имя не совпадает",
        "Сравните SAN с DNS-именем запроса. Выпустите сертификат на допустимое имя и повторите запрос по этому имени."
      ],
      [
        "Срок неверен",
        "openssl x509 -dates и системное время отличают expiration от clock drift. Исправьте время либо обновите сертификат, повторите chain/name/time проверки."
      ]
    ],
    "security": "Закрытые ключи вне Git, защищённая Root, минимальное Enrollment и контроль обновления. Самоподписанный lab сертификат не импортировать в корпоративное доверие.",
    "tasks": [
      "Создайте CSR с SAN и проверьте его без вывода закрытого ключа.",
      "Lab HTTPS проходит проверку с явным CAfile для верного имени и отклоняет неверное, без -k."
    ],
    "sources": [
      "https://www.rfc-editor.org/rfc/rfc5280",
      "https://learn.microsoft.com/windows-server/identity/ad-cs/active-directory-certificate-services-overview"
    ]
  },
  {
    "id": "powershell",
    "title": "PowerShell для системного инженера",
    "business": "Импорт пользователей не должен оставлять незаметно наполовину настроенные аккаунты. Нужны проверка входа, WhatIf, точная обработка ошибок и журнал только действительно созданных объектов.",
    "theory": [
      "PowerShell передаёт по конвейеру объекты, а не просто строки. Select-Object сохраняет свойства, Format-Table предназначен для отображения и не должен предшествовать Export-Csv. Нетерминирующие ошибки попадают в try/catch при -ErrorAction Stop; ErrorActionPreference задают осознанно в нужном scope.",
      "Advanced Functions с SupportsShouldProcess поддерживают WhatIf/Confirm для объявленных изменений. WhatIf не является транзакцией. Идемпотентный сценарий проверяет целевое состояние и уникальную identity. Откат затрагивает лишь успешно созданные в этом запуске GUID/DN. SecureString не делает небезопасный источник пароля безопасным."
    ],
    "setup": "PowerShell 7 или Windows PowerShell 5.1, собственный TEMP-каталог; пример не меняет AD.",
    "commands": "$ErrorActionPreference = \"Stop\" # останавливаться при ошибке\n$dir = Join-Path ([IO.Path]::GetTempPath()) ([guid]::NewGuid()) # уникальный путь\nNew-Item -ItemType Directory -Path $dir | Out-Null # свой каталог\ntry {\n  Get-Process | Select-Object -First 5 Name,Id | Export-Csv (Join-Path $dir \"processes.csv\") -NoTypeInformation # экспорт объектов\n  $rows = Import-Csv (Join-Path $dir \"processes.csv\") # прочитать обратно\n  if ($rows.Count -ne 5) { throw \"Unexpected row count\" } # проверить результат\n  $rows | Format-Table # форматирование в конце\n} finally {\n  Remove-Item (Join-Path $dir \"processes.csv\") -ErrorAction SilentlyContinue # только своя запись\n  Remove-Item $dir # свой пустой каталог\n}",
    "expected": "CSV содержит пять процессов с Name/Id, Import-Csv подтверждает число строк. После finally не остаётся созданных файлов.",
    "problems": [
      [
        "catch не срабатывает",
        "Проверьте ErrorRecord и ErrorAction; воспроизведите отсутствующий Get-Item с Stop и подтвердите catch."
      ],
      [
        "CSV содержит форматирование",
        "Найдите Format-Table до Export-Csv. Уберите formatter, проверьте свойства после Import-Csv."
      ],
      [
        "Откат затрагивает старые аккаунты",
        "Журнал должен содержать только GUID/DN успешно созданных New-ADUser. Исправьте tracking, проверьте, что предсуществующий аккаунт переживает rollback."
      ]
    ],
    "security": "Пароли не должны попадать в CSV/Transcript. Ограниченное Remoting, review и WhatIf перед изменениями; откат только своих объектов.",
    "tasks": [
      "Напишите SupportsShouldProcess функцию для собственного каталога: WhatIf не меняет файлы.",
      "CSV с дубликатом и пустым обязательным полем отклоняется до первой мутации."
    ],
    "sources": [
      "https://learn.microsoft.com/powershell/scripting/learn/deep-dives/everything-about-shouldprocess",
      "https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_try_catch_finally"
    ]
  }
];
