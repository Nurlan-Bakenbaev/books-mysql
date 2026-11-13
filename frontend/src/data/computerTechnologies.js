// Начальный курс для тех, кому нужен технический фундамент до серверного администрирования.

const profiles = [
  {
    id: 'ct-computer-architecture', title: 'Архитектура компьютера и сервера', description: 'CPU, RAM, motherboard, buses, NUMA, питание и чтение аппаратного inventory.',
    theory: [
      'Процессор выполняет инструкции потоками на ядрах, оперативная память хранит рабочий набор, а контроллеры и шины связывают вычисления с устройствами. Тактовая частота не позволяет напрямую сравнивать разные архитектуры: важны число ядер, IPC, cache, инструкции, лимиты питания и профиль нагрузки.',
      'Материнская плата определяет сокет CPU, каналы памяти, PCIe lanes, storage и management-возможности. Серверы добавляют ECC, резервные блоки питания, hot-swap, BMC/IPMI и иногда NUMA. При NUMA доступ к локальной памяти быстрее, поэтому размещение VM и больших процессов влияет на задержку.',
      'Администратор начинает с inventory и наблюдений: модель, firmware, CPU, объём и состояние памяти, датчики, PCIe-устройства и ошибки. Нельзя менять компонент по одному симптому: перегрев, питание, несовместимая прошивка и драйвер могут выглядеть как отказ CPU или диска.',
    ],
    commands: "lscpu\nfree -h\nlspci -nn | head -30\nsudo dmidecode -t system -t memory 2>/dev/null | head -60 || true",
    exercise: "python3 - <<'PY'\nworkloads=[('AD lab',2,4),('database lab',4,8),('monitoring',2,4)]\nprint('workload | vCPU | RAM GiB')\nfor row in workloads: print(' | '.join(map(str,row)))\nprint('Total before reserve:',sum(x[1] for x in workloads),'vCPU /',sum(x[2] for x in workloads),'GiB')\nPY",
    expected: 'Сформирован inventory CPU, RAM и PCIe без изменения системы; для трёх учебных нагрузок рассчитана потребность и отдельно оставлен резерв хоста.',
    sources: ['ct-linux-insides', 'ct-linux-docs', 'sp-developer-roadmap'],
    question: ['Для чего серверу ECC memory?', ['Для обнаружения и исправления части ошибок памяти', 'Для шифрования диска', 'Для замены CPU', 'Для ускорения DNS'], 0, 'ECC добавляет контроль ошибок памяти и снижает риск незаметного повреждения данных.'],
  },
  {
    id: 'ct-uefi-boot', title: 'UEFI, загрузка и firmware', description: 'POST, UEFI, GPT, boot manager, Secure Boot, обновление firmware и план восстановления.',
    theory: [
      'После подачи питания firmware выполняет инициализацию, POST и выбирает загрузочную запись. UEFI хранит записи в NVRAM и запускает EFI-приложение с системного раздела; GPT описывает разделы современного диска. Ошибка до загрузки ядра диагностируется иначе, чем неисправность службы после входа.',
      'Secure Boot проверяет подписи компонентов загрузки и снижает риск подмены boot chain. Он не шифрует диск и не заменяет обновление ОС. TPM может защищать измерения и ключи, а BitLocker или другой механизм привязывает доступ к ожидаемому состоянию платформы.',
      'Firmware обновляют по документации модели, с устойчивым питанием, сохранённой конфигурацией и проверенным recovery path. Прерывание обновления может сделать устройство незагружаемым. Перед изменением сохраняют boot order, ключи восстановления и доступ к out-of-band console.',
    ],
    commands: "test -d /sys/firmware/efi && echo 'Boot mode: UEFI' || echo 'Boot mode: legacy/unknown'\nlsblk -o NAME,SIZE,FSTYPE,PARTTYPENAME,MOUNTPOINTS\nefibootmgr -v 2>/dev/null || true\nbootctl status 2>/dev/null || true",
    exercise: "# Только чтение: нарисуйте цепочку своей VM по фактическому выводу.\nprintf '%s\n' 'Power -> firmware/UEFI -> boot entry -> bootloader -> kernel -> init/systemd -> services' > boot-chain.txt\ncat boot-chain.txt\nrm -f boot-chain.txt",
    expected: 'Определён режим загрузки и EFI/GPT-компоненты, построена цепочка от питания до служб; firmware и boot order не изменялись.',
    sources: ['ct-uefi', 'ct-linux-docs', 'ms-windows-security'],
    question: ['Что делает Secure Boot?', ['Проверяет доверенные подписи компонентов загрузки', 'Шифрует все файлы', 'Создаёт backup', 'Заменяет TPM'], 0, 'Secure Boot проверяет доверие boot chain, но не является шифрованием диска.'],
  },
  {
    id: 'ct-storage-filesystems', title: 'Диски, RAID и файловые системы', description: 'Block storage, SSD/HDD, partition, filesystem, RAID, SMART и проверяемое восстановление.',
    theory: [
      'Блочное устройство предоставляет адресуемые блоки, раздел делит устройство, файловая система организует каталоги и метаданные, а mount связывает её с деревом каталогов. HDD и SSD имеют разные характеристики задержки и отказа; NVMe использует PCIe и очереди, но реальная производительность зависит от нагрузки и контроллера.',
      'RAID изменяет доступность и производительность, но не является backup. Зеркало переживает отказ одного члена при заданных условиях, parity экономит ёмкость ценой расчётов и длительного rebuild. Удаление, ransomware или логическое повреждение реплицируются на массив.',
      'SMART и журналы дают ранние признаки, но не предсказывают каждый отказ. Контроль включает свободное место, latency, ошибки I/O, состояние массива, scrub и тест restore. Любая операция partition/format выполняется только на отдельном учебном виртуальном диске после проверки имени устройства.',
    ],
    commands: "lsblk -o NAME,MODEL,SIZE,TYPE,FSTYPE,MOUNTPOINTS\ndf -hT\nfindmnt\ncat /proc/mdstat 2>/dev/null || true",
    exercise: "lab_dir=$(mktemp -d \"$PWD/storage-lab.XXXXXX\")\nprintf 'recoverable lab data' > \"$lab_dir/source.txt\"\nsha256sum \"$lab_dir/source.txt\" > \"$lab_dir/source.sha256\"\ncp \"$lab_dir/source.txt\" \"$lab_dir/backup.txt\"\ncmp \"$lab_dir/source.txt\" \"$lab_dir/backup.txt\"\nsha256sum \"$lab_dir/source.txt\" \"$lab_dir/backup.txt\"\nrm \"$lab_dir/source.txt\" \"$lab_dir/source.sha256\" \"$lab_dir/backup.txt\"\nrmdir \"$lab_dir\"",
    expected: 'Различены device, partition, filesystem и mount; создана и проверена копия тестового файла, затем учебный каталог удалён без операций над реальным разделом.',
    sources: ['ct-linux-docs', 'storage-docs', 'backup-docs'],
    question: ['Почему RAID не является резервной копией?', ['Он повторяет логические изменения и не даёт независимой истории', 'Он всегда медленнее', 'Он не виден ОС', 'Он работает только в облаке'], 0, 'Массив повышает доступность, но удаление или повреждение может затронуть все его члены.'],
  },
  {
    id: 'ct-os-internals', title: 'Как работает операционная система', description: 'Kernel, process, thread, virtual memory, filesystem permissions, driver и system call.',
    theory: [
      'Ядро управляет CPU, памятью, устройствами и изоляцией процессов. Программа становится процессом с адресным пространством, файловыми дескрипторами и правами; потоки делят ресурсы процесса. System call переводит запрос приложения в контролируемую операцию ядра.',
      'Virtual memory даёт процессу собственное адресное пространство и отображает страницы на физическую память или swap/pagefile. Высокое использование RAM не обязательно является проблемой: ОС использует свободную память под cache. Диагностика связывает latency, working set, paging и поведение приложения.',
      'Driver связывает ядро с устройством, а service/daemon выполняет фоновую функцию. Ошибка приложения, службы, драйвера и hardware требует разных evidence. Администратор проверяет process tree, состояние службы, журнал и resource pressure до перезапуска.',
    ],
    commands: "ps -eo pid,ppid,user,stat,comm,%cpu,%mem --sort=-%cpu | head -20\nfree -h\ncat /proc/meminfo | head -15\nsystemctl --failed 2>/dev/null || true",
    exercise: "python3 - <<'PY' &\nimport time\ndata=bytearray(10*1024*1024)\nprint('lab process allocated 10 MiB', flush=True)\ntime.sleep(5)\nPY\npid=$!\nps -o pid,ppid,stat,%mem,comm -p \"$pid\"\nwait \"$pid\"",
    expected: 'Найден учебный процесс и его родитель, состояние и память; после пяти секунд он завершился без оставшегося сервиса или файла.',
    sources: ['ct-linux-insides', 'ct-linux-docs', 'ct-sysinternals'],
    question: ['Чем процесс отличается от файла программы?', ['Процесс — выполняющийся экземпляр с состоянием и ресурсами', 'Ничем', 'Процесс хранится только в BIOS', 'Файл всегда имеет PID'], 0, 'Файл содержит код, а процесс получает PID, память, handles и контекст выполнения.'],
  },
  {
    id: 'ct-virtualization-containers', title: 'Виртуализация и контейнеры', description: 'Hypervisor, VM, virtual switch, snapshot, image, namespace и границы изоляции.',
    theory: [
      'Гипервизор распределяет CPU, память, storage и virtual devices между VM. Каждая VM имеет собственное ядро и ОС, поэтому изоляция сильнее и накладные расходы выше. Type 1 работает непосредственно на hardware, Type 2 использует host OS, но практические реализации могут сочетать уровни.',
      'Контейнер использует ядро хоста и изолирует процессы через namespaces, cgroups и политики. Image задаёт слои файловой системы, container — запущенный экземпляр. Контейнер не является маленькой VM и не устраняет необходимость обновлять host, image и runtime.',
      'Snapshot фиксирует состояние VM для короткого отката изменения, но зависит от исходного хранилища и не заменяет backup. Перед лабораторией документируют сеть, ресурсы и cleanup. Bridged/external сеть не нужна для большинства базовых упражнений; host-only/private снижает риск.',
    ],
    commands: "systemd-detect-virt 2>/dev/null || true\nlscpu | grep -E 'Virtualization|Hypervisor' || true\nlsns 2>/dev/null | head -15 || true\ndocker info 2>/dev/null | head -20 || true",
    exercise: "unshare --user --map-root-user --pid --fork sh -c 'echo namespace PID: $$; id' 2>/dev/null || echo 'unprivileged user namespaces disabled — это допустимый результат'",
    expected: 'Определено, является ли система VM, и показана отдельная namespace либо явно зафиксировано её запретное состояние; сетевые и системные настройки не менялись.',
    sources: ['ct-qemu', 'ct-linux-docs', 'devops-roadmap'],
    question: ['Почему snapshot VM не заменяет backup?', ['Он зависит от того же хранилища и не даёт независимую копию', 'Он всегда шифрован', 'Он не содержит RAM', 'Он работает только с Linux'], 0, 'Snapshot удобен для краткого отката, но отказ или повреждение основного хранилища может уничтожить и его.'],
  },
  {
    id: 'ct-network-hardware', title: 'Сетевые интерфейсы и каналы связи', description: 'Ethernet, Wi-Fi, MAC, MTU, speed/duplex, switch и безопасная диагностика канала.',
    theory: [
      'Network interface передаёт кадры по Ethernet или Wi-Fi и имеет link state, MAC, MTU и параметры драйвера. IP относится к следующему уровню. Горящий индикатор link подтверждает физическое соединение, но не доказывает правильную VLAN, адресацию, DNS или доступность приложения.',
      'Switch пересылает кадры по MAC-таблице внутри VLAN, router соединяет IP-сети, access point соединяет беспроводных клиентов с сетью. Speed и duplex должны согласоваться; ошибки, drops и retransmissions требуют проверки кабеля, transceiver, драйвера и нагрузки.',
      'Wi-Fi разделяет эфир и зависит от канала, мощности, помех, стандарта и безопасности. Сильный signal не гарантирует пропускную способность. Администратор сравнивает link, counters, IP route, DNS и конкретный service, меняя одно звено за раз.',
    ],
    commands: "ip -br link\nip -br address\nip route\nfor i in /sys/class/net/*/statistics; do echo \"$i\"; cat \"$i\"/rx_errors \"$i\"/tx_errors; done",
    exercise: "python3 - <<'PY'\nfrom ipaddress import ip_interface\nfor value in ['192.0.2.10/24','192.0.2.129/25']:\n i=ip_interface(value); print(value,'network=',i.network,'broadcast=',i.network.broadcast_address)\nPY",
    expected: 'Определены интерфейсы, link, адреса, маршрут и counters; рассчитаны две учебные подсети без изменения адресации или firewall.',
    sources: ['network-roadmap', 'network-open-book', 'ct-linux-docs'],
    question: ['Что доказывает активный физический link?', ['Наличие канального соединения, но не работу DNS или приложения', 'Полную работу интернета', 'Правильный пароль пользователя', 'Наличие backup'], 0, 'Link относится к физическому/канальному уровню; верхние уровни проверяются отдельно.'],
  },
  {
    id: 'ct-interfaces-peripherals', title: 'Интерфейсы, периферия и драйверы', description: 'USB, PCIe, display, storage interfaces, device IDs, drivers и безопасная совместимость.',
    theory: [
      'USB описывает и разъём, и протокол с версиями, режимами и ограничениями питания; одинаковый USB-C разъём может поддерживать разные функции. DisplayPort, HDMI и alternate modes имеют свои пределы разрешения, частоты и кабеля. Совместимость проверяют по обеим сторонам и конкретному кабелю.',
      'PCIe использует lanes и поколения; устройство x4 может физически войти в более длинный слот, но реальные lanes зависят от платы и CPU. SATA и NVMe относятся к разным интерфейсам и протоколам. Форм-фактор M.2 не гарантирует NVMe: устройство может быть SATA.',
      'ОС связывает vendor/device ID с драйвером. Перед обновлением драйвера фиксируют текущую версию, источник, rollback и влияние. Не устанавливайте случайный driver pack: подпись и официальный поставщик важнее обещания автоматического ускорения.',
    ],
    commands: "lsusb 2>/dev/null || true\nlspci -nnk | head -80\nls -l /dev/disk/by-id 2>/dev/null | head -30\nudevadm info --query=property --path=/sys/class/net/$(ls /sys/class/net | head -1) 2>/dev/null | head -25 || true",
    exercise: "# Выберите одно собственное устройство из lspci/lsusb и запишите только модель, ID и driver.\nprintf '%s\n' 'device | vendor:device ID | current driver | official source | rollback' > device-inventory.txt\ncat device-inventory.txt\nrm -f device-inventory.txt",
    expected: 'Одно устройство связано с vendor/device ID и текущим драйвером; план обновления содержит официальный источник и rollback, установка не выполнялась.',
    sources: ['ct-linux-docs', 'ct-sysinternals', 'sp-developer-roadmap'],
    question: ['Гарантирует ли разъём USB-C одинаковые возможности?', ['Нет, режимы, скорость и питание зависят от устройств и кабеля', 'Да, всегда', 'Только в Linux', 'Только для зарядки'], 0, 'USB-C — форма разъёма; поддерживаемые протоколы и питание нужно проверять отдельно.'],
  },
  {
    id: 'ct-troubleshooting-capstone', title: 'Системная диагностика и итоговая сборка', description: 'Симптом, baseline, гипотеза, одно изменение, verification, rollback и технический отчёт.',
    theory: [
      'Диагностика начинается с точного симптома, времени, области влияния и ожидаемого поведения. «Компьютер медленный» превращают в измеримые вопросы: какая операция, для кого, с какого момента, каковы CPU, memory, I/O, network и журнал в момент проблемы.',
      'Baseline показывает нормальное состояние, hypothesis связывает симптом с возможной причиной, test изменяет один фактор. Одновременное обновление драйверов, очистка, reboot и смена сети уничтожает причинную связь. Перед изменением готовят rollback и критерий успеха.',
      'Итоговый отчёт содержит схему системы, inventory, symptom, timeline, evidence, гипотезы, выполненное действие, результат и следующий шаг. Если причина не доказана, это пишут прямо. Хорошая эскалация экономит время следующего специалиста и не скрывает уже выполненные изменения.',
    ],
    commands: "date -Is\nuname -a\nuptime\nfree -h\ndf -hT\nip -br address\nsystemctl --failed 2>/dev/null || true\njournalctl -p warning -n 30 --no-pager 2>/dev/null || true",
    exercise: "cat > diagnostic-report.md <<'EOF'\n# Учебный отчёт\nSymptom / expected:\nScope and start time:\nHardware and OS inventory:\nCPU / memory / storage / network evidence:\nHypothesis and one safe test:\nResult and rollback:\nRoot cause: proved / not proved\nNext action and owner:\nEOF\ncat diagnostic-report.md\nrm -f diagnostic-report.md",
    expected: 'Собран read-only baseline и создан структурированный отчёт без секретов; одна гипотеза имеет безопасный тест, критерий результата и rollback.',
    sources: ['ct-sysinternals', 'ct-linux-docs', 'network-roadmap'],
    question: ['Почему нужно менять один фактор за раз?', ['Чтобы сохранить причинную связь между действием и результатом', 'Чтобы скрыть журнал', 'Чтобы не делать backup', 'Чтобы ускорить CPU'], 0, 'Одно контролируемое изменение позволяет подтвердить или опровергнуть гипотезу.'],
  },
];

const makeLesson = (profile) => ({
  intro: `${profile.title} — подробный урок начального курса «Компьютерные технологии». Он объясняет устройство системы, показывает read-only inventory и завершает тему безопасной практикой, проверкой результата и очисткой.`,
  sections: [
    { title: 'Как устроена технология', paragraphs: profile.theory.slice(0, 2) },
    { title: 'Что проверяет системный администратор', paragraphs: [profile.theory[2], `Практическая цель урока: ${profile.expected}`] },
  ],
  lab: {
    steps: [
      'Работайте на собственной VM или учебном компьютере. Запишите модель среды, ОС и способ возврата; не разбирайте включённое оборудование и не меняйте firmware, разделы или драйверы.',
      'Прочитайте команды inventory. Найдите все операции чтения и убедитесь, что пути относятся к текущей учебной системе.',
      'Выполните inventory и сохраните только технические сведения без серийных номеров, имён пользователей, внешних IP и других ненужных данных.',
      'Сформулируйте ожидаемый результат упражнения и запустите только учебный блок. Не используйте production-диск, рабочую сеть или чужое устройство.',
      'Сравните результат с моделью из теории, отметьте одно наблюдение, одно ограничение и один безопасный следующий тест.',
      'Удалите созданные файлы, завершите учебный процесс и повторите краткий inventory, чтобы подтвердить очистку.',
    ],
    commands: profile.commands,
    commandsLabel: 'ИНВЕНТАРИЗАЦИЯ · БЕЗ ИЗМЕНЕНИЯ СИСТЕМЫ',
    extraCommands: [{ label: 'ПРАКТИКА И ОЧИСТКА', commands: profile.exercise }],
    expected: profile.expected,
    pitfalls: ['Не выполняйте hardware/firmware/storage изменения по примеру: сначала документация точной модели, backup и проверенный recovery path.', 'Не публикуйте серийные номера, MAC, внешние IP, имена пользователей и полный system report.', 'VM может скрывать реальные датчики и устройства; отсутствие строки в выводе не доказывает неисправность.', 'Одна команда проверяет только одно звено. Связывайте hardware, ОС, driver, service и приложение последовательно.'],
  },
});

const makeDetail = (profile) => ({
  goals: [`Объяснить тему «${profile.title}» своими словами и на схеме.`, 'Снять безопасный технический inventory и распознать его ограничения.', 'Выполнить локальную практику с ожидаемым результатом и полной очисткой.', 'Оформить наблюдение, гипотезу, проверку и следующий шаг без догадок.'],
  deepDive: [...profile.theory, `Практическая проверка связывает теорию с наблюдаемым результатом: ${profile.expected}`, 'При диагностике администратор сохраняет исходное состояние, изменяет один фактор и отделяет факт вывода команды от предположения о причине.'],
  caseStudy: { situation: `Новый администратор исследует тему «${profile.title}», но не хочет менять исправную систему до понимания её устройства.`, action: 'Он снимает read-only inventory, рисует цепочку компонентов, формулирует одну гипотезу и выполняет ограниченную лабораторию на синтетических данных.', result: 'Получен воспроизводимый результат, временные артефакты удалены, а следующий технический шаг основан на evidence.' },
  diagram: ['Физический компонент', 'Firmware и driver', 'Ядро и операционная система', 'Служба или приложение', 'Наблюдение, проверка и отчёт'],
  uiMockup: { breadcrumb: `COMPUTER TECHNOLOGIES › ${profile.title}`, panelTitle: 'Inventory учебной системы · макет', rows: [{ label: 'Environment', value: 'Собственная VM / учебный ПК' }, { label: 'Mode', value: 'Read-only inventory' }, { label: 'Evidence', value: 'Без serial, MAC и персональных данных' }, { label: 'Change', value: 'Один безопасный тест' }, { label: 'Cleanup', value: 'Временные артефакты удалены' }], helpText: 'Учебный макет помогает читать системные данные и не является снимком BIOS или production-консоли.' },
  terminal: { prompt: 'student@computer-lab:~$', caption: 'Вывод зависит от hardware, гипервизора, ОС и прав текущего пользователя.', lines: [{ type: 'input', text: profile.commands.split('\n')[0] }, { type: 'output', text: 'read-only inventory collected' }, { type: 'success', text: 'scope=local  change=none  evidence=redacted' }] },
  practiceTasks: [{ task: 'Нарисуйте цепочку от физического компонента до наблюдаемого приложения.', hint: 'Добавьте firmware, driver, kernel и service.', solution: `Используйте схему урока и проверяемый результат: ${profile.expected}` }, { task: 'Напишите гипотезу и один тест, который может её опровергнуть.', hint: 'Тест должен менять максимум один фактор.', solution: 'Запишите symptom, baseline, hypothesis, safe test, expected result и rollback.' }],
  question: { question: profile.question[0], options: profile.question[1], answer: profile.question[2], explanation: profile.question[3] },
});

const makeWalkthrough = (profile) => ({
  title: `Практический разбор: ${profile.title}`,
  context: 'Разбор обучает системной диагностике от нижнего уровня к верхнему: hardware, firmware, driver, ОС, service и приложение. Все команды сначала читаются, запускаются на собственной среде и завершаются проверкой очистки.',
  steps: ['Зафиксируйте учебную среду, ОС, виртуальная это машина или физический компьютер, время начала и границы данных. Не включайте serial, внешние адреса и другие сведения, которые не нужны для вывода.', 'Разберите inventory-команды по строкам и предскажите, какой слой показывает каждая. Выполните их без изменения состояния, сохраните ключевые значения и явно отметьте поля, недоступные внутри VM.', 'Нарисуйте путь от компонента к функции ОС и пользовательскому результату. Сформулируйте одну гипотезу, которую можно подтвердить или опровергнуть безопасным тестом.', 'Выполните учебное упражнение и сравните фактический результат с ожидаемым. Если команда недоступна, изучите help и зафиксируйте ограничение вместо установки случайного пакета.', 'Проверьте, что нормальная функция системы сохранилась, а созданный процесс или файл существует только в пределах лаборатории. Не применяйте широкое исправление по одному показателю.', 'Удалите артефакты, повторите короткий inventory и оформите результат: symptom, facts, hypothesis, test, result, rollback и следующий шаг.'],
  verification: `${profile.expected} Повторный inventory не показывает временных файлов или процессов, а отчёт отделяет наблюдаемый факт от гипотезы.`,
  troubleshooting: 'Если команда ничего не показывает, проверьте ОС, VM/hardware, права, наличие /proc или sysfs и имя утилиты. Не устанавливайте неизвестный драйвер и не меняйте UEFI, storage или сеть ради совпадения с примером.',
});

export const computerTechnologiesLessons = Object.fromEntries(profiles.map((profile) => [profile.id, makeLesson(profile)]));
export const computerTechnologiesDetails = Object.fromEntries(profiles.map((profile) => [profile.id, makeDetail(profile)]));
export const computerTechnologiesWalkthroughs = Object.fromEntries(profiles.map((profile) => [profile.id, makeWalkthrough(profile)]));

const byId = new Map(profiles.map((profile) => [profile.id, profile]));
const topic = (id) => ({ id, title: byId.get(id).title, description: byId.get(id).description });
const phase = (id, number, title, subtitle, description, ids) => ({ id, number, title, subtitle, description, topics: ids.map(topic) });

export const computerTechnologiesPhases = [
  phase('ct-platform', '01', 'Платформа компьютера', 'HARDWARE & FIRMWARE', 'От питания и CPU до UEFI, boot chain и безопасного inventory.', ['ct-computer-architecture', 'ct-uefi-boot']),
  phase('ct-system', '02', 'Данные и операционная система', 'STORAGE & OS', 'Диски, RAID, filesystem, процессы, память, driver и службы.', ['ct-storage-filesystems', 'ct-os-internals']),
  phase('ct-isolation', '03', 'Изоляция и сеть', 'VM & CONNECTIVITY', 'Виртуальные машины, контейнеры, интерфейсы, коммутаторы и путь пакета.', ['ct-virtualization-containers', 'ct-network-hardware']),
  phase('ct-operations', '04', 'Устройства и диагностика', 'DEVICES & TROUBLESHOOTING', 'Периферия, совместимость, драйверы и воспроизводимый итоговый отчёт.', ['ct-interfaces-peripherals', 'ct-troubleshooting-capstone']),
];

export const computerTechnologiesCourse = { id: 'computer-technologies', title: 'Компьютерные технологии', description: 'Начальный курс перед системным администрированием: как устроены компьютер и сервер, как загружается ОС, где хранятся данные, как работают VM, сеть, устройства и доказательная диагностика.', topics: computerTechnologiesPhases.flatMap((item) => item.topics) };

export const computerTechnologiesResources = [
  { id: 'ct-linux-insides', title: 'Linux Insides', type: 'Открытая книга', language: 'EN', access: 'Бесплатно', description: 'Подробный открытый разбор boot, interrupts, memory, processes, system calls и устройства Linux kernel.', url: 'https://github.com/0xAX/linux-insides' },
  { id: 'ct-linux-docs', title: 'Linux kernel documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Первичная документация Linux по CPU, memory, filesystems, block devices, PCI, USB, networking и administration.', url: 'https://github.com/torvalds/linux/tree/master/Documentation' },
  { id: 'ct-uefi', title: 'TianoCore UEFI documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Открытая документация и материалы реализации UEFI для изучения firmware и boot chain.', url: 'https://github.com/tianocore/tianocore.github.io/wiki/UEFI' },
  { id: 'ct-qemu', title: 'QEMU', type: 'GitHub', language: 'EN', access: 'Бесплатно', description: 'Открытый эмулятор и виртуализатор с документацией машин, устройств, storage и networking.', url: 'https://github.com/qemu/qemu' },
  { id: 'ct-sysinternals', title: 'Microsoft Sysinternals documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Официальная документация инструментов для процессов, памяти, автозапуска, дисков и диагностики Windows.', url: 'https://github.com/MicrosoftDocs/sysinternals' },
];

export const computerTechnologiesLessonResources = Object.fromEntries(profiles.map((profile) => [profile.id, profile.sources.map((sourceId, index) => ({ sourceId, focus: `Изучите открытый раздел, связанный с темой «${profile.title}», и сопоставьте его с inventory и лабораторией.`, ...(index === 0 ? { takeaway: profile.theory[0] } : {}) }))]));
