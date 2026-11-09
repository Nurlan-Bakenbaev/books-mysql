import { useId, useRef, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { phases } from '../data/guide';
import { lessons } from '../data/lessons';
import LessonDialog from './LessonDialog';

type Topic = { id: string; title: string; description: string };
type Lesson = { intro: string; sections: { title: string; paragraphs: string[] }[]; lab: { steps: string[]; commands: string; commandsLabel?: string; extraCommands?: { label: string; commands: string }[]; expected: string; pitfalls: string[] } };
type Props = { topicId: string; completed: string[]; onToggle: (id: string) => void };

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

const topicsById = new Map<string, Topic>(phases.flatMap((phase) => phase.topics.map((topic) => [topic.id, topic] as [string, Topic])));
const lessonById = lessons as Record<string, Lesson>;

export default function RelatedPractice({ topicId, completed, onToggle }: Props) {
  const headingId = useId();
  const [selected, setSelected] = useState<Topic | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const related = (relatedByChapter[topicId] || [])
    .map((id) => topicsById.get(id))
    .filter((topic): topic is Topic => Boolean(topic && lessonById[topic.id]));

  if (!related.length) return null;

  return <section className="course-terms" aria-labelledby={headingId}>
    <h3 id={headingId}>Дополнительная практика</h3>
    <p>Самостоятельные уроки дорожной карты по близким темам. Это дополнительные материалы, а не текст книги.</p>
    <div className="course-topic-list">{related.map((topic) => <button className="course-topic-button" type="button" key={topic.id} onClick={(event) => { triggerRef.current = event.currentTarget; setSelected(topic); }}><span>{topic.title}</span><FiArrowRight aria-hidden="true" /></button>)}</div>
    <LessonDialog topic={selected} lesson={selected ? lessonById[selected.id] : null} isComplete={selected ? completed.includes(selected.id) : false} onToggle={onToggle} onClose={() => setSelected(null)} triggerRef={triggerRef} />
  </section>;
}
