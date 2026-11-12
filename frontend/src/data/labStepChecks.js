const rows={
'lab-network':[
'VM подключены только к LAB-NET.|Сверьте vSwitch у обеих VM.|При внешнем DHCP отключите bridge и проверьте режим сети.',
'Адреса в одной /24 и уникальны.|ipconfig /all на обоих клиентах.|При duplicate address исправьте адрес только lab NIC.',
'Маска и интерфейс соответствуют схеме.|Сравните IP, prefix и route print.|Ошибочный NIC отделите по MAC виртуального адаптера.',
'ICMP проходит между lab VM при разрешённом правиле.|ping и counters временного ICMP rule.|Если timeout, проверьте host firewall и тот же vSwitch.',
'Capture содержит Echo Request/Reply.|Wireshark фильтр icmp на lab NIC.|Если пакетов нет, смените интерфейс захвата, не отключайте весь firewall.'],
'lab-ad':[
'Имя DC01, статический IP и lab DNS записаны.|hostname и Get-NetIPConfiguration.|При неверном IP исправьте lab NIC через console.',
'AD DS установлена, RestartNeeded учтён.|Get-WindowsFeature AD-Domain-Services.|При ошибке смотрите Setup log и источник компонентов.',
'После reboot существует lab.example.|Get-ADForest и SRV query.|Проверьте DNS/Directory Service logs, не создавайте второй случайный лес.',
'OU Workstations/Lab-Users и lab.user существуют.|Get-ADOrganizationalUnit и Get-ADUser.|При Name exists не удаляйте прежний объект: установите происхождение.',
'Клиент разрешает DC и состоит в domain.|Resolve-DnsName и Get-ComputerInfo.|При Join error сначала DNS и время, затем NetSetup.log.',
'Вход выполнен как LAB\\lab.user.|whoami и Get-ADComputer на DC.|Если локальный вход, явно выберите domain identity.'],
'lab-gpo':[
'Новая test GPO имеет уникальный GUID и link.|Get-GPO и GPMC links.|При совпадении имени не меняйте существующую production GPO.',
'User setting включён в test GPO.|GPMC Settings report.|Если настройка в Computer part, перенесите в нужную часть.',
'Только lab OU и нужные Read/Apply права.|GPMC Scope/Delegation и положение user.|Если denied, gpresult покажет фильтр.',
'Refresh выполнен в сессии нужного пользователя.|whoami и gpupdate user result.|При требовании sign-out выполните новый вход.',
'Настройка действует, отчёт доступен в TEMP.|gpresult HTML и контрольный пользователь.|При конфликте найдите winning GPO и проверьте link order.'],
'lab-dhcp':[
'Роль установлена и сервер авторизован в lab AD.|Get-DhcpServerInDC и service state.|Проверьте DHCP Server log и разрешённую lab identity.',
'Scope active, пул не пересекается со статическими IP.|Get-DhcpServerv4Scope и exclusions.|При exhaustion проверьте lease count и диапазон.',
'Gateway и DNS соответствуют lab схеме.|Get-DhcpServerv4OptionValue.|Если DNS публичный, исправьте option 6 до клиентского теста.',
'Клиент получил lease из нужного scope.|ipconfig /all и server lease list.|APIPA требует проверки relay/VLAN/UDP 67–68.',
'Имя DC и SRV разрешаются внутренним DNS.|Resolve-DnsName -Type SRV.|При NXDOMAIN проверьте resolver и authoritative зону.'],
'lab-backup':[
'Marker и исходный VM ID сохранены.|Чтение recovery-proof.txt и Get-VM.|Если исходные данные неизвестны, остановитесь до export.',
'Экспорт завершён в отдельном backup path.|Task result и содержимое export каталога.|При I/O error проверьте место и права, не удаляйте source.',
'Есть config и virtual disks экспорта.|Get-ChildItem и manifest копии.|Если отсутствует диск, export не считается завершённым.',
'Новый VM ID, отдельные paths, NIC отключён.|Get-VM, Get-VMHardDiskDrive и Get-VMNetworkAdapter.|При общем VHD path не запускайте копию до исправления.',
'Копия загружается без сети и содержит marker.|Console и checksum/содержимое marker.|При ошибке загрузки проверьте версии config и boot disk.'],
'lab-powershell':[
'CSV содержит только synthetic records и нужные headers.|Import-Csv и просмотр имён колонок.|При неверном delimiter задайте его явно и повторите parsing.',
'Пустые значения и дубликаты отклонены до изменений.|Group-Object и validation report.|При finding исправьте вход, не продолжайте частичный import.',
'WhatIf показывает только ожидаемые новые объекты.|Сравните вывод с OU и account manifest.|Если scope неверен, исправьте DN до удаления WhatIf.',
'Созданы только отсутствующие accounts, GUID записаны после success.|Журнал успешных ObjectGUID и Get-ADUser.|При ошибке не добавляйте failed/preexisting account в rollback.',
'Новые объекты в Lab-Users и тестовый вход успешен.|Get-ADUser по GUID и whoami тестовой сессии.|При login failure проверьте Enabled, пароль, DNS и время.'],
'lab-entra':[
'Группа содержит одного lab пользователя.|Group membership в tenant.|Если выбран другой tenant, остановите изменения.',
'Application требует assignment в lab scope.|Enterprise Application properties.|Если функция недоступна по лицензии, явно запишите ограничение.',
'Только lab group имеет assignment.|Users and groups приложения.|При наследуемом доступе проверьте все assignment paths.',
'Policy Report-only, аварийный admin исключён.|Conditional Access scope и exclusions.|Если scope широкий, не включайте policy до исправления.',
'Sign-in logs показывают ожидаемое решение.|Сравните lab member и control user.|При unexpected result проверьте другие CA policies и device state.',
'Включённая узкая policy требует MFA у lab member.|Новая приватная сессия и Sign-in logs.|При блокировке используйте исключённого admin и отключите только test policy.'],
'lab-security':[
'Исходные процессы, время и log size записаны.|Get-Process и Eventlog inventory.|Если время расходится, зафиксируйте offset до корреляции.',
'Подпись Microsoft действительна, config прочитан.|Get-AuthenticodeSignature и config rules.|При invalid signature файл не запускать.',
'Sysmon service работает с выбранным config.|Service state и Sysmon Operational config event.|При отказе смотрите точный service/config error.',
'Созданы только notepad и собственный test file.|PID, parent и точный file path.|Не используйте malware и не трогайте чужие файлы.',
'Найден Process Create с нужным временем/PID.|Event ID 1 и ProcessGuid.|File/network events могут быть выключены config: не обещайте их наличие.',
'Отчёт связывает identity, parent, time и действие.|Сверьте raw event с timeline.|Отделите наблюдение от неподтверждённой гипотезы.'],
'lab-linux':[
'Созданы только sysadminlab и /srv/sysadminlab.|getent, stat и owner файла.|При существующих объектах остановитесь, не перезаписывайте.',
'Unit использует non-root User и loopback bind.|systemd-analyze verify файла unit.|Ошибки пути/синтаксиса исправьте до старта.',
'active, loopback socket и lab-http-ok подтверждены.|status, ss и curl body.|Проверьте port collision и journal при различии.',
'HTTP 403 при active service.|curl code, namei и journalctl.|Если не 403, проверьте service identity и точный file mode.',
'После 0640 HTTP снова 200 с ожидаемым телом.|curl -fsS index.html.|Не заменяйте минимальные права на 777.',
'Restored файл совпадает с backup.|cmp и SHA-256 именно restored.|При mismatch restore не считается успешным.']
};
export const labStepChecks=Object.fromEntries(Object.entries(rows).map(([id,items])=>[id,items.map(s=>{const [expected,verify,diagnosis]=s.split('|');return {expected,verify,diagnosis};})]));
