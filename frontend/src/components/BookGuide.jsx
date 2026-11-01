import { FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { bookParts } from '../data/bookGuide';

/* Pages correspond to the physical pages of the supplied PDF. */
/* eslint-disable react/prop-types */
export default function BookGuide({ onOpenPage }) {
  return <section className="section book-guide" id="book-guide" aria-labelledby="book-guide-title">
    <div className="section-heading"><div><span className="eyebrow">ПУТЕВОДИТЕЛЬ ПО КНИГЕ</span><h2 id="book-guide-title">Разбираем материал по частям</h2><p>Пояснения и практические примеры помогают ориентироваться в оригинале. Все номера ниже — страницы PDF.</p></div></div>
    <div className="book-guide-intro"><FiBookOpen aria-hidden="true" /><p>В книге рассматриваются принципы построения и сопровождения надёжных систем. Это не руководство по конкретной версии Windows Server: для AD, GPO и продуктов Microsoft используйте актуальную документацию вместе с дорожной картой.</p></div>
    {bookParts.map((part) => <details className="book-part" key={part.id}>
      <summary className="book-part-heading"><span className="book-part-number">{part.number}</span><span><strong>{part.title}</strong><small>Часть {part.number} · с PDF-страницы {part.page}</small></span></summary>
      <div className="book-part-body"><p className="book-part-intro">{part.introduction}</p>
        {part.sections.map((section) => <article className="book-section" key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="book-example">{section.example}</div></article>)}
        <p className="book-roadmap">{part.roadmap}</p><h3>Главы в оригинале</h3><div className="book-chapters">{part.chapters.map((chapter) => <button className="book-chapter" type="button" key={chapter.page} onClick={() => onOpenPage(chapter.page)}><span>{chapter.title}</span><span>стр. {chapter.page} <FiArrowRight aria-hidden="true" /></span></button>)}</div>
      </div></details>)}
  </section>;
}
