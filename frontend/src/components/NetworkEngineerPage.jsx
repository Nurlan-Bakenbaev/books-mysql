import { FiArrowUpRight, FiExternalLink } from 'react-icons/fi';
import Roadmap from './Roadmap';
import { networkEngineerCourse, networkEngineerPhases, networkEngineerCertifications } from '../data/networkEngineer';

/* eslint-disable react/prop-types */
export default function NetworkEngineerPage({ completed, onToggle }) {
  return <>
    <Roadmap id="network-engineer" eyebrow="NETWORK ENGINEER" title={networkEngineerCourse.title} description={networkEngineerCourse.description} startHint="Пять уровней: от основ сетей до автоматизации. Лаборатории выполняйте на изолированном стенде." phases={networkEngineerPhases} completed={completed} onToggle={onToggle} />
    <aside className="network-route-source"><a href="https://roadmap.sh/network-engineer" target="_blank" rel="noreferrer">Основа программы: roadmap.sh · Network Engineer <FiExternalLink aria-hidden="true" /></a></aside>
    <section className="network-certifications" aria-labelledby="network-certifications-title"><span className="eyebrow">СЛЕДУЮЩИЙ ШАГ</span><h2 id="network-certifications-title">Сертификации сетевого инженера</h2><p>Network+, CCNA и JNCIA подходят для начала; CCNP — после практики. Стоимость и программу экзамена проверяйте у организатора.</p><div className="network-certification-grid">{networkEngineerCertifications.map((certification) => <article className="network-certification-card" key={certification.id}><span className="eyebrow">{Array.isArray(certification.focus) ? certification.focus.join(' · ') : certification.focus}</span><h3>{certification.name}</h3><p>{certification.description}</p>{certification.prerequisites && <p><strong>Когда переходить:</strong> {certification.prerequisites}</p>}<a href={certification.url} target="_blank" rel="noreferrer">Официальная программа <FiArrowUpRight aria-hidden="true" /></a></article>)}</div></section>
  </>;
}
