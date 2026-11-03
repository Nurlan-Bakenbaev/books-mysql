import { useEffect, useMemo, useState } from 'react';
import { FiArrowRight, FiAward, FiCheckCircle, FiExternalLink, FiTarget } from 'react-icons/fi';
import './LearningPath.css';

const TRACKS = [
  { id: 'it', name: '01 · IT & Networking', duration: '4–6 недель', focus: 'TCP/IP, IPv4/IPv6, CIDR, VLAN, DNS, DHCP, routing, firewall, Wireshark', tasks: ['Объяснить DNS → TCP/TLS → HTTP и модель OSI', 'Рассчитать подсети /24, /26 и /28', 'Настроить две VLAN и правила доступа', 'Диагностировать DNS, ping, traceroute и Wireshark'], resources: [{name:'Microsoft Learn · Networking',url:'https://learn.microsoft.com/en-us/training/browse/?terms=networking'}] },
  { id: 'windows', name: '02 · Windows & Windows Server', duration: '6–9 недель', focus: 'Windows 11, Windows Server 2022/2025, AD DS, DNS, DHCP, GPO, NTFS, SMB, Kerberos, Windows LAPS', tasks: ['Установить Windows Server и клиент в изолированных VM', 'Создать домен, OU, группы и пользователей в AD DS', 'Настроить DNS/DHCP, GPO и SMB/NTFS права', 'Проверить gpresult, репликацию AD и восстановление'], resources: [{name:'Windows Server · Microsoft Learn',url:'https://learn.microsoft.com/en-us/windows-server/'}] },
  { id: 'linux', name: '03 · Linux Administration', duration: '4–6 недель', focus: 'Ubuntu/RHEL, CLI, systemd, SSH, sudo, пользователей, права, system logs, cron, Bash', tasks: ['Развернуть Linux VM и настроить SSH-ключи', 'Настроить пользователей, sudo и файловые права', 'Диагностировать systemd и journald', 'Написать Bash-сценарий резервного копирования'], resources: [{name:'Linux Foundation · Training',url:'https://training.linuxfoundation.org/'}] },
  { id: 'virtual', name: '04 · Virtualization, Storage & Recovery', duration: '3–5 недель', focus: 'Hyper-V, VMware, virtual switches, RAID, NAS, SAN, snapshots, backup, RPO/RTO, тест восстановления', tasks: ['Настроить виртуальную сеть и 3 VM', 'Объяснить RAID ≠ backup и снапшот ≠ backup', 'Сделать резервную копию VM и восстановить её', 'Составить план RPO/RTO и проверить восстановление'], resources: [{name:'Microsoft Learn · Hyper-V',url:'https://learn.microsoft.com/en-us/windows-server/virtualization/hyper-v/'}] },
  { id: 'cloud', name: '05 · Microsoft 365, Entra & Azure', duration: '6–9 недель', focus: 'Entra ID, Microsoft 365, Intune, MFA, Conditional Access, Azure VMs, VNet, RBAC, monitoring, hybrid identity', tasks: ['Создать пользователей и группы в тестовом Entra tenant', 'Настроить MFA и безопасные тестовые политики', 'Создать Azure VM, VNet и RBAC', 'Изучить Intune device compliance и обновления'], resources: [{name:'Microsoft Learn · Azure Administrator',url:'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/'}] },
  { id: 'automation', name: '06 · PowerShell & Automation', duration: '4–6 недель', focus: 'PowerShell pipeline, objects, remoting, CSV, ErrorAction, WhatIf, Git, Bash, Infrastructure as Code', tasks: ['Написать PowerShell-скрипт инвентаризации', 'Автоматизировать создание тестовых пользователей из CSV', 'Добавить error handling и -WhatIf', 'Сохранить инфраструктурный код в Git'], resources: [{name:'Microsoft Learn · PowerShell',url:'https://learn.microsoft.com/en-us/powershell/'}] },
  { id: 'security', name: '07 · Cybersecurity Foundations', duration: '6–8 недель', focus: 'Zero Trust, least privilege, IAM, MFA, PKI, TLS, hardening, patching, vulnerability management, Defender', tasks: ['Настроить Windows Firewall и безопасные политики', 'Сделать аудит привилегий и включить MFA', 'Провести разрешённую оценку конфигурации тестовой VM', 'Создать план patch management и remediation'], resources: [{name:'Microsoft Security Learn',url:'https://learn.microsoft.com/en-us/training/browse/?products=defender'}] },
  { id: 'soc', name: '08 · Security Operations & Incident Response', duration: '5–8 недель', focus: 'Sysmon, Windows Event Logs, SIEM, Microsoft Sentinel, KQL, MITRE ATT&CK, IR, detection engineering', tasks: ['Собрать события Windows и Sysmon в тестовой среде', 'Написать простые KQL-запросы к логам', 'Исследовать безопасную учебную симуляцию инцидента', 'Подготовить incident report: timeline, impact, remediation'], resources: [{name:'Microsoft Learn · Security Operations',url:'https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/'}] },
];
const CERTS = [
  {name:'AZ-900',level:'Старт · по желанию',what:'Основы Azure и облачных сервисов',url:'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/'},
  {name:'SC-900',level:'Старт · по желанию',what:'Основы Microsoft Security, Compliance & Identity',url:'https://learn.microsoft.com/en-us/credentials/certifications/security-compliance-and-identity-fundamentals/'},
  {name:'MD-102',level:'Администрирование endpoints',what:'Windows-клиенты, Intune, устройства и приложения',url:'https://learn.microsoft.com/en-us/credentials/certifications/modern-desktop/'},
  {name:'AZ-802',level:'Windows Server · основной',what:'Действующий экзамен для Windows Server Administrator Associate; проверьте требования на Microsoft Learn',url:'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-802/'},
  {name:'AZ-104',level:'Azure Administrator',what:'Azure: сети, storage, compute, identity и governance',url:'https://learn.microsoft.com/en-us/credentials/certifications/azure-administrator/'},
  {name:'SC-300',level:'Identity Security',what:'Microsoft Entra ID, IAM, Conditional Access, identity governance',url:'https://learn.microsoft.com/en-us/credentials/certifications/identity-and-access-administrator/'},
  {name:'SC-200',level:'SecOps',what:'Microsoft Defender, Sentinel, detection и incident response',url:'https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/'},
];

const KEY = 'sysadmin-learning-checklist-2026';
function getSaved() {
  try { const saved = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(saved) ? saved.filter(x => typeof x === 'string') : []; }
  catch { return []; }
}

export default function LearningPath({ phases, completed }) {
  const [checked, setChecked] = useState(getSaved);
  const [selected, setSelected] = useState('it');
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(checked)); } catch { /* Optional browser storage. */ } }, [checked]);
  const counts = useMemo(() => TRACKS.map(track => {
    const done = track.tasks.filter((_, i) => checked.includes(track.id + ':' + i)).length;
    return {...track, done, total: track.tasks.length, pct: Math.round(done / track.tasks.length * 100)};
  }), [checked]);
  const total = counts.reduce((a,c) => a+c.total,0);
  const done = counts.reduce((a,c) => a+c.done,0);
  const active = counts.find(t => t.id === selected) || counts[0];
  const currentTopics = phases.reduce((sum, p) => sum + p.topics.filter(t => completed.includes(t.id)).length,0);
  const allTopics = phases.reduce((sum, p) => sum + p.topics.length,0);
  const toggle = id => setChecked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev,id]);

  return <section className="learning-path section" id="career-path" aria-labelledby="career-heading">
    <div className="section-heading"><div><span className="eyebrow">ПРОФЕССИОНАЛЬНЫЙ МАРШРУТ · 2026</span><h2 id="career-heading">Твой путь: System Administrator → Cybersecurity</h2><p>Учебный план от сетей и Windows Server до облака, автоматизации и операций безопасности. Открывай этапы по порядку, выполняй практику и отмечай только проверенные навыки.</p></div></div>
    <div className="learning-summary">
      <div><span>Практические навыки</span><strong>{done} / {total}</strong><div className="learning-meter" role="progressbar" aria-label="Прогресс практических навыков" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(done / total * 100)}><span style={{width: (done / total * 100) + '%'}} /></div><small>{Math.round(done / total * 100)}% выполнено</small></div>
      <div><span>Текущие уроки</span><strong>{currentTopics} / {allTopics}</strong><div className="learning-meter" role="progressbar" aria-label="Прогресс уроков" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(currentTopics / Math.max(1,allTopics) * 100)}><span style={{width:(currentTopics / Math.max(1,allTopics) * 100) + '%'}} /></div><small>Синхронизировано с дорожной картой выше</small></div>
    </div>
    <h3 className="learning-subhead"><FiTarget aria-hidden="true" /> Карта компетенций</h3>
    <div className="learning-bars" aria-label="Диаграмма прогресса по направлениям">{counts.map(track => <button type="button" key={track.id} onClick={() => setSelected(track.id)} className={'learning-bar-row' + (selected === track.id ? ' selected':'')} aria-pressed={selected === track.id}><span className="learning-bar-title">{track.name}</span><span className="learning-bar-line"><span style={{width:track.pct+'%'}} /></span><span className="learning-bar-value">{track.pct}%</span></button>)}</div>
    <div className="learning-detail">
      <div className="learning-detail-top"><div><span className="eyebrow">ВЫБРАННЫЙ ЭТАП · {active.duration}</span><h3>{active.name}</h3><p><strong>Что изучать:</strong> {active.focus}</p></div><span className="learning-percent">{active.pct}%</span></div>
      <h4>Практические результаты — отмечай после выполнения</h4>
      <div className="learning-checklist">{active.tasks.map((task,i) => {const id=active.id+':'+i;return <label key={id} className={'learning-task' + (checked.includes(id)?' done':'')}><input type="checkbox" checked={checked.includes(id)} onChange={() => toggle(id)} /><span>{task}</span><FiCheckCircle aria-hidden="true" /></label>})}</div>
      <div className="learning-resources">{active.resources.map(resource=><a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer">{resource.name} <FiExternalLink aria-hidden="true" /></a>)}</div>
    </div>
    <h3 className="learning-subhead"><FiAward aria-hidden="true" /> Сертификационный маршрут Microsoft</h3>
    <p className="learning-explainer">Сертификаты не являются обязательными этапами единой лестницы. AZ-900 и SC-900 подходят для знакомства, затем выбирай специализацию: Windows Server (AZ-802), endpoints (MD-102), Azure (AZ-104), identity (SC-300) или SecOps (SC-200). Подготовка к экзамену не заменяет лабораторную практику.</p>
    <div className="learning-cert-grid">{CERTS.map(cert => <a key={cert.name} className="learning-cert" href={cert.url} target="_blank" rel="noopener noreferrer"><span>{cert.level}</span><strong>{cert.name}</strong><p>{cert.what}</p><span className="learning-cert-link">Официальная страница <FiArrowRight aria-hidden="true" /></span></a>)}</div>
    <p className="learning-disclaimer">Сроки ориентировочные и зависят от опыта. Прогресс хранится локально в этом браузере, не синхронизируется между устройствами и отражает отмеченные действия, а не уровень профессиональной сертификации. Перед записью на экзамен проверь действующие требования Microsoft.</p>
  </section>;
}
