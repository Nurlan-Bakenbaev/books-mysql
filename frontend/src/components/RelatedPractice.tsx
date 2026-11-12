import { useId } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { phases } from '../data/guide';
import { lessonHref } from '../navigation';

type Topic = { id: string; title: string; description: string };
type Props = { topicId: string };

// Эти материалы дополняют курс и не являются текстом книги.
const relatedByChapter: Record<string, string[]> = {
  compute: ['virtualization', 'linux-basics', 'linux-services'],
  storage: ['hardware-storage', 'backup-dr', 'database-operations'],
  network: ['network-models', 'routing-vlan', 'network-troubleshooting'],
  toolkit: ['powershell', 'bash', 'network-troubleshooting'],
  'version-control': ['devops-basics'],
  testing: ['devops-basics'],
  'infrastructure-security': ['zero-trust', 'hardening', 'iam-rbac-laps'],
  'scripting-infrastructure': ['powershell', 'bash', 'powershell-ad'],
  'managing-infrastructure': ['devops-basics', 'ansible-iac', 'patch-management'],
  'securing-infrastructure': ['zero-trust', 'hardening'],
  'monitoring-theory': ['operations-monitoring', 'security-monitoring', 'logs-scripting'],
  'compute-monitoring': ['logs-scripting', 'network-troubleshooting'],
  'monitoring-data': ['logs-scripting', 'security-monitoring'],
  'capacity-management': ['virtualization'],
  'incident-management': ['security-monitoring', 'logs-scripting', 'incident-portfolio'],
};

const topicsById = new Map<string, Topic>(phases.flatMap((phase) => phase.topics.map((topic: Topic) => [topic.id, topic] as [string, Topic])));

export default function RelatedPractice({ topicId }: Props) {
  const headingId = useId();
  const related = (relatedByChapter[topicId] || [])
    .map((id) => topicsById.get(id))
    .filter((topic): topic is Topic => Boolean(topic));

  if (!related.length) return null;

  return <section className="course-terms" aria-labelledby={headingId}>
    <h3 id={headingId}>Дополнительная практика</h3>
    <p>Самостоятельные уроки дорожной карты по близким темам. Это дополнительные материалы, а не текст книги.</p>
    <div className="course-topic-list">{related.map((topic) => <a className="course-topic-button" href={lessonHref(topic.id)} data-route-link key={topic.id}><span>{topic.title}</span><FiArrowRight aria-hidden="true" /></a>)}</div>
  </section>;
}
