import { useState } from 'react';
import { FiArrowRight, FiExternalLink, FiPlay, FiTerminal } from 'react-icons/fi';
import { calculateSubnet } from '../data/subnet';
import { executeVirtualCommand } from '../data/virtualShell';

const services = [
  { id: 'https', label: 'HTTPS', protocol: 'TCP', port: 443 },
  { id: 'ssh', label: 'SSH', protocol: 'TCP', port: 22 },
  { id: 'dns', label: 'DNS', protocol: 'UDP', port: 53 },
];

function SubnetSimulator() {
  const [address, setAddress] = useState('192.0.2.130');
  const [prefix, setPrefix] = useState('26');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  function calculate(event) {
    event.preventDefault();
    try {
      setResult(calculateSubnet(address, prefix));
      setError('');
    } catch (problem) {
      setResult(null);
      setError(problem.message);
    }
  }
  return <article className="simulator-card" aria-labelledby="subnet-simulator-heading"><span className="eyebrow">01 / СЕТЬ</span><h3 id="subnet-simulator-heading">Калькулятор IPv4 и CIDR</h3><p>Введите адрес и префикс, затем сравните результат с ручным расчётом. Вычисление выполняется только в браузере.</p>
    <form className="simulator-form" onSubmit={calculate}><label>IPv4-адрес<input value={address} onChange={(event) => setAddress(event.target.value)} aria-invalid={Boolean(error)} spellCheck="false" /></label><label>Префикс<input value={prefix} onChange={(event) => setPrefix(event.target.value)} inputMode="numeric" aria-invalid={Boolean(error)} /></label><button className="button button-primary" type="submit">Рассчитать</button></form>
    {error && <p className="simulator-error" role="alert">{error}</p>}
    {result && <div className="simulation-result" role="status"><dl><div><dt>Сеть</dt><dd>{result.network}</dd></div><div><dt>Маска</dt><dd>{result.mask}</dd></div><div><dt>Последний адрес диапазона</dt><dd>{result.broadcast}</dd></div><div><dt>Адреса узлов</dt><dd>{result.firstHost} — {result.lastHost}</dd></div><div><dt>Количество адресов узлов</dt><dd>{result.usableHosts.toLocaleString('ru-RU')}</dd></div></dl><p>{result.prefix === 31 ? 'Для /31 оба адреса могут использоваться на соединении точка-точка (RFC 3021).' : result.prefix === 32 ? '/32 обозначает один адрес узла.' : 'Для обычной подсети первый адрес — сеть, последний — широковещательный адрес IPv4.'}</p></div>}
  </article>;
}

function NetworkSimulator() {
  const [selected, setSelected] = useState('https');
  const [allowed, setAllowed] = useState(['https']);
  const [result, setResult] = useState(null);
  function toggleRule(id) {
    setAllowed((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
    setResult(null);
  }
  function simulate(event) {
    event.preventDefault();
    const service = services.find((item) => item.id === selected);
    setResult({ service, permitted: allowed.includes(selected) });
  }
  return <article className="simulator-card" aria-labelledby="network-simulator-heading"><span className="eyebrow">02 / СЕТЕВОЙ ПУТЬ</span><h3 id="network-simulator-heading">Учебный симулятор правил</h3><p>Это упрощённая модель маршрута и одного набора правил, а не Cisco Packet Tracer. Настоящие пакеты не отправляются, настройки компьютера не меняются.</p>
    <div className="simulator-path" aria-label="Учебный путь пакета"><span>Клиент<br /><small>192.0.2.10 / VLAN 10</small></span><FiArrowRight aria-hidden="true" /><span>Маршрутизатор</span><FiArrowRight aria-hidden="true" /><span>Firewall</span><FiArrowRight aria-hidden="true" /><span>Сервер<br /><small>198.51.100.20 / VLAN 20</small></span></div>
    <form onSubmit={simulate}><fieldset className="simulator-rules"><legend>Разрешённые сервисы в учебном правиле</legend>{services.map((service) => <label key={service.id}><input type="checkbox" checked={allowed.includes(service.id)} onChange={() => toggleRule(service.id)} /> {service.label} / {service.protocol} {service.port}</label>)}</fieldset><div className="simulator-form"><label>Проверить поток<select value={selected} onChange={(event) => { setSelected(event.target.value); setResult(null); }}>{services.map((service) => <option value={service.id} key={service.id}>{service.label} / {service.protocol} {service.port}</option>)}</select></label><button className="button button-primary" type="submit"><FiPlay aria-hidden="true" /> Проверить маршрут</button></div></form>
    {result && <div className="simulation-result" role="status"><strong>{result.permitted ? 'В модели поток разрешён' : 'В модели поток заблокирован'}</strong><ol><li>Клиент отправляет {result.service.protocol} на порт {result.service.port} учебного сервера.</li><li>Для примера предполагается, что маршрут между двумя сетями существует.</li><li>Правило {result.permitted ? 'содержит' : 'не содержит'} выбранный сервис; результат — {result.permitted ? 'разрешение' : 'отказ'}.</li></ol><p>Реальные устройства дополнительно учитывают адреса, порядок правил, состояние соединения и другие параметры.</p></div>}
  </article>;
}

function ShellSimulator() {
  const [cwd, setCwd] = useState('/home/student');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  function run(event) {
    event.preventDefault();
    const command = input.trim();
    if (!command) return;
    const outcome = executeVirtualCommand(command, cwd);
    setCwd(outcome.cwd);
    setHistory((current) => outcome.clear ? [] : [...current.slice(-29), { command, output: outcome.output }]);
    setInput('');
  }
  return <article className="simulator-card" aria-labelledby="shell-simulator-heading"><span className="eyebrow">03 / КОМАНДЫ</span><h3 id="shell-simulator-heading">Учебный терминал Linux</h3><p>Симулятор содержит только вымышленные файлы и ограниченный набор команд. Он не выполняет код операционной системы и не подключается к сети.</p><p>Задание: введите <code>pwd</code>, <code>ls</code>, <code>cat notes.txt</code>, затем <code>cd logs</code> и <code>cat practice.log</code>.</p>
    <div className="virtual-terminal"><div className="virtual-terminal-title"><FiTerminal aria-hidden="true" /> student@training:{cwd}</div><div className="virtual-terminal-output" aria-live="polite"><p>Введите help для списка поддерживаемых команд.</p>{history.map((item, index) => <div key={`${index}-${item.command}`}><div>$ {item.command}</div>{item.output && <pre>{item.output}</pre>}</div>)}</div><form onSubmit={run}><label className="sr-only" htmlFor="virtual-command">Учебная команда</label><span aria-hidden="true">$</span><input id="virtual-command" value={input} onChange={(event) => setInput(event.target.value)} autoComplete="off" maxLength={100} placeholder="help" /><button type="submit" disabled={!input.trim()}>Выполнить</button></form></div>
  </article>;
}

export default function Simulators() {
  return <section className="section simulators" id="simulators" aria-labelledby="simulators-heading"><div className="section-heading"><div><span className="eyebrow">ПРАКТИКА БЕЗ УСТАНОВКИ</span><h2 id="simulators-heading">Интерактивные тренажёры</h2><p>Проверьте расчёт сети, модель правила и базовые команды в безопасной учебной среде.</p></div></div>
    <div className="simulator-grid"><SubnetSimulator /><NetworkSimulator /><ShellSimulator /></div>
    <details className="packet-tracer-guide"><summary>Cisco Packet Tracer: как получить и выполнить первую лабораторию</summary><div><p>Packet Tracer — отдельный продукт Cisco, а не часть этого сайта. Скачивайте программу только у правообладателя и соблюдайте актуальные условия. Доступность платформ, регистрация и интерфейс портала могут измениться.</p><ol className="lesson-steps"><li>Откройте <a href="https://www.netacad.com/courses/packet-tracer" target="_blank" rel="noreferrer">страницу Cisco Networking Academy <FiExternalLink aria-hidden="true" /></a>. Создайте учётную запись или войдите; если Cisco попросит, запишитесь на вводный курс и примите условия.</li><li>Найдите в своём профиле или учебном портале раздел загрузок Packet Tracer, проверьте требования и выберите установщик для поддерживаемой системы. Не скачивайте программу с посторонних сайтов.</li><li>Установите программу по инструкциям Cisco, запустите её и при необходимости войдите в учебную учётную запись. Названия пунктов могут отличаться в вашей версии.</li><li>В новой схеме разместите два PC и коммутатор. Соедините каждый PC с отдельным портом коммутатора кабелем Copper Straight-Through.</li><li>В настройках IP двух учебных PC задайте 192.0.2.10 и 192.0.2.20 с маской 255.255.255.0. Шлюз для этой локальной схемы не нужен.</li><li>На первом PC откройте учебную командную строку и выполните <code>ping 192.0.2.20</code>. Проверьте адреса, порты и состояние соединения, если ответа нет; затем сохраните собственный проект.</li></ol><p>Сайт Cisco может быть недоступен в отдельных сетях; в таком случае найдите Packet Tracer непосредственно через официальный сайт Cisco Networking Academy.</p></div></details>
  </section>;
}
