import { useEffect, useId, useRef, useState } from 'react';
import { SiLinux, SiUbuntu, SiDebian, SiRedhat, SiDocker, SiKubernetes, SiAnsible, SiGit, SiPython, SiPrometheus, SiGrafana, SiCisco, SiIbm, SiVmware, SiTerraform, SiNginx, SiApache, SiPostgresql, SiMysql, SiOpenstack, SiWireshark } from 'react-icons/si';
import { FaWindows } from 'react-icons/fa';
import { VscTerminalPowershell, VscAzure } from 'react-icons/vsc';

const brands = [
  ['Windows', FaWindows, '#32a9f4', 'Операционная система для рабочих станций, серверов и корпоративной инфраструктуры.'],
  ['IBM', SiIbm, '#5498ff', 'Серверы, корпоративные системы и технологии для обработки данных.'],
  ['Cisco', SiCisco, '#33c5e9', 'Сетевое оборудование: коммутация, маршрутизация и защита соединений.'],
  ['Linux', SiLinux, '#f5ca45', 'Открытая операционная система — основа серверов, облаков и автоматизации.'],
  ['Ubuntu', SiUbuntu, '#f47441', 'Дистрибутив Linux для рабочих станций, серверов и облачной инфраструктуры.'],
  ['Debian', SiDebian, '#ef5285', 'Стабильный дистрибутив Linux с открытой системой управления пакетами.'],
  ['Red Hat', SiRedhat, '#f34b50', 'Корпоративный Linux, поддержка серверов и инструменты автоматизации.'],
  ['Docker', SiDocker, '#36a9ff', 'Упаковывает приложения и зависимости в переносимые контейнеры.'],
  ['Kubernetes', SiKubernetes, '#588dff', 'Управляет запуском, масштабированием и восстановлением контейнеров.'],
  ['Ansible', SiAnsible, '#ef5963', 'Автоматизирует настройку серверов и развёртывание приложений с помощью playbook.'],
  ['Git', SiGit, '#f87357', 'Хранит историю изменений кода и помогает работать над проектом вместе.'],
  ['Python', SiPython, '#f6cc4b', 'Язык для скриптов, автоматизации, работы с данными и разработки сервисов.'],
  ['PowerShell', VscTerminalPowershell, '#5baaff', 'Оболочка и язык сценариев для управления системами и автоматизации задач.'],
  ['Prometheus', SiPrometheus, '#f27b57', 'Собирает метрики сервисов и помогает обнаруживать проблемы через оповещения.'],
  ['Grafana', SiGrafana, '#ffab42', 'Превращает метрики и журналы в наглядные панели мониторинга.'],
  ['VMware', SiVmware, '#55d0b2', 'Виртуализация: несколько изолированных систем на одном физическом сервере.'],
  ['Terraform', SiTerraform, '#a78bfa', 'Описывает инфраструктуру кодом и управляет её изменениями.'],
  ['Nginx', SiNginx, '#40cb83', 'Веб-сервер, обратный прокси и балансировщик нагрузки для приложений.'],
  ['Apache', SiApache, '#f46a9d', 'Веб-сервер для публикации сайтов и настройки обработки HTTP-запросов.'],
  ['PostgreSQL', SiPostgresql, '#6caee0', 'Реляционная база данных с SQL, транзакциями и расширяемыми типами данных.'],
  ['MySQL', SiMysql, '#3cbcd4', 'Реляционная база данных для хранения и обработки данных приложений.'],
  ['OpenStack', SiOpenstack, '#f26170', 'Платформа для построения частного облака: вычисления, сети и хранилища.'],
  ['Wireshark', SiWireshark, '#57a9ff', 'Анализирует сетевые пакеты и помогает разбираться в работе протоколов.'],
  ['Azure', VscAzure, '#36b8f4', 'Облачная платформа Microsoft для виртуальных машин, сетей и управляемых сервисов.'],
].map(([name, Icon, color, description], index, items) => {
  const y = 1 - 2 * (index + .5) / items.length;
  const angle = index * Math.PI * (3 - Math.sqrt(5));
  const radius = Math.sqrt(1 - y * y);
  return { name, Icon, color, description, x: radius * Math.cos(angle), y, z: radius * Math.sin(angle) };
});

export default function TechnologySphere() {
  const sphereRef = useRef(null);
  const nodesRef = useRef([]);
  const activeRef = useRef(null);
  const angleRef = useRef(.35);
  const hoveredRef = useRef(null);
  const focusedRef = useRef(null);
  const [active, setActive] = useState(null);
  const tooltipId = useId();

  const activate = (index) => {
    activeRef.current = index;
    setActive(index);
  };

  useEffect(() => {
    const sphere = sphereRef.current;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let frame;
    let lastTime;

    // Project points onto a flat plane: logos never turn sideways or mirror.
    const paint = () => {
      const angle = angleRef.current;
      brands.forEach((point, index) => {
        const node = nodesRef.current[index];
        if (!node || activeRef.current === index) return;
        const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
        const z = point.z * Math.cos(angle) - point.x * Math.sin(angle);
        const y = point.y * Math.cos(.22) - z * Math.sin(.22);
        const depth = (point.y * Math.sin(.22) + z * Math.cos(.22) + 1) / 2;
        node.style.left = `${50 + x * 39}%`;
        node.style.top = `${50 + y * 39}%`;
        node.style.setProperty('--depth-scale', (.72 + depth * .34).toFixed(3));
        node.style.setProperty('--depth-opacity', (.6 + depth * .4).toFixed(3));
        node.style.setProperty('--tooltip-anchor', `${50 + x * 50}%`);
        node.style.zIndex = String(Math.round(depth * 100));
        node.dataset.side = y > 0 ? 'above' : 'below';
      });
    };
    const animate = (time) => {
      if (lastTime !== undefined) angleRef.current += Math.min(time - lastTime, 64) * Math.PI / 24000;
      lastTime = time;
      paint();
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      lastTime = undefined;
      paint();
      if (visible && !document.hidden && !motionPreference.matches) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(sphere);
    document.addEventListener('visibilitychange', sync);
    motionPreference.addEventListener('change', sync);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motionPreference.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    const dismiss = (event) => {
      if (event.type !== 'keydown' && sphereRef.current.contains(event.target) && event.target.closest('.sphere-node')) return;
      if (event.type === 'keydown' && event.key !== 'Escape') return;
      hoveredRef.current = focusedRef.current = null;
      activeRef.current = null;
      setActive(null);
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', dismiss);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', dismiss);
    };
  }, []);

  return <div className="technology-sphere" ref={sphereRef}>
    <div className="sphere-rotation" role="group" aria-label="Технологии курса">
      {brands.map(({ name, Icon, color, description }, index) => <div
        className={`sphere-node${active === index ? ' is-active' : ''}`}
        style={{ '--brand-color': color }}
        ref={(node) => { nodesRef.current[index] = node; }}
        key={name}
        onPointerEnter={(event) => {
          if (event.pointerType === 'touch') return;
          hoveredRef.current = index;
          activate(index);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'touch') return;
          hoveredRef.current = null;
          activate(focusedRef.current);
        }}
      >
        <button type="button" className="sphere-icon" aria-label={name}
          aria-describedby={active === index ? tooltipId : undefined}
          onFocus={() => { focusedRef.current = index; activate(index); }}
          onBlur={() => { focusedRef.current = null; activate(hoveredRef.current); }}
          onClick={() => activate(index)}
        ><Icon aria-hidden="true" /></button>
        {active === index && <div className="sphere-tooltip" role="tooltip" id={tooltipId}>
          <strong>{name}</strong><p>{description}</p>
        </div>}
      </div>)}
    </div>
    <p className="sphere-hint">Наведите на иконку или коснитесь её</p>
  </div>;
}
