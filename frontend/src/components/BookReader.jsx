import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FiBookOpen, FiChevronLeft, FiChevronRight, FiFileText, FiMinus, FiPlus, FiSearch, FiUpload } from 'react-icons/fi';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
const EXPECTED_FINGERPRINT = 'faf37ec52bb8646184d576d312386266';
const STORAGE_PREFIX = 'sysadmin-reader-page:';

function savedPage(fingerprint, total) {
  try {
    const page = Number(localStorage.getItem(STORAGE_PREFIX + fingerprint));
    return Number.isInteger(page) && page >= 1 && page <= total ? page : 1;
  } catch { return 1; }
}

/* Each page has its own canvas, so an obsolete render never draws over the next page. */
function PDFPage({ document, pageNumber, width, zoom, onError }) {
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const [pageSize, setPageSize] = useState(null);
  useEffect(() => {
    let cancelled = false;
    let renderTask;
    let textLayer;
    async function renderPage() {
      try {
        const page = await document.getPage(pageNumber);
        if (cancelled) return;
        const original = page.getViewport({ scale: 1 });
        const scale = Math.max(0.1, width / original.width) * zoom;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const container = textRef.current;
        if (!canvas || !container) return;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.ceil(viewport.width * pixelRatio);
        canvas.height = Math.ceil(viewport.height * pixelRatio);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        setPageSize({ width: viewport.width, height: viewport.height, scale });
        renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport, transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0] });
        const textPromise = page.getTextContent().then((textContent) => {
          if (cancelled) return undefined;
          container.replaceChildren();
          textLayer = new pdfjs.TextLayer({ textContentSource: textContent, container, viewport });
          return textLayer.render();
        });
        await Promise.all([renderTask.promise, textPromise]);
      } catch (error) {
        if (!cancelled && error.name !== 'RenderingCancelledException' && error.name !== 'AbortException') onError('Не удалось отобразить страницу. Попробуйте открыть файл снова.');
      }
    }
    renderPage();
    return () => { cancelled = true; renderTask?.cancel(); textLayer?.cancel(); };
  }, [document, pageNumber, width, zoom, onError]);
  return <div className="book-reader-page" style={pageSize ? { width: pageSize.width, height: pageSize.height, '--scale-factor': pageSize.scale } : undefined}><canvas ref={canvasRef} aria-label={`Страница ${pageNumber}`} /><div ref={textRef} className="textLayer" /></div>;
}

function OutlineItems({ items, onNavigate, depth = 0 }) {
  return <ul>{items.map((item, index) => <li key={`${depth}-${index}`}><button type="button" className="book-reader-outline-button" onClick={() => onNavigate(item)}>{item.title || 'Без названия'}</button>{item.items?.length > 0 && <OutlineItems items={item.items} onNavigate={onNavigate} depth={depth + 1} />}</li>)}</ul>;
}

/* pageRequest = { page, requestId }; change requestId to repeat a navigation. */
export default function BookReader({ pageRequest }) {
  const [source, setSource] = useState(null);
  const [document, setDocument] = useState(null);
  const [outline, setOutline] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [zoom, setZoom] = useState(1);
  const [stageWidth, setStageWidth] = useState(760);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchStatus, setSearchStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const stageRef = useRef(null);
  const textCache = useRef(new Map());
  const pendingPage = useRef(null);
  const handledRequest = useRef(null);
  const documentRef = useRef(document);
  documentRef.current = document;
  const errorRef = useRef(setError);

  useEffect(() => {
    let cancelled = false;
    let loadingTask;
    if (!source) return undefined;
    documentRef.current = null;
    setDocument(null);
    setOutline([]);
    setQuery('');
    setResults([]);
    setError('');
    setLoading(true);
    textCache.current = new Map();
    async function load() {
      try {
        const config = { data: new Uint8Array(await source.file.arrayBuffer()) };
        if (cancelled) return;
        loadingTask = pdfjs.getDocument(config);
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        const original = pdf.fingerprints[0] === EXPECTED_FINGERPRINT && pdf.numPages === 444;
        const shouldNavigate = original && pendingPage.current != null;
        const page = shouldNavigate ? Math.min(pdf.numPages, Math.max(1, pendingPage.current)) : savedPage(pdf.fingerprints[0], pdf.numPages);
        if (shouldNavigate) pendingPage.current = null;
        setNotice(pendingPage.current != null && !original ? 'Для перехода из путеводителя выберите исходный PDF книги Modern System Administration. Сейчас открыт другой файл.' : '');
        setPageNumber(page);
        setPageInput(String(page));
        setDocument(pdf);
        setLoading(false);
        pdf.getOutline().then((items) => { if (!cancelled) setOutline(items || []); }).catch(() => { if (!cancelled) setOutline([]); });
      } catch (e) {
        if (!cancelled) {
          setLoading(false);
          setError(e.name === 'PasswordException' ? 'PDF защищён паролем. Откройте незашифрованный файл.' : 'Не удалось открыть PDF. Выберите файл на устройстве и попробуйте ещё раз.');
        }
      }
    }
    load();
    return () => { cancelled = true; loadingTask?.destroy(); };
  }, [source]);

  useEffect(() => {
    if (!pageRequest || !Number.isInteger(pageRequest.page) || handledRequest.current === pageRequest.requestId) return;
    handledRequest.current = pageRequest.requestId;
    pendingPage.current = pageRequest.page;
    const pdf = documentRef.current;
    if (!pdf || pdf.fingerprints[0] !== EXPECTED_FINGERPRINT || pdf.numPages !== 444) {
      setNotice(pdf ? 'Для перехода из путеводителя выберите исходный PDF книги Modern System Administration. Сейчас открыт другой файл.' : 'Чтобы открыть главу, выберите исходный PDF книги Modern System Administration на своём устройстве.');
      return;
    }
    const page = Math.min(pdf.numPages, Math.max(1, pageRequest.page));
    setPageNumber(page);
    setPageInput(String(page));
    setNotice('');
    pendingPage.current = null;
  }, [pageRequest]);

  useEffect(() => {
    if (!document) return;
    try { localStorage.setItem(STORAGE_PREFIX + document.fingerprints[0], String(pageNumber)); } catch { /* storage is optional */ }
  }, [document, pageNumber]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => setStageWidth(Math.max(220, Math.min(840, stage.clientWidth - 32)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [document]);

  useEffect(() => {
    if (!document || !query.trim()) { setResults([]); setSearchStatus(''); return undefined; }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const needle = query.trim().toLocaleLowerCase();
      const matches = [];
      setResults([]);
      setSearchStatus('Поиск по книге…');
      try {
        for (let i = 1; i <= document.numPages; i += 1) {
          if (cancelled) return;
          let text = textCache.current.get(i);
          if (text === undefined) {
            const page = await document.getPage(i);
            const content = await page.getTextContent();
            text = content.items.map((item) => item.str || '').join(' ').replace(/\s+/g, ' ');
            if (cancelled) return;
            textCache.current.set(i, text);
          }
          const index = text.toLocaleLowerCase().indexOf(needle);
          if (index !== -1) {
            matches.push({ page: i, snippet: `${index > 55 ? '…' : ''}${text.slice(Math.max(0, index - 55), index + needle.length + 100)}…` });
          }
          if (i % 25 === 0 || i === document.numPages) {
            setResults([...matches]);
            setSearchStatus(i === document.numPages ? `Найдено страниц: ${matches.length}` : `Проверено страниц: ${i} из ${document.numPages}`);
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
        }
      } catch {
        if (!cancelled) setSearchStatus('Не удалось завершить поиск по книге.');
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [document, query]);

  function goToPage(value) {
    if (!document) return;
    const page = Number(value);
    if (!Number.isInteger(page)) { setPageInput(String(pageNumber)); return; }
    const next = Math.min(document.numPages, Math.max(1, page));
    setPageNumber(next);
    setPageInput(String(next));
  }
  async function navigateOutline(item) {
    try {
      if (!document) return;
      if (!item.dest) {
        if (item.url && /^https?:\/\//i.test(item.url)) window.open(item.url, '_blank', 'noopener,noreferrer');
        return;
      }
      const dest = typeof item.dest === 'string' ? await document.getDestination(item.dest) : item.dest;
      if (!dest || dest[0] == null) return;
      const index = Number.isInteger(dest[0]) ? dest[0] : await document.getPageIndex(dest[0]);
      goToPage(index + 1);
    } catch { setError('Не удалось перейти к этому разделу оглавления.'); }
  }

  return <section className="section book-reader" id="book" aria-labelledby="book-reader-title">
    <div className="book-reader-header"><div><span className="eyebrow">ИСТОЧНИК / ПОЛНЫЙ ТЕКСТ</span><h2 id="book-reader-title">Читать книгу</h2><p>Jennifer Davis · <em>Modern System Administration</em> · O’Reilly, 2022</p></div><FiBookOpen aria-hidden="true" /></div>
    <p className="book-reader-intro">Выберите свой PDF книги, чтобы читать оригинальные страницы с иллюстрациями и примерами. Используйте оглавление или поиск по английскому тексту.</p>
    <label className="book-reader-upload button"><FiUpload aria-hidden="true" /> {source ? 'Открыть другой PDF' : 'Выбрать PDF с устройства'}<input type="file" accept="application/pdf,.pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) { documentRef.current = null; setSource({ file, name: file.name }); } event.target.value = ''; }} /></label>
    <p className="book-reader-note">Файл, выбранный на устройстве, обрабатывается в браузере. Последняя страница запоминается на этом устройстве.</p>
    {notice && <p className="book-reader-note" role="status">{notice}</p>}
    {error && <div className="book-reader-error" role="alert">{error}</div>}
    {loading && <p className="book-reader-status" role="status">Открываем книгу…</p>}
    {document && <div className="book-reader-layout">
      <aside className="book-reader-sidebar" aria-label="Навигация по книге"><div className="book-reader-sidebar-header"><FiFileText aria-hidden="true" /><strong>Внутри книги</strong></div>
        <label className="book-reader-search"><FiSearch aria-hidden="true" /><span className="sr-only">Поиск по тексту книги</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по книге..." /></label>
        {query.trim() ? <div className="book-reader-results"><p role="status">{searchStatus}</p>{results.map((result) => <button type="button" className="book-reader-result" key={result.page} onClick={() => goToPage(result.page)}><strong>Страница {result.page}</strong><span>{result.snippet}</span></button>)}</div> : <nav className="book-reader-outline" aria-label="Оглавление">{outline.length ? <OutlineItems items={outline} onNavigate={navigateOutline} /> : <p>В этом файле нет встроенного оглавления.</p>}</nav>}
      </aside>
      <div className="book-reader-main"><div className="book-reader-toolbar"><span className="book-reader-filename" title={source.name}>{source.name}</span><div className="book-reader-controls"><button type="button" className="button" disabled={pageNumber <= 1} onClick={() => goToPage(pageNumber - 1)} aria-label="Предыдущая страница"><FiChevronLeft /></button><label>Страница <input className="book-reader-page-input" aria-label="Номер страницы" type="number" min="1" max={document.numPages} value={pageInput} onChange={(event) => setPageInput(event.target.value)} onBlur={() => goToPage(pageInput)} onKeyDown={(event) => { if (event.key === 'Enter') { goToPage(pageInput); event.currentTarget.blur(); } }} /> из {document.numPages}</label><button type="button" className="button" disabled={pageNumber >= document.numPages} onClick={() => goToPage(pageNumber + 1)} aria-label="Следующая страница"><FiChevronRight /></button><button type="button" className="button" disabled={zoom <= 0.7} onClick={() => setZoom((value) => Math.max(0.7, Math.round((value - 0.1) * 10) / 10))} aria-label="Уменьшить масштаб"><FiMinus /></button><span aria-label="Масштаб">{Math.round(zoom * 100)}%</span><button type="button" className="button" disabled={zoom >= 2} onClick={() => setZoom((value) => Math.min(2, Math.round((value + 0.1) * 10) / 10))} aria-label="Увеличить масштаб"><FiPlus /></button></div></div>
        <div className="book-reader-stage" ref={stageRef}><PDFPage key={`${pageNumber}-${stageWidth}-${zoom}`} document={document} pageNumber={pageNumber} width={stageWidth} zoom={zoom} onError={errorRef.current} /></div><p className="book-reader-status" role="status">Страница {pageNumber} из {document.numPages}</p>
      </div>
    </div>}
  </section>;
}

PDFPage.propTypes = {
  document: PropTypes.shape({ getPage: PropTypes.func.isRequired }).isRequired,
  pageNumber: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  onError: PropTypes.func.isRequired,
};
OutlineItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNavigate: PropTypes.func.isRequired,
  depth: PropTypes.number,
};
BookReader.propTypes = {
  pageRequest: PropTypes.shape({ page: PropTypes.number.isRequired, requestId: PropTypes.number.isRequired }),
};
