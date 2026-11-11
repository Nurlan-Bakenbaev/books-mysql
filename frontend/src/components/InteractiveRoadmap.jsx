import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FiCheck, FiCopy, FiMaximize, FiMinus, FiPlus } from 'react-icons/fi';
import { sysadminRoadmapSource, sysadminRoadmapNodes, sysadminRoadmapLevels } from '../data/sysadminRoadmap.js';

export default function InteractiveRoadmap() {
  const section = useRef(null);
  const viewport = useRef(null);
  const diagram = useRef(null);
  const drag = useRef(null);
  const [active, setActive] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [size, setSize] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setActive(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect(); }
    }, { rootMargin: '200px' });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    let current = true;
    setError(false);
    import('../lib/renderRoadmap').then(({ renderRoadmap }) => renderRoadmap(sysadminRoadmapSource)).then(({ svg, bindFunctions }) => {
      if (!current || !diagram.current) return;
      // Only the fixed, repository-owned Mermaid source is rendered here.
      diagram.current.innerHTML = svg;
      bindFunctions?.(diagram.current);
      const element = diagram.current.querySelector('svg');
      const box = element.viewBox.baseVal;
      const dimensions = { width: box.width, height: box.height };
      element.style.maxWidth = 'none';
      element.style.width = '100%';
      element.style.height = 'auto';
      for (const link of element.querySelectorAll('a')) {
        link.setAttribute('data-route-link', '');
        link.setAttribute('target', '_self');
      }
      setSize(dimensions);
      const firstWidth = element.querySelector('.node')?.getBBox().width || dimensions.width;
      const targetWidth = window.matchMedia('(max-width: 680px)').matches ? firstWidth : dimensions.width;
      setZoom(Math.min(1, (viewport.current.clientWidth - 32) / targetWidth));
    }).catch(() => { if (current) setError(true); });
    return () => { current = false; };
  }, [active, attempt]);

  // Centre only after React has applied the initial diagram width and scale.
  useLayoutEffect(() => {
    if (!size || !viewport.current) return;
    const first = diagram.current?.querySelector('.node')?.getBoundingClientRect();
    if (first) {
      const view = viewport.current.getBoundingClientRect();
      viewport.current.scrollLeft += first.left + first.width / 2 - view.left - viewport.current.clientWidth / 2;
    }
    viewport.current.scrollTop = 0;
  }, [size]);

  function fit() {
    if (!size) return;
    setZoom(Math.min(1, (viewport.current.clientWidth - 32) / size.width, (viewport.current.clientHeight - 32) / size.height));
    viewport.current.scrollTo({ top: 0, left: 0 });
  }
  async function copy() {
    try { await navigator.clipboard.writeText(sysadminRoadmapSource); setCopyStatus('Код Mermaid скопирован'); }
    catch { setCopyStatus('Откройте «Код Mermaid» ниже и скопируйте текст вручную.'); }
  }
  function startDrag(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a')) return;
    drag.current = { x: event.clientX, y: event.clientY, left: viewport.current.scrollLeft, top: viewport.current.scrollTop };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event) {
    if (!drag.current) return;
    viewport.current.scrollLeft = drag.current.left + drag.current.x - event.clientX;
    viewport.current.scrollTop = drag.current.top + drag.current.y - event.clientY;
  }

  return <section ref={section} className="landing-roadmap interactive-roadmap" id="landing-map" aria-labelledby="landing-map-title">
    <div className="landing-section-heading"><span className="eyebrow">КАРТА · 2026</span><h2 id="landing-map-title">Как стать системным администратором</h2><p>С нуля до профессионала: путь на 2026 год. Фундамент → Linux или Windows → инфраструктура → автоматизация. Выбирайте узел, чтобы открыть урок или учебный маршрут.</p></div>
    <div className="roadmap-panel">
      <div className="roadmap-toolbar" role="group" aria-label="Управление картой">
        <div className="roadmap-zoom"><button className="button-icon" type="button" aria-label="Уменьшить карту" disabled={!size || zoom <= 0.1} onClick={() => setZoom((value) => Math.max(0.1, value / 1.25))}><FiMinus aria-hidden="true" /></button><output aria-label="Масштаб карты">{Math.round(zoom * 100)}%</output><button className="button-icon" type="button" aria-label="Увеличить карту" disabled={!size || zoom >= 2} onClick={() => setZoom((value) => Math.min(2, value * 1.25))}><FiPlus aria-hidden="true" /></button></div>
        <button className="button roadmap-fit" type="button" disabled={!size} onClick={fit}><FiMaximize aria-hidden="true" /> Показать целиком</button>
        <button className="button" type="button" onClick={copy}>{copyStatus === 'Код Mermaid скопирован' ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />} Копировать Mermaid</button>
      </div>
      <p className="roadmap-help" id="roadmap-help">Сдвигайте карту мышью или пальцем. Для клавиатуры — Tab и стрелки; все переходы также доступны в списке этапов ниже.</p>
      <div ref={viewport} className="roadmap-viewport" tabIndex="0" role="region" aria-label="Интерактивная дорожная карта системного администратора" aria-describedby="roadmap-help" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
        {!size && !error && <p className="roadmap-loading" role="status">{active ? 'Строим дорожную карту…' : 'Карта загружается при просмотре.'}</p>}
        {error && <div className="roadmap-loading" role="status"><p>Не удалось отобразить граф. Используйте список этапов или код Mermaid ниже.</p><button className="button" type="button" onClick={() => setAttempt((value) => value + 1)}>Повторить загрузку</button></div>}
        <div ref={diagram} className="roadmap-diagram" style={size ? { width: `${size.width * zoom}px` } : undefined} />
      </div>
      <p className="roadmap-copy-status" role="status">{copyStatus}</p>
    </div>
    <p className="roadmap-path-note">В ветке ОС достаточно начать с одной специализации. В облаке выберите одного провайдера. Рост от Junior к Middle или переход в DevOps опирается на практику и ответственность за работающие системы.</p>
    <details className="roadmap-alternative"><summary>Этапы списком</summary><div className="roadmap-level-list">{sysadminRoadmapLevels.map((level) => <div key={level.id}><h3>{level.title}</h3><ul>{sysadminRoadmapNodes.filter((node) => node.level === level.id).map((node) => <li key={node.id}><a href={node.href} data-route-link>{node.title}</a><p>{node.description}</p></li>)}</ul></div>)}</div></details>
    <details className="roadmap-source"><summary>Код Mermaid</summary><pre tabIndex="0" aria-label="Код карты Mermaid"><code>{sysadminRoadmapSource}</code></pre></details>
  </section>;
}
