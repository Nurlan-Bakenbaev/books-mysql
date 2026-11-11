# Network Engineer: происхождение материалов и проверка ссылок

Проверка выполнена 11 ноября 2026 года. Каталог находится в
`frontend/src/data/networkEngineerSources.js`: 41 источник и четыре
сертификационных маршрута. Материалы для самостоятельного изучения открыты;
экзамены обычно платные. У учебных порталов есть отдельные платные предложения,
а запуск облачных ресурсов и лицензирование образов не входят в бесплатную
документацию.

## Исходная карта

Пользовательский источник — <https://roadmap.sh/network-engineer>.
Из среды этот адрес вернул ограничение прокси `403 Forbidden` при установлении
HTTPS-туннеля. Содержимое действующего сайта и точный визуальный порядок узлов
не проверены.

GitHub-адрес <https://github.com/kamranahmedse/developer-roadmap> перенаправил на
<https://github.com/nilbuild/developer-roadmap> с HTTP 200. Основная ветка —
`master`; зафиксированный SHA — `eca7997f640979e8d2a09cee497579ee5ce3a73d`.
Актуальные материалы доступны по адресу:

<https://github.com/nilbuild/developer-roadmap/tree/master/roadmaps/network-engineer/content>

В каталоге обнаружены 202 Markdown-файла, включая варианты названий одних и тех
же тем; это не означает 202 независимых урока. В текущей папке
`roadmaps/network-engineer/` находится только `content/`, без JSON графа.
Пути `src/data/roadmaps/network-engineer/network-engineer.json` и
`roadmaps/network-engineer/network-engineer.json` в текущем состоянии репозитория
не подходят.

HTTP 200 подтверждён для Markdown introduction, routing, wireless-networking,
troubleshooting, network-design-principles, network-automation,
cloud-networking-basics, linux-for-networking, python-for-networking, netmiko,
ccna и ccnp. Материалы охватывают сетевой фундамент, адресацию, коммутацию,
маршрутизацию, Wi-Fi, безопасность, доступность, QoS, облако, мониторинг,
диагностику и автоматизацию. Последовательность курса — учебная группировка этих
тем, а не воспроизведение визуальной геометрии roadmap.sh.

Ссылки Cisco CCNA и CCNP Enterprise в каталоге дословно совпадают с официальными
ссылками в соответствующих Markdown-файлах исходной карты. Перенаправление
GitHub и состояние файлов проверены в этой сессии; происхождение каждой
сторонней рекомендации внутри карты отдельно не аудировалось.

## Источники с подтверждённым HTTP 200

Проверены HTTPS GET, конечный адрес и заголовок страницы GitHub. Это проверка
доступности и принадлежности указанному проекту; она не заменяет выполнение
каждого примера или аудит всего содержимого репозитория.

| ID | Проверенный адрес |
| --- | --- |
| ne-frr | <https://github.com/FRRouting/frr/tree/master/doc/user> |
| ne-wireshark | <https://github.com/wireshark/wireshark> |
| ne-wireshark-guide | <https://github.com/wireshark/wireshark/tree/master/doc/wsug_src> |
| ne-iproute2 | <https://github.com/iproute2/iproute2> |
| ne-linux-networking | <https://github.com/torvalds/linux/tree/master/Documentation/networking> |
| ne-wireguard | <https://github.com/WireGuard/wireguard-tools> |
| ne-strongswan | <https://github.com/strongswan/strongswan> |
| ne-prometheus-snmp | <https://github.com/prometheus/snmp_exporter> |
| ne-netbox | <https://github.com/netbox-community/netbox> |
| ne-netmiko | <https://github.com/ktbyers/netmiko> |
| ne-napalm | <https://github.com/napalm-automation/napalm> |
| ne-nornir | <https://github.com/nornir-automation/nornir> |
| ne-ansible-network | <https://github.com/ansible-collections/ansible.netcommon> |
| ne-containerlab | <https://github.com/srl-labs/containerlab> |
| ne-azure-network | <https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network> |
| ne-openconfig | <https://github.com/openconfig/public> |

Также HTTP 200 подтверждён для конкретных разделов FRR `static.rst`,
`ospf_fundamentals.rst`, `ospfd.rst`, `bgp.rst`, `ipv6.rst`, `filter.rst`,
`ldpd.rst`, `vrrp.rst`, `isisd.rst`, `evpn.rst`; Wireshark `wsug_capture.adoc`,
`wsug_wireless.adoc`, `wsug_troubleshoot.adoc`; iproute2 `ip-link.8.in`,
`ip-address.8.in`, `ip-netns.8.in`, `tc.8`; документации Linux `bridge.rst`.
GitHub-зеркала Wireshark, WireGuard и iproute2 отмечены самими проектами как
зеркала; они не обозначены здесь как независимые учебные сайты.

## Адреса, которые заблокировала среда

Все следующие HTTPS-запросы остановлены прокси среды с
`Tunnel connection failed: 403 Forbidden`. Это не HTTP 403 от самого сайта и
не доказательство, что адрес не существует. Эти страницы не помечены как
успешно загруженные.

- Исходный `roadmap.sh/network-engineer`.
- Главная RFC Editor и адреса `/rfc/rfcNNNN.html` для RFC 1918, 4632, 8200,
  4291, 2131, 1034, 5905, 9293, 768, 9110, 8446, 5424, 3411, 6241 и 8040.
  Это канонические адреса публикаций; их текущие страницы и цепочки обновлений
  в этой сессии не загружены.
- Cisco Networking Academy `https://www.netacad.com/` и Juniper Learning Portal
  `https://learningportal.juniper.net/`. Текущий состав бесплатных предложений,
  формы регистрации и доступ к симуляторам не подтверждены.
- hostapd `https://w1.fi/hostapd/`.
- AWS `https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html`.
  Репозиторий `https://github.com/awsdocs/amazon-vpc-user-guide` доступен с
  HTTP 200 как исторический открытый источник AWS; свежесть текущего руководства
  AWS по его содержимому не утверждается.
- Официальные страницы CompTIA Network+, Cisco CCNA, Cisco CCNP Enterprise и
  Juniper JNCIA-Junos из модуля. Структура CCNP core + concentration также
  описана в загруженном Markdown исходной карты, но текущие правила регистрации
  Cisco отдельно не подтверждены.

Имена сертификаций используются без номеров версий экзаменов и цен. Network+
представлен как необязательная независимая от вендора база; CCNA и JNCIA-Junos —
как альтернативные первые вендорные направления; CCNP Enterprise — как
углубление после практики. Курс не обещает автоматическое получение
сертификации или доступ к платным экзаменам. Dumps и закрытые экзаменационные
вопросы в источники не включены.

## Видеорекомендации

`frontend/src/data/networkEngineerVideos.js` содержит по одной рекомендации для
каждого из 20 уроков. Идентификаторы YouTube извлечены из реально загруженных
Markdown-файлов Network Engineer указанного GitHub-каталога; поле `source`
ведёт на точный исходный файл с рекомендацией. Идентификаторы не подбирались
по названию и не генерировались.

Выбраны рекомендации с английскими названиями. Воспроизведение, фактический
разговорный язык, наличие субтитров и длительность в этой среде отдельно не
проверены. Ограничение `maxDurationMinutes` не задано: в частности,
`Wireshark Full Course` нельзя обоснованно объявлять роликом до 15 минут.
Поле `focus` указывает конкретную часть урока, для которой предлагается видео;
один ролик не представлен как полное покрытие всех тем большого урока.
