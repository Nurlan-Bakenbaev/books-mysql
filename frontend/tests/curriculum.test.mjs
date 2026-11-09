import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { phases } from '../src/data/guide.js';
import { lessons } from '../src/data/lessons.js';
import { lessonDetails } from '../src/data/lessonDetails.js';
import { lessonWalkthroughs } from '../src/data/lessonWalkthroughs.js';
import { foundationWalkthroughs } from '../src/data/lessonWalkthroughsFoundations.js';
import { operationsWalkthroughs } from '../src/data/lessonWalkthroughsOperations.js';
import { windowsWalkthroughs } from '../src/data/lessonWalkthroughsWindows.js';
import { lessonResources, resources } from '../src/data/resources.js';
import { chapterVideos, lessonVideos } from '../src/data/lessonVideos.js';
import { windowsSecurityCourse } from '../src/data/windowsSecurity.js';

const topics = [...phases.flatMap((phase) => phase.topics), ...windowsSecurityCourse.topics];
const topicIds = topics.map((topic) => topic.id);
const sourceIds = resources.map((resource) => resource.id);
const course = JSON.parse(readFileSync(new URL('../src/data/course.json', import.meta.url), 'utf8'));

function assertQuestion(question, context) {
  assert.ok(question.question && question.explanation, context);
  assert.ok(question.options.length >= 3, context);
  assert.equal(new Set(question.options).size, question.options.length, context);
  assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length, context);
}

test('every roadmap step has a unique, complete lesson and practical outcome', () => {
  assert.equal(new Set(topicIds).size, topicIds.length);
  assert.deepEqual(Object.keys(lessons).sort(), [...topicIds].sort());
  assert.equal(topicIds[0], 'virtualization');
  assert.equal(windowsSecurityCourse.topics.length, 9);

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

test('every lesson has substantial original detail, a diagram, a quiz, and a sourced video', () => {
  assert.deepEqual(Object.keys(lessonDetails).sort(), [...topicIds].sort());
  assert.deepEqual(Object.keys(lessonVideos).sort(), [...topicIds].sort());
  for (const topic of topics) {
    const detail = lessonDetails[topic.id];
    assert.ok(detail.goals.length >= 3 && detail.goals.every(Boolean), topic.id);
    assert.ok(detail.deepDive.length >= 2 && detail.deepDive.every((paragraph) => paragraph.length >= 100), topic.id);
    assert.ok(detail.caseStudy.situation && detail.caseStudy.action && detail.caseStudy.result, topic.id);
    assert.ok(detail.diagram.length >= 3 && detail.diagram.every(Boolean), topic.id);
    assertQuestion(detail.question, topic.id);
    const video = lessonVideos[topic.id];
    assert.match(video.id, /^[A-Za-z0-9_-]{11}$/, topic.id);
    assert.ok(video.title && video.sourceName, topic.id);
    assert.equal(new URL(video.source).protocol, 'https:', topic.id);
    const screenshot = detail.example?.screenshot || detail.labScreenshot;
    if (screenshot) assert.ok(existsSync(new URL(`../public/study-images/${screenshot}`, import.meta.url)), topic.id);
  }
});

test('every lesson includes a complete, topic-specific step-by-step walkthrough', () => {
  const walkthroughIds = [...Object.keys(foundationWalkthroughs), ...Object.keys(operationsWalkthroughs), ...Object.keys(windowsWalkthroughs)];
  assert.equal(new Set(walkthroughIds).size, walkthroughIds.length);
  assert.deepEqual(Object.keys(lessonWalkthroughs).sort(), [...topicIds].sort());
  for (const topic of topics) {
    const walkthrough = lessonWalkthroughs[topic.id];
    assert.ok(walkthrough.title && walkthrough.context.length >= 100, topic.id);
    assert.ok(walkthrough.steps.length >= 4 && walkthrough.steps.every((step) => step.length >= 100), topic.id);
    assert.ok(walkthrough.verification.length >= 80 && walkthrough.troubleshooting.length >= 100, topic.id);
  }
});

test('each roadmap and book module supplies its own assessment questions', () => {
  assert.ok(phases.every((phase) => phase.topics.length >= 3 && phase.topics.every((topic) => lessonDetails[topic.id].question)));
  assert.ok(windowsSecurityCourse.topics.every((topic) => lessonDetails[topic.id].question));
  assert.equal(course.modules.length, 5);
  assert.deepEqual(Object.keys(chapterVideos).sort(), course.modules.flatMap((module) => module.topics.map((topic) => topic.id)).sort());
  for (const module of course.modules) {
    assert.ok(module.topics.length >= 3, module.id);
    for (const chapter of module.topics) {
      assert.ok(chapter.quiz.length, chapter.id);
      chapter.quiz.forEach((question) => assertQuestion(question, chapter.id));
      assert.match(chapterVideos[chapter.id].id, /^[A-Za-z0-9_-]{11}$/, chapter.id);
      assert.equal(new URL(chapterVideos[chapter.id].source).protocol, 'https:', chapter.id);
    }
  }
});

test('self-contained Linux and Python examples produce their documented results', () => {
  const examples = [
    [lessonDetails['ip-addressing'].example.code, ['Network: 192.0.2.128/26', 'Netmask: 255.255.255.192', 'Broadcast: 192.0.2.191', 'Usable hosts: 62']],
    [lessonDetails['logs-scripting'].example.code, ['2026-01-02T10:01:00Z ERROR request timeout']],
    [lessonDetails['cloud-foundations'].example.code, ['Estimated total: 2.50 units']],
    [lessonDetails.bash.example.code, ['Check planned: web', 'Check planned: database']],
    [lessons['database-operations'].lab.commands, ["[('test-server',)]"]],
  ];
  for (const [command, expected] of examples) {
    const output = execFileSync('bash', ['-c', command], { encoding: 'utf8', timeout: 10000 });
    for (const line of expected) assert.ok(output.includes(line), `${line}: ${output}`);
  }
  assert.match(lessonDetails['powershell-ad'].example.code, /New-ADUser[^\n]+-WhatIf/);
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
