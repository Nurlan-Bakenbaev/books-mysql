import { Fragment, useEffect, useRef, useState } from 'react';
import { FiCopy } from 'react-icons/fi';

/* eslint-disable react/prop-types */
export default function CodeBlock({ label, code }) {
  const block = useRef(null);
  const [visible, setVisible] = useState(false);
  const [highlighted, setHighlighted] = useState(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return undefined; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '250px' });
    observer.observe(block.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!visible) return undefined;
    let active = true;
    import('../lib/highlight').then(({ highlightCode }) => highlightCode(code, label)).then((tokens) => {
      if (active) setHighlighted({ code, label, tokens });
    }).catch(() => { if (active) setHighlighted(null); });
    return () => { active = false; };
  }, [code, label, visible]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('Скопировано');
    } catch { setStatus('Выделите код и скопируйте его вручную'); }
  }
  const tokens = highlighted?.code === code && highlighted?.label === label ? highlighted.tokens : null;
  return <div ref={block} className="lesson-code"><div className="lesson-code-heading"><span>{label}</span><button type="button" aria-label={`Копировать: ${label}`} onClick={copy}><FiCopy aria-hidden="true" /> Копировать</button></div>
    <pre tabIndex="0" aria-label={label}><code data-highlighted={Boolean(tokens)}>{tokens ? tokens.map((line, index) => <Fragment key={index}>{index > 0 && '\n'}{line.map((token, tokenIndex) => <span key={tokenIndex} style={{ color: token.color }}>{token.content}</span>)}</Fragment>) : code}</code></pre><span role="status">{status}</span>
  </div>;
}
