// Полностью обновлённый курс «Компьютерные технологии»: 3 модуля и 6 уроков.
const profiles = [
  {
    id: 'csf-cpu-architecture', title: 'Устройство ПК и работа центрального процессора', short: 'CPU, ALU, блок управления, регистры и цикл выполнения инструкции.',
    theory: [
      'Компьютер состоит из процессора, оперативной памяти, накопителей, устройств ввода-вывода и шин, которые связывают компоненты. Центральный процессор выполняет машинные инструкции: блок управления выбирает следующую команду и координирует её исполнение, а арифметико-логическое устройство выполняет вычисления и логические операции.',
      'Регистры находятся внутри процессорного ядра и хранят операнды, адреса и состояние текущего вычисления. Типичный instruction cycle включает выборку команды из памяти, декодирование, получение операндов, выполнение и запись результата. Реальные процессоры перекрывают эти стадии конвейером, поэтому тактовая частота сама по себе не определяет производительность.',
      'Периферия общается с процессором через контроллеры, прерывания и прямой доступ к памяти. Для технической диагностики важно отделять архитектурную модель от конкретной реализации: число ядер, cache, набор инструкций, IPC, лимиты питания и профиль нагрузки влияют на результат одновременно.',
    ],
    commands: "python3 - <<'PY'\nregisters = {'R1': 0, 'R2': 0, 'R3': 0}\nprogram = [('LOADI', 'R1', 7), ('LOADI', 'R2', 5), ('ADD', 'R3', 'R1', 'R2')]\nfor pc, instruction in enumerate(program):\n    print(f'FETCH   pc={pc} instruction={instruction}')\n    opcode, *operands = instruction\n    print(f'DECODE  opcode={opcode} operands={operands}')\n    if opcode == 'LOADI':\n        target, value = operands\n        registers[target] = value\n    elif opcode == 'ADD':\n        target, left, right = operands\n        registers[target] = registers[left] + registers[right]\n    print(f'EXECUTE registers={registers}')\nassert registers['R3'] == 12\nprint('CHECK   R3=12 PASS')\nPY",
    expected: 'Модель выполняет три instruction cycle, явно печатает FETCH, DECODE и EXECUTE и завершает проверкой CHECK R3=12 PASS.',
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
    commands: "python3 - <<'PY'\nPAGE_SIZE = 4096\npage_table = {0: 5, 1: 9, 2: 12}\nvirtual_addresses = [0, 4095, 4096, 8195]\nfor virtual in virtual_addresses:\n    vpn, offset = divmod(virtual, PAGE_SIZE)\n    frame = page_table[vpn]\n    physical = frame * PAGE_SIZE + offset\n    print(f'VA={virtual:5} VPN={vpn} offset={offset:4} -> frame={frame:2} PA={physical}')\ncache_line = 64\nbyte_addresses = [0, 1, 63, 64, 65, 127, 128]\nlines = sorted({address // cache_line for address in byte_addresses})\nprint('cache lines touched:', lines)\nassert lines == [0, 1, 2]\nprint('CHECK page-translation-and-locality PASS')\nPY",
    expected: 'Для четырёх виртуальных адресов вычислены VPN, offset, frame и физический адрес; семь обращений затрагивают ровно три cache line, итоговая проверка — PASS.',
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
    commands: "python3 - <<'PY'\nimport os\nimport tempfile\nfrom threading import Thread, current_thread, get_native_id\nwith tempfile.TemporaryDirectory() as directory:\n    path = os.path.join(directory, 'syscall-demo.txt')\n    fd = os.open(path, os.O_CREAT | os.O_RDWR, 0o600)\n    os.write(fd, b'kernel boundary')\n    os.lseek(fd, 0, os.SEEK_SET)\n    print('file round-trip:', os.read(fd, 64).decode())\n    os.close(fd)\n    results = []\n    def worker(number):\n        results.append((number, os.getpid(), get_native_id(), current_thread().name))\n    threads = [Thread(target=worker, args=(n,), name=f'worker-{n}') for n in range(2)]\n    for thread in threads: thread.start()\n    for thread in threads: thread.join()\n    print('process pid:', os.getpid())\n    print('threads:', sorted(results))\n    assert all(item[1] == os.getpid() for item in results)\n    assert len({item[2] for item in results}) == 2\nprint('CHECK syscalls-and-threads PASS')\nPY",
    expected: 'Операции open/write/read проходят через интерфейс ОС, оба потока имеют один PID и разные native thread ID; временный каталог удаляется автоматически.',
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
    commands: "lab_dir=$(mktemp -d)\ncleanup() { rm -f \"$lab_dir/file-hardlink.txt\" \"$lab_dir/file.txt\" \"$lab_dir/channel\"; rmdir \"$lab_dir\" 2>/dev/null || true; }\ntrap cleanup EXIT\nmkfifo \"$lab_dir/channel\"\nprintf 'message-through-pipe\\n' > \"$lab_dir/channel\" &\nwriter_pid=$!\nread -r message < \"$lab_dir/channel\"\nwait \"$writer_pid\"\nprintf 'received: %s\\n' \"$message\"\nprintf 'inode-demo\\n' > \"$lab_dir/file.txt\"\nstat -c 'inode=%i links=%h mode=%A size=%s' \"$lab_dir/file.txt\"\nln \"$lab_dir/file.txt\" \"$lab_dir/file-hardlink.txt\"\nstat -c 'inode=%i links=%h' \"$lab_dir/file.txt\" \"$lab_dir/file-hardlink.txt\"",
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
    commands: "python3 - <<'PY'\nfrom ipaddress import ip_address, ip_network\nroutes = [\n    (ip_network('0.0.0.0/0'), '192.0.2.1', 'default'),\n    (ip_network('10.0.0.0/8'), '10.0.0.1', 'corp'),\n    (ip_network('10.20.0.0/16'), '10.20.0.1', 'lab'),\n]\nfor destination_text in ['10.20.5.7', '10.30.1.4', '203.0.113.8']:\n    destination = ip_address(destination_text)\n    matches = [route for route in routes if destination in route[0]]\n    network, gateway, name = max(matches, key=lambda route: route[0].prefixlen)\n    print(f'{destination} -> {name:7} prefix={network} gateway={gateway}')\nassert ip_address('10.20.5.7') in ip_network('10.20.0.0/16')\nprint('CHECK longest-prefix-match PASS')\nPY",
    expected: 'Алгоритм longest prefix match выбирает маршрут lab для 10.20.5.7, corp для 10.30.1.4 и default для 203.0.113.8, затем печатает PASS.',
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
    commands: "python3 - <<'PY'\nfrom http.server import BaseHTTPRequestHandler, HTTPServer\nfrom threading import Thread\nfrom urllib.error import HTTPError\nfrom urllib.request import urlopen\nclass Handler(BaseHTTPRequestHandler):\n    def do_GET(self):\n        if self.path != '/api/status':\n            self.send_response(404)\n            self.end_headers()\n            return\n        body = b'{\"service\":\"lab\",\"status\":\"ok\"}'\n        self.send_response(200)\n        self.send_header('Content-Type', 'application/json')\n        self.send_header('Content-Length', str(len(body)))\n        self.end_headers()\n        self.wfile.write(body)\n    def log_message(self, *_):\n        pass\nserver = HTTPServer(('127.0.0.1', 0), Handler)\nthread = Thread(target=server.serve_forever, daemon=True)\nthread.start()\nbase_url = f'http://127.0.0.1:{server.server_port}'\ntry:\n    with urlopen(f'{base_url}/api/status', timeout=3) as response:\n        print('status:', response.status)\n        print('content-type:', response.headers['Content-Type'])\n        print('body:', response.read().decode())\n    try:\n        urlopen(f'{base_url}/missing', timeout=3)\n    except HTTPError as error:\n        print('missing status:', error.code)\nfinally:\n    server.shutdown()\n    thread.join()\n    server.server_close()\nprint('CHECK server-stopped PASS')\nPY",
    expected: 'Локальный API возвращает 200 и JSON для /api/status, 404 для неизвестного ресурса и завершает работу с CHECK server-stopped PASS.',
    sources: ['csf-rfc9110', 'csf-mdn-http'], videos: ['csf-video-mishustin-http', 'csf-video-ulbi-api'],
    question: ['Что верно о REST?', ['Это архитектурный стиль поверх протоколов вроде HTTP', 'Это замена IP-маршрутизации', 'Это формат только для XML', 'Это алгоритм шифрования TLS'], 0, 'REST описывает ограничения архитектуры взаимодействия с ресурсами и часто реализуется поверх HTTP.'],
  },
];

const labBlueprints = {
  'csf-cpu-architecture': {
    environment: 'Python 3 · модель CPU без доступа к firmware',
    action: 'Трассировка FETCH → DECODE → EXECUTE',
    boundary: 'Симулятор объясняет instruction cycle, но не измеряет реальный процессор',
    commandsLabel: 'PYTHON · МОДЕЛЬ ЦИКЛА ИНСТРУКЦИИ',
    context: 'Лаборатория моделирует три инструкции и показывает, как программный счётчик, декодер, регистры и ALU участвуют в цикле процессора. Реальные BIOS/UEFI и настройки CPU не изменяются.',
    prerequisites: ['Python 3.8 или новее на любом учебном компьютере.', 'Текстовый редактор или терминал; административные права не требуются.', 'Запрещено изменять BIOS/UEFI, напряжение, частоту и параметры разгона.'],
    steps: [
      'Нарисуйте блоки CPU: программный счётчик, блок управления, регистры и ALU. Для каждой из трёх инструкций заранее запишите ожидаемое изменение регистров.',
      'Прочитайте список program в коде и найдите операнды двух LOADI и одной ADD. Не запускайте код, пока не предскажете итоговое значение R3.',
      'Запустите модель и для каждого значения pc сопоставьте строки FETCH, DECODE и EXECUTE с этапами instruction cycle.',
      'Проверьте, что LOADI изменяет только целевой регистр, а ADD читает R1 и R2 и записывает сумму в R3.',
      'Сравните собственный прогноз с утверждением assert и итоговой строкой CHECK R3=12 PASS.',
      'Для отрицательной проверки измените только один числовой операнд, заранее пересчитайте результат и соответствующим образом измените assert. Не меняйте системные настройки компьютера.',
    ],
    pitfalls: ['Python-словарь лишь изображает регистры и не является регистрами физического CPU.', 'Финальное число 12 без трассировки не доказывает понимание стадий FETCH, DECODE и EXECUTE.', 'Модель не показывает конвейер, cache, out-of-order execution и особенности конкретной ISA.'],
    troubleshooting: ['Если команда python3 не найдена, используйте установленный Python 3 своей системы и сохраните тот же код.', 'При SyntaxError скопируйте блок целиком, включая обе строки с маркером PY.', 'При AssertionError сравните фактическое значение R3 с операндами инструкций и ожидаемой суммой.'],
    cleanup: ['Файлы и фоновые процессы не создаются; закройте терминал после сохранения вывода.', 'Верните изменённый операнд и assert к исходным значениям, если выполняли отрицательную проверку.'],
  },
  'csf-memory-hierarchy': {
    environment: 'Python 3 · модель страниц памяти и cache line',
    action: 'Перевод виртуальных адресов и анализ локальности',
    boundary: 'Модель использует учебную таблицу страниц и не читает память других процессов',
    commandsLabel: 'PYTHON · СТРАНИЦЫ ПАМЯТИ И CACHE LINE',
    context: 'Лаборатория связывает виртуальный адрес с номером страницы и смещением, а затем показывает, почему соседние байтовые адреса попадают в одну cache line.',
    prerequisites: ['Python 3.8 или новее; Linux не обязателен.', 'Калькулятор для ручной проверки деления с остатком.', 'Не требуются root-права, swap и изменение параметров памяти ОС.'],
    steps: [
      'Запишите размер страницы 4096 байт и вручную вычислите VPN и offset для адресов 0, 4095, 4096 и 8195.',
      'По учебной таблице page_table найдите физический frame для каждого VPN и вычислите PA = frame × PAGE_SIZE + offset.',
      'Запустите код и сравните каждую строку VA → PA со своими расчётами.',
      'Разделите семь байтовых адресов на размер cache line 64 и предскажите количество уникальных линий.',
      'Проверьте список cache lines touched и итоговую строку CHECK page-translation-and-locality PASS.',
      'Добавьте адрес 192, заранее предскажите новую линию и обновите assert; затем объясните проявление пространственной локальности.',
    ],
    pitfalls: ['4096 байт — это 4 KiB, а не произвольное округление до 4000.', 'Виртуальный адрес не равен физическому: отображение задаёт таблица страниц.', 'Учебные cache line не моделируют ассоциативность, вытеснение, TLB и реальные cache misses.'],
    troubleshooting: ['При KeyError проверьте, что для вычисленного VPN существует запись в page_table.', 'При AssertionError распечатайте address // cache_line для каждого адреса.', 'Не пытайтесь исправить модель изменением swap или параметров ядра.'],
    cleanup: ['Скрипт не создаёт файлов и не меняет память ОС.', 'Удалите добавленный тестовый адрес или сохраните изменённую версию отдельно в отчёте.'],
  },
  'csf-kernel-processes': {
    environment: 'Python 3 · пользовательский процесс и временный каталог',
    action: 'Файловые операции ОС и сравнение PID/TID потоков',
    boundary: 'Наблюдаются безопасные вызовы текущего процесса без отладки ядра',
    commandsLabel: 'PYTHON · СИСТЕМНЫЕ ВЫЗОВЫ, ПРОЦЕСС И ПОТОКИ',
    context: 'Лаборатория проходит границу user mode → kernel через файловые операции и показывает, какие идентификаторы общие и разные у потоков одного процесса.',
    prerequisites: ['Python 3.8 или новее и право создавать временные файлы.', 'Обычная учётная запись; root и инструменты трассировки ядра не нужны.', 'На платформе должен поддерживаться threading.get_native_id.'],
    steps: [
      'До запуска перечислите операции ОС, которые потребуются для создания, записи, перемещения позиции чтения и закрытия файла.',
      'Запустите код и проверьте round-trip строки kernel boundary через os.open, os.write, os.lseek и os.read.',
      'Сравните PID главного процесса и PID обеих записей worker: они должны совпасть.',
      'Сравните native thread ID: для двух одновременно созданных потоков они должны быть разными.',
      'Объясните, почему список results доступен обоим потокам и какой риск возникает без синхронизации при сложных изменениях общего состояния.',
      'Убедитесь, что после выхода из TemporaryDirectory временный каталог удалён и CHECK syscalls-and-threads PASS напечатан.',
    ],
    pitfalls: ['Функции Python являются обёртками над интерфейсами ОС, а не демонстрацией внутреннего кода ядра.', 'Одинаковый PID у потоков ожидаем; различаются их native thread ID.', 'Порядок выполнения worker-0 и worker-1 не гарантирован планировщиком.'],
    troubleshooting: ['Если get_native_id отсутствует, проверьте версию Python и обновите только учебную среду.', 'При ошибке создания файла проверьте право записи во временный каталог.', 'При зависании убедитесь, что оба потока запускаются и для каждого вызывается join.'],
    cleanup: ['TemporaryDirectory удаляет файл и каталог автоматически.', 'Оба потока завершаются через join; дополнительных процессов и служб не остаётся.'],
  },
  'csf-memory-ipc-filesystems': {
    environment: 'Linux или WSL · Bash, FIFO и файловая система',
    action: 'Передача через named pipe и проверка hard link/inode',
    boundary: 'Все объекты создаются в новом временном каталоге и удаляются trap-обработчиком',
    commandsLabel: 'BASH · FIFO, HARD LINK И INODE',
    context: 'Лаборатория показывает блокирующий поток байтов через FIFO и связь двух имён с одним inode. Она относится к IPC и файловым системам, а не к настройке Linux-сервера.',
    prerequisites: ['Linux VM, контейнер или WSL с Bash, mkfifo, stat и ln.', 'Файловая система, поддерживающая FIFO и hard links; обычной учётной записи достаточно.', 'Не подставляйте системные каталоги: скрипт сам создаёт отдельный путь через mktemp.'],
    steps: [
      'Предскажите, почему запись в FIFO запускается в фоне и что произойдёт без читающей стороны.',
      'Запустите блок и подтвердите получение строки message-through-pipe через named pipe.',
      'Запишите inode и число ссылок файла до создания hard link.',
      'Создайте второе имя через ln и сравните inode обоих путей: номера должны совпасть, links должно стать 2.',
      'Объясните различие между именем в каталоге, inode с метаданными и блоками содержимого.',
      'Дождитесь завершения команды и проверьте, что trap удалил FIFO, оба имени файла и временный каталог.',
    ],
    pitfalls: ['FIFO блокирует запись до появления читателя; не запускайте writer в foreground перед read.', 'Hard link должен находиться на той же файловой системе и не является копией содержимого.', 'Формат stat -c и понятие inode в таком виде относятся к Linux; NTFS имеет другую внутреннюю модель.'],
    troubleshooting: ['Если mkfifo или stat -c недоступны, выполняйте лабораторию в Linux/WSL, а не заменяйте команды непроверенным аналогом.', 'При зависании остановите блок Ctrl+C: trap выполнит очистку временного каталога.', 'При ошибке ln проверьте, что оба пути находятся внутри одного lab_dir.'],
    cleanup: ['Обработчик trap запускается при нормальном завершении и при прерывании оболочки.', 'После работы убедитесь, что путь из mktemp больше не существует и фонового writer_pid нет.'],
  },
  'csf-network-models-routing': {
    environment: 'Python 3 · изолированная таблица IPv4-маршрутов',
    action: 'Выбор маршрута по longest prefix match',
    boundary: 'Системные интерфейсы, адреса и маршруты компьютера не изменяются',
    commandsLabel: 'PYTHON · CIDR И LONGEST PREFIX MATCH',
    context: 'Лаборатория реализует выбор маршрута на синтетической таблице и позволяет проверить правило самого длинного совпадающего префикса без доступа к реальной сети.',
    prerequisites: ['Python 3.8 или новее со стандартным модулем ipaddress.', 'Бумага или калькулятор для сравнения префиксов /0, /8 и /16.', 'Не требуется сеть, VPN, root-доступ или изменение маршрутов ОС.'],
    steps: [
      'Прочитайте три записи routes и определите область адресов для default, corp и lab.',
      'Для каждого из трёх адресов перечислите все подходящие префиксы до запуска кода.',
      'Выберите среди совпадений запись с наибольшим prefixlen и запишите ожидаемый gateway.',
      'Запустите модель и сравните маршруты для 10.20.5.7, 10.30.1.4 и 203.0.113.8 со своим прогнозом.',
      'Объясните, почему маршрут /16 выигрывает у /8 и /0 независимо от их положения в списке.',
      'Добавьте тестовый адрес на границе сети 10.20.255.255 и проверьте выбор маршрута, не изменяя таблицу маршрутов компьютера.',
    ],
    pitfalls: ['Маршрут 0.0.0.0/0 совпадает с любым IPv4-адресом, но проигрывает более специфичному префиксу.', 'Первый маршрут в списке не обязан быть выбран: решает длина подходящего префикса.', 'Модель не выполняет ARP, NAT, коммутацию кадра и проверку доступности gateway.'],
    troubleshooting: ['При ValueError проверьте корректность IPv4-адреса и CIDR-префикса.', 'Если выбран неверный маршрут, выведите prefixlen всех matches перед max.', 'Не используйте ip route add для исправления результата синтетической модели.'],
    cleanup: ['Скрипт не создаёт соединений, файлов и системных маршрутов.', 'Удалите добавленный тестовый адрес из учебного списка или приложите изменённый код к отчёту.'],
  },
  'csf-transport-web-rest': {
    environment: 'Python 3 · HTTP-сервер только на 127.0.0.1',
    action: 'GET успешного и отсутствующего ресурса API',
    boundary: 'Случайный локальный порт, без Интернета, DNS, TLS и внешних клиентов',
    commandsLabel: 'PYTHON · ЛОКАЛЬНЫЙ HTTP И REST-РЕСУРС',
    context: 'Лаборатория запускает одноразовый HTTP API на loopback, сравнивает ответы 200 и 404 и явно завершает сервер. Она показывает семантику HTTP, а не настраивает Linux-службу.',
    prerequisites: ['Python 3.8 или новее; внешние пакеты и доступ в Интернет не нужны.', 'Право открыть непривилегированный порт только на 127.0.0.1.', 'Локальная политика безопасности должна разрешать loopback-соединение текущего процесса.'],
    steps: [
      'До запуска разберите URL на схему, IP-адрес, динамический порт и путь ресурса /api/status.',
      'Прочитайте Handler и предскажите статус, Content-Type и тело успешного GET-запроса.',
      'Запустите сервер и проверьте ответ 200 с application/json и полем status=ok.',
      'Сравните запрос /missing: сервер должен вернуть 404 без JSON-представления ресурса.',
      'Разделите наблюдение по уровням: TCP доставляет байты, HTTP задаёт запрос/статус/заголовки, JSON кодирует представление ресурса.',
      'Проверьте строку CHECK server-stopped PASS и убедитесь, что поток сервера завершён и порт закрыт.',
    ],
    pitfalls: ['REST — архитектурный стиль, а не синоним HTTP или JSON.', 'Ответ 200 доказывает обработку этого запроса, но не безопасность, авторизацию и корректность всего API.', 'Loopback-лаборатория не проверяет DNS, TLS, proxy, firewall и работу через реальную сеть.'],
    troubleshooting: ['При timeout проверьте, что thread.start вызывается до urlopen.', 'При ошибке привязки убедитесь, что указан 127.0.0.1 и порт 0, позволяющий ОС выбрать свободный порт.', 'Если программа не завершается, проверьте блок finally с shutdown, join и server_close.'],
    cleanup: ['Блок finally останавливает serve_forever, ждёт поток и закрывает сокет.', 'Дополнительные файлы и постоянные службы не создаются.'],
  },
};

const makeLesson = (profile) => ({
  intro: `${profile.title} — урок курса «Фундаментальный Computer Science: Архитектура, ОС и Сети». Теория и лаборатория посвящены одной теме и используют безопасную локальную модель без изменения рабочей инфраструктуры.`,
  sections: [
    { title: 'Основные понятия и механизм', paragraphs: profile.theory.slice(0, 2) },
    { title: 'Практическая граница модели', paragraphs: [profile.theory[2], `Критерий практической проверки: ${profile.expected}`] },
  ],
  lab: {
    prerequisites: labBlueprints[profile.id].prerequisites,
    steps: labBlueprints[profile.id].steps,
    commands: profile.commands,
    commandsLabel: labBlueprints[profile.id].commandsLabel,
    expected: profile.expected,
    pitfalls: labBlueprints[profile.id].pitfalls,
    troubleshooting: labBlueprints[profile.id].troubleshooting,
    cleanup: labBlueprints[profile.id].cleanup,
  },
});

const makeDetail = (profile) => ({
  goals: [`Объяснить тему «${profile.title}» от базового механизма до наблюдаемого результата.`, 'Связать модель с безопасным inventory или локальным воспроизводимым примером.', 'Отделить факт вывода команды от предположения и ограничения выбранного стенда.'],
  deepDive: [...profile.theory, `Лаборатория подтверждает конкретный критерий, а не всю тему сразу: ${profile.expected}`, 'Технический отчёт должен содержать исходное состояние, команды, фактический вывод, критерий приёмки, ограничение проверки и подтверждённую очистку временных объектов.'],
  caseStudy: { situation: `Начинающий специалист изучает тему «${profile.title}» и должен объяснить её без изменения рабочей инфраструктуры.`, action: 'Он строит схему, выполняет локальную воспроизводимую проверку, сохраняет вывод и сопоставляет каждое наблюдение с определённым уровнем модели.', result: profile.expected },
  diagram: ['Исходные данные или запрос', 'Аппаратный либо системный механизм', 'Контролируемая операция ОС или протокола', 'Наблюдаемый результат', 'Проверка и технический отчёт'],
  uiMockup: { breadcrumb: `COMPUTER SCIENCE › ${profile.title}`, panelTitle: 'Учебная модель · наблюдение', rows: [{ label: 'Среда', value: labBlueprints[profile.id].environment }, { label: 'Действие', value: labBlueprints[profile.id].action }, { label: 'Доказательство', value: profile.expected }, { label: 'Граница', value: labBlueprints[profile.id].boundary }], helpText: 'Макет фиксирует среду, действие, проверяемый результат и границу применимости лаборатории.' },
  practiceTasks: [{ task: 'Нарисуйте механизм урока и подпишите границы между hardware, ОС, протоколом и приложением.', hint: 'Используйте минимум четыре узла и направление передачи данных.', solution: profile.theory[0] }, { task: 'Сформулируйте отрицательную проверку, которая не повредит стенду.', hint: 'Изменяйте только синтетические данные или локальный одноразовый процесс.', solution: `Сравните отрицательный результат с критерием: ${profile.expected}` }],
  question: { question: profile.question[0], options: profile.question[1], answer: profile.question[2], explanation: profile.question[3] },
});

const makeWalkthrough = (profile) => ({
  title: `Практический разбор: ${profile.title}`,
  context: labBlueprints[profile.id].context,
  steps: labBlueprints[profile.id].steps.map((step) => `${step} Зафиксируйте прогноз, фактический вывод и короткое объяснение расхождения в отчёте.`),
  verification: `${profile.expected} Повторная проверка даёт согласованный результат, а временные процессы и объекты после завершения отсутствуют.`,
  troubleshooting: labBlueprints[profile.id].troubleshooting.join(' '),
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
