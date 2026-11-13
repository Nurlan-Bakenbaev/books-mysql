// Полностью обновлённый курс «Компьютерные технологии»: 3 модуля и 6 уроков.
const profiles = [
  {
    id: 'csf-cpu-architecture', title: 'Устройство ПК и работа центрального процессора', short: 'CPU, ALU, блок управления, регистры и цикл выполнения инструкции.',
    theory: [
      'Компьютер состоит из процессора, оперативной памяти, накопителей, устройств ввода-вывода и шин, которые связывают компоненты. Центральный процессор выполняет машинные инструкции: блок управления выбирает следующую команду и координирует её исполнение, а арифметико-логическое устройство выполняет вычисления и логические операции.',
      'Регистры находятся внутри процессорного ядра и хранят операнды, адреса и состояние текущего вычисления. Типичный instruction cycle включает выборку команды из памяти, декодирование, получение операндов, выполнение и запись результата. Реальные процессоры перекрывают эти стадии конвейером, поэтому тактовая частота сама по себе не определяет производительность.',
      'Периферия общается с процессором через контроллеры, прерывания и прямой доступ к памяти. Для технической диагностики важно отделять архитектурную модель от конкретной реализации: число ядер, cache, набор инструкций, IPC, лимиты питания и профиль нагрузки влияют на результат одновременно.',
    ],
    commands: "lscpu\ngetconf LONG_BIT\ngetconf LEVEL1_DCACHE_SIZE 2>/dev/null || true\npython3 - <<'PY'\nregisters = {'R1': 7, 'R2': 5}\ninstruction = ('ADD', 'R1', 'R2', 'R3')\nop, left, right, target = instruction\nregisters[target] = registers[left] + registers[right]\nprint('fetch:', instruction)\nprint('decode:', op, left, right, '->', target)\nprint('execute:', registers[target])\nprint('registers:', registers)\nPY",
    expected: 'Inventory показывает архитектуру и разрядность текущей системы, а учебная модель проходит fetch, decode и execute и записывает в R3 значение 12.',
    sources: ['csf-riscv', 'csf-csapp'], videos: ['csf-video-argodev-architecture', 'csf-video-mozhenkov-architecture'],
    question: ['Какова роль регистра процессора?', ['Хранить небольшие текущие операнды и состояние внутри CPU', 'Заменять долговременный SSD', 'Маршрутизировать IP-пакеты', 'Хранить резервную копию ОС'], 0, 'Регистры — самая близкая к исполнительным блокам память для текущих данных и состояния вычисления.'],
  },
  {
    id: 'csf-memory-hierarchy', title: 'Иерархия памяти и виртуальная адресация', short: 'Биты и байты, cache L1–L3, RAM, Load/Store и виртуальная память.',
    theory: [
      'Данные кодируются битами, а байт обычно состоит из восьми битов. Уровни хранения различаются задержкой, пропускной способностью, ёмкостью, стоимостью и сохранностью данных: регистры и cache быстры и малы, RAM больше, а SSD и HDD сохраняют данные после выключения питания.',
      'Cache L1, L2 и L3 уменьшает среднее время доступа благодаря пространственной и временной локальности. Процессор получает данные из памяти инструкциями load и возвращает их инструкциями store. Cache line переносит блок данных целиком, поэтому последовательный доступ часто эффективнее случайного, хотя реальный результат зависит от архитектуры.',
      'Виртуальная память даёт процессу собственное адресное пространство. MMU и таблицы страниц отображают виртуальные страницы на физические кадры, а ОС управляет защитой и замещением. Swap помогает пережить давление на память, но обращение к накопителю намного медленнее RAM и не является способом ускорения программы.',
    ],
    commands: "getconf PAGESIZE\nfree -h\ncat /proc/meminfo | head -12\npython3 - <<'PY'\nfrom time import perf_counter\ndata = bytearray(8 * 1024 * 1024)\npage = 4096\nstart = perf_counter()\nfor offset in range(0, len(data), page):\n    data[offset] = 1\nprint('bytes:', len(data))\nprint('pages touched:', len(data) // page)\nprint('elapsed seconds:', round(perf_counter() - start, 6))\nPY",
    expected: 'Определён размер страницы и состояние памяти, после чего процесс выделяет 8 MiB и касается 2048 страниц при размере страницы 4096 байт.',
    sources: ['csf-ostep-vm', 'csf-linux-mm'], videos: ['csf-video-lectorium-architecture'],
    question: ['Зачем процессу виртуальная память?', ['Для изолированного адресного пространства и контролируемого отображения на физическую память', 'Чтобы заменить процессор', 'Чтобы отключить файловую систему', 'Только для хранения паролей'], 0, 'Виртуальные адреса дают процессам изоляцию, защиту и управляемое отображение страниц.'],
  },
  {
    id: 'csf-kernel-processes', title: 'Ядро, системные вызовы, процессы и потоки', short: 'Kernel/User mode, system calls, процессы, потоки и планировщик.',
    theory: [
      'Ядро работает с привилегиями, управляет процессором, памятью, устройствами и изоляцией, а обычные приложения выполняются в user mode. Системный вызов является контролируемой границей: программа просит ядро открыть файл, создать процесс, выделить память или передать данные, не обращаясь к оборудованию напрямую.',
      'Процесс имеет собственное виртуальное адресное пространство, файловые дескрипторы, права и другие ресурсы. Потоки одного процесса разделяют память и открытые ресурсы, но имеют отдельные стеки и контексты выполнения. Ошибка потока может повредить общее состояние всего процесса.',
      'Планировщик распределяет вычислительное время между runnable-задачами, учитывая приоритеты и политику системы. Наличие процесса не доказывает полезную работу сервиса: администратор отдельно проверяет состояние, журналы, ресурсную нагрузку и ожидаемую пользовательскую операцию.',
    ],
    commands: "ps -eo pid,ppid,nlwp,stat,comm --sort=-nlwp | head -12\npython3 - <<'PY'\nfrom threading import Thread, current_thread\nfrom os import getpid\nresults = []\ndef worker(number):\n    results.append((number, getpid(), current_thread().name))\nthreads = [Thread(target=worker, args=(n,), name=f'worker-{n}') for n in range(2)]\nfor thread in threads: thread.start()\nfor thread in threads: thread.join()\nprint('process pid:', getpid())\nprint('threads:', sorted(results))\nPY",
    expected: 'Оба worker-потока сообщают один PID процесса, но разные имена; системный inventory показывает число потоков NLWP у процессов.',
    sources: ['csf-ostep-processes', 'csf-linux-syscalls'], videos: ['csf-video-bragin-processes', 'csf-video-csc-os'],
    question: ['Что обычно разделяют потоки одного процесса?', ['Адресное пространство и открытые ресурсы процесса', 'Разные физические компьютеры', 'Отдельные DNS-зоны', 'Только содержимое SSD'], 0, 'Потоки имеют собственные контексты и стеки, но разделяют адресное пространство и ресурсы процесса.'],
  },
  {
    id: 'csf-memory-ipc-filesystems', title: 'Управление памятью, IPC и файловые системы', short: 'Paging, swap, pipes, sockets, shared memory, signals, ext4, NTFS и inode.',
    theory: [
      'Paging делит виртуальное адресное пространство и физическую память на блоки фиксированного размера. При обращении к отсутствующей странице возникает page fault, после чего ядро загружает или создаёт нужное отображение. Интенсивный swapping увеличивает задержку и может привести к thrashing, когда система тратит время преимущественно на перенос страниц.',
      'Процессы обмениваются данными через pipes, локальные и сетевые sockets, shared memory, очереди и signals. Каждый механизм имеет свою семантику: pipe передаёт поток байтов, socket связывает конечные точки, shared memory требует синхронизации, а signal сообщает о событии и несёт мало данных.',
      'Файловая система связывает имена с метаданными и блоками данных. В ext4 inode хранит тип, права, владельца, временные метки и ссылки на данные, а имя находится в каталоге. NTFS использует другие структуры, поэтому детали нельзя переносить буквально, хотя обе системы предоставляют файлы, каталоги, права и журналирование.',
    ],
    commands: "lab_dir=$(mktemp -d)\nmkfifo \"$lab_dir/channel\"\nprintf 'message-through-pipe\\n' > \"$lab_dir/channel\" &\nwriter_pid=$!\nread -r message < \"$lab_dir/channel\"\nwait \"$writer_pid\"\nprintf 'received: %s\\n' \"$message\"\nprintf 'inode-demo\\n' > \"$lab_dir/file.txt\"\nstat -c 'inode=%i links=%h mode=%A size=%s' \"$lab_dir/file.txt\"\nln \"$lab_dir/file.txt\" \"$lab_dir/file-hardlink.txt\"\nstat -c 'inode=%i links=%h' \"$lab_dir/file.txt\" \"$lab_dir/file-hardlink.txt\"\nrm \"$lab_dir/file-hardlink.txt\" \"$lab_dir/file.txt\" \"$lab_dir/channel\"\nrmdir \"$lab_dir\"",
    expected: 'Сообщение проходит через именованный pipe, а исходный файл и hard link имеют одинаковый inode и счётчик ссылок 2 до очистки.',
    sources: ['csf-man7-pipe', 'csf-ext4'], videos: ['csf-video-argodev-os'],
    question: ['Где в типичной ext4 хранится имя файла?', ['В записи каталога, которая указывает на inode', 'В регистре CPU', 'Только в swap', 'В таблице маршрутизации'], 0, 'Каталог связывает имя с номером inode, а inode содержит метаданные и ссылки на данные.'],
  },
  {
    id: 'csf-network-models-routing', title: 'Сетевые модели, IP-адресация и маршрутизация', short: 'LAN/WAN, OSI и TCP/IP, Ethernet, IP, NAT, CIDR и маршрут пакета.',
    theory: [
      'Модель OSI делит взаимодействие на семь уровней, а практический стек TCP/IP обычно описывают четырьмя или пятью. При отправке данные приложения получают транспортный заголовок, IP-заголовок и канальный кадр; получатель снимает эти оболочки в обратном порядке. Модели помогают локализовать симптом, но не заменяют проверку реальной реализации.',
      'Коммутатор передаёт кадры внутри канального сегмента по MAC-адресам, а маршрутизатор пересылает IP-пакеты между сетями. Коммутация пакетов разделяет канал между потоками и не резервирует постоянный путь как классическая коммутация каналов. LAN, MAN и WAN описывают масштаб, но не конкретный протокол.',
      'Префикс CIDR определяет границу сети и узлов. Частные IPv4-адреса не маршрутизируются напрямую в публичном Интернете; NAT может преобразовать адрес и порт на границе. NAT не является полноценной политикой безопасности, а IPv6 строится без обязательной трансляции адресов.',
    ],
    commands: "ip -br address\nip route\npython3 - <<'PY'\nfrom ipaddress import ip_interface, ip_network\ninterface = ip_interface('192.168.10.34/24')\nfor subnet in ip_network('192.168.10.0/24').subnets(new_prefix=25):\n    hosts = list(subnet.hosts())\n    print(subnet, 'hosts', hosts[0], '-', hosts[-1], 'broadcast', subnet.broadcast_address)\nprint('interface network:', interface.network)\nPY",
    expected: 'Исходная /24 делится на 192.168.10.0/25 и 192.168.10.128/25 с корректными диапазонами узлов и broadcast-адресами.',
    sources: ['csf-rfc1122', 'csf-rfc8200'], videos: ['csf-video-semyenkov-networks', 'csf-video-osi-examples'],
    question: ['Что определяет префикс CIDR?', ['Какая часть IP-адреса относится к сети', 'Пароль маршрутизатора', 'Имя DNS-зоны', 'Скорость процессора'], 0, 'Длина префикса задаёт сетевую часть адреса и позволяет вычислить диапазон подсети.'],
  },
  {
    id: 'csf-transport-web-rest', title: 'Транспортный уровень, Web и REST API', short: 'TCP, UDP, DNS, порты, HTTP/1.1–3, HTTPS и REST.',
    theory: [
      'TCP предоставляет надёжный упорядоченный поток байтов с подтверждениями, управлением потоком и перегрузкой. UDP передаёт независимые датаграммы без встроенной гарантии доставки; приложение при необходимости добавляет собственную надёжность. Порт выбирает конечную точку процесса, а DNS сопоставляет имена с данными, включая IP-адреса.',
      'HTTP задаёт методы, заголовки, коды состояния и представления ресурсов. HTTP/1.1 широко использует persistent connections, HTTP/2 мультиплексирует потоки в одном TCP-соединении, а HTTP/3 работает поверх QUIC и UDP. HTTPS означает HTTP внутри TLS: шифрование не исправляет ошибки авторизации или уязвимости приложения.',
      'REST — архитектурный стиль, а не отдельный сетевой протокол. Ресурсы имеют идентификаторы, сообщения должны быть самодостаточными, а сервер не хранит клиентское состояние сессии между запросами в смысле REST constraint. GET читают без изменения ресурса, POST обычно создаёт или запускает обработку, PUT заменяет представление, DELETE удаляет согласно политике API.',
    ],
    commands: "python3 - <<'PY'\nfrom http.server import BaseHTTPRequestHandler, HTTPServer\nfrom threading import Thread\nfrom urllib.request import urlopen\nclass Handler(BaseHTTPRequestHandler):\n    def do_GET(self):\n        body = b'{\"service\":\"lab\",\"status\":\"ok\"}'\n        self.send_response(200)\n        self.send_header('Content-Type', 'application/json')\n        self.send_header('Content-Length', str(len(body)))\n        self.end_headers()\n        self.wfile.write(body)\n    def log_message(self, *_):\n        pass\nserver = HTTPServer(('127.0.0.1', 0), Handler)\nthread = Thread(target=server.handle_request)\nthread.start()\nurl = f'http://127.0.0.1:{server.server_port}/api/status'\nwith urlopen(url, timeout=3) as response:\n    print('status:', response.status)\n    print('content-type:', response.headers['Content-Type'])\n    print('body:', response.read().decode())\nthread.join()\nserver.server_close()\nPY",
    expected: 'Одноразовый localhost-сервер возвращает status 200, Content-Type application/json и JSON со status ok, после чего сокет закрывается.',
    sources: ['csf-rfc9110', 'csf-mdn-http'], videos: ['csf-video-mishustin-http', 'csf-video-ulbi-api'],
    question: ['Что верно о REST?', ['Это архитектурный стиль поверх протоколов вроде HTTP', 'Это замена IP-маршрутизации', 'Это формат только для XML', 'Это алгоритм шифрования TLS'], 0, 'REST описывает ограничения архитектуры взаимодействия с ресурсами и часто реализуется поверх HTTP.'],
  },
];

const makeLesson = (profile) => ({
  intro: `${profile.title} — урок курса «Фундаментальный Computer Science: Архитектура, ОС и Сети». Материал связывает абстрактную модель с наблюдаемым поведением Linux и безопасной локальной практикой.`,
  sections: [
    { title: 'Основные понятия и механизм', paragraphs: profile.theory.slice(0, 2) },
    { title: 'Практическая граница модели', paragraphs: [profile.theory[2], `Критерий практической проверки: ${profile.expected}`] },
  ],
  lab: {
    prerequisites: ['Linux VM или отдельный учебный компьютер с Bash и Python 3; обычная учётная запись, без production-данных.'],
    steps: [
      'Зафиксируйте версию ОС, тип среды и исходное состояние. Прочитайте весь блок команд и убедитесь, что он использует только локальный inventory, Python и временные учебные объекты.',
      'Своими словами объясните понятия урока и нарисуйте путь данных между названными компонентами. Отметьте, где заканчивается упрощённая модель и начинается реализация ОС или протокола.',
      'Выполните команды по строкам в собственной учебной среде. Сохраняйте фактический вывод, время и ненулевые коды возврата, не заменяя их образцом из урока.',
      'Сопоставьте каждую строку результата с одним понятием урока. Если значение зависит от платформы, запишите это ограничение вместо попытки изменить систему для совпадения.',
      'Повторите ключевую проверку и сравните результат с критерием приёмки. Отдельно отметьте, что команда действительно доказала и какие уровни остались непроверенными.',
      'Убедитесь, что временный процесс завершён и созданные объекты очищены. В отчёте отделите теоретический вывод, фактическое наблюдение и следующую проверяемую гипотезу.',
    ],
    commands: profile.commands,
    commandsLabel: 'LINUX / PYTHON · УЧЕБНЫЙ СТЕНД',
    expected: profile.expected,
    pitfalls: ['Не запускайте примеры на рабочем сервере и не подставляйте пути, интерфейсы или адреса production-среды.', 'Вывод одной команды подтверждает только её уровень проверки; процесс, порт или пакет ещё не доказывает полезный результат приложения.', 'Тактовая частота, использование RAM, наличие маршрута и HTTP-код требуют контекста; не делайте вывод о причине по одному числу.'],
  },
});

const makeDetail = (profile) => ({
  goals: [`Объяснить тему «${profile.title}» от базового механизма до наблюдаемого результата.`, 'Связать модель с безопасным inventory или локальным воспроизводимым примером.', 'Отделить факт вывода команды от предположения и ограничения выбранного стенда.'],
  deepDive: [...profile.theory, `Лаборатория подтверждает конкретный критерий, а не всю тему сразу: ${profile.expected}`, 'Технический отчёт должен содержать исходное состояние, команды, фактический вывод, критерий приёмки, ограничение проверки и подтверждённую очистку временных объектов.'],
  caseStudy: { situation: `Начинающий специалист изучает тему «${profile.title}» и должен объяснить её без изменения рабочей инфраструктуры.`, action: 'Он строит схему, выполняет локальную воспроизводимую проверку, сохраняет вывод и сопоставляет каждое наблюдение с определённым уровнем модели.', result: profile.expected },
  diagram: ['Исходные данные или запрос', 'Аппаратный либо системный механизм', 'Контролируемая операция ОС или протокола', 'Наблюдаемый результат', 'Проверка и технический отчёт'],
  uiMockup: { breadcrumb: `COMPUTER SCIENCE › ${profile.title}`, panelTitle: 'Учебная модель · наблюдение', rows: [{ label: 'Среда', value: 'Изолированная Linux VM' }, { label: 'Действие', value: 'Локальный воспроизводимый пример' }, { label: 'Доказательство', value: 'Команда, вывод и критерий' }, { label: 'Граница', value: 'Платформенные детали записаны отдельно' }], helpText: 'Макет показывает структуру отчёта и не имитирует BIOS, ядро или сетевой анализатор.' },
  terminal: { prompt: 'student@cs-lab:~$', caption: 'Фактические значения зависят от CPU, ядра и конфигурации учебной VM.', lines: [{ type: 'input', text: profile.commands.split('\n')[0] }, { type: 'output', text: 'local observation collected' }, { type: 'success', text: 'scope=lab  evidence=saved  cleanup=verified' }] },
  practiceTasks: [{ task: 'Нарисуйте механизм урока и подпишите границы между hardware, ОС, протоколом и приложением.', hint: 'Используйте минимум четыре узла и направление передачи данных.', solution: profile.theory[0] }, { task: 'Сформулируйте отрицательную проверку, которая не повредит стенду.', hint: 'Изменяйте только синтетические данные или локальный одноразовый процесс.', solution: `Сравните отрицательный результат с критерием: ${profile.expected}` }],
  question: { question: profile.question[0], options: profile.question[1], answer: profile.question[2], explanation: profile.question[3] },
});

const walkthroughSteps = [
  'Подготовьте отдельную Linux VM или учебный компьютер, запишите версию ОС, текущего пользователя и время начала. Проверьте, что в командах нет production-путей, реальных секретов и операций над системными дисками.',
  'До запуска нарисуйте ожидаемый путь данных и подпишите компоненты, которыми управляют hardware, ядро, системная библиотека и приложение. Для каждого перехода сформулируйте одно наблюдаемое доказательство.',
  'Прочитайте командный блок полностью, затем выполните его по строкам. Сохраните фактический stdout, stderr и код возврата, не редактируя неудобные значения и не выдавая образец вывода за собственный результат.',
  'Сопоставьте наблюдение с теорией: укажите, какая строка подтверждает механизм, какая зависит от платформы и какой вывод команда делать не позволяет. Отсутствующее средство отмечайте как ограничение стенда.',
  'Повторите ключевую проверку на тех же входных данных и сравните результат с критерием приёмки. Если результаты различаются, сформулируйте узкую гипотезу и безопасный тест одного фактора.',
  'Завершите локальные процессы, проверьте удаление временных объектов и оформите отчёт. В нём должны быть цель, среда, схема, команды, вывод, проверка, ограничение и состояние после очистки.',
];

const makeWalkthrough = (profile) => ({
  title: `Практический разбор: ${profile.title}`,
  context: 'Практика переводит фундаментальную модель в проверяемое наблюдение на локальной Linux-системе. Она не меняет firmware, сеть, пользователей или production-данные и завершается явной проверкой очистки.',
  steps: walkthroughSteps,
  verification: `${profile.expected} Повторная проверка даёт согласованный результат, а временные процессы и объекты после завершения отсутствуют.`,
  troubleshooting: 'Если результат отличается, сначала проверьте ОС, архитектуру, версию Python, доступность /proc и точный код возврата. Не устанавливайте случайные драйверы и не расширяйте привилегии ради совпадения с примером.',
});

const topic = (profile) => ({ id: profile.id, title: profile.title, description: profile.short });
const phase = (id, number, title, subtitle, description, ids) => ({ id, number, title, subtitle, description, topics: ids.map((id) => topic(profiles.find((profile) => profile.id === id))) });

export const computerTechnologiesPhases = [
  phase('csf-architecture', '01', 'Архитектура ЭВМ', 'COMPUTER ARCHITECTURE', 'От компонентов и instruction cycle до cache и виртуальной адресации.', ['csf-cpu-architecture', 'csf-memory-hierarchy']),
  phase('csf-operating-systems', '02', 'Операционные системы', 'OPERATING SYSTEMS', 'Ядро, процессы, потоки, память, IPC и файловые системы.', ['csf-kernel-processes', 'csf-memory-ipc-filesystems']),
  phase('csf-networks-web', '03', 'Компьютерные сети и Web', 'NETWORKS & WEB', 'От инкапсуляции и маршрутизации до HTTP, HTTPS и REST API.', ['csf-network-models-routing', 'csf-transport-web-rest']),
];

export const computerTechnologiesCourse = { id: 'computer-technologies', title: 'Фундаментальный Computer Science: Архитектура, ОС и Сети', description: 'Базовый курс для начинающих IT-специалистов, системных администраторов, DevOps и разработчиков: от instruction cycle и виртуальной памяти до маршрутизации, HTTP и REST.', topics: computerTechnologiesPhases.flatMap((item) => item.topics) };
export const computerTechnologiesLessons = Object.fromEntries(profiles.map((profile) => [profile.id, makeLesson(profile)]));
export const computerTechnologiesDetails = Object.fromEntries(profiles.map((profile) => [profile.id, makeDetail(profile)]));
export const computerTechnologiesWalkthroughs = Object.fromEntries(profiles.map((profile) => [profile.id, makeWalkthrough(profile)]));

export const computerTechnologiesResources = [
  { id: 'csf-riscv', title: 'RISC-V ISA Manual', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Открытая спецификация набора инструкций для изучения регистров, операций load/store и машинного уровня.', url: 'https://github.com/riscv/riscv-isa-manual' },
  { id: 'csf-csapp', title: 'Computer Systems: A Programmer’s Perspective · материалы курса', type: 'Курс', language: 'EN', access: 'Бесплатно', description: 'Материалы CMU по представлению данных, машинному коду, памяти, процессам и сетевому программированию.', url: 'https://www.cs.cmu.edu/~213/' },
  { id: 'csf-ostep-vm', title: 'OSTEP · Virtualization and memory', type: 'Открытая книга', language: 'EN', access: 'Бесплатно', description: 'Открытые главы по виртуализации CPU и памяти, адресным пространствам, paging и scheduling.', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' },
  { id: 'csf-linux-mm', title: 'Linux kernel memory management documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Первичная документация ядра Linux по virtual memory, page tables и memory management.', url: 'https://docs.kernel.org/mm/index.html' },
  { id: 'csf-ostep-processes', title: 'OSTEP · Processes and concurrency', type: 'Открытая книга', language: 'EN', access: 'Бесплатно', description: 'Разделы по процессам, scheduling, concurrency, threads и синхронизации.', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' },
  { id: 'csf-linux-syscalls', title: 'Linux system calls', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Справочник интерфейса системных вызовов Linux и границы между приложением и ядром.', url: 'https://man7.org/linux/man-pages/man2/syscalls.2.html' },
  { id: 'csf-man7-pipe', title: 'Linux pipe(7)', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Семантика pipes и FIFO, блокировка, ёмкость и ошибки межпроцессной передачи.', url: 'https://man7.org/linux/man-pages/man7/pipe.7.html' },
  { id: 'csf-ext4', title: 'ext4 filesystem documentation', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Первичная документация структуры ext4, inode, каталогов, блоков и журналирования.', url: 'https://www.kernel.org/doc/html/latest/filesystems/ext4/index.html' },
  { id: 'csf-rfc1122', title: 'RFC 1122 · Internet Hosts', type: 'RFC', language: 'EN', access: 'Бесплатно', description: 'Базовые требования стека IP для хостов и взаимодействие уровней Internet architecture.', url: 'https://www.rfc-editor.org/rfc/rfc1122' },
  { id: 'csf-rfc8200', title: 'RFC 8200 · IPv6', type: 'RFC', language: 'EN', access: 'Бесплатно', description: 'Спецификация IPv6, формата заголовка и обработки пакетов.', url: 'https://www.rfc-editor.org/rfc/rfc8200' },
  { id: 'csf-rfc9110', title: 'RFC 9110 · HTTP Semantics', type: 'RFC', language: 'EN', access: 'Бесплатно', description: 'Актуальная семантика HTTP: методы, статусы, поля и представления ресурсов.', url: 'https://www.rfc-editor.org/rfc/rfc9110' },
  { id: 'csf-mdn-http', title: 'MDN · Overview of HTTP', type: 'Документация', language: 'EN', access: 'Бесплатно', description: 'Практическое введение в HTTP, сообщения, соединения, cache, cookies и развитие протокола.', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview' },
  { id: 'csf-video-argodev-architecture', title: 'Computer Science | Архитектура ПК', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'argoDev · 07:41. Введение в устройство компьютера и архитектуру CPU.', url: 'https://www.youtube.com/watch?v=XR6GTyCpmHo' },
  { id: 'csf-video-mozhenkov-architecture', title: 'Архитектура компьютера', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'Volodya Mozhenkov · 15:32. Дополнительный разбор компонентов и архитектуры.', url: 'https://www.youtube.com/watch?v=cr5jQYw2aJI' },
  { id: 'csf-video-lectorium-architecture', title: 'Лекция 1 | Архитектура ЭВМ и основы ОС', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'Лекториум · 01:19:36. Развёрнутая лекция об архитектуре и памяти.', url: 'https://www.youtube.com/watch?v=dVZrHGNGvb0' },
  { id: 'csf-video-bragin-processes', title: 'Процессы и потоки в операционной системе', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'Dr Bragin · 12:00. Краткое объяснение процессов и потоков.', url: 'https://www.youtube.com/watch?v=cZUZycRiOwg' },
  { id: 'csf-video-csc-os', title: 'Что такое операционная система и как она работает', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'Computer Science Center · 02:01:08. Полная лекция по устройству ОС.', url: 'https://www.youtube.com/watch?v=hb9CTGSJm88' },
  { id: 'csf-video-argodev-os', title: 'Computer Science | Операционные системы', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'argoDev · 10:30. Введение в управление памятью, IPC и файловые системы.', url: 'https://www.youtube.com/watch?v=EGXI2GIv9rc' },
  { id: 'csf-video-semyenkov-networks', title: 'Сети для несетевиков', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'Yuriy Semyenkov · 21:27. OSI, IP, MAC, NAT, TCP, UDP и DNS.', url: 'https://www.youtube.com/watch?v=PYHKOwBfsLI' },
  { id: 'csf-video-osi-examples', title: 'Сетевая модель OSI. Стек TCP/IP', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'Обучение системных администраторов · 10:46. Модели на практических примерах.', url: 'https://www.youtube.com/watch?v=wnxDXj2Fqus' },
  { id: 'csf-video-mishustin-http', title: 'Гайд по HTTP для начинающих', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'Vlad Mishustin · 24:49. Методы, статусы и взаимодействие клиента с сервером.', url: 'https://www.youtube.com/watch?v=6JzPr_8bMbk' },
  { id: 'csf-video-ulbi-api', title: 'REST API, SOAP, GraphQL и WebSockets', type: 'Видео', language: 'RU', access: 'Бесплатно', description: 'Ulbi TV · 57:31. Сравнение API-подходов и транспортных моделей.', url: 'https://www.youtube.com/watch?v=XaTwnKLQi4A' },
];

export const computerTechnologiesLessonResources = Object.fromEntries(profiles.map((profile) => [profile.id, [...profile.sources, ...profile.videos].map((sourceId, index) => ({ sourceId, focus: index < profile.sources.length ? `Изучите первоисточник и сопоставьте его модель с темой «${profile.title}».` : `Посмотрите русскоязычный видеоматериал и проверьте ключевые утверждения по документации урока.`, ...(index === 0 ? { takeaway: profile.theory[0] } : {}) }))]));

export const computerTechnologiesVideos = {
  'csf-cpu-architecture': { id: 'XR6GTyCpmHo', title: 'Computer Science | Архитектура ПК', sourceName: 'argoDev', source: 'https://www.youtube.com/watch?v=XR6GTyCpmHo', duration: '07:41', language: 'ru', focus: 'Instruction cycle, CPU и базовые компоненты компьютера.' },
  'csf-memory-hierarchy': { id: 'dVZrHGNGvb0', title: 'Архитектура ЭВМ и основы ОС', sourceName: 'Лекториум', source: 'https://www.youtube.com/watch?v=dVZrHGNGvb0', duration: '01:19:36', language: 'ru', focus: 'Иерархия памяти и связь архитектуры с операционной системой.' },
  'csf-kernel-processes': { id: 'cZUZycRiOwg', title: 'Процессы и потоки в операционной системе', sourceName: 'Dr Bragin', source: 'https://www.youtube.com/watch?v=cZUZycRiOwg', duration: '12:00', language: 'ru', focus: 'Процессы, потоки и их ресурсы.' },
  'csf-memory-ipc-filesystems': { id: 'EGXI2GIv9rc', title: 'Computer Science | Операционные системы', sourceName: 'argoDev', source: 'https://www.youtube.com/watch?v=EGXI2GIv9rc', duration: '10:30', language: 'ru', focus: 'Управление памятью, IPC и файловые системы.' },
  'csf-network-models-routing': { id: 'PYHKOwBfsLI', title: 'Сети для несетевиков', sourceName: 'Yuriy Semyenkov', source: 'https://www.youtube.com/watch?v=PYHKOwBfsLI', duration: '21:27', language: 'ru', focus: 'OSI, IP, MAC, NAT, TCP, UDP и DNS.' },
  'csf-transport-web-rest': { id: '6JzPr_8bMbk', title: 'Гайд по HTTP для начинающих', sourceName: 'Vlad Mishustin', source: 'https://www.youtube.com/watch?v=6JzPr_8bMbk', duration: '24:49', language: 'ru', focus: 'HTTP, методы, статусы и взаимодействие клиента с сервером.' },
};
