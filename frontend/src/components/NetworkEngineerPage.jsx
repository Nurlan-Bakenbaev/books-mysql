import { FiArrowUpRight, FiExternalLink } from 'react-icons/fi';
import Roadmap from './Roadmap';
import { networkEngineerCourse, networkEngineerPhases, networkEngineerCertifications } from '../data/networkEngineer';

/* eslint-disable react/prop-types */
export default function NetworkEngineerPage({ completed, onToggle }) {
  return <>
    <Roadmap id="network-engineer" eyebrow="НОВАЯ КАРЬЕРА · NETWORK ENGINEER" title={networkEngineerCourse.title} description={networkEngineerCourse.description} startHint="Идите по пяти уровням. Сначала предскажите результат упражнения, затем проверьте его и сохраните отчёт. Автономные модели протоколов дополняйте практикой на изолированном стенде из источников урока." phases={networkEngineerPhases} completed={completed} onToggle={onToggle} />
    <aside className="network-route-source"><strong>На основе Network Engineer roadmap</strong><p>Программа адаптирует темы roadmap.sh в последовательные уроки с русскими объяснениями, упражнениями и первоисточниками.</p><a href="https://roadmap.sh/network-engineer" target="_blank" rel="noreferrer">Открыть исходную дорожную карту <FiExternalLink aria-hidden="true" /></a></aside>
    <section className="network-certifications" aria-labelledby="network-certifications-title"><span className="eyebrow">ОРИЕНТИРЫ ДЛЯ РОСТА</span><h2 id="network-certifications-title">Сертификации сетевого инженера</h2><p>Выберите маршрут под свою роль и оборудование. Network+, CCNA и JNCIA — варианты начальной специализации; к CCNP переходят после практики. Учебные материалы доступны бесплатно, сертификационные экзамены обычно платные. Текущую программу и условия проверяйте у организатора.</p><div className="network-certification-grid">{networkEngineerCertifications.map((certification) => <article className="network-certification-card" key={certification.id}><span className="eyebrow">{Array.isArray(certification.focus) ? certification.focus.join(' · ') : certification.focus}</span><h3>{certification.name}</h3><p>{certification.description}</p>{certification.prerequisites && <p><strong>Когда переходить:</strong> {certification.prerequisites}</p>}<a href={certification.url} target="_blank" rel="noreferrer">Официальная программа <FiArrowUpRight aria-hidden="true" /></a></article>)}</div></section>
  </>;
}
