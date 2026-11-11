import { securityPlusDepth } from './securityPlusDepth.js';

// Неофициальный учебный маршрут по открытой структуре CompTIA Security+ SY0-701.
// Материал написан для платформы; внешние источники используются для проверки терминов и практики.

const profiles = [
  {
    id: 'secplus-controls-zero-trust', title: 'Контроли безопасности и Zero Trust', description: 'CIA, AAA, типы контролей, least privilege и перевод бизнес-требования в проверяемую меру.',
    theory: [
      'Безопасность начинается с цели: конфиденциальность ограничивает чтение данных, целостность защищает их от незаметного изменения, а доступность сохраняет работу в нужный момент. К ним добавляются аутентичность и неотказуемость. Один контроль редко закрывает все свойства, поэтому администратор записывает, какое свойство и от какого сценария он защищает.',
      'Контроли классифицируют по природе и назначению. Технический контроль реализует система, административный задаёт процесс, физический ограничивает пространство. Preventive снижает вероятность события, detective показывает факт, corrective возвращает систему в норму, compensating временно покрывает ограничение. MFA является preventive-контролем, журнал входов — detective, а восстановление из копии — corrective.',
      'Zero Trust строится на явной проверке каждого запроса, минимальных правах и предположении о возможной компрометации. Решение учитывает личность, устройство, ресурс, риск и контекст сеанса. Сетевое расположение само по себе не даёт доверия, а повторная проверка нужна при изменении риска или выполнении чувствительного действия.',
      'В лаборатории полезно превратить абстрактную цель в матрицу: актив, угроза, preventive-контроль, событие detection, владелец и проверка восстановления. Такая запись показывает пробелы лучше списка продуктов и связывает техническое изменение с измеримым результатом.',
    ],
    inventory: "python3 - <<'PY'\ncontrols = [('данные клиентов','утечка','MFA + least privilege','необычный вход'),('веб-сервис','отказ','резервирование','health check')]\nfor row in controls: print(' | '.join(row))\nPY",
    exercise: "# Создайте controls.csv только с вымышленными активами лаборатории.\nprintf '%s\n' 'asset,threat,prevent,detect,recover,owner' 'lab-vm,stolen password,MFA,login alert,revoke session,student' > controls.csv\ncat controls.csv\n# Очистка:\nrm -f controls.csv",
    expected: 'Получена матрица, где каждый риск имеет preventive, detective и recovery-контроль, владельца и наблюдаемый способ проверки; файл с учебными данными удалён.',
    detection: 'Проверяйте события аутентификации, изменения ролей, новые устройства, изменение политики и запросы к чувствительным ресурсам. Сигнал должен содержать субъект, объект, решение доступа, время и correlation ID без записи секретов.',
    defense: 'Применяйте явную проверку, MFA, least privilege, сегментацию и короткие сеансы по риску. Для каждого контроля назначайте владельца, способ тестирования и дату пересмотра.',
    sources: ['sp-comptia-objectives', 'sp-developer-roadmap', 'mitre-attack-docs'],
    question: ['Какой контроль сообщает, что событие уже произошло?', ['Detective', 'Preventive', 'Directive', 'Physical'], 0, 'Detective-контроль создаёт наблюдаемый сигнал; preventive снижает вероятность события.'],
  },
  {
    id: 'secplus-crypto-pki', title: 'Криптография, хеширование и PKI', description: 'Шифрование, подпись, хеш, сертификаты, цепочка доверия и практическая проверка TLS.',
    theory: [
      'Шифрование обеспечивает конфиденциальность, если ключ защищён. Симметричный алгоритм использует общий секрет и подходит для больших объёмов данных; асимметричная пара связывает открытый и закрытый ключи и помогает согласовать секрет или проверить подпись. Хеш необратимо отображает данные в фиксированное значение и позволяет обнаружить изменение, но сам по себе не подтверждает автора.',
      'Цифровая подпись создаётся закрытым ключом и проверяется открытым. Она подтверждает целостность и владение ключом, но доверие к личности зависит от процесса выдачи сертификата. PKI связывает имя и открытый ключ через центр сертификации, цепочку доверия, сроки действия и статусы отзыва CRL или OCSP.',
      'TLS обычно применяет сертификат сервера, согласование сеансового ключа и симметричное шифрование трафика. Проверка должна включать имя узла, срок действия, назначение ключа и доверенную цепочку. Игнорирование ошибки сертификата уничтожает смысл проверки сервера и допустимо только в явно контролируемом учебном сценарии.',
      'Управление ключами важнее выбора модного алгоритма: ключи генерируют из надёжной случайности, хранят отдельно от данных, ограничивают по назначению, ротируют и уничтожают по процедуре. Резервирование ключа требуется там, где без него невозможно восстановить зашифрованные данные, но копия должна иметь отдельную защиту и аудит.',
    ],
    inventory: "openssl version\nprintf 'security-plus-lab' > message.txt\nsha256sum message.txt\nopenssl req -x509 -newkey rsa:2048 -nodes -subj '/CN=lab.local' -keyout lab.key -out lab.crt -days 1 2>/dev/null\nopenssl x509 -in lab.crt -noout -subject -issuer -dates -fingerprint -sha256",
    exercise: "openssl dgst -sha256 -sign lab.key -out message.sig message.txt\nopenssl dgst -sha256 -verify <(openssl x509 -in lab.crt -pubkey -noout) -signature message.sig message.txt\nprintf 'changed' >> message.txt\nopenssl dgst -sha256 -verify <(openssl x509 -in lab.crt -pubkey -noout) -signature message.sig message.txt || true\n# Очистка ключа и учебных файлов:\nrm -f lab.key lab.crt message.txt message.sig",
    expected: 'Подпись исходного файла проходит проверку, после изменения проверка завершается ошибкой; обучающийся объясняет, почему самоподписанный сертификат не создаёт внешнего доверия.',
    detection: 'Наблюдайте выпуск и отзыв сертификатов, изменение key store, экспорт private key, ошибки цепочки и неожиданные алгоритмы. Инвентаризация должна заранее находить истекающие сертификаты.',
    defense: 'Используйте поддерживаемые алгоритмы и протоколы, защищённое хранилище ключей, минимальные права на private key, автоматическое обновление сертификатов и проверку цепочки без отключения ошибок.',
    sources: ['sp-comptia-objectives', 'sp-owasp-cheats', 'owasp-passwords'],
    question: ['Что подтверждает изменение файла без раскрытия его содержимого?', ['Сравнение криптографического хеша', 'Base64-кодирование', 'Сжатие', 'Имя файла'], 0, 'Изменение входа с высокой вероятностью меняет криптографический хеш; Base64 шифрованием не является.'],
  },
  {
    id: 'secplus-threats-social', title: 'Угрозы, вредоносное ПО и социальная инженерия', description: 'Threat actors, векторы, phishing, malware и разбор признаков без открытия опасного содержимого.',
    theory: [
      'Threat actor описывают по мотивации, ресурсам, навыкам и доступу: киберпреступник ищет прибыль, инсайдер уже имеет доверенный контекст, государственная группа может вести долгую операцию, а hacktivist добивается публичного эффекта. Attribution редко бывает абсолютной; для защиты важнее наблюдаемое поведение и активы под риском.',
      'Вектор — путь доставки или доступа: письмо, вредоносная реклама, украденная учётная запись, внешний сервис, съёмный носитель или цепочка поставки. Phishing использует срочность, авторитет и несоответствие реального адреса заявленному. Пользователь не должен самостоятельно открывать вложение ради проверки: безопаснее передать оригинал по процедуре анализа.',
      'Malware описывают по поведению: ransomware шифрует или крадёт данные, trojan маскирует полезную функцию, worm распространяется автоматически, rootkit скрывает присутствие. Один файл может сочетать несколько поведений. Хеш помогает сопоставлению известного образца, но злоумышленник легко изменит файл, поэтому нужны поведенческие события.',
      'Разбор подозрительного сообщения начинается с сохранения доказательств и проверки заголовков, домена, контекста запроса и независимого подтверждения отправителя. Не переходите по ссылке и не вводите учётные данные. Учебная лаборатория использует только синтетическое письмо без реального payload.',
    ],
    inventory: "cat > sample-headers.txt <<'EOF'\nFrom: Helpdesk <support@example.invalid>\nReply-To: reset@lookalike.invalid\nSubject: Срочно подтвердите пароль\nAuthentication-Results: spf=fail dkim=none dmarc=fail\nEOF\ncat sample-headers.txt",
    exercise: "python3 - <<'PY'\nfrom email.parser import Parser\nh=Parser().parsestr(open('sample-headers.txt').read())\nfor k in ['From','Reply-To','Subject','Authentication-Results']: print(f'{k}: {h[k]}')\nprint('VERDICT: suspicious; do not open links; report through approved channel')\nPY\nrm -f sample-headers.txt",
    expected: 'Отмечены несовпадающие From/Reply-To, провал проверок домена и социальный триггер; сообщение классифицировано и передано по процедуре без открытия ссылок.',
    detection: 'Коррелируйте mail gateway verdict, URL/domain reputation, authentication results, создание процесса из офисного приложения, загрузки и последующий вход. Храните оригинальные заголовки и цепочку действий.',
    defense: 'Применяйте SPF/DKIM/DMARC, фильтрацию вложений, MFA, ограничение macro/script, EDR и простой канал сообщения. Обучение должно давать практику распознавания и безопасный способ уточнить запрос.',
    sources: ['sp-comptia-objectives', 'mitre-attack-docs', 'sp-developer-roadmap'],
    question: ['Что безопаснее сделать с подозрительным вложением?', ['Не открывать и передать по утверждённой процедуре', 'Запустить с правами администратора', 'Переименовать расширение', 'Отправить коллегам'], 0, 'Анализ выполняют в контролируемой среде специалисты; пользователь сохраняет evidence и не активирует содержимое.'],
  },
  {
    id: 'secplus-vulnerability-management', title: 'Уязвимости, сканирование и исправление', description: 'Inventory, CVE/CVSS, safe scan, patching, compensating controls и подтверждённый retest.',
    theory: [
      'Уязвимость — слабость, которую угроза может использовать, а exposure описывает доступность компонента. CVE задаёт идентификатор, CVSS оценивает техническую тяжесть, но приоритет также зависит от доступности извне, критичности актива, наличия эксплуатации и компенсирующих мер. Высокий балл не заменяет контекст.',
      'Сканер формирует гипотезы по версии, конфигурации и ответу сервиса. Credentialed scan видит пакеты и настройки глубже, но требует защищённой учётной записи с минимальными правами. Результат может быть false positive или не учитывать backport, поэтому finding подтверждают безопасной проверкой версии и документацией поставщика.',
      'Цикл включает inventory, discovery, анализ, приоритизацию, исправление, retest и отчёт об исключениях. Патч тестируют на canary, готовят backup и health check. Если патч временно невозможен, применяют сегментацию, отключение функции или WAF, назначают владельца и срок пересмотра.',
      'Сканировать можно только собственный адрес или явно разрешённый диапазон. Темп ограничивают, слабые устройства исключают, а действия согласуют с владельцем. В учебной лаборатории сравниваются локально установленные пакеты и открытые порты без эксплуатации.',
    ],
    inventory: "uname -a\n(ss -lntup || netstat -lnt) 2>/dev/null\npython3 -m pip list --outdated --format=columns 2>/dev/null | head -20 || true",
    exercise: "python3 - <<'PY'\nfindings=[('LAB-001','outdated demo package',8.1,'local only'),('LAB-002','unused listener',6.5,'reachable from lab VLAN')]\nfor i,t,s,c in sorted(findings,key=lambda x:x[2],reverse=True): print(i,s,t,'|',c)\nprint('Next: verify -> remediate -> health check -> rescan')\nPY",
    expected: 'Создан небольшой список подтверждаемых findings с контекстом, приоритетом, мерой, проверкой сервиса и обязательным повторным сканированием; эксплуатация не выполнялась.',
    detection: 'Отслеживайте запуски scanner, множество соединений к портам, изменение пакетов и конфигурации, возраст findings и просроченные исключения. Отчёт должен различать найдено, подтверждено и закрыто retest.',
    defense: 'Поддерживайте inventory и SLA, сканируйте безопасными волнами, исправляйте первопричину, документируйте исключения и подтверждайте закрытие тем же тестом плюс health check.',
    sources: ['sp-comptia-objectives', 'nmap-source', 'linux-compliance-docs'],
    question: ['Когда finding можно считать закрытым?', ['После исправления, health check и отрицательного retest', 'После назначения CVE', 'После экспорта CSV', 'После первого сканирования'], 0, 'Retest подтверждает устранение пути, а health check — отсутствие поломки нормальной работы.'],
  },
  {
    id: 'secplus-architecture-resilience', title: 'Безопасная архитектура и устойчивость', description: 'Сегментация, cloud/shared responsibility, HA, backups, RTO/RPO и tabletop-проверка отказа.',
    theory: [
      'Архитектура задаёт trust boundaries и потоки данных до выбора продукта. Сегментация ограничивает blast radius, allow-list разрешает только нужные потоки, а отдельная management plane снижает риск от пользовательской сети. Каждый разрешённый маршрут документируют по источнику, назначению, протоколу и владельцу.',
      'В облаке shared responsibility меняется по модели IaaS, PaaS и SaaS: провайдер защищает физическую и часть платформенной инфраструктуры, клиент сохраняет ответственность за идентификацию, данные, настройки доступа и используемый код. Ошибка публичного доступа остаётся риском клиента даже при безопасном дата-центре.',
      'High availability снижает простой при отказе компонента, но не заменяет backup. RTO задаёт допустимое время восстановления, RPO — допустимую потерю данных. Репликация может быстро распространить удаление или повреждение, поэтому нужны независимые неизменяемые копии и проверенный restore.',
      'Tabletop exercise проходит по сценарию без разрушительного отключения production: участники фиксируют сигнал, решение, владельца, канал связи, переключение и критерий возврата. Пробел в контактах или недоступный ключ восстановления является таким же результатом теста, как техническая ошибка.',
    ],
    inventory: "python3 - <<'PY'\nservices=[('identity',2,15),('file-share',8,60),('training-web',24,240)]\nprint('service | RPO(h) | RTO(min)')\nfor row in services: print(' | '.join(map(str,row)))\nPY",
    exercise: "cat > tabletop.md <<'EOF'\nScenario: lab storage unavailable\nSignal: health check + storage alert\nDecision: declare incident after 5 minutes\nRecover: restore test file to isolated target\nVerify: hash and application read\nRollback: remove isolated target after evidence\nEOF\ncat tabletop.md\nrm -f tabletop.md",
    expected: 'Для трёх сервисов определены обоснованные RTO/RPO, а tabletop связывает сигнал, решение, восстановление и проверку данных без отключения рабочей системы.',
    detection: 'Наблюдайте health checks, saturation, replication lag, backup failures, изменения маршрутов и правил доступа. Алерт должен быть связан с runbook и владельцем, иначе сигнал не превращается в восстановление.',
    defense: 'Применяйте сегментацию, least privilege, независимые fault domains, проверенные backups и регулярные restore/tabletop drills. Документируйте shared responsibility для каждого сервиса.',
    sources: ['sp-comptia-objectives', 'sp-nist-csf', 'sp-developer-roadmap'],
    question: ['Что означает RPO?', ['Допустимый объём потери данных во времени', 'Максимальное число администраторов', 'Скорость шифрования', 'Срок сертификата'], 0, 'RPO определяет, к какой точке во времени должны восстановиться данные.'],
  },
  {
    id: 'secplus-data-cloud', title: 'Защита данных и облачных ресурсов', description: 'Классификация, lifecycle, DLP, токенизация, disposal и проверка публичного доступа.',
    theory: [
      'Данные защищают по жизненному циклу: создание, использование, передача, хранение, архив и уничтожение. Классификация связывает набор данных с требованиями к доступу, шифрованию, retention и обработке. Метка без технического правила и владельца остаётся декоративной.',
      'Data at rest защищают шифрованием диска, базы или объекта; data in transit — TLS или защищённым туннелем; data in use требуют контроля процесса и среды выполнения. Токенизация заменяет чувствительное значение ссылкой, маскирование скрывает часть представления, а хеш подходит не для любого секрета и не является шифрованием.',
      'DLP использует контекст, шаблоны и метки, но создаёт false positives. Начинайте с audit mode, измеряйте реальные потоки и только затем блокируйте. Исключение должно иметь владельца, причину и срок. Публичный cloud object проверяют политикой, ACL, inherited access и фактическим запросом без credentials.',
      'Удаление ссылки не всегда удаляет данные из snapshot, replica или backup. Disposal выбирают по носителю и требованиям: криптографическое стирание, безопасное удаление ключа, wipe или физическое уничтожение. Процедура должна учитывать юридическое удержание и подтверждение поставщика.',
    ],
    inventory: "python3 - <<'PY'\nrecords=[('public','training guide','web'),('internal','inventory','staff'),('restricted','recovery keys','vault')]\nfor label,data,place in records: print(f'{label:10} {data:20} -> {place}')\nPY",
    exercise: "umask 077\nprintf 'fictional recovery code: LAB-ONLY' > restricted.txt\nstat -c '%A %n' restricted.txt\nsha256sum restricted.txt > restricted.sha256\nsha256sum -c restricted.sha256\nrm -f restricted.txt restricted.sha256",
    expected: 'Учебный restricted-файл доступен только владельцу, его целостность проверена, затем файл и контрольная сумма удалены; в отчёте отмечено, что обычное rm не гарантирует wipe физического носителя.',
    detection: 'Собирайте чтение и экспорт чувствительных наборов, изменение ACL/policy, создание public link, массовую загрузку и отказ DLP. Не записывайте содержимое секрета в журнал.',
    defense: 'Минимизируйте сбор, классифицируйте данные, шифруйте, ограничивайте доступ по роли и контексту, проверяйте public exposure и выполняйте retention/disposal по подтверждаемой процедуре.',
    sources: ['sp-comptia-objectives', 'sp-owasp-asvs', 'sp-nist-csf'],
    question: ['Почему DLP сначала полезно включить в audit mode?', ['Чтобы увидеть реальные потоки и false positives до блокировки', 'Чтобы отключить журнал', 'Чтобы сделать данные публичными', 'Чтобы заменить классификацию'], 0, 'Наблюдение помогает настроить правило без неожиданной остановки нормальной работы.'],
  },
  {
    id: 'secplus-iam', title: 'IAM, MFA, SSO и управление привилегиями', description: 'Identity lifecycle, authentication, authorization, federation, PAM и регулярный access review.',
    theory: [
      'IAM отвечает за жизненный цикл идентичности: подтверждение человека или сервиса, создание, выдачу минимального доступа, изменение роли и своевременное отключение. Authentication отвечает «кто это», authorization — «что разрешено», accounting — «что произошло». Общая учётная запись мешает расследованию и отзыву.',
      'MFA использует разные факторы: знание, владение и биометрическую характеристику. Два пароля не образуют MFA. Устойчивые к phishing методы привязывают подтверждение к законному домену, тогда как push без контекста может привести к fatigue attack. Recovery flow защищают не слабее обычного входа.',
      'SSO уменьшает число паролей, но повышает критичность identity provider. Federation передаёт утверждение о личности между доверенными сторонами; trust, audience, issuer, срок и подпись должны проверяться. Provisioning и deprovisioning нельзя заменять одним SSO: удалённый сотрудник не должен сохранять local account.',
      'PAM выдаёт привилегию на ограниченное время, фиксирует одобрение и действия. Access review сравнивает роль, фактическую потребность и owner ресурса. Особое внимание нужно service accounts, emergency accounts, stale permissions и накоплению прав после смены должности.',
    ],
    inventory: "python3 - <<'PY'\naccounts=[('anna','helpdesk','active'),('boris','former-project','review'),('svc-backup','backup-job','no interactive login')]\nfor row in accounts: print(' | '.join(row))\nPY",
    exercise: "cat > access-review.csv <<'EOF'\nidentity,resource,access,owner,decision\nanna,lab-ticketing,operator,team-lead,keep\nboris,lab-admin,admin,security,revoke\nsvc-backup,lab-storage,write,backup-owner,restrict-to-job\nEOF\ncat access-review.csv\nrm -f access-review.csv",
    expected: 'Access review содержит владельца и решение по каждой записи: ненужная привилегия отозвана, service account ограничена задачей, а нормальный доступ остаётся работоспособным.',
    detection: 'Коррелируйте выдачу роли, вход с новым фактором, MFA reset, consent, dormant account, emergency-account use и привилегированную сессию. Отдельно проверяйте успешный вход после серии отказов.',
    defense: 'Используйте персональные identity, phishing-resistant MFA, RBAC, just-in-time privilege, автоматический joiner/mover/leaver и регулярные review с владельцем ресурса.',
    sources: ['sp-comptia-objectives', 'sp-owasp-cheats', 'mitre-attack-docs'],
    question: ['Какие два фактора образуют MFA?', ['Пароль и аппаратный ключ', 'Пароль и PIN', 'Два разных пароля', 'PIN и секретный вопрос'], 0, 'Пароль — фактор знания, аппаратный ключ — владения; два секрета остаются одним типом фактора.'],
  },
  {
    id: 'secplus-monitoring-response', title: 'Журналы, SIEM и реагирование на инциденты', description: 'Telemetry pipeline, use cases, triage, containment, evidence и полный цикл incident response.',
    theory: [
      'Журнал полезен, когда содержит точное время, субъект, действие, объект, результат и идентификатор связи. Источники включают identity, endpoint, network, cloud control plane и application. Централизация снижает риск потери локальных логов, но требует контроля доступа, retention, синхронизации времени и наблюдения за самим pipeline.',
      'SIEM нормализует и связывает события. Use case начинается с поведения и доступных полей, а не с запроса «показывать всё». Хорошее правило имеет гипотезу, окно, threshold, исключения, severity, owner и runbook. Его проверяют синтетическим безопасным событием и измеряют false positives/false negatives.',
      'Incident response проходит preparation, detection and analysis, containment, eradication, recovery и lessons learned. Containment ограничивает вред, но поспешное выключение может уничтожить volatile evidence или остановить критичный сервис. Решение принимает назначенный incident lead с учётом влияния.',
      'Evidence фиксируют с источником, временем, хешем и цепочкой передачи. В учебной лаборатории создаётся безвредный failed login или тестовая строка, затем сигнал находится, классифицируется и закрывается. Реальные секреты и персональные данные в учебный отчёт не копируют.',
    ],
    inventory: "python3 - <<'PY'\nlogs=['2026-11-10T10:00:00Z auth FAIL user=lab src=192.0.2.10','2026-11-10T10:00:04Z auth FAIL user=lab src=192.0.2.10','2026-11-10T10:00:08Z auth OK user=lab src=192.0.2.10']\nopen('secplus-events.log','w').write('\\n'.join(logs)+'\\n')\nprint(*logs,sep='\\n')\nPY",
    exercise: "python3 - <<'PY'\nfrom collections import Counter\nlines=open('secplus-events.log').read().splitlines()\nfails=Counter(line.split('src=')[-1] for line in lines if ' FAIL ' in line)\nfor src,count in fails.items(): print('ALERT' if count>=2 else 'OK',src,count)\nPY\nsha256sum secplus-events.log\nrm -f secplus-events.log",
    expected: 'Два отказа от одного учебного адреса создают alert, событие сопоставлено с успешным входом и runbook, хеш evidence зафиксирован, временный файл удалён.',
    detection: 'Контролируйте полноту pipeline, задержку ingestion, пропуски источников и изменение правил вместе с самими alerts. Triage должен сохранять raw event, контекст identity/asset и принятые решения.',
    defense: 'Стройте use cases вокруг рисков, синхронизируйте время, защищайте логи, привязывайте alert к владельцу/runbook и регулярно проводите table-top и безопасные detection tests.',
    sources: ['sp-comptia-objectives', 'mitre-attack-docs', 'sp-nist-ir'],
    question: ['Что нужно проверить вместе с правилом SIEM?', ['Поступление нужных полей и работу runbook', 'Только цвет dashboard', 'Только размер архива', 'Только имя правила'], 0, 'Без источника, полей и действий аналитика правило не обеспечивает обнаружение и реакцию.'],
  },
  {
    id: 'secplus-governance-risk', title: 'Governance, риск и соответствие', description: 'Policies, standards, risk register, third parties, privacy и решения о treatment с владельцами.',
    theory: [
      'Governance связывает цели организации, ответственность и контроль. Policy задаёт намерение и обязательное правило, standard — конкретный минимум, procedure — последовательность действий, guideline — рекомендуемый вариант. Документ без владельца, аудитории, версии и цикла пересмотра быстро теряет актуальность.',
      'Риск описывают как сценарий: угроза использует уязвимость и создаёт влияние на актив. Оценка вероятности и влияния помогает сравнивать сценарии, но числа не являются точной наукой. Treatment включает mitigate, transfer, avoid или accept; принятие делает уполномоченный risk owner, а не технический исполнитель в одиночку.',
      'Third-party risk охватывает due diligence, договорные требования, доступ, data location, уведомление об инциденте, субподрядчиков и exit plan. Сертификат поставщика является evidence для определённой области и даты, а не гарантией безопасности всех услуг. Доступ поставщика регулярно пересматривают и отключают по окончании.',
      'Privacy требует цели обработки, минимизации, retention и прав субъектов согласно применимому праву. Compliance и security пересекаются, но выполнение checklist не доказывает отсутствие риска. Контроль должен быть и спроектирован правильно, и реально работать в проверяемый период.',
    ],
    inventory: "python3 - <<'PY'\nrisks=[('R1','stolen admin token',4,5),('R2','lab outage',2,3),('R3','expired certificate',3,3)]\nfor i,s,p,impact in risks: print(i,p*impact,s)\nPY",
    exercise: "cat > risk-register.csv <<'EOF'\nid,scenario,owner,likelihood,impact,treatment,due\nR1,stolen lab admin token,security,4,5,phishing-resistant MFA,2026-12-01\nR2,training outage,platform,2,3,accept with restore drill,2027-01-15\nEOF\ncat risk-register.csv\nrm -f risk-register.csv",
    expected: 'Каждый риск записан как сценарий, имеет owner, оценку, конкретное treatment и срок; принятие риска не маскируется технической задачей без ответственного лица.',
    detection: 'Отслеживайте просроченные treatments, исключения, изменения scope поставщика, истечение evidence, неиспользуемый vendor access и отклонение фактического контроля от standard.',
    defense: 'Назначайте владельцев, пересматривайте policies и risk register, проверяйте third-party access и exit plan, собирайте evidence работы контроля и ограничивайте исключения сроком.',
    sources: ['sp-comptia-objectives', 'sp-nist-csf', 'sp-nist-oscal'],
    question: ['Кто должен принимать остаточный риск?', ['Уполномоченный владелец риска', 'Любой пользователь', 'Сканер уязвимостей', 'Поставщик антивируса'], 0, 'Владелец понимает бизнес-влияние и имеет полномочия принять остаточный риск.'],
  },
  {
    id: 'secplus-assessment-capstone', title: 'Оценка защиты и итоговая лаборатория', description: 'Security assessment, evidence, awareness, отчёт и сквозной capstone по всем доменам SY0-701.',
    theory: [
      'Assessment отвечает на заранее сформулированный вопрос и ограниченный scope. Audit сравнивает evidence с критериями, vulnerability assessment ищет слабости, penetration test проверяет согласованные пути эксплуатации, а tabletop проверяет решения и взаимодействие. Названия не взаимозаменяемы и требуют разных разрешений.',
      'Evidence должно быть достаточным, актуальным и воспроизводимым: конфигурация, журнал, ticket, интервью и результат теста дополняют друг друга. Screenshot без даты и контекста слабее команды с output, asset ID и независимой проверкой. Секреты редактируют, оригинал защищают по правилам хранения.',
      'Awareness строят по ролям и измеряют поведением: умеет ли сотрудник сообщить о phishing, знает ли администратор процедуру emergency access, выполняет ли разработчик review секретов. Один ежегодный тест не показывает устойчивый навык; нужны короткие упражнения, обратная связь и улучшение процесса.',
      'Итоговая лаборатория соединяет пять доменов: классифицировать актив, смоделировать угрозу, выбрать архитектуру и IAM, создать detection, провести безопасный инцидент и записать risk treatment. Результат — короткий отчёт с фактами, ограничениями, remediation, owner и retest.',
    ],
    inventory: "python3 - <<'PY'\nchecks=['scope approved','asset classified','control mapped','test executed','evidence redacted','owner assigned','retest planned']\nfor n,item in enumerate(checks,1): print(f'[ ] {n}. {item}')\nPY",
    exercise: "cat > secplus-capstone.md <<'EOF'\n# Security+ capstone — fictional lab\nScope: one isolated VM and synthetic events\nAsset/classification: training service / internal\nThreat: stolen operator credential\nControls: MFA, least privilege, login alert, recovery procedure\nTest: generate synthetic failed logins; no exploitation\nFinding: describe observed gap and evidence location\nRemediation/owner/due: fill after test\nRetest/cleanup: repeat negative test and remove artifacts\nEOF\ncat secplus-capstone.md\nrm -f secplus-capstone.md",
    expected: 'Итоговый отчёт связывает scope, актив, угрозу, контроль, безопасный тест, evidence, finding, владельца, срок и retest; временные артефакты удалены.',
    detection: 'Проверяйте, что тестовое событие дошло от источника до alert и ticket, а evidence содержит время и asset. Отсутствие сигнала фиксируйте как telemetry gap, а не как доказательство отсутствия события.',
    defense: 'Проводите оценки по письменному scope, комбинируйте evidence, обучайте по ролям, исправляйте первопричину и закрывайте finding только после retest нормального и запрещённого сценариев.',
    sources: ['sp-comptia-objectives', 'sp-owasp-asvs', 'sp-nist-ir'],
    question: ['Что обязательно завершает исправление finding?', ['Повторный тест и проверка нормального сценария', 'Красивый отчёт', 'Удаление ticket', 'Смена названия системы'], 0, 'Retest доказывает устранение слабости, а функциональная проверка выявляет регрессию.'],
  },
];

profiles.forEach((profile, index) => {
  const depth = securityPlusDepth[index];
  profile.depth = depth;
  profile.theory.push(...depth.theory);
  profile.sources = [...new Set([...profile.sources, 'sp-messer', ...depth.sources.map(([id]) => id)])];
});

const makeLesson = (profile) => ({
  intro: `${profile.title}. Авторский курс CompTIA Security+ · SY0-701: от модели угроз до проверяемого решения и практики.`,
  sections: [
    { title: 'Модель и основные понятия', paragraphs: profile.theory.slice(0, 2) },
    { title: 'Применение в инфраструктуре', paragraphs: profile.theory.slice(2, 4) },
    { title: 'Термины и границы понятий', paragraphs: profile.depth.terms },
    { title: 'Обнаружение и защита', paragraphs: [profile.detection, profile.defense] },
  ],
  lab: {
    steps: [
      'Создайте отдельный каталог или snapshot учебной VM. Запишите границы: используются только синтетические данные и собственная система; подготовьте консоль или простой способ удалить артефакты.',
      'Прочитайте команды инвентаризации и объясните назначение каждой строки до запуска. Если утилита отсутствует или команда затрагивает не учебный объект, остановитесь и адаптируйте шаг.',
      'Выполните инвентаризацию без изменения рабочей инфраструктуры. Сохраните только необходимые факты, текущее время и ожидаемый результат; не копируйте токены, private keys или реальные персональные данные.',
      'Запустите учебное упражнение. Все имена, адреса и события должны принадлежать локальному стенду. Не расширяйте scope и не применяйте сканирование или активные действия к внешним системам.',
      'Сопоставьте результат с защитной телеметрией: какой журнал, alert или контроль подтвердил действие. Запишите один факт, одно ограничение и одно исправление с владельцем.',
      'Проведите отрицательный retest, удалите временные файлы и повторите inventory. Убедитесь, что лаборатория не оставила ключи, правила, процессы, открытые порты или чувствительное evidence.',
    ],
    commands: `umask 077\n${profile.inventory}`,
    commandsLabel: 'БЕЗОПАСНАЯ ИНВЕНТАРИЗАЦИЯ · СОБСТВЕННЫЙ СТЕНД',
    extraCommands: [{ label: 'УЧЕБНОЕ УПРАЖНЕНИЕ И ОЧИСТКА', commands: profile.exercise }, { label: 'ПРЕДМЕТНЫЙ РАЗБОР · СИНТЕТИЧЕСКАЯ МОДЕЛЬ', commands: profile.depth.lab }],
    expected: `${profile.expected} ${profile.depth.expected}`,
    pitfalls: [
      'Не запускайте команды автоматически: сначала прочитайте их и замените только учебные пути, адреса и имена. Внешняя доступность цели не означает разрешение.',
      'Не используйте реальные пароли, токены, private keys, клиентские данные или рабочие журналы. Для курса достаточно синтетических событий и вымышленных активов.',
      'Успешная команда не доказывает эффективность контроля. Проверьте ожидаемое пользовательское поведение, защитный сигнал и отрицательный сценарий.',
      `Диагностика: ${profile.depth.troubleshooting}`,
      `Очистка стенда: ${profile.depth.cleanup}`,
    ],
  },
});

const makeDetail = (profile) => ({
  goals: [
    `Объяснить тему «${profile.title}» на уровне экзамена Security+ и реальной эксплуатации.`,
    'Отличить доказанный факт, риск, контроль и защитный сигнал.',
    'Выполнить безопасную лабораторию на синтетических данных с проверкой и очисткой.',
    'Связать finding с конкретным исправлением, владельцем и повторным тестом.',
  ],
  deepDive: [...profile.depth.theory, `План проверки: ${profile.depth.action}`, `Критерий результата: ${profile.depth.expected}`, `Самостоятельное продолжение: ${profile.depth.task} До выполнения запишите ожидаемое разрешённое и запрещённое поведение, затем сравните фактический результат и объясните ограничения модели.`],
  caseStudy: {
    situation: profile.depth.situation,
    action: profile.depth.action,
    result: profile.depth.result,
  },
  diagram: profile.depth.diagram,
  uiMockup: {
    breadcrumb: `SECURITY+ / SY0-701 › ${profile.title}`,
    panelTitle: 'Карточка практики · учебный макет',
    rows: [
      { label: 'Scope', value: 'Локальная VM и синтетические данные' },
      { label: 'Evidence', value: 'Команда, время, результат без секретов' },
      { label: 'Detection', value: profile.detection.slice(0, 84) + '…' },
      { label: 'Remediation', value: 'Owner + срок + отрицательный retest' },
      { label: 'Cleanup', value: 'Артефакты удалены, inventory повторён' },
    ],
    helpText: 'Это авторский учебный макет, а не интерфейс CompTIA или реального SIEM.',
  },
  terminal: {
    prompt: 'student@securityplus-lab:~$',
    caption: 'Команды выполняются пользователем только на собственной учебной машине; сайт не подключён к реальной системе.',
    lines: [
      { type: 'input', text: profile.inventory.split('\n')[0] },
      { type: 'output', text: 'Результат зависит от ОС и конфигурации локальной лаборатории.' },
      { type: 'success', text: 'scope=local  data=synthetic  cleanup=required' },
    ],
  },
  practiceTasks: [
    { task: profile.depth.task, hint: profile.depth.troubleshooting, solution: profile.depth.solution },
    { task: 'Составьте таблицу «актив → угроза → preventive → detective → recovery» для своего учебного сценария.', hint: 'Каждый контроль должен отвечать на конкретный риск и иметь наблюдаемый тест.', solution: `Используйте ожидаемый результат урока: ${profile.expected}` },
    { task: 'Напишите finding из пяти строк: факт, влияние, evidence, исправление, retest.', hint: 'Не называйте предположение фактом и не включайте секреты.', solution: `Защитная основа: ${profile.defense} Сигнал для проверки: ${profile.detection}` },
  ],
  question: { question: profile.question[0], options: profile.question[1], answer: profile.question[2], explanation: profile.question[3] },
});

const makeWalkthrough = (profile) => ({
  title: `Пошаговая лаборатория Security+: ${profile.title}`,
  context: 'Лаборатория переводит экзаменационное понятие в полный рабочий цикл администратора: scope, исходное состояние, синтетическое действие, evidence, защитный сигнал, исправление, retest и очистка. Все данные вымышлены, а команды запускаются только на собственной учебной машине.',
  steps: [
    `Сценарий: ${profile.depth.situation}`,
    `Решение перед выполнением: ${profile.depth.action}`,
    'Создайте отдельную папку лаборатории и запишите scope: одна собственная VM, синтетические пользователи и события, отсутствие внешних целей. Зафиксируйте версию ОС, время начала и способ вернуть snapshot или удалить созданные файлы.',
    'Разберите команды inventory построчно и предскажите результат. Запустите их без повышения привилегий, если это возможно, затем отделите факты вывода от интерпретации и сохраните только минимально необходимое evidence без секретов.',
    'Сформулируйте одну проверяемую гипотезу по теме урока: какое разрешённое действие произойдёт, какой запрет должен сработать и какое событие увидит защитник. Запишите критерии успеха до запуска упражнения.',
    'Выполните только приведённое синтетическое упражнение. Сразу сравните фактический результат с прогнозом, отметьте время и источник, а при неожиданном влиянии остановитесь и выполните очистку вместо расширения действий.',
    'Найдите или опишите ожидаемый defensive signal, предложите узкое исправление и выполните тот же отрицательный тест. Разрешённый сценарий должен сохраниться, а рискованный путь — блокироваться или становиться наблюдаемым.',
    'Удалите временные файлы и ключи, повторите inventory и оформите finding: факт, влияние, evidence, ограничение, remediation, owner, срок и результат retest. Непроверенные предположения пометьте явно.',
  ],
  verification: `${profile.expected} ${profile.depth.expected} Результат модели не доказывает наличие реального enforcement: для инфраструктуры отдельно проверьте настройку, телеметрию и очистку.`,
  troubleshooting: `${profile.depth.troubleshooting} Очистка: ${profile.depth.cleanup} Если результат отличается, проверьте версию утилиты, оболочку, текущий каталог, права и наличие зависимостей. ${profile.detection} Не отключайте защиту и не переходите к внешней цели: вернитесь к синтетическим данным и локальной VM.`,
});

export const securityPlusLessons = Object.fromEntries(profiles.map((profile) => [profile.id, makeLesson(profile)]));
export const securityPlusDetails = Object.fromEntries(profiles.map((profile) => [profile.id, makeDetail(profile)]));
export const securityPlusWalkthroughs = Object.fromEntries(profiles.map((profile) => [profile.id, makeWalkthrough(profile)]));

const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
const topic = (id) => ({ id, title: profileById.get(id).title, description: profileById.get(id).description });
const phase = (id, number, weight, title, subtitle, description, ids) => ({ id, number, weight, title, subtitle, description, topics: ids.map(topic) });

export const securityPlusPhases = [
  phase('secplus-general', '01', 12, 'Общие концепции безопасности', 'DOMAIN 1 · 12%', 'Контроли, CIA, Zero Trust, криптография и PKI как единая модель доверия.', ['secplus-controls-zero-trust', 'secplus-crypto-pki']),
  phase('secplus-threats', '02', 22, 'Угрозы и уязвимости', 'DOMAIN 2 · 22%', 'Threat actors, социальная инженерия, malware и полный цикл vulnerability management.', ['secplus-threats-social', 'secplus-vulnerability-management']),
  phase('secplus-architecture', '03', 18, 'Архитектура безопасности', 'DOMAIN 3 · 18%', 'Trust boundaries, shared responsibility, устойчивость и защита данных.', ['secplus-architecture-resilience', 'secplus-data-cloud']),
  phase('secplus-operations', '04', 28, 'Операции безопасности', 'DOMAIN 4 · 28%', 'IAM, telemetry, SIEM и incident response с наблюдаемыми лабораториями.', ['secplus-iam', 'secplus-monitoring-response']),
  phase('secplus-program', '05', 20, 'Управление программой', 'DOMAIN 5 · 20%', 'Governance, риск, third parties, assessment и итоговый практический отчёт.', ['secplus-governance-risk', 'secplus-assessment-capstone']),
];

export const securityPlusCourse = {
  id: 'security-plus', title: 'Авторский курс CompTIA Security+ · SY0-701', examCode: 'SY0-701', unofficial: true,
  description: 'Пять доменов SY0-701: десять углублённых уроков, лаборатории, открытые источники и авторский итоговый экзамен на 30 вопросов.',
  topics: securityPlusPhases.flatMap((item) => item.topics),
};

export const securityPlusResources = [
{"id": "sp-messer", "title": "Professor Messer · SY0-701", "url": "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/", "description": "Бесплатные видео по темам SY0-701; используйте раздел, соответствующий уроку.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-cisa-kev", "title": "CISA Known Exploited Vulnerabilities", "url": "https://www.cisa.gov/known-exploited-vulnerabilities-catalog", "description": "Каталог подтверждённо эксплуатируемых уязвимостей для приоритизации.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-wstg", "title": "OWASP Web Security Testing Guide", "url": "https://owasp.org/www-project-web-security-testing-guide/", "description": "Методики проверки веб-безопасности и оформления evidence.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-juice-shop", "title": "OWASP Juice Shop", "url": "https://github.com/juice-shop/juice-shop", "description": "Намеренно уязвимое приложение для изолированной учебной практики.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-webgoat", "title": "OWASP WebGoat", "url": "https://github.com/WebGoat/WebGoat", "description": "Локальные учебные упражнения с объяснением защиты.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-ms-zerotrust", "title": "Microsoft Learn · Zero Trust", "url": "https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview", "description": "Явная проверка, минимальные привилегии и предположение компрометации.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-ms-resilience", "title": "Microsoft Learn · Reliability", "url": "https://learn.microsoft.com/en-us/azure/well-architected/reliability/", "description": "Failure modes, восстановление и архитектура надёжности.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-ms-shared", "title": "Microsoft Learn · Shared responsibility", "url": "https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility", "description": "Границы ответственности в облачных моделях.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-ms-identity", "title": "Microsoft Learn · Identity fundamentals", "url": "https://learn.microsoft.com/en-us/entra/fundamentals/whatis", "description": "Identity, authentication и управление доступом.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
{"id": "sp-sigma", "title": "SigmaHQ · Sigma rules", "url": "https://github.com/SigmaHQ/sigma", "description": "Открытые правила обнаружения с logsource и false positives.", "type": "Открытый материал", "language": "EN", "access": "Бесплатно"},
  { id: 'sp-comptia-objectives', title: 'CompTIA: Exam Objectives', type: 'Официальная программа', language: 'EN', access: 'Бесплатно', description: 'Страница загрузки официальных exam objectives. Используйте её для проверки действующего кода экзамена и структуры доменов перед регистрацией.', url: 'https://www.comptia.org/training/resources/exam-objectives' },
  { id: 'sp-developer-roadmap', title: 'Developer Roadmap: Cyber Security', type: 'Карта', language: 'EN', access: 'Бесплатно', description: 'Открытые материалы по основам cyber security, IAM, hardening, SIEM, vulnerability management и incident response.', url: 'https://github.com/nilbuild/developer-roadmap/tree/master/roadmaps/cyber-security' },
  { id: 'sp-owasp-cheats', title: 'OWASP Cheat Sheet Series', type: 'Справочник', language: 'EN', access: 'Бесплатно', description: 'Открытые практические рекомендации по authentication, cryptography, secrets, logging, incident response и другим защитным задачам.', url: 'https://github.com/OWASP/CheatSheetSeries' },
  { id: 'sp-owasp-asvs', title: 'OWASP Application Security Verification Standard', type: 'Стандарт', language: 'EN', access: 'Бесплатно', description: 'Открытый набор проверяемых требований к архитектуре, identity, access, cryptography, data protection и logging приложений.', url: 'https://github.com/OWASP/ASVS' },
  { id: 'sp-nist-csf', title: 'NIST Cybersecurity Framework 2.0', type: 'Фреймворк', language: 'EN', access: 'Бесплатно', description: 'Официальная модель Govern, Identify, Protect, Detect, Respond и Recover для построения программы и управления риском.', url: 'https://www.nist.gov/cyberframework' },
  { id: 'sp-nist-ir', title: 'NIST SP 800-61 Rev. 3', type: 'Руководство', language: 'EN', access: 'Бесплатно', description: 'Официальное руководство по включению incident response в управление cybersecurity risk.', url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final' },
  { id: 'sp-nist-oscal', title: 'NIST OSCAL', type: 'GitHub', language: 'EN', access: 'Бесплатно', description: 'Открытые модели NIST для машиночитаемого представления каталогов контролей, профилей, implementation и assessment results.', url: 'https://github.com/usnistgov/OSCAL' },
];

export const securityPlusLessonResources = Object.fromEntries(profiles.map((profile) => [profile.id, profile.sources.map((sourceId, index) => ({
  sourceId,
  focus: profile.depth.sources.find(([id]) => id === sourceId)?.[1] || (index === 0 ? `Сверьте терминологию и границы домена для темы «${profile.title}» с официальными целями SY0-701; перед экзаменом проверьте актуальный код.` : `Используйте открытый материал для углубления темы «${profile.title}» и проверки защитной лаборатории.`),
  ...(index === 0 ? { takeaway: profile.defense } : {}),
}))]));
