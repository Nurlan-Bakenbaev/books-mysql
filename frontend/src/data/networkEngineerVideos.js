// Every ID below occurs in the linked official roadmap Markdown (HTTP 200).
// Playback, spoken language and duration were not independently verified.
// Do not attach an invented duration limit to these recommendations.
const roadmapVideo = (id, title, file, focus) => ({
  id,
  title,
  source: `https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/roadmaps/network-engineer/content/${file}`,
  sourceName: 'roadmap.sh · Network Engineer, исходный каталог видео',
  focus,
});

// A recommendation covers the stated focus, which can be one part of a lesson.
export const networkEngineerVideos = {
  'ne-foundations': roadmapVideo('Ilk7UXzV_Qc', 'What is OSI Model?', 'osi-model@pt6RO3SEStG9TJOWpt_8D.md', 'Модель OSI и разделение сетевых функций по уровням.'),
  'ne-media-ethernet': roadmapVideo('TIiQiw7fpsU', 'MAC Address Explained', 'mac-address@6zxS5esVlRNIDrQuZBaHz.md', 'MAC-адреса сетевых интерфейсов: адресация канального уровня в теме Ethernet.'),
  'ne-ipv4-subnetting': roadmapVideo('hbdT_Q9DM8w', 'Subnetting Explained: Networking Basics', 'subnetting@d93bl-7gSB8lu43BQlqvY.md', 'Деление IPv4-сети на подсети и чтение префикса.'),
  'ne-ipv6': roadmapVideo('aor29pGhlFE', 'Internet Protocol - IPv4 vs IPv6 as Fast As Possible', 'ipv4-vs-ipv6@wzYaf1wtbo2RQ8JSRawFM.md', 'Сравнение IPv4 и IPv6 как вводная часть темы IPv6.'),
  'ne-transport-applications': roadmapVideo('hExRDVZHhig', 'SSL, TLS, HTTP, HTTPS Explained', 'http--https@_st-ChGja7h83_MOwtiF2.md', 'Связь HTTP, HTTPS и TLS; прикладная часть урока о сетевых протоколах.'),
  'ne-services-dns-dhcp-ntp': roadmapVideo('e6-TaH5bkjo', 'DHCP Explained - Dynamic Host Configuration Protocol', 'dhcp@yL4HVbX33i2wAj-k92X48.md', 'Назначение DHCP и автоматическое получение сетевой конфигурации.'),
  'ne-switching-vlans': roadmapVideo('jC6MJTh9fRE', 'VLAN Explained', 'vlans@x0bAdjSBNfZ4gm1CwnPBK.md', 'Логическое разделение локальной сети с помощью VLAN.'),
  'ne-stp-redundancy': roadmapVideo('6MW5P6Ci7lw', 'Spanning Tree Protocol | CCNA - Explained', 'stp@DM50xKwBoRZa0_JdQi07v.md', 'Назначение STP и предотвращение петель в коммутируемой сети.'),
  'ne-routing-ospf': roadmapVideo('Xb3CbIDMDRk', 'What is OSPF and How Does It Work?', 'ospf@OZICDRrSq-KJNAGTlmwr7.md', 'Вводное объяснение OSPF и динамического выбора маршрутов.'),
  'ne-bgp-wan': roadmapVideo('z8INzy9E628', 'MicroNugget: What is BGP and BGP Configuration Explained', 'bgp@gCdUfkMlZwamhOpM5aUqr.md', 'Основы BGP и вводный пример конфигурации; часть темы WAN.'),
  'ne-design-availability': roadmapVideo('Zgy1miPsTNs', 'Fail-over and High-Availability (Explained by Example)', 'failover@PcFSE-h39-bLmrVcc1ae7.md', 'Отказоустойчивость и переключение при отказе на примере.'),
  'ne-wireless': roadmapVideo('hhks5xSpM-0', 'Wireless Networking Technology', 'wireless-networking@RCUgWXsit4Jcma9UNBd2c.md', 'Введение в беспроводные сетевые технологии как основа темы Wi-Fi.'),
  'ne-security-access': roadmapVideo('0gGhuYOh-54', 'What Are Access Lists? -- Access Control Lists (ACLs) -- Part 1 of 8', 'acls@MVuNY7zJkimjXMMeXbVTa.md', 'Назначение списков доступа ACL и основы фильтрации трафика.'),
  'ne-vpn': roadmapVideo('R-JUOpCgTZc', 'VPN (Virtual Private Network) Explained', 'vpn@b2HXcIkkjJB8WhHbrVesk.md', 'Назначение VPN и защищённого туннеля между участниками сети.'),
  'ne-linux-packet-analysis': roadmapVideo('n4muxtqLhN4', 'Wireshark Full Course | Wireshark Tutorial Beginner to Advance', 'wireshark@Ly43qxaO0RsKSy-_VuIBx.md', 'Работа с Wireshark для захвата и исследования сетевых пакетов.'),
  'ne-monitoring-telemetry': roadmapVideo('2IXP0TkwNJU', 'How SNMP Works - a quick guide', 'snmp@KqxGa5MoKuprDLF9OY988.md', 'SNMP как способ получения состояния и метрик сетевых устройств.'),
  'ne-cloud-sdn': roadmapVideo('2fPgKvDBfbs', 'Virtual Private Cloud (VPC) Explained', 'virtual-networks@-5_aMu3RtOBr0Vav9-Fyx.md', 'Виртуальная частная сеть VPC: вводная часть облачной сетевой инфраструктуры.'),
  'ne-automation': roadmapVideo('eiYemtNKS-M', 'Netmiko Tutorial', 'netmiko@_5MtpKVNmBZI7phdwzvIX.md', 'Знакомство с Netmiko для автоматизации CLI сетевых устройств по SSH.'),
  'ne-troubleshooting-change': roadmapVideo('1i3XdhC2ZAs', 'Steps for Network Troubleshooting', 'troubleshooting@vG_95IDrk5lOnCQub2XkD.md', 'Последовательность диагностики сетевой неисправности по наблюдаемым симптомам.'),
  'ne-capstone-career': roadmapVideo('wwwAXlE4OtU', 'DO NOT design your network like this!!', 'design-best-practices@yaxDHcIbupKmE51O8q3Q9.md', 'Разбор решений при проектировании сети для проверки архитектуры итогового проекта.'),
};
