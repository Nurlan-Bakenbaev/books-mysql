import test from 'node:test';
import assert from 'node:assert/strict';
import { phases } from '../src/data/guide.js';
import { lessons } from '../src/data/lessons.js';
import { lessonResources, resources } from '../src/data/resources.js';

const topics = phases.flatMap((phase) => phase.topics);
const topicIds = topics.map((topic) => topic.id);
const sourceIds = resources.map((resource) => resource.id);

test('every roadmap step has a unique, complete lesson and practical outcome', () => {
  assert.equal(new Set(topicIds).size, topicIds.length);
  assert.deepEqual(Object.keys(lessons).sort(), [...topicIds].sort());
  assert.equal(topicIds[0], 'virtualization');

  for (const topic of topics) {
    const lesson = lessons[topic.id];
    assert.ok(topic.title && topic.description, topic.id);
    assert.ok(lesson.intro && lesson.sections.length, topic.id);
    assert.ok(lesson.sections.every((section) => section.title && section.paragraphs.length), topic.id);
    assert.ok(lesson.lab.steps.length && lesson.lab.expected && lesson.lab.pitfalls.length, topic.id);
    assert.equal(typeof lesson.lab.commands, 'string', topic.id);
    assert.ok((lesson.lab.extraCommands || []).every((block) => block.label && block.commands), topic.id);
  }
});

test('every lesson has at least two specific, resolvable learning resources', () => {
  assert.equal(new Set(sourceIds).size, sourceIds.length);
  assert.deepEqual(Object.keys(lessonResources).sort(), [...topicIds].sort());
  for (const resource of resources) {
    assert.ok(resource.title && resource.type && resource.language && resource.access && resource.description, resource.id);
    assert.equal(new URL(resource.url).protocol, 'https:', resource.id);
  }
  for (const topic of topics) {
    const references = lessonResources[topic.id];
    assert.ok(references.length >= 2, topic.id);
    assert.ok(references.some((reference) => reference.takeaway), `${topic.id}: missing source takeaway`);
    assert.equal(new Set(references.map((reference) => reference.sourceId)).size, references.length, topic.id);
    for (const reference of references) {
      assert.ok(sourceIds.includes(reference.sourceId), `${topic.id}: ${reference.sourceId}`);
      assert.ok(reference.focus, `${topic.id}: ${reference.sourceId}`);
    }
  }
  assert.ok(resources.some((resource) => resource.type === 'Книга'));
  assert.ok(resources.some((resource) => resource.type === 'Сообщество'));
  assert.ok(resources.some((resource) => resource.language === 'RU'));
});

test('existing topic identifiers remain available for saved progress', () => {
  const previousIds = [
    'network-models', 'ip-addressing', 'routing-vlan', 'network-troubleshooting', 'hardware-storage',
    'server-deployment', 'ad-ds', 'gpo', 'dns-dhcp-nps', 'iam-rbac-laps',
    'virtualization', 'backup-dr', 'entra-id', 'hybrid-identity', 'devops-basics',
    'powershell', 'powershell-ad', 'logs-scripting', 'bash',
    'zero-trust', 'hardening', 'security-monitoring', 'patch-management',
  ];
  assert.deepEqual(previousIds.filter((id) => !topicIds.includes(id)), []);
});
