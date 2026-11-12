import { courseCatalog } from '../data/catalog';
import { labStepChecks } from '../data/labStepChecks';
import { FiAlertTriangle, FiArrowDownRight, FiArrowRight, FiAward, FiBookOpen, FiCheck, FiCheckCircle, FiChevronDown, FiClock, FiRotateCcw, FiShield, FiTerminal } from 'react-icons/fi';

/* eslint-disable react/prop-types */
export function LabsPage({ labs, completed, onToggle }) {
  const done = labs.filter((lab) => completed.includes(lab.id)).length;
  return <section className="section utility-page"><div className="section-heading"><div><div className="section-kicker">Практика на собственном стенде</div><h1>Лабораторные работы <span className="heading-icon"><FiTerminal /></span></h1><p>Каждая работа содержит подготовку стенда, точные действия, проверку результата, диагностику и безопасный откат.</p></div><span className="section-count">{done} / {labs.length} выполнено</span></div><div className="lab-workbook-list">{labs.map((lab, index) => {
    const isComplete = completed.includes(lab.id);
    return <details className={`lab-workbook${isComplete ? ' is-complete' : ''}`} key={lab.id}>
      <summary className="lab-workbook-summary"><span className="lab-index">{String(index + 1).padStart(2, '0')}</span><span className="lab-summary-copy"><span className="lab-number">ЛАБОРАТОРИЯ · {lab.platform}</span><strong>{lab.title}</strong><small>{lab.description}</small><span className="lab-duration"><FiClock aria-hidden="true" /> {lab.duration}</span></span><span className="lab-summary-status">{isComplete ? <><FiCheckCircle /> Выполнено</> : 'Открыть инструкцию'}<FiChevronDown className="lab-summary-chevron" aria-hidden="true" /></span></summary>
      <div className="lab-workbook-body">
        <section className="lab-preflight"><h2><FiShield aria-hidden="true" /> Перед началом</h2><ul>{lab.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section><h2><FiTerminal aria-hidden="true" /> Пошаговое выполнение</h2><ol className="lab-step-list">{lab.steps.map((step, stepIndex) => <li className="lab-step" key={step.title}><span className="lab-step-number">{String(stepIndex + 1).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.text}</p><p><strong>Ожидается:</strong> {labStepChecks[lab.id][stepIndex].expected}</p><p><strong>Проверка:</strong> {labStepChecks[lab.id][stepIndex].verify}</p><p><strong>При отклонении:</strong> {labStepChecks[lab.id][stepIndex].diagnosis}</p>{step.command && <pre className="lab-command"><code>{step.command}</code></pre>}</div></li>)}</ol></section>
        <section className="lab-expected"><h2><FiCheckCircle aria-hidden="true" /> Ожидаемый результат</h2><p>{lab.expected}</p></section>
        <div className="lab-verification-grid">
          <section><h2><FiCheck aria-hidden="true" /> Проверка</h2><ul>{lab.verify.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2><FiAlertTriangle aria-hidden="true" /> Если не получилось</h2><ul>{lab.troubleshooting.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h2><FiRotateCcw aria-hidden="true" /> Откат</h2><ol>{lab.rollback.map((item) => <li key={item}>{item}</li>)}</ol></section>
        </div>
        <section className="lab-resources"><h2><FiBookOpen aria-hidden="true" /> Документация</h2><div>{lab.resources.map((resource) => <a href={resource.url} target="_blank" rel="noreferrer" key={resource.url}>{resource.title} <FiArrowDownRight aria-hidden="true" /></a>)}</div></section>
        <label className="lab-complete-action"><input type="checkbox" checked={isComplete} onChange={() => onToggle(lab.id)} /><span><FiCheck aria-hidden="true" /></span><strong>{isComplete ? 'Лаборатория выполнена' : 'Отметить лабораторию выполненной'}</strong></label>
      </div>
    </details>;
  })}</div></section>;
}

function CertificationArtwork({ cert }) {
  const kind = cert.category === 'Сети' ? 'network' : cert.category === 'Облако' ? 'cloud' : 'security';
  return <div className={`cert-art cert-art-${kind}`} aria-hidden="true">
    <svg viewBox="0 0 320 150" role="img">
      <defs><linearGradient id={`cert-gradient-${cert.id}`} x1="0" x2="1"><stop stopColor="currentColor" stopOpacity=".9" /><stop offset="1" stopColor="currentColor" stopOpacity=".12" /></linearGradient></defs>
      <path className="cert-art-grid" d="M0 30H320M0 75H320M0 120H320M40 0V150M100 0V150M160 0V150M220 0V150M280 0V150" />
      {kind === 'network' && <g className="cert-art-main"><path d="M70 76 132 42l58 34 62-34M70 76l62 35 58-35 62 35M132 42v69M190 76v41" /><circle cx="70" cy="76" r="16" /><circle cx="132" cy="42" r="16" /><circle cx="132" cy="111" r="16" /><circle cx="190" cy="76" r="16" /><circle cx="252" cy="42" r="16" /><circle cx="252" cy="111" r="16" /></g>}
      {kind === 'cloud' && <g className="cert-art-main"><path d="M92 103h137c20 0 31-12 31-29 0-18-14-30-33-30-6-18-23-29-43-29-26 0-47 17-51 41-22 0-39 10-39 27 0 12 8 20 20 20" /><path d="m133 82 25-24 25 24M158 58v68M217 72l-20 19 20 19M197 91h-26" /></g>}
      {kind === 'security' && <g className="cert-art-main"><path d="M160 18 225 43v39c0 34-24 52-65 66-41-14-65-32-65-66V43Z" /><path d="m130 81 20 20 40-44" /></g>}
      <rect x="18" y="16" width="78" height="24" rx="12" fill={`url(#cert-gradient-${cert.id})`} />
    </svg>
    <span>{cert.name}</span><small>{cert.category}</small>
  </div>;
}

export function CertificationsPage({ certifications, completed = [] }) {
  return <section className="section utility-page"><div className="section-heading"><div><div className="section-kicker">Профессиональное развитие</div><h1>Сертификации <span className="heading-icon"><FiAward /></span></h1><p>Выберите экзамен после практики по соответствующему треку. Программа и стоимость могут меняться.</p></div></div><div className="lesson-section"><h2>Подготовка по курсам</h2><p>Прогресс показывает изученные материалы, а не гарантию работы или сдачи экзамена.</p><ul>{[['ccna','network-engineer'],['az104','azure-admin'],['securityplus','security-plus'],['sc200','windows-security']].map(([certId,courseId])=>{const course=courseCatalog.find(c=>c.id===courseId);return <li key={certId}><a href={`?view=${courseId}`} data-route-link>{certifications.find(c=>c.id===certId)?.name}: {course.title}</a> · {course.topics.filter(t=>completed.includes(t.id)).length}/{course.topics.length} изучено</li>;})}</ul></div><div className="certifications-grid">{certifications.map((cert) => <a className={`cert-card cert-${cert.id}`} key={cert.id} href={cert.url} target="_blank" rel="noreferrer"><CertificationArtwork cert={cert} /><span className="cert-top"><span className="tag">{cert.category}</span><FiArrowDownRight /></span><strong>{cert.name}</strong><p>{cert.description}</p><span className="cert-link">Официальная страница <FiArrowRight /></span></a>)}</div><p className="cert-note"><FiShield /> Перед регистрацией проверьте актуальную программу и требования на официальной странице экзамена.</p></section>;
}
