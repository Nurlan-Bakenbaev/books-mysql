import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FiArrowRight, FiCheck, FiCheckCircle, FiCopy, FiLayers, FiMaximize, FiMinus, FiPlus } from 'react-icons/fi';
import { sysadminRoadmapSource, sysadminRoadmapNodes, sysadminRoadmapLevels, sysadminRoadmapStageSources } from '../data/sysadminRoadmap.js';
import './InteractiveRoadmap.css';

const stepCount = (count) => `${count} ${count % 10 === 1 && count % 100 !== 11 ? 'шаг' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'шага' : 'шагов'}`;

export default function InteractiveRoadmap() {
  const viewport = useRef(null);
  const diagram = useRef(null);
  const drag = useRef(null);
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [mode, setMode] = useState('all');
  const [attempt, setAttempt] = useState(0);
  const [size, setSize] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const level = sysadminRoadmapLevels[selectedLevel];
  const selectedNodes = sysadminRoadmapNodes.filter((node) => node.level === selectedLevel);
  const source = mode === 'all' ? sysadminRoadmapSource : sysadminRoadmapStageSources[selectedLevel];

  useEffect(() => {
    let current = true;
    setError(false);
    setSize(null);
    diagram.current.innerHTML = '';
    import('../lib/renderRoadmap').then(({ renderRoadmap }) => renderRoadmap(source)).then(({ svg, bindFunctions }) => {
      if (!current || !diagram.current) return;
      // Only fixed, repository-owned Mermaid sources are rendered here.
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
      setZoom(mode === 'all'
        ? Math.min(1, (viewport.current.clientWidth - 40) / dimensions.width, (viewport.current.clientHeight - 40) / dimensions.height)
        : Math.min(1, (viewport.current.clientWidth - 40) / targetWidth));
    }).catch(() => { if (current) setError(true); });
    return () => { current = false; };
  }, [source, attempt, mode]);

  useLayoutEffect(() => {
    if (!size || !viewport.current) return;
    if (mode === 'all') {
      const fitWhole = () => setZoom(Math.min(1, (viewport.current.clientWidth - 40) / size.width, (viewport.current.clientHeight - 40) / size.height));
      fitWhole();
      viewport.current.scrollTo({ top: 0, left: 0 });
      if (!('ResizeObserver' in window)) return undefined;
      const observer = new ResizeObserver(fitWhole);
      observer.observe(viewport.current);
      return () => observer.disconnect();
    }
    const first = diagram.current?.querySelector('.node')?.getBoundingClientRect();
    if (first) {
      const view = viewport.current.getBoundingClientRect();
      viewport.current.scrollLeft += first.left + first.width / 2 - view.left - viewport.current.clientWidth / 2;
    }
    viewport.current.scrollTop = 0;
    return undefined;
  }, [size, mode]);

  function chooseLevel(id) {
    setSelectedLevel(id);
    setMode('level');
  }
  function fit() {
    if (!size) return;
    setZoom(Math.min(1, (viewport.current.clientWidth - 40) / size.width, (viewport.current.clientHeight - 40) / size.height));
    viewport.current.scrollTo({ top: 0, left: 0 });
  }
  async function copy() {
    try { await navigator.clipboard.writeText(sysadminRoadmapSource); setCopyStatus('Код Mermaid скопирован'); }
    catch { setCopyStatus('Откройте «Код Mermaid» ниже и скопируйте текст вручную.'); }
  }
  function startDrag(event) {
    if (mode === 'all' || event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a')) return;
    drag.current = { x: event.clientX, y: event.clientY, left: viewport.current.scrollLeft, top: viewport.current.scrollTop };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event) {
    if (!drag.current) return;
    viewport.current.scrollLeft = drag.current.left + drag.current.x - event.clientX;
    viewport.current.scrollTop = drag.current.top + drag.current.y - event.clientY;
  }

  return <section className={`interactive-roadmap career-map${mode === 'all' ? ' is-overview' : ''}`} id="career-map" aria-labelledby="career-map-title">
    <header className="career-map-heading"><span className="eyebrow">КАРТА · 2026</span><h1 id="career-map-title">Как стать системным администратором</h1><p>От первых основ до самостоятельной работы. Выбирайте уровень, изучайте его шаги и переходите к практике.</p><div className="career-map-facts"><span><FiLayers aria-hidden="true" /> 5 уровней</span><span>{sysadminRoadmapNodes.length} связанных шага</span><span>Linux · Windows · инфраструктура</span></div></header>



    <div className="roadmap-view-heading"><div><span className="eyebrow">{mode === 'all' ? 'ОБЩИЙ МАРШРУТ' : `УРОВЕНЬ ${level.id}`}</span><h2 id="roadmap-current-title">{mode === 'all' ? 'Полный маршрут · 23 шага' : level.title}</h2><p>{mode === 'all' ? 'Первые три уровня — сверху, затем автоматизация и профессиональный рост.' : level.description}</p></div><button type="button" className="button roadmap-all-toggle" aria-pressed={mode === 'all'} onClick={() => setMode(mode === 'all' ? 'level' : 'all')}><FiLayers aria-hidden="true" /> {mode === 'all' ? 'Вернуться к уровню' : 'Полная карта'}</button></div>

    <div className="roadmap-panel" data-mode={mode} data-level={selectedLevel}>
      <div className="roadmap-toolbar" role="group" aria-label="Управление картой">
        {mode === 'level' && <div className="roadmap-zoom"><button className="button-icon" type="button" aria-label="Уменьшить карту" disabled={!size || zoom <= 0.1} onClick={() => setZoom((value) => Math.max(0.1, value / 1.25))}><FiMinus aria-hidden="true" /></button><output aria-label="Масштаб карты">{Math.round(zoom * 100)}%</output><button className="button-icon" type="button" aria-label="Увеличить карту" disabled={!size || zoom >= 2} onClick={() => setZoom((value) => Math.min(2, value * 1.25))}><FiPlus aria-hidden="true" /></button></div>}
        <button className="button roadmap-fit" type="button" disabled={!size} onClick={fit}><FiMaximize aria-hidden="true" /> Показать целиком</button>
        <button className="button roadmap-copy" type="button" onClick={copy}>{copyStatus === 'Код Mermaid скопирован' ? <FiCheck aria-hidden="true" /> : <FiCopy aria-hidden="true" />} Копировать Mermaid</button>
      </div>
      <div ref={viewport} className="roadmap-viewport" style={mode === 'level' && size ? { height: `${Math.min(560, size.height * zoom + 40)}px` } : undefined} tabIndex="0" role="region" aria-label="Интерактивная дорожная карта системного администратора" aria-describedby="roadmap-help" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
        {!size && !error && <p className="roadmap-loading" role="status">Строим дорожную карту…</p>}
        {error && <div className="roadmap-loading" role="status"><p>Не удалось отобразить граф. Используйте шаги ниже или код Mermaid.</p><button className="button" type="button" onClick={() => setAttempt((value) => value + 1)}>Повторить загрузку</button></div>}
        <div ref={diagram} className="roadmap-diagram" style={size ? { width: `${size.width * zoom}px` } : undefined} />
      </div>
      <div className="roadmap-panel-footer"><p id="roadmap-help">{mode === 'all' ? 'Полный маршрут помещается в кадре. Нажмите узел для перехода. Уровни для подробного просмотра — ниже.' : 'Нажмите узел, чтобы открыть урок. Карту можно сдвигать мышью, пальцем или стрелками после Tab.'}</p><p className="roadmap-copy-status" role="status">{copyStatus}</p></div>
    </div>

    <nav className="roadmap-stage-navigation" aria-label="Уровни дорожной карты"><ol>{sysadminRoadmapLevels.map((item) => <li key={item.id} data-tone={item.tone}><button type="button" aria-pressed={mode === 'level' && selectedLevel === item.id} onClick={() => chooseLevel(item.id)}><span className="roadmap-stage-number">{String(item.id).padStart(2, '0')}</span><strong>{item.shortTitle}</strong><span className="roadmap-stage-count">{stepCount(sysadminRoadmapNodes.filter((node) => node.level === item.id).length)}</span><FiArrowRight aria-hidden="true" /></button></li>)}</ol></nav>

    {mode === 'level' && <section className="roadmap-stage-details" aria-labelledby="roadmap-steps-title"><div className="roadmap-outcome"><FiCheckCircle aria-hidden="true" /><p><strong>Результат уровня</strong>{level.outcome}</p></div><h3 id="roadmap-steps-title">Шаги этого уровня</h3><ol className="roadmap-step-cards">{selectedNodes.map((node, index) => <li key={node.id}><a href={node.href} data-route-link><span className="roadmap-step-order">{index + 1}</span><div><strong>{node.title}</strong><p>{node.description}</p></div><FiArrowRight aria-hidden="true" /></a></li>)}</ol><div className="roadmap-level-actions">{selectedLevel > 0 && <button className="button" type="button" onClick={() => chooseLevel(selectedLevel - 1)}>Предыдущий уровень</button>}{selectedLevel < 4 && <button className="button button-primary" type="button" onClick={() => chooseLevel(selectedLevel + 1)}>Следующий уровень <FiArrowRight aria-hidden="true" /></button>}</div></section>}

    <aside className="roadmap-specialization"><div><span className="eyebrow">ОТДЕЛЬНАЯ СПЕЦИАЛИЗАЦИЯ</span><h2>Хочется глубже в сети?</h2><p>Network Engineer — отдельный путь от адресации и коммутации до проектирования, мониторинга и автоматизации сетей.</p></div><a className="button" href="?view=network-engineer" data-route-link>Network Engineer <FiArrowRight aria-hidden="true" /></a></aside>
    <p className="roadmap-path-note">Начните с одной серверной ОС и одного облачного провайдера. Рост от Junior к Middle или DevOps опирается на практику и ответственность за работающие системы.</p>
    <details className="roadmap-alternative"><summary>Все этапы списком</summary><div className="roadmap-level-list">{sysadminRoadmapLevels.map((item) => <div key={item.id}><h3>{item.id} · {item.title}</h3><ul>{sysadminRoadmapNodes.filter((node) => node.level === item.id).map((node) => <li key={node.id}><a href={node.href} data-route-link>{node.title}</a><p>{node.description}</p></li>)}</ul></div>)}</div></details>
    <details className="roadmap-source"><summary>Код Mermaid</summary><pre tabIndex="0" aria-label="Код карты Mermaid"><code>{sysadminRoadmapSource}</code></pre></details>
  </section>;
}
