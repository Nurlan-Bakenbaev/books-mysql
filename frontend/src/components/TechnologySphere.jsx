import { useEffect, useId, useRef, useState } from 'react';
import { gsap } from 'gsap';
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
  const paintRef = useRef(null);
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
    const easeReturn = gsap.parseEase('power2.inOut');
    let width = sphere.clientWidth;
    let visible = false;
    let firstFrame = true;
    gsap.set(nodesRef.current, { x: 0, y: 0, xPercent: -50, yPercent: -50, force3D: true });
    gsap.set(nodesRef.current.map(node => node.querySelector('button')), { scale: 1, force3D: false });
    const models = nodesRef.current.map(node => ({
      node,
      setX: gsap.quickSetter(node, 'x', 'px'),
      setY: gsap.quickSetter(node, 'y', 'px'),
      setScaleX: gsap.quickSetter(node.querySelector('button'), 'scaleX'),
      setScaleY: gsap.quickSetter(node.querySelector('button'), 'scaleY'),
      setOpacity: gsap.quickSetter(node.querySelector('button'), 'opacity'),
      position: null,
      scale: 1,
      opacity: 1,
      wasActive: false,
      returnFrom: null,
      returnTime: 0,
      zIndex: -1,
    }));

    // Only transforms and opacity change per frame; layout is measured on resize.
    const paint = (delta = 0, snap = false) => {
      const angle = angleRef.current;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const follow = snap ? 1 : 1 - Math.exp(-delta / .11);
      brands.forEach((point, index) => {
        const model = models[index];
        const selected = activeRef.current === index;
        const x = point.x * cos + point.z * sin;
        const z = point.z * cos - point.x * sin;
        const y = point.y * Math.cos(.22) - z * Math.sin(.22);
        const depth = (point.y * Math.sin(.22) + z * Math.cos(.22) + 1) / 2;
        const target = { x: x * .39, y: y * .39, depth };
        model.position ??= target;
        if (selected) {
          model.returnFrom = null;
          if (!model.wasActive) {
            model.node.style.setProperty('--tooltip-anchor', `${50 + model.position.x / .39 * 50}%`);
            model.node.dataset.side = model.position.y > 0 ? 'above' : 'below';
          }
        } else {
          if (model.wasActive) {
            model.returnFrom = model.position;
            model.returnTime = 0;
          }
          if (model.returnFrom && !snap) {
            // Rejoin the moving orbit over 900 ms instead of jumping to it.
            model.returnTime = Math.min(1, model.returnTime + delta / .9);
            const progress = easeReturn(model.returnTime);
            model.position = {
              x: model.returnFrom.x + (target.x - model.returnFrom.x) * progress,
              y: model.returnFrom.y + (target.y - model.returnFrom.y) * progress,
              depth: model.returnFrom.depth + (target.depth - model.returnFrom.depth) * progress,
            };
            if (model.returnTime === 1) model.returnFrom = null;
          } else {
            model.position = target;
            model.returnFrom = null;
          }
        }
        model.wasActive = selected;
        model.scale += ((selected ? 1.4 : .72 + model.position.depth * .34) - model.scale) * follow;
        model.opacity += ((selected ? 1 : .6 + model.position.depth * .4) - model.opacity) * follow;
        model.setX(model.position.x * width);
        model.setY(model.position.y * width);
        model.setScaleX(model.scale);
        model.setScaleY(model.scale);
        model.setOpacity(model.opacity.toFixed(4));
        const zIndex = Math.round(model.position.depth * 100);
        if (model.zIndex !== zIndex) {
          model.node.style.zIndex = String(zIndex);
          model.zIndex = zIndex;
        }
      });
    };
    const animate = (_time, deltaTime) => {
      const delta = firstFrame ? 0 : Math.min(deltaTime, 50) / 1000;
      firstFrame = false;
      angleRef.current += delta * Math.PI / 32;
      paint(delta);
    };
    const sync = () => {
      gsap.ticker.remove(animate);
      firstFrame = true;
      paint(0, motionPreference.matches);
      if (visible && !document.hidden && !motionPreference.matches) gsap.ticker.add(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(sphere);
    const resizeObserver = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      paint(0, motionPreference.matches);
    });
    resizeObserver.observe(sphere);
    document.addEventListener('visibilitychange', sync);
    motionPreference.addEventListener('change', sync);
    paintRef.current = () => paint(0, motionPreference.matches);
    paint(0, true);
    return () => {
      gsap.ticker.remove(animate);
      observer.disconnect();
      resizeObserver.disconnect();
      paintRef.current = null;
      document.removeEventListener('visibilitychange', sync);
      motionPreference.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => { paintRef.current?.(); }, [active]);

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
