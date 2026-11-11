import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lessons } from '../src/data/lessons.js';
import { securityPlusExam, gradeSecurityPlus } from '../src/data/securityPlusExam.js';
import { securityPlusDepth } from '../src/data/securityPlusDepth.js';
import { securityPlusCourse, securityPlusPhases, securityPlusLessons, securityPlusDetails, securityPlusWalkthroughs, securityPlusLessonResources, securityPlusDepthById } from '../src/data/securityPlus.js';

test('original Security+ exam has exact domain coverage and valid unique options', () => {
  assert.equal(securityPlusExam.length, 30);
  const normalize = (text) => text.trim().toLocaleLowerCase().replace(/\s+/g, ' ');
  assert.equal(new Set(securityPlusExam.map((q) => normalize(q.question))).size, 30);
  assert.deepEqual([1, 2, 3, 4, 5].map((d) => securityPlusExam.filter((q) => q.domain === d).length), [4, 7, 5, 8, 6]);
  for (const q of securityPlusExam) {
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map(normalize)).size, 4);
    assert.ok(q.options.every((option) => option.trim().length > 0));
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.ok(q.explanation.length > 130);
  }
});

test('exam grading respects 24/30 boundary and missing or incorrect answers', () => {
  const all = Object.fromEntries(securityPlusExam.map((q, i) => [i, q.answer]));
  assert.deepEqual(gradeSecurityPlus(all), { correct: 30, percent: 100, passed: true });
  assert.deepEqual(gradeSecurityPlus({}), { correct: 0, percent: 0, passed: false });
  const answerCount = (n) => Object.fromEntries(securityPlusExam.map((q, i) => [i, i < n ? q.answer : (q.answer + 1) % 4]));
  assert.deepEqual(gradeSecurityPlus(answerCount(24)), { correct: 24, percent: 80, passed: true });
  assert.deepEqual(gradeSecurityPlus(answerCount(23)), { correct: 23, percent: 77, passed: false });
});

test('all Security+ syllabus lessons have distinct depth, terminology, diagnosis and runnable practice', () => {
  assert.equal(securityPlusDepth.length, 37);
  assert.equal(securityPlusCourse.topics.length, 37);
  assert.deepEqual(securityPlusPhases.map((phase) => phase.topics.length), [1, 7, 7, 7, 10, 5]);
  for (const topic of securityPlusCourse.topics) {
    const depth = securityPlusDepthById[topic.id];
    assert.equal(securityPlusDetails[topic.id].caseStudy.situation, depth.situation);
    assert.ok(depth.terms.length >= 4);
    assert.ok(depth.theory.length >= 3 && depth.theory.every((p) => p.length > 200));
    assert.ok(securityPlusWalkthroughs[topic.id].troubleshooting.includes(depth.troubleshooting));
    assert.ok(securityPlusLessons[topic.id].lab.pitfalls.some((p) => p.includes(depth.cleanup)));
    const cwd = mkdtempSync(join(tmpdir(), 'secplus-'));
    try {
      const output = execFileSync('bash', ['-e', '-c', depth.lab], { cwd, encoding: 'utf8', timeout: 10000 });
      assert.ok(output.trim().length > 0, topic.id);
    } finally { rmSync(cwd, { recursive: true, force: true }); }
  }
});

test('Security+ lessons cover the supplied SY0-701 syllabus and link Professor Messer course', () => {
  const content = securityPlusCourse.topics.map((topic) => {
    const lesson = securityPlusLessons[topic.id];
    const detail = securityPlusDetails[topic.id];
    return [topic.title, topic.description, lesson.intro, ...lesson.sections.flatMap((section) => section.paragraphs), ...detail.deepDive].join(' ');
  }).join(' ').toLocaleLowerCase();
  for (const term of [
    'cia', 'aaa', 'изменениями', 'deception', 'disruption', 'pki', 'hsm', 'tpm', 'secure enclave',
    'watering-hole', 'malware', 'account lockouts', 'impossible travel', 'resource consumption',
    'serverless', 'микросервисы', 'data lifecycle', 'носителей', 'secure baseline', 'asset',
    'nvd', 'ids', 'ips', 'mdm', 'sso', 'federation', 'soar', 'forensics', 'sla',
    'risk appetite', 'tolerance', 'compliance', 'audit', 'awareness', 'phishing', 'gdpr', 'hipaa',
  ]) assert.ok(content.includes(term), `Missing syllabus term: ${term}`);
  for (const topic of securityPlusCourse.topics) {
    assert.ok(securityPlusDetails[topic.id].practiceTasks.length >= 3, topic.id);
    assert.ok(securityPlusDetails[topic.id].deepDive.length >= 6, topic.id);
    assert.ok(securityPlusLessonResources[topic.id].some((source) => source.sourceId === 'sp-messer'), topic.id);
  }
});

test('all baseline lesson identifiers and progress storage contract are preserved', () => {
  const baseline = JSON.parse(readFileSync(new URL('./baseline-lesson-ids.json', import.meta.url), 'utf8'));
  assert.deepEqual(baseline.filter((id) => !lessons[id]), []);
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.ok(app.includes("const STORAGE_KEY = 'sysadmin-path-2026-progress'"));
  const landing = readFileSync(new URL('../src/components/LandingPage.jsx', import.meta.url), 'utf8');
  assert.ok(!landing.includes('Настоящая карта профессии'));
  assert.ok(!landing.includes('landing-map-node'));
});
