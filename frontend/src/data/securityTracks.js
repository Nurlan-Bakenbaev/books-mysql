// Авторские русскоязычные треки. Команды рассчитаны только на собственные VM,
// специально уязвимые приложения и системы с явным письменным разрешением.

const linuxProfiles = [
  {
    id: 'lsec-users-sudo', title: 'Пользователи, группы и sudo', description: 'Учётные записи, группы, минимальные привилегии, sudoers.d и безопасное восстановление доступа.',
    theory: [
      'Linux связывает имя пользователя с числовым UID, а группу — с GID. Ядро проверяет именно числа, поэтому ручное изменение UID может оставить файлы с прежним владельцем. /etc/passwd хранит атрибуты учётной записи, /etc/shadow — хеш пароля с ограниченным доступом, /etc/group — членство. Сервисные учётные записи обычно имеют shell nologin и не должны использоваться для интерактивного входа.',
      'sudo делегирует конкретные административные действия и ведёт журнал, тогда как общий пароль root уничтожает персональную подотчётность. Правила читаются сверху вниз из /etc/sudoers и /etc/sudoers.d. Редактировать их нужно только через visudo: утилита проверяет синтаксис до сохранения и снижает риск заблокировать административный доступ.',
      'Выдавайте право группе, ограничивайте команды полными путями и избегайте опасных конструкций вроде ALL=(ALL) NOPASSWD: ALL. Многие редакторы, интерпретаторы и команды с возможностью shell escape фактически дают полный root. Для автоматизации лучше отдельная service account, systemd unit или narrowly scoped policy, чем интерактивный пользователь без пароля.',
      'Перед изменением sudo держите вторую root-сессию открытой, создайте копию правила и проверяйте sudo -l в новом соединении. Если проверка не прошла, восстановите файл через открытую сессию или консоль VM. В production заранее убедитесь, что out-of-band console действительно доступна и проверена.',
    ],
    read: "id\ngetent passwd | awk -F: '$3 >= 1000 {print $1, $3, $7}'\ngetent group sudo wheel 2>/dev/null\nsudo -l\nsudo visudo -c",
    change: "sudo groupadd --force lab-ops\nsudo usermod -aG lab-ops \"$USER\"\necho '%lab-ops ALL=(root) /usr/bin/systemctl status *' | sudo tee /etc/sudoers.d/lab-ops\nsudo chmod 0440 /etc/sudoers.d/lab-ops\nsudo visudo -cf /etc/sudoers.d/lab-ops\n# Откат из второй административной сессии:\nsudo rm -f /etc/sudoers.d/lab-ops\nsudo gpasswd -d \"$USER\" lab-ops",
    expected: 'Пользователь видит ограниченное разрешение в sudo -l, правило проходит visudo -c и после отката исчезает без потери действующей административной сессии.',
    detection: 'Проверяйте auth.log или journalctl по событиям sudo, изменения /etc/sudoers* через auditd и неожиданные группы с UID/GID. Отдельно отслеживайте NOPASSWD, запуск shell из разрешённой команды и добавление пользователя в wheel/sudo.',
    defense: 'Используйте персональные учётные записи, MFA на точке входа, минимальные правила в sudoers.d, периодический review членства и console-access runbook. Блокируйте ушедших сотрудников через disable, завершение сеансов и отзыв ключей, а не только сменой отображаемого имени.',
    sources: ['linux-admin-docs', 'linux-audit-docs'],
    question: ['Зачем редактировать sudoers через visudo?', ['Чтобы проверить синтаксис до применения', 'Чтобы отключить журнал', 'Чтобы заменить UID', 'Чтобы открыть SSH-порт'], 0, 'visudo блокирует параллельное редактирование и проверяет синтаксис, снижая риск потери sudo.'],
  },
  {
    id: 'lsec-ssh-hardening', title: 'Безопасный SSH без потери доступа', description: 'Ключи, sshd_config.d, MFA, ограничение входа и пошаговый откат.',
    theory: [
      'SSH устанавливает зашифрованный канал и аутентифицирует сервер по host key. Клиент сохраняет отпечаток в known_hosts; неожиданная смена отпечатка может означать переустановку или атаку и требует проверки по независимому каналу. Пользователь подтверждает личность ключом, паролем или дополнительным методом PAM.',
      'Ключевая пара безопаснее повторно используемого пароля, если private key защищён passphrase и агентом. На сервер копируется только public key. Ed25519 подходит современным системам; RSA оставляют для совместимости с достаточной длиной. Один ключ на человека и устройство облегчает отзыв и расследование.',
      'Настройки лучше добавлять отдельным файлом /etc/ssh/sshd_config.d/99-hardening.conf. Сначала выполните sshd -t, затем reload, не restart. Проверяйте новый вход во второй сессии, пока первая остаётся открытой. Только после успешного входа ключом можно отключать PasswordAuthentication и прямой PermitRootLogin.',
      'Смена порта уменьшает шум сканеров, но не является защитой. Реальные слои — firewall с разрешённым источником или VPN, ключи, MFA, fail2ban по обоснованному сценарию, обновления и аудит. Не включайте AllowUsers, пока не проверили точное имя своей аварийной учётной записи.',
    ],
    read: "sudo sshd -T | grep -E '^(passwordauthentication|pubkeyauthentication|permitrootlogin|maxauthtries)'\nsudo sshd -t\nss -lntp | grep ssh\njournalctl -u ssh -u sshd --since '1 hour ago' --no-pager",
    change: "sudo cp -a /etc/ssh/sshd_config /etc/ssh/sshd_config.before-lab\nprintf '%s\n' 'PermitRootLogin no' 'PubkeyAuthentication yes' 'PasswordAuthentication no' 'MaxAuthTries 3' | sudo tee /etc/ssh/sshd_config.d/99-lab-hardening.conf\nsudo sshd -t && sudo systemctl reload sshd 2>/dev/null || sudo systemctl reload ssh\n# Проверьте новый вход, не закрывая первую сессию. Откат:\nsudo rm -f /etc/ssh/sshd_config.d/99-lab-hardening.conf\nsudo sshd -t && sudo systemctl reload sshd 2>/dev/null || sudo systemctl reload ssh",
    expected: 'sshd -t не выдаёт ошибок, второй вход по ключу работает, root/password вход запрещён; после удаления drop-in эффективная конфигурация возвращается.',
    detection: 'Смотрите Accepted/Failed в journal, необычные страны и адреса на внешнем шлюзе, новые authorized_keys и изменения host keys/config. Auditd может контролировать /etc/ssh и домашние каталоги, а SIEM связывает множество отказов с последующим успехом.',
    defense: 'Держите проверенную console path, отдельную аварийную учётную запись, ключи с passphrase, MFA или VPN и ограниченный firewall. Выполняйте reload только после sshd -t и тестируйте новое соединение до закрытия старого.',
    sources: ['linux-ssh-docs', 'linux-admin-docs'],
    question: ['Как безопаснее применить изменение sshd?', ['Проверить sshd -t, reload и открыть вторую сессию', 'Закрыть текущую сессию и reboot', 'Удалить host keys', 'Открыть порт всему интернету'], 0, 'Вторая сессия и синтаксическая проверка сохраняют путь отката.'],
  },
  {
    id: 'lsec-firewall', title: 'Firewall: nftables, UFW и firewalld', description: 'Политика deny-by-default, состояние соединений, проверка правил и аварийный откат.',
    theory: [
      'Linux firewall работает через netfilter; nftables — современный интерфейс ядра, а UFW и firewalld дают более удобные модели управления. Правило сопоставляет адрес, протокол, порт, интерфейс и состояние. Stateful firewall разрешает ответы established/related без отдельного широкого входящего правила.',
      'Политика deny-by-default начинается с инвентаризации реально слушающих служб через ss. Сначала разрешают loopback, established/related и административный доступ с проверенного адреса, затем нужные сервисы. Порядок правил важен: ранний accept или drop может сделать позднее правило недостижимым.',
      'Не смешивайте ручной nft, UFW и firewalld без понимания, кто владеет ruleset. Контейнерные платформы могут добавлять свои цепочки. Сохранение правил между reboot зависит от дистрибутива; проверка только текущего ruleset не гарантирует то же состояние после перезагрузки.',
      'Удалённое изменение firewall опасно. Подготовьте отложенный откат через at/systemd-run, держите вторую сессию, разрешите текущий management source и только потом включайте политику. После проверки отмените rollback job. В облаке дополнительно проверьте NSG/security group: пакет должен пройти оба слоя.',
    ],
    read: "sudo nft list ruleset\nsudo ufw status verbose 2>/dev/null || true\nsudo firewall-cmd --list-all 2>/dev/null || true\nss -lntup",
    change: "# Ubuntu/UFW, только на собственной VM с консолью:\nsudo ufw allow from <ADMIN_IP> to any port 22 proto tcp\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw enable\n# Откат через консоль:\nsudo ufw disable\nsudo ufw delete allow from <ADMIN_IP> to any port 22 proto tcp",
    expected: 'Слушающие службы сопоставлены разрешениям, SSH доступен только с административного адреса, ненужный тестовый порт блокируется, а откат возвращает исходную политику.',
    detection: 'Логируйте отклонённые новые соединения с rate limit, изменения ruleset и запуск firewall-команд через sudo. Всплеск deny может означать сканирование или ошибочную конфигурацию; отсутствие логов не доказывает отсутствие трафика.',
    defense: 'Оставляйте минимум входящих портов, ограничивайте management сетью/VPN, документируйте owner каждого правила и регулярно сравнивайте слушающие сокеты с policy. Изменения применяйте с консолью и автоматическим rollback.',
    sources: ['linux-nftables-docs', 'linux-admin-docs'],
    question: ['Что нужно разрешить до включения deny-by-default удалённо?', ['Текущий административный путь и established connections', 'Все входящие порты', 'Только ICMP Redirect', 'Анонимный FTP'], 0, 'Иначе администратор может немедленно потерять SSH-доступ.'],
  },
  {
    id: 'lsec-updates', title: 'Обновления и управление уязвимостями', description: 'Инвентаризация, репозитории, тестовое кольцо, reboot, откат и контроль результата.',
    theory: [
      'Патч-менеджмент — цикл инвентаризации, оценки применимости, тестирования, внедрения и подтверждения. Номер CVSS не учитывает, доступен ли сервис извне и насколько он критичен. Приоритизацию уточняют по эксплуатируемости, CISA KEV, роли сервера и компенсирующим мерам.',
      'APT и DNF проверяют подписи метаданных и пакетов. Добавление стороннего репозитория расширяет цепочку доверия, поэтому фиксируйте owner, ключ и назначение, избегайте curl | sh и удаляйте старые ключи. Автоматические security updates полезны, но требуют окна reboot и мониторинга неуспешных транзакций.',
      'Развёртывайте волнами: canary, небольшое кольцо, массовая группа. До ядра, libc, database и сетевых служб проверьте backup/snapshot и процедуру отката. Snapshot VM не всегда application-consistent и не заменяет резервную копию данных.',
      'После установки проверьте версию, systemctl --failed, journal, пользовательский health check и необходимость reboot. Отчёт package manager о success не доказывает работоспособность приложения. Исключения должны иметь владельца, компенсирующую меру и дату пересмотра.',
    ],
    read: "cat /etc/os-release\napt list --upgradable 2>/dev/null || dnf check-update || true\nsystemctl --failed\n[ -f /var/run/reboot-required ] && cat /var/run/reboot-required || true",
    change: "# Сначала снимок/backup и canary. Ubuntu:\nsudo apt update\nsudo apt upgrade --simulate\n# Реальную установку выполняйте только в согласованное окно: sudo apt upgrade\n# Для отката используйте проверенный snapshot/backup или версию пакета из доверенного репозитория.",
    expected: 'Получен список применимых обновлений и симуляция без изменения системы; план содержит canary, окно, health check, reboot и способ восстановления.',
    detection: 'Отслеживайте возраст последнего успешного update, неподдерживаемый release, отключённые репозитории, failed transactions и расхождение версий между узлами. Уязвимость считается закрытой только после повторной проверки фактической версии.',
    defense: 'Поддерживайте inventory и SLA по критичности, используйте подписанные репозитории, тестовые кольца, автоматизацию с лимитом одновременных узлов и проверенный backup. Никогда не откладывайте патч бессрочно без компенсирующей меры.',
    sources: ['linux-admin-docs', 'linux-compliance-docs'],
    question: ['Что подтверждает успешное обновление?', ['Версия плюс health check и отсутствие критичных ошибок', 'Только код выхода apt', 'Только reboot', 'Удаление журнала'], 0, 'Нужно проверить и установленную версию, и реальную работу сервиса.'],
  },
  {
    id: 'lsec-logging-auditd', title: 'Журналы, journald и auditd', description: 'Сбор событий, audit rules, ротация, централизованная доставка и расследование.',
    theory: [
      'systemd-journald собирает сообщения ядра, служб и stdout/stderr units с метаданными: unit, PID, boot ID и priority. rsyslog/syslog-ng могут сохранять текстовые файлы и пересылать события. Часы и NTP критичны: без единого времени невозможно восстановить последовательность между узлами.',
      'Audit subsystem ядра фиксирует security-relevant действия. Правило может наблюдать путь, syscall, пользователя и ключ. Auditd не является записью всего терминала; слишком широкие syscall-правила создают объём и нагрузку. Правило должно отвечать на конкретный вопрос расследования.',
      'Ротация, retention и квота защищают диск. Persistent journal требует каталога/настройки Storage=persistent, но локальный root может удалить события. Критичные журналы отправляют по защищённому каналу в отдельную систему с ограниченным доступом и контролем целостности.',
      'Расследование начинает с гипотезы и временного окна: кто вошёл, какая команда получила sudo, какой файл изменился, какая служба перезапустилась. Сохраняйте исходные логи read-only, вычисляйте хеш и работайте с копией. Не очищайте журнал ради устранения ошибки.',
    ],
    read: "timedatectl status\njournalctl --list-boots\njournalctl -p warning --since '1 hour ago' --no-pager\nsudo auditctl -l 2>/dev/null || true\nsudo ausearch -m USER_CMD,USER_AUTH --start today 2>/dev/null | tail -40",
    change: "echo '-w /etc/sudoers.d/ -p wa -k sudoers_changes' | sudo tee /etc/audit/rules.d/99-lab.rules\nsudo augenrules --load\nsudo touch /etc/sudoers.d/audit-lab-test\nsudo ausearch -k sudoers_changes -i\n# Откат:\nsudo rm -f /etc/sudoers.d/audit-lab-test /etc/audit/rules.d/99-lab.rules\nsudo augenrules --load",
    expected: 'Audit rule загружено, тестовое изменение найдено по ключу sudoers_changes, время синхронизировано; после отката постоянное правило удалено.',
    detection: 'Контролируйте остановку auditd, изменение правил, заполнение диска, разрыв доставки и резкое падение объёма событий. Алёрт должен различать отсутствие действий и поломку источника через heartbeat.',
    defense: 'Синхронизируйте время, храните критичные журналы удалённо, ограничивайте доступ, задавайте retention и тестируйте поиск. Правила auditd проектируйте по use case и проверяйте влияние на нагрузку.',
    sources: ['linux-audit-docs', 'linux-systemd-docs'],
    question: ['Зачем добавлять key к audit rule?', ['Чтобы искать связанные события по понятному имени', 'Чтобы шифровать диск', 'Чтобы открыть порт', 'Чтобы сменить UID'], 0, 'Ключ позволяет ausearch -k быстро выбрать события конкретного контрольного правила.'],
  },
  {
    id: 'lsec-threat-model', title: 'Модель угроз Linux-сервера', description: 'Активы, границы доверия, attack surface, риски и проверяемые меры защиты.',
    theory: [
      'Модель угроз начинается с активов и последствий: данные, учётные записи, доступность, ключи, репутация. Затем рисуют потоки данных и границы доверия: интернет, reverse proxy, приложение, база, backup, администратор. Без схемы hardening превращается в случайный чек-лист.',
      'Attack surface включает слушающие порты, пакеты, пользователей, scheduled jobs, sudo, secrets, web panels и supply chain. STRIDE помогает задать вопросы о подмене личности, изменении, отказе от действий, раскрытии, отказе в обслуживании и повышении привилегий. Риск связывает вероятность, влияние и существующие контроли.',
      'Контроль должен предотвращать, обнаруживать или помогать восстановлению. Firewall не исправляет уязвимое приложение, MFA не защищает украденный root token, backup не предотвращает утечку. Defense in depth работает, когда слои независимы и их эффективность проверяется.',
      'Модель пересматривают после новой службы, интеграции, роли администратора или инцидента. Для каждого высокого риска назначают owner, срок, меру, остаточный риск и сигнал проверки. Принятый риск — документированное решение владельца, а не забытая уязвимость.',
    ],
    read: "hostnamectl\nss -lntup\nsystemctl list-unit-files --state=enabled\nfindmnt\ngetent passwd | awk -F: '$7 !~ /(nologin|false)$/ {print $1, $3, $7}'",
    change: "# Эта лаборатория ничего не меняет. Создайте диаграмму потока:\n# Client -> reverse proxy -> app -> database -> backup\n# Отметьте trust boundaries, identities, secrets и журнал для каждого перехода.",
    expected: 'Получена схема активов и потоков, inventory поверхности атаки и таблица минимум из пяти рисков с owner, preventive/detective/recovery controls.',
    detection: 'Для каждого сценария укажите telemetry: auth logs, process execution, network flow, file integrity, application errors и backup jobs. Если сигнал не собирается или не тестировался, контроль обнаружения пока существует только на бумаге.',
    defense: 'Сокращайте поверхность, разделяйте привилегии, защищайте секреты, обновляйте компоненты и проектируйте восстановление. Приоритет давайте рискам с серьёзным влиянием и правдоподобным путём атаки.',
    sources: ['linux-compliance-docs', 'mitre-attack-docs'],
    question: ['С чего начинается модель угроз?', ['С активов, потоков и границ доверия', 'С установки всех scanners', 'Со смены порта SSH', 'С удаления логов'], 0, 'Схема системы показывает, что защищать и где меняется доверие.'],
  },
  {
    id: 'lsec-mac', title: 'SELinux и AppArmor', description: 'Mandatory Access Control, режимы, профили, диагностика denial и безопасное обучение политики.',
    theory: [
      'DAC проверяет владельца, группу и mode bits, а Mandatory Access Control добавляет политику, которую процесс не может обойти только потому, что запущен root. SELinux маркирует субъект и объект type/context и применяет правила; AppArmor привязывает профиль к пути программы и описывает доступ к файлам, capability и сети.',
      'SELinux Enforcing блокирует и журналирует, Permissive только журналирует, Disabled требует сложного возврата и не является методом диагностики. AppArmor использует enforce и complain для отдельных профилей. Переводите в permissive/complain только конкретный домен или профиль, когда возможно.',
      'Denial часто обнаруживает неверный путь, label или архитектуру, а не необходимость разрешить всё. Для SELinux сначала restorecon и проверка boolean, затем минимальный local module. Для AppArmor используйте aa-logprof, но просматривайте каждое предложенное правило: автоматическое принятие расширяет доступ.',
      'Перед включением enforcing проверьте console, backup config и boot parameter recovery. Не запускайте audit2allow | semodule без понимания: так можно узаконить поведение скомпрометированного процесса. Тестируйте позитивный сценарий и попытку доступа, которая должна остаться заблокированной.',
    ],
    read: "getenforce 2>/dev/null || true\nsestatus 2>/dev/null || true\nsudo ausearch -m AVC -ts recent 2>/dev/null | tail -30\nsudo aa-status 2>/dev/null || true\njournalctl -k --since '1 hour ago' | grep -Ei 'apparmor|avc' | tail -30",
    change: "# SELinux: временно permissive только для диагностики, затем вернуть enforcing:\nsudo setenforce 0\n# воспроизведите разрешённый учебный сценарий и изучите AVC\nsudo setenforce 1\n# AppArmor: используйте complain только для конкретного учебного профиля:\n# sudo aa-complain /path/to/profile; ...; sudo aa-enforce /path/to/profile",
    expected: 'Текущий режим и denial-события определены, временная диагностика возвращена в enforcing; сформулировано минимальное правило вместо глобального отключения MAC.',
    detection: 'Собирайте AVC/AppArmor denials, изменения policy, переход global permissive и загрузку новых модулей. Отделяйте ожидаемый шум при deployment от новой попытки доступа процесса к секретному пути.',
    defense: 'Оставляйте MAC включённым, используйте поставляемые профили, корректные labels и минимальные local overrides. Проверяйте policy в staging и сохраняйте console/recovery путь перед enforcing.',
    sources: ['linux-selinux-docs', 'linux-apparmor-docs'],
    question: ['Какой режим SELinux журналирует и блокирует?', ['Enforcing', 'Permissive', 'Disabled', 'Complain'], 0, 'Enforcing применяет policy, тогда как Permissive лишь пишет нарушения.'],
  },
  {
    id: 'lsec-hardening-audit', title: 'Hardening и проверка конфигурации', description: 'Baseline, CIS-подход, OpenSCAP/Lynis, исключения и безопасное исправление отклонений.',
    theory: [
      'Baseline переводит требования организации в проверяемую конфигурацию: службы, mount options, пароли, SSH, logging, kernel settings. CIS Benchmark и vendor guides дают отправную точку, но не знают назначения вашего сервера. Каждый пункт оценивают на применимость и влияние.',
      'Scanner показывает отклонение, а не автоматически уязвимость. Авто-remediation может отключить протокол, изменить PAM, mount или sysctl и вывести систему из строя. Сначала запускайте assessment read-only, сохраняйте отчёт и выбирайте небольшую группу изменений с owner и rollback.',
      'Конфигурацию лучше описывать кодом через Ansible и проверять в CI/staging. Исключение содержит ID требования, причину, компенсирующую меру, владельца и срок. Drift detection сравнивает состояние регулярно, а не только перед аудитом.',
      'Проверка hardening включает функциональный тест: вход администратора, запуск приложения, backup, monitoring и reboot. Только процент compliance без проверки сервиса создаёт ложную уверенность. Высокий score не компенсирует открытый секрет или неподдерживаемую ОС.',
    ],
    read: "systemctl list-unit-files --state=enabled\nsysctl kernel.randomize_va_space fs.protected_hardlinks fs.protected_symlinks\nfindmnt -o TARGET,SOURCE,FSTYPE,OPTIONS\nss -lntup\ncommand -v lynis >/dev/null && sudo lynis audit system --quick || true",
    change: "# Пример обратимого sysctl только в лаборатории:\nsysctl kernel.randomize_va_space\necho 'kernel.randomize_va_space = 2' | sudo tee /etc/sysctl.d/99-lab-hardening.conf\nsudo sysctl --system\n# Откат:\nsudo rm -f /etc/sysctl.d/99-lab-hardening.conf\nsudo sysctl --system",
    expected: 'Получен baseline-отчёт, одно обратимое изменение проверено функциональным тестом и откатилось; исключения имеют owner и дату пересмотра.',
    detection: 'Сравнивайте drift важных файлов, enabled services, ports, sysctl и scanner findings. Следите не только за ухудшением score, но и за неожиданным отключением audit/backup/EDR после remediation.',
    defense: 'Выберите baseline по роли сервера, автоматизируйте assessment, исправляйте небольшими волнами и сохраняйте исключения. Любое изменение проходит staging, backup, health check и rollback.',
    sources: ['linux-compliance-docs', 'linux-admin-docs'],
    question: ['Что означает finding сканера compliance?', ['Отклонение, которое нужно оценить по контексту', 'Гарантированную активную атаку', 'Команду на автоисправление', 'Успешный backup'], 0, 'Сканер сравнивает baseline, но администратор оценивает применимость и риск изменения.'],
  },
  {
    id: 'lsec-integrity-backup', title: 'Целостность, резервное копирование и восстановление', description: 'Хеши, AIDE, restic, правило 3-2-1, шифрование и регулярный restore drill.',
    theory: [
      'File integrity monitoring хранит эталон метаданных и хешей и сообщает об изменениях. Он не определяет автоматически злой умысел: обновление пакета тоже меняет файл. Базу создают на доверенной системе, защищают отдельно и связывают alert с change window.',
      'Backup проектируют от RPO/RTO и сценариев: удаление, ransomware, отказ диска, потеря региона. Правило 3-2-1 означает три копии, два типа хранения, одну вне основной площадки; immutable/offline копия уменьшает риск удаления теми же credentials.',
      'Restic и похожие инструменты шифруют и дедуплицируют данные, но password/repository key нужно хранить отдельно и резервировать. Snapshot не равен backup, если находится в той же административной границе. Для базы используйте application-consistent экспорт или нативный механизм.',
      'Restore drill важнее зелёного backup job. Восстанавливайте в отдельный каталог/VM, проверяйте хеш, владельца, права и работу приложения, измеряйте время. Не перезаписывайте production до анализа и согласования точки восстановления.',
    ],
    read: "sha256sum /etc/ssh/sshd_config\nfindmnt\nsystemctl list-timers --all | grep -Ei 'backup|restic' || true\ncommand -v restic >/dev/null && restic snapshots || true",
    change: "mkdir -p \"$HOME/lab-source\" \"$HOME/lab-restore\"\nprintf 'training data\\n' > \"$HOME/lab-source/sample.txt\"\nsha256sum \"$HOME/lab-source/sample.txt\" > \"$HOME/lab-source/SHA256SUMS\"\n# Настройте restic только на собственный локальный lab repository, затем backup/restore.\n# Очистка: rm -rf \"$HOME/lab-source\" \"$HOME/lab-restore\" <local-lab-repository>",
    expected: 'Тестовый файл восстановлен в отдельный каталог, sha256 совпадает, время восстановления записано, а ключ репозитория не находится рядом с копией.',
    detection: 'Alert должен ловить failed/missed backup, резкое падение объёма, удаление snapshots и изменение критичных файлов вне окна. Периодический независимый restore подтверждает, что monitoring не выдаёт ложный успех.',
    defense: 'Разделяйте credentials, включайте immutability, шифруйте и тестируйте восстановление. Документируйте RPO/RTO, owner, расположение ключа и порядок запуска зависимостей.',
    sources: ['linux-restic-docs', 'linux-audit-docs'],
    question: ['Что лучше всего подтверждает пригодность backup?', ['Успешное проверенное восстановление', 'Наличие файла snapshot', 'Большой размер архива', 'Один зелёный job'], 0, 'Только restore drill подтверждает чтение данных и фактический RTO.'],
  },
];

const ethicalProfiles = [
  {
    id: 'eth-ethics-law', title: 'Правила, разрешение и границы теста', description: 'Письменный scope, Rules of Engagement, остановка работ, хранение доказательств и безопасная коммуникация.',
    theory: ['Тестирование начинается не со сканера, а с письменного разрешения. Scope перечисляет IP, домены, приложения, учётные записи и исключения; Rules of Engagement задают время, допустимые техники, лимиты нагрузки, контакт и критерии немедленной остановки.', 'Даже пассивная информация может содержать персональные данные. Собирайте минимум, шифруйте доказательства и задавайте срок удаления. Никогда не переносите найденные секреты в личные сервисы и не используйте доступ для задач вне согласованной цели.', 'Безопасный kill switch включает контакт владельца, сохранение текущего состояния, остановку инструмента и запись времени. Не продолжайте при признаках нестабильности, выходе за scope или обнаружении чужой инфраструктуры. Не пытайтесь скрывать тест от защитников, если это не оговорённая контролируемая часть упражнения.', 'Отчёт отделяет доказанный факт от предположения, указывает воспроизводимость и риск для бизнеса. Responsible disclosure применяют только по опубликованной политике владельца; отсутствие ответа не превращает систему в разрешённую цель.'],
    read: "printf '%s\n' 'TARGETS: 192.0.2.0/28 (lab only)' 'WINDOW: 10:00-12:00 UTC' 'ALLOWED: discovery, safe scan' 'FORBIDDEN: DoS, persistence, data export' 'STOP CONTACT: lab-owner@example.test'",
    change: "# Создайте signed scope.md для своей лаборатории.\n# Выпишите точные цели, окно, разрешённые/запрещённые действия, лимит запросов, контакт и процедуру очистки.\n# Не запускайте инструменты до review документа владельцем стенда.",
    expected: 'Существует однозначный подписанный scope, stop condition, contact и план удаления данных; любой участник может определить, разрешено ли конкретное действие.',
    detection: 'Blue team получает окно и источники теста, чтобы отличить упражнение от инцидента, если тест не является согласованным blind exercise. Все действия имеют timestamps и operator ID.',
    defense: 'Организация публикует vulnerability disclosure policy, ведёт asset inventory и контакт безопасности, а тесты проходят change management и наблюдение владельцев критичных сервисов.',
    sources: ['owasp-wstg', 'mitre-attack-docs'],
    question: ['Что обязательно до активного сканирования?', ['Явное письменное разрешение и scope', 'Только VPN', 'Публичный IP цели', 'Анонимная учётная запись'], 0, 'Техническая доступность не является разрешением.'],
  },
  {
    id: 'eth-lab-setup', title: 'Изолированный учебный стенд', description: 'Host-only сеть, snapshots, уязвимые цели, наблюдение и очистка без риска для чужих систем.',
    theory: ['Стенд состоит из атакующей VM, специально уязвимой цели, отдельной сети и точки наблюдения. Host-only или internal network не маршрутизируется в интернет; NAT включают временно только для обновления и отключают перед экспериментом. Bridged mode опасен: цель окажется в домашней или корпоративной сети.', 'Используйте OWASP Juice Shop/WebGoat или иные официальные учебные приложения, а не случайно найденный сервер. Snapshot перед упражнением даёт быстрый возврат, но секреты и артефакты всё равно удаляют. Тестовые пароли не повторяют реальные.', 'Наблюдаемость является частью лаборатории: access logs, auth logs, process events и packet capture показывают, что увидит защитник. Синхронизируйте время VM и подпишите IP/роль каждого узла. Симулятор в браузере или терминал сайта не является настоящей системой.', 'Перед началом выполните containment test: цель не должна достигать интернет или production, а хост не должен принимать порт цели с внешнего интерфейса. После работы остановите контейнеры, верните snapshots и проверьте, что пробросы портов удалены.'],
    read: "ip -brief address\nip route\nss -lntup\n# Docker-цель должна слушать только loopback:\ndocker ps --format 'table {{.Names}}\t{{.Ports}}' 2>/dev/null || true",
    change: "docker run --rm -d --name juice-lab -p 127.0.0.1:3000:3000 bkimminich/juice-shop\ncurl -I http://127.0.0.1:3000\n# Очистка:\ndocker stop juice-lab",
    expected: 'Учебная цель доступна только с разрешённого хоста/сети, snapshot и logs готовы, внешний интерфейс не публикует порт, контейнер полностью удаляется.',
    detection: 'Собирайте access logs цели, docker events, соединения и процессы; временная шкала должна связывать действие обучающегося с наблюдаемым событием.',
    defense: 'Изоляция, egress filtering, snapshots и тестовые identities ограничивают последствия ошибки. Перед каждой лабой повторяйте containment test.',
    sources: ['owasp-juice-shop', 'owasp-webgoat'],
    question: ['Какой режим сети VM безопаснее для изолированной цели?', ['Host-only/internal', 'Bridged в корпоративную сеть', 'Публичный IP', 'DMZ production'], 0, 'Внутренняя сеть ограничивает достижимость специально уязвимой VM.'],
  },
  {
    id: 'eth-recon-osint', title: 'Разведка и OSINT', description: 'Пассивные источники, DNS/WHOIS, метаданные, минимизация данных и защитная инвентаризация.',
    theory: ['Пассивная разведка использует публичные источники без прямого взаимодействия с целевой системой: регистрационные данные, сертификаты, DNS, вакансии и утечки конфигураций. Даже она выполняется только в scope, потому что обработка персональных данных и сторонних активов несёт риск.', 'Certificate Transparency показывает имена, которые организация когда-то включала в сертификаты, но не доказывает, что хост ещё существует или принадлежит цели. WHOIS часто скрыт privacy proxy. Каждую находку подтверждают вторым источником и отмечают confidence.', 'Разведка строит attack surface inventory, а не коллекцию случайных имён. Для каждого актива фиксируют owner, источник, дату, IP/провайдера, назначение и статус validation. Чужие SaaS и CDN не сканируют без отдельного разрешения.', 'Защитник использует тот же процесс для external attack surface management: находит забытые домены, открытые buckets и секреты в public repositories. Исправление начинается с владельца и жизненного цикла, а не с сокрытия banner.'],
    read: "dig example.test A AAAA MX TXT\ndig +short _dmarc.example.test TXT\nwhois example.test 2>/dev/null | head -40\n# Используйте только домен собственной лаборатории или разрешённый учебный домен.",
    change: "# Создайте inventory.csv: asset,source,observed_at,owner,in_scope,confidence,notes\n# Добавьте только данные собственного учебного домена; сторонние CDN отметьте out-of-scope и не сканируйте.",
    expected: 'Получена проверяемая таблица активов с источником, датой, confidence и явной границей scope; персональные данные и сторонние цели исключены.',
    detection: 'Пассивная разведка часто не видна на целевом хосте, поэтому защитник сам мониторит CT, DNS, public Git и внешнюю поверхность. Active DNS queries могут быть видны authoritative provider.',
    defense: 'Ведите полный asset inventory, удаляйте забытые записи, применяйте secret scanning, минимизируйте метаданные и назначайте owner каждому публичному сервису.',
    sources: ['owasp-wstg', 'mitre-attack-docs'],
    question: ['Что доказывает имя в Certificate Transparency?', ['Что оно было включено в сертификат, но не обязательно активно сейчас', 'Что сервер уязвим', 'Что сканирование разрешено', 'Что IP принадлежит цели навсегда'], 0, 'CT — источник кандидатов, которые требуют проверки ownership и актуальности.'],
  },
  {
    id: 'eth-scanning-nmap', title: 'Сканирование Nmap', description: 'Безопасное обнаружение хостов и портов, версии сервисов, темп, интерпретация и журналы защиты.',
    theory: ['Nmap различает host discovery и port scan. Состояние open означает, что приложение принимает соединение; closed — хост ответил, но слушателя нет; filtered — фильтр не позволил сделать вывод. Отсутствие ответа не доказывает отсутствие хоста.', 'Начинайте с малого списка разрешённых IP и стандартного темпа. -sV отправляет дополнительные probes для определения сервиса, -O и NSE увеличивают воздействие и требуют отдельного разрешения. SYN scan обычно требует root; connect scan использует обычный connect и полнее попадает в application/network logs.', 'Результат сохраняйте в -oA, указывайте версию Nmap, команду, время и source IP. Banner/version — гипотеза: reverse proxy, backport или deception могут исказить ответ. Подтверждайте вручную безопасным запросом и документацией владельца.', 'Сканирование может вызвать нагрузку на слабое устройство, IDS и блокировку. Ограничивайте --max-rate, исключайте printers/OT, имейте stop contact. Никогда не применяйте aggressive scripts к интернету или чужой сети.'],
    read: "nmap -sn 192.0.2.10-12 -oA lab-discovery\nnmap -sT -sV --version-light -T3 --max-rate 50 -p 22,80,443 192.0.2.10 -oA lab-services\n# Диапазон 192.0.2.0/24 документационный: замените только IP собственной лаборатории.",
    change: "# Сравните XML/normal output с ss -lntup на собственной целевой VM.\n# Остановите scan при нестабильности: Ctrl-C сохраняет частичный результат; уведомите владельца по RoE.",
    expected: 'Для каждого разрешённого узла зафиксированы open/closed/filtered, вероятный сервис и ручное подтверждение; темп ограничен, out-of-scope адреса отсутствуют.',
    detection: 'Firewall/IDS видит последовательные попытки портов, хост — connect events, сервис — application probes. Коррелируйте один source с множеством destination ports и учитывайте разрешённые scanner IP.',
    defense: 'Закрывайте ненужные listeners, сегментируйте management, ограничивайте source, обновляйте сервисы и собирайте flow/host logs. Rate limiting дополняет, но не заменяет устранение поверхности.',
    sources: ['nmap-source', 'owasp-wstg'],
    question: ['Что означает filtered в Nmap?', ['Nmap не смог определить состояние из-за фильтрации/ответа', 'Порт точно открыт', 'Сервис уязвим', 'Хост выключен'], 0, 'Фильтрация мешает получить однозначный ответ open/closed.'],
  },
  {
    id: 'eth-enumeration', title: 'Перечисление сервисов', description: 'HTTP, DNS, SMB и SSH как протоколы; доказательство доступа без сбора чужих данных.',
    theory: ['Enumeration углубляет подтверждённый сервис: protocol handshake, version hints, доступные методы и разрешённые анонимные функции. Делайте минимальный запрос, достаточный для вывода. Не выгружайте каталоги, письма или файлы только потому, что сервер их показывает.', 'HTTP проверяют status, headers, redirect и robots как подсказки, но robots не является контролем доступа. DNS zone transfer и SMB guest проверяют только на собственном стенде. SSH banner редко достаточно для точной patch level из-за backports.', 'Для каждого результата отделяйте evidence от interpretation: команда и raw response, затем предположение и confidence. Ошибка 401 означает аутентификацию, 403 — отказ после понимания запроса, но proxy может менять поведение.', 'Защитник уменьшает анонимную поверхность, отключает legacy protocols и наблюдает atypical methods/paths. Banner hiding имеет низкий приоритет по сравнению с обновлением и access control.'],
    read: "curl -skI http://192.0.2.10/\ncurl -sk -o /dev/null -w '%{http_code} %{content_type} %{size_download}\n' http://192.0.2.10/\nprintf '\n' | nc -nv 192.0.2.10 22\n# Только адрес собственной лаборатории.",
    change: "# Запишите service-evidence.md: command, timestamp, raw result, interpretation, confidence, detection source.\n# Не используйте brute force, recursive download или доступ к данным вне учебного набора.",
    expected: 'Сервис подтверждён минимальным protocol request, evidence сохранено без чужих данных, версия помечена как вероятная и сопоставлена с логом цели.',
    detection: 'Web logs фиксируют необычные HEAD/OPTIONS/paths, DNS — AXFR attempts, SMB — guest sessions, SSH — pre-auth connections. Baseline помогает отличить admin tools от reconnaissance.',
    defense: 'Отключайте anonymous/guest, ограничивайте management networks, удаляйте default content и legacy protocols, обновляйте и централизуйте protocol logs.',
    sources: ['owasp-wstg', 'nmap-source'],
    question: ['Является ли banner точным доказательством patch level?', ['Нет, его нужно подтверждать', 'Да, всегда', 'Только без TLS', 'Только для SSH'], 0, 'Backports и proxy могут сохранять старую строку версии при исправленном пакете.'],
  },
  {
    id: 'eth-web-owasp', title: 'Безопасность веб-приложений', description: 'HTTP-модель, аутентификация, доступ, ввод, OWASP Juice Shop и защитные тесты.',
    theory: ['Веб-тест строится вокруг HTTP-запроса, состояния сессии и серверной авторизации. Клиентские кнопки и скрытые поля не являются контролем: сервер обязан проверять identity, object ownership и действие на каждом запросе. Разница authentication и authorization критична.', 'Ввод рассматривают по контексту: SQL, HTML, shell, path и template требуют разных защит. Универсальная мера — parameterized queries и безопасные API, output encoding по контексту и allow-list там, где формат ограничен. WAF снижает риск, но не исправляет код.', 'Лабораторию выполняйте в Juice Shop/WebGoat по встроенному сценарию. Перехватывающий proxy настраивают только для localhost/изолированной цели. Не копируйте payload в чужие формы и не проверяйте production без отдельного test case и rollback.', 'Для каждого finding запишите precondition, request/response с удалёнными tokens, влияние и remediation. Затем повторите тот же тест после исправления и покажите, что legitimate request работает, а запрещённый блокируется.'],
    read: "curl -sS -D lab-headers.txt -o /dev/null http://127.0.0.1:3000/\ngrep -Ei 'content-security-policy|set-cookie|x-content-type-options|strict-transport' lab-headers.txt || true\n# Цель — локальный официально уязвимый учебный контейнер.",
    change: "# В Juice Shop выполните встроенный beginner challenge по access control.\n# Сохраните минимальный request/response без session token, затем изучите access log контейнера.\nrm -f lab-headers.txt",
    expected: 'Учебная слабость воспроизведена только в уязвимом приложении, evidence очищено от токенов, показаны server-side исправление и ожидаемый log/detection.',
    detection: 'WAF и web logs показывают необычные status/path/query, но приложение должно журналировать user/object/decision без секретов. Correlation ID связывает запрос с backend event.',
    defense: 'Server-side authorization, parameterized API, secure session cookies, CSP и dependency updates применяются вместе. Regression test подтверждает исправление каждого finding.',
    sources: ['owasp-wstg', 'owasp-juice-shop'],
    question: ['Где должен проверяться доступ к объекту?', ['На сервере для каждого запроса', 'Только скрытием кнопки', 'В CSS', 'В robots.txt'], 0, 'Клиент контролирует пользователь, поэтому сервер повторно авторизует действие и объект.'],
  },
  {
    id: 'eth-passwords-hashes', title: 'Пароли и хеши', description: 'Хеширование, salt, KDF, офлайн-аудит тестовых хешей и защитная политика.',
    theory: ['Хеш пароля должен быть медленным и адаптивным: Argon2id, scrypt, bcrypt или PBKDF2 по актуальным параметрам. Salt уникален и не секретен; он ломает precomputed tables. Pepper хранится отдельно как секрет и усложняет офлайн-проверку украденной базы.', 'Онлайн guessing ограничен сервером и должен встречать MFA, rate limit и risk detection. Офлайн-аудит работает над копией тестовых хешей и может перебирать быстро, поэтому параметры KDF выбирают по допустимой задержке входа и регулярно повышают.', 'В лаборатории используйте только самостоятельно созданные пароли и хеши. Цель — увидеть разницу быстрого SHA-256 и password KDF, а не получать чужие credentials. Wordlist должна быть учебной и удаляться вместе с результатами.', 'Защитник отслеживает password spray по одному паролю ко многим аккаунтам, credential stuffing по утёкшим парам и аномалии reset/MFA. Политика длины и blocklist эффективнее частой принудительной смены без признака компрометации.'],
    read: "python3 -c \"import hashlib; print(hashlib.sha256(b'lab-password').hexdigest())\"\npython3 -c \"import crypt; print(crypt.crypt('lab-password', crypt.mksalt(crypt.METHOD_SHA512)))\" 2>/dev/null || true",
    change: "# Создайте три собственных тестовых пароля и измерьте проверку разных KDF в учебном скрипте.\n# Не используйте /etc/shadow, дампы, чужие hashes или реальные пароли.\n# Удалите hash/wordlist/results после отчёта.",
    expected: 'Обучающийся объясняет salt/KDF, сравнивает стоимость проверки на тестовых данных и формулирует MFA/rate-limit/detection без получения реальных учётных данных.',
    detection: 'Коррелируйте failures по source, account и password pattern, успешный вход после серии отказов, impossible travel и новые MFA methods. Не записывайте пароль в log.',
    defense: 'Используйте Argon2id или поддерживаемый адаптивный KDF, уникальный salt, MFA, blocklist утёкших паролей, rate limiting и безопасный reset.',
    sources: ['owasp-passwords', 'mitre-attack-docs'],
    question: ['Зачем нужен уникальный salt?', ['Чтобы одинаковые пароли имели разные хеши', 'Чтобы расшифровать пароль', 'Чтобы заменить MFA', 'Чтобы ускорить перебор'], 0, 'Salt мешает сравнению одинаковых паролей и готовым таблицам, но хранится рядом с хешем.'],
  },
  {
    id: 'eth-privesc', title: 'Повышение привилегий в Linux-лаборатории', description: 'Sudo, SUID, capabilities, services и cron: безопасный аудит, обнаружение и исправление.',
    theory: ['Privilege escalation использует неверно делегированное действие: слишком широкое sudo, writable service unit/script, опасный SUID binary, capability или секрет. Инвентаризация должна быть read-only и выполняться на собственной специально подготовленной VM.', 'SUID запускает файл с effective UID владельца; он нужен небольшому числу программ. Linux capabilities делят root-привилегии, но cap_setuid, cap_dac_override и другие чувствительные права на интерпретаторе могут эквивалентно дать полный доступ. Сравнивайте с baseline пакета.', 'Writable cron script или systemd unit опасны, когда привилегированный scheduler выполняет содержимое. Защитник проверяет всю цепочку пути: каталог, файл, interpreter и environment. Не эксплуатируйте найденное в production; достаточно доказательства доступа к безвредному lab marker по согласованию.', 'Исправление удаляет лишнее право, меняет owner/mode, ограничивает sudo и rotates exposed secret. Затем повторяют negative test и проверяют, что legit service продолжает работать. Evidence не должно содержать /etc/shadow или реальные ключи.'],
    read: "sudo -l\nfind / -xdev -perm -4000 -type f 2>/dev/null\ngetcap -r / 2>/dev/null\nsystemctl list-timers --all\nfind /etc/systemd/system /usr/local/bin -xdev -type f -writable 2>/dev/null",
    change: "# На специально подготовленной VM найдите одну намеренную ошибку и создайте только безвредный marker в /tmp.\n# Не устанавливайте persistence и не читайте реальные секреты.\n# Исправьте mode/owner или sudo rule, удалите marker и повторите inventory.",
    expected: 'Намеренная misconfiguration найдена и доказана безопасным marker, затем исправлена; повторная проверка не воспроизводит путь, а служба работает.',
    detection: 'Auditd/EDR отслеживает setuid execution, sudo, changes unit/cron, capabilities и root-owned files в /tmp. Baseline выявляет новый SUID или writable privileged path.',
    defense: 'Минимизируйте sudo/SUID/capabilities, защищайте service paths, используйте package verification, MAC и регулярный drift scan. Устраните первопричину и ротируйте затронутые secrets.',
    sources: ['linux-compliance-docs', 'mitre-attack-docs'],
    question: ['Что безопасно доказывает путь повышения в лаборатории?', ['Создание безвредного marker в согласованном месте', 'Копирование shadow', 'Установка backdoor', 'Отключение logs'], 0, 'Минимальное доказательство подтверждает влияние без сбора секретов или persistence.'],
  },
  {
    id: 'eth-ad-attacks', title: 'Основы безопасности Active Directory', description: 'Граф доступа, Kerberos, делегирование, учётные записи служб, обнаружение и исправление в тестовом домене.',
    theory: ['AD security анализирует пути контроля: членство в привилегированной группе, права ACL на объект, управление GPO, delegation и service accounts. Одна слабая связь может дать путь к домену, поэтому перечень Domain Admins недостаточен.', 'Kerberos выдаёт TGT и service tickets. Service account с SPN должен иметь длинный случайный пароль или gMSA, потому что offline guessing service ticket не требует блокировки аккаунта. Не выполняйте извлечение tickets или hashes вне собственного учебного домена.', 'Tiering отделяет администрирование домена от серверов и рабочих станций. Привилегированная учётная запись не входит на менее доверенный узел, PAW защищает её credential material, LAPS даёт уникальные локальные пароли. Delegation и legacy NTLM сокращают по плану совместимости.', 'Лаборатория строит граф из заранее созданных учебных ACL и групп, затем исправляет одну связь и подтверждает разрыв пути. Защитник наблюдает directory changes, необычные ticket requests, group membership и GPO modifications.'],
    read: "# PowerShell на собственном контроллере/management VM:\nGet-ADGroupMember 'Domain Admins'\nGet-ADUser -Filter {ServicePrincipalName -like '*'} -Properties ServicePrincipalName,PasswordLastSet\nGet-ADObject -SearchBase (Get-ADRootDSE).defaultNamingContext -LDAPFilter '(adminCount=1)' -Properties adminCount",
    change: "# Создайте тестовую группу и делегирование только в отдельной OU учебного домена.\n# Задокументируйте путь User -> Group -> ACL -> Test Object, затем удалите ACL/group membership.\n# Не запрашивайте реальные tickets/hashes и не используйте production identities.",
    expected: 'Построен понятный граф учебного доступа, одна misconfiguration устранена, права повторно проверены; события изменения группы/ACL найдены в журнале.',
    detection: 'Собирайте события 4728/4729/4732/4733, directory service changes, GPO и Kerberos anomalies. Изменение привилегии связывайте с ticket/change request и владельцем.',
    defense: 'Tiered admin, gMSA, LAPS, protected groups, review ACL/GPO, MFA на внешнем входе и сокращение NTLM уменьшают путь. Forest recovery и backup проверяются отдельно.',
    sources: ['ad-docs', 'mitre-attack-docs'],
    question: ['Почему gMSA полезна для службы?', ['Управляет длинным автоматически меняемым паролем', 'Отключает Kerberos', 'Делает всех Domain Admin', 'Открывает LDAP анонимно'], 0, 'gMSA уменьшает риск статического слабого пароля service account.'],
  },
  {
    id: 'eth-reporting-ctf', title: 'Отчёт и защитная лаборатория', description: 'Воспроизводимые findings, риск, доказательства, remediation, retest и итоговый mini-CTF.',
    theory: ['Хороший finding содержит название, актив, severity с обоснованием, precondition, минимальные шаги, evidence, влияние, remediation и retest. Severity не равна названию уязвимости: учитываются доступность, привилегии, данные, blast radius и существующие контроли.', 'Executive summary отвечает, что произошло, каков риск и что делать в первую очередь. Technical appendix даёт воспроизводимость без секретов. Скриншот дополняет текст, но команды и raw response важнее; токены, cookies и персональные данные редактируют.', 'Remediation должна быть конкретной и проверяемой: server-side ownership check, удалить anonymous, rotate key, ограничить source. После исправления повторяют исходный test и проверяют нормальный сценарий. Accepted risk фиксирует owner и expiry.', 'Итоговая лаборатория объединяет recon, scan, enumeration и одно безопасное finding на своём стенде, затем требует найти соответствующие blue-team logs и восстановить snapshot. Победа — не root, а качественный отчёт и подтверждённое исправление.'],
    read: "printf '%s\n' '# Finding: LAB-001' 'Asset:' 'Severity and rationale:' 'Precondition:' 'Steps:' 'Evidence (redacted):' 'Detection:' 'Remediation:' 'Retest:'",
    change: "# Пройдите mini-CTF только на своём изолированном стенде:\n# 1 scope; 2 discovery; 3 service evidence; 4 one safe finding; 5 logs; 6 fix; 7 retest; 8 cleanup.\n# Верните snapshot и удалите все временные данные.",
    expected: 'Отчёт позволяет владельцу воспроизвести finding, увидеть событие в журнале, применить конкретное исправление и подтвердить отрицательный retest; стенд очищен.',
    detection: 'Каждый шаг сопоставлен с source, timestamp и конкретным log. Если действие не видно, отчёт содержит gap и рекомендацию по telemetry, а не утверждение об отсутствии события.',
    defense: 'Remediation приоритизируется по реальному пути атаки и blast radius, имеет owner/sрок и проверяется retest. Метрики считают закрытые подтверждённые риски, а не число страниц.',
    sources: ['owasp-wstg', 'owasp-juice-shop'],
    question: ['Когда finding считается исправленным?', ['После отрицательного retest и проверки нормального сценария', 'После обещания владельца', 'После удаления screenshot', 'После смены названия'], 0, 'Retest проверяет конкретный путь и отсутствие регрессии.'],
  },
];

const makeLesson = (profile, ethical = false) => ({
  intro: `${profile.title} — подробный практический урок трека «${ethical ? 'Этичный хакинг и защита' : 'Безопасность Linux'}». Здесь теория связана с изолированной лабораторией, ожидаемым результатом, диагностикой, обнаружением и защитой. ${ethical ? 'Любое активное действие разрешено только на собственном стенде или при явном письменном разрешении владельца.' : 'Опасные изменения выполняются только при сохранённой консоли, второй сессии и заранее подготовленном откате.'}`,
  sections: [
    { title: 'Как устроена технология', paragraphs: profile.theory.slice(0, 2) },
    { title: 'Риски и безопасная эксплуатация', paragraphs: profile.theory.slice(2) },
    { title: 'Обнаружение и защита', paragraphs: [profile.detection, profile.defense] },
  ],
  lab: {
    steps: [
      `Подтвердите границы лаборатории: собственная VM или письменный scope, адреса, время, разрешённые действия и контакт остановки. Снимите snapshot и проверьте консольный доступ до изменения.`,
      'Выполните команды инвентаризации без изменения состояния. Сохраните результат без секретов, отметьте время и объясните, какую гипотезу проверяет каждая команда.',
      'Подготовьте rollback: копию конфигурации, вторую административную сессию или snapshot. Запишите точную команду возврата и критерий, при котором её нужно выполнить.',
      'Выполните только учебное изменение или упражнение из блока ниже. Не расширяйте цель, не собирайте реальные пароли/данные и остановитесь при нестабильности или выходе за scope.',
      'Проверьте ожидаемый результат с точки зрения пользователя и защитника: функциональный тест, журнал, событие audit/network и отрицательный тест запрещённого действия.',
      'Выполните откат и очистку, повторите inventory, удалите временные файлы и убедитесь, что не осталось открытого порта, правила, учётной записи, контейнера или чувствительного evidence.',
    ],
    commands: profile.read,
    commandsLabel: 'ИНВЕНТАРИЗАЦИЯ · ТОЛЬКО СОБСТВЕННЫЙ СТЕНД',
    extraCommands: [{ label: 'УЧЕБНОЕ ДЕЙСТВИЕ И ОТКАТ · ПРОЧИТАЙТЕ ПЕРЕД ЗАПУСКОМ', commands: profile.change }],
    expected: profile.expected,
    pitfalls: [
      ethical ? 'Техническая доступность цели не является разрешением. При сомнении действие прекращают и уточняют scope у владельца.' : 'Не закрывайте текущую административную сессию, пока новая конфигурация и путь отката не проверены из отдельного соединения.',
      'Команды и пути отличаются между дистрибутивами и версиями. Сначала читайте man/help и состояние текущей системы, затем адаптируйте один параметр за раз.',
      'Не помещайте пароли, токены, private keys, cookies и персональные данные в screenshot, Git или отчёт. Редактируйте evidence и удаляйте его по окончании.',
      'Snapshot облегчает возврат VM, но не заменяет backup данных и документированный rollback. После восстановления повторно проверьте сеть, время и журналы.',
    ],
  },
});

const makeDetail = (profile, ethical = false) => ({
  goals: [
    `Объяснить тему «${profile.title}» через модель работы и границы доверия.`,
    'Провести безопасную инвентаризацию и отличить доказанный факт от предположения.',
    'Выполнить изолированную лабораторию с заранее подготовленным откатом и очисткой.',
    'Показать, какое событие увидит защитник и какая мера устраняет первопричину.',
  ],
  deepDive: [...profile.theory, profile.detection, profile.defense],
  caseStudy: {
    situation: `В учебной среде обнаружено отклонение по теме «${profile.title}», но команда не хочет потерять доступ или повредить сервис поспешным исправлением.`,
    action: `Администратор фиксирует scope и исходное состояние, готовит snapshot/rollback, выполняет минимальное доказательство, находит соответствующее событие в журнале, применяет узкое исправление и повторяет тот же тест.`,
    result: `Риск подтверждён без выхода за разрешённые границы, защитный сигнал проверен, нормальная работа сохранена, а отчёт содержит воспроизводимый результат и план дальнейшего контроля.`,
  },
  diagram: ethical
    ? ['Письменный scope', 'Минимальное действие', 'Evidence без секретов', 'Detection в журнале', 'Исправление, retest и cleanup']
    : ['Inventory и baseline', 'Backup и путь отката', 'Одно изменение', 'Функциональная и security-проверка', 'Журнал, документирование и cleanup'],
  uiMockup: {
    breadcrumb: `${ethical ? 'LAB / ETHICAL SECURITY' : 'LAB / LINUX SECURITY'} › ${profile.title}`,
    panelTitle: 'Контрольная карточка лаборатории · учебный макет',
    rows: [
      { label: 'Scope', value: 'Собственная изолированная VM' },
      { label: 'Rollback', value: 'Snapshot + проверенная консоль' },
      { label: 'Evidence', value: 'Без секретов и персональных данных' },
      { label: 'Detection', value: profile.detection.slice(0, 82) + '…' },
      { label: 'Cleanup', value: 'Выполнен и проверен inventory' },
    ],
    helpText: 'Авторский учебный макет чек-листа, а не снимок реального продукта.',
  },
  terminal: {
    prompt: 'student@isolated-lab:~$',
    caption: 'Учебный терминал изолированной VM; вывод сокращён. Команды не выполняются на сервере сайта.',
    lines: [
      { type: 'input', text: profile.read.split('\n')[0] },
      { type: 'output', text: 'Учебный результат зависит от вашей VM и версии дистрибутива.' },
      { type: 'success', text: 'scope=authorized  rollback=ready  evidence=redacted' },
    ],
  },
  practiceTasks: [
    { task: 'Составьте таблицу «действие → ожидаемый результат → журнал → откат» минимум для трёх шагов лаборатории.', hint: 'У каждого технического изменения должен быть наблюдаемый сигнал и обратная операция.', solution: `Используйте команды урока, ожидаемый результат «${profile.expected}» и защитный сигнал: ${profile.detection}` },
    { task: 'Объясните, почему широкое быстрое исправление хуже узкой меры, и предложите negative test после изменения.', hint: 'Проверьте влияние на доступ администратора и нормальный пользовательский сценарий.', solution: `Узкая мера: ${profile.defense} После изменения повторите исходный тест и отдельно подтвердите, что разрешённый сценарий продолжает работать.` },
  ],
  question: { question: profile.question[0], options: profile.question[1], answer: profile.question[2], explanation: profile.question[3] },
});

const makeWalkthrough = (profile, ethical = false) => ({
  title: `Практический разбор: ${profile.title}`,
  context: `Разбор показывает полный рабочий цикл: разрешение и scope, исходное состояние, безопасное действие, наблюдение защитника, исправление, retest и очистка. ${ethical ? 'Цель упражнения — обучиться защите на собственном стенде, а не получить доступ к чужой системе.' : 'Путь администратора и откат проверяются до применения настройки.'}`,
  steps: [
    `Опишите лабораторию и доверенные границы: адреса, владельца, допустимые действия, активную административную сессию и способ консольного восстановления. Если актив выходит за scope или console/rollback не проверены, остановитесь до изменения.`,
    `Снимите baseline командами чтения и отметьте ключевые факты. Не интерпретируйте отсутствие строки как доказательство безопасности: проверьте, работает ли источник журнала, правильны ли время, namespace/container и права текущего пользователя.`,
    `Выберите одно минимальное действие, предскажите его результат и защитное событие. Ограничьте адрес, файл, правило или время; сохраните команду отката отдельно, чтобы она была доступна даже при потере текущего соединения.`,
    `Выполните упражнение и сразу проверьте пользовательский результат, security boundary и журнал. Evidence храните с timestamp и командой, но удалите токены, cookies, private keys, password hashes и данные, не нужные для вывода.`,
    `Примените узкое исправление и повторите тот же тест: запрещённый путь должен перестать работать, разрешённый сценарий — сохраниться. Если результат иной, верните исходное состояние и исследуйте одно звено за раз.`,
    `Выполните cleanup и повторный inventory, верните snapshot при необходимости, удалите временные правила и данные. В отчёте укажите факт, влияние, detection, remediation и retest, отдельно отметив ограничения и непроверенные гипотезы.`,
  ],
  verification: `${profile.expected} Соответствующее событие найдено в разрешённом источнике telemetry, откат выполнен, повторная инвентаризация не показывает временных артефактов.`,
  troubleshooting: `Если результат отличается, проверьте scope/адрес, версию дистрибутива, права, состояние службы, время и журнал. ${profile.detection} Не расширяйте привилегии и не отключайте защиту для удобства: вернитесь к snapshot или подготовленной команде отката.`,
});

const allProfiles = [...linuxProfiles.map((item) => ({ ...item, track: 'linux' })), ...ethicalProfiles.map((item) => ({ ...item, track: 'ethical' }))];

export const securityTrackLessons = Object.fromEntries(allProfiles.map((profile) => [profile.id, makeLesson(profile, profile.track === 'ethical')]));
export const securityTrackDetails = Object.fromEntries(allProfiles.map((profile) => [profile.id, makeDetail(profile, profile.track === 'ethical')]));
export const securityTrackWalkthroughs = Object.fromEntries(allProfiles.map((profile) => [profile.id, makeWalkthrough(profile, profile.track === 'ethical')]));

const topic = (profile) => ({ id: profile.id, title: profile.title, description: profile.description });
const byId = new Map(allProfiles.map((profile) => [profile.id, profile]));
const phase = (id, number, title, subtitle, description, ids) => ({ id, number, title, subtitle, description, topics: ids.map((item) => topic(byId.get(item))) });

export const linuxSecurityPhases = [
  phase('lsec-access', '01', 'Доступ и привилегии', 'IDENTITY & ACCESS', 'Персональные учётные записи, минимальные права и SSH без риска потерять доступ.', ['lsec-users-sudo', 'lsec-ssh-hardening']),
  phase('lsec-boundary', '02', 'Сеть и обновления', 'EXPOSURE CONTROL', 'Минимальная поверхность, проверяемые firewall-правила и безопасный цикл обновлений.', ['lsec-firewall', 'lsec-updates']),
  phase('lsec-visibility', '03', 'Модель угроз и наблюдаемость', 'THREAT & TELEMETRY', 'Что защищаем, какие пути атаки реальны и какие события подтверждают действия.', ['lsec-threat-model', 'lsec-logging-auditd']),
  phase('lsec-enforcement', '04', 'Принудительная защита и baseline', 'MAC & HARDENING', 'SELinux/AppArmor, проверка конфигурации, исключения и контроль drift.', ['lsec-mac', 'lsec-hardening-audit']),
  phase('lsec-recovery', '05', 'Целостность и восстановление', 'RECOVERY', 'Контроль изменений, независимые копии и проверенный restore drill.', ['lsec-integrity-backup']),
];

export const ethicalHackingPhases = [
  phase('eth-boundaries', '01', 'Разрешение и стенд', 'RULES & LAB', 'Письменные границы, изоляция, наблюдение и безопасная очистка.', ['eth-ethics-law', 'eth-lab-setup']),
  phase('eth-discovery', '02', 'Разведка и поверхность', 'DISCOVERY', 'Проверяемый inventory, ограниченное сканирование и protocol evidence.', ['eth-recon-osint', 'eth-scanning-nmap', 'eth-enumeration']),
  phase('eth-apps', '03', 'Приложения и учётные данные', 'APPLICATION SECURITY', 'Веб-модель, server-side контроль, KDF, MFA и защитная телеметрия.', ['eth-web-owasp', 'eth-passwords-hashes']),
  phase('eth-privileges', '04', 'Пути привилегий', 'PRIVILEGE PATHS', 'Минимальное доказательство, Linux/AD граф доступа, обнаружение и устранение.', ['eth-privesc', 'eth-ad-attacks']),
  phase('eth-report', '05', 'Отчёт, исправление и retest', 'REPORTING', 'От finding до подтверждённого исправления и полностью очищенного стенда.', ['eth-reporting-ctf']),
];

export const linuxSecurityCourse = {
  id: 'linux-security', title: 'Безопасность Linux',
  description: 'Подробный путь от учётных записей и SSH до auditd, SELinux/AppArmor, hardening и проверенного восстановления. Каждое опасное изменение содержит способ сохранить доступ и откат.',
  topics: linuxSecurityPhases.flatMap((item) => item.topics),
};

export const ethicalHackingCourse = {
  id: 'ethical-hacking', title: 'Этичный хакинг и защита',
  description: 'Практические лаборатории в стиле учебного cyber range: только собственные стенды или явное разрешение, минимальное доказательство, обнаружение, защита, отчёт и retest.',
  topics: ethicalHackingPhases.flatMap((item) => item.topics),
};

export const securityTrackResources = [
  { id: 'linux-admin-docs', title: 'Ubuntu Server documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Открытая документация Canonical по пользователям, SSH, сети, обновлениям и эксплуатации Ubuntu Server.', url: 'https://github.com/canonical/ubuntu-server-documentation' },
  { id: 'linux-ssh-docs', title: 'OpenSSH portable', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Исходный код, manual pages и release notes OpenSSH для проверки параметров клиента и сервера.', url: 'https://github.com/openssh/openssh-portable' },
  { id: 'linux-nftables-docs', title: 'nftables wiki', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Официальная wiki проекта netfilter по tables, chains, rules, stateful filtering и миграции.', url: 'https://wiki.nftables.org/wiki-nftables/index.php/Main_Page' },
  { id: 'linux-audit-docs', title: 'Linux Audit userspace', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Открытый проект auditd, auditctl, ausearch и правил аудита Linux.', url: 'https://github.com/linux-audit/audit-userspace' },
  { id: 'linux-systemd-docs', title: 'systemd manual sources', type: 'Справочник', language: 'EN', access: 'Бесплатно', description: 'Исходники manual pages journald, systemctl, timers и units.', url: 'https://github.com/systemd/systemd/tree/main/man' },
  { id: 'linux-selinux-docs', title: 'SELinux notebook', type: 'Книга', language: 'EN', access: 'Бесплатно', description: 'Открытое подробное объяснение модели SELinux, labels, domains и policy.', url: 'https://github.com/SELinuxProject/selinux-notebook' },
  { id: 'linux-apparmor-docs', title: 'AppArmor documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Официальный проект AppArmor с документацией профилей, tools и диагностики.', url: 'https://gitlab.com/apparmor/apparmor' },
  { id: 'linux-compliance-docs', title: 'ComplianceAsCode content', type: 'Курс', language: 'EN', access: 'Бесплатно', description: 'Открытые baseline-профили и проверки SCAP для Linux; применять только после оценки влияния.', url: 'https://github.com/ComplianceAsCode/content' },
  { id: 'linux-restic-docs', title: 'Restic documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Открытый инструмент шифрованного backup и документация snapshot, check, restore и key management.', url: 'https://github.com/restic/restic' },
  { id: 'owasp-wstg', title: 'OWASP Web Security Testing Guide', type: 'Книга', language: 'EN', access: 'Бесплатно', description: 'Открытая методика web-testing: planning, information gathering, identity, access, input и reporting.', url: 'https://github.com/OWASP/wstg' },
  { id: 'owasp-juice-shop', title: 'OWASP Juice Shop', type: 'Курс', language: 'EN', access: 'Бесплатно', description: 'Специально уязвимое учебное приложение с challenges и companion guide для изолированного стенда.', url: 'https://github.com/juice-shop/juice-shop' },
  { id: 'owasp-webgoat', title: 'OWASP WebGoat', type: 'Курс', language: 'EN', access: 'Бесплатно', description: 'Интерактивное специально уязвимое приложение для законного изучения web-security.', url: 'https://github.com/WebGoat/WebGoat' },
  { id: 'owasp-passwords', title: 'OWASP Password Storage Cheat Sheet', type: 'Справочник', language: 'EN', access: 'Бесплатно', description: 'Рекомендации по Argon2id, scrypt, bcrypt, PBKDF2, salt, pepper и обновлению параметров.', url: 'https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Password_Storage_Cheat_Sheet.md' },
  { id: 'nmap-source', title: 'Nmap source and documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Официальный открытый репозиторий Nmap с reference guide, scripts и changelog.', url: 'https://github.com/nmap/nmap' },
  { id: 'mitre-attack-docs', title: 'MITRE ATT&CK knowledge base', type: 'Справочник', language: 'EN', access: 'Бесплатно', description: 'Открытые данные о техниках, telemetry и mitigations для моделирования и обнаружения поведения.', url: 'https://github.com/mitre-attack/attack-stix-data' },
];

export const securityTrackLessonResources = Object.fromEntries(allProfiles.map((profile) => [profile.id, profile.sources.map((sourceId, index) => ({
  sourceId,
  focus: index === 0 ? `Основной первоисточник для темы «${profile.title}»: сверяйте модель, параметры и ограничения перед лабораторией.` : `Дополнительный защитный взгляд: detection, hardening и проверка результата для темы «${profile.title}».`,
  ...(index === 0 ? { takeaway: profile.defense } : {}),
}))]));
