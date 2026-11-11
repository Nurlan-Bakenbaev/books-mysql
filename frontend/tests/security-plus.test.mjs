import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lessons } from '../src/data/lessons.js';
import { securityPlusExam, gradeSecurityPlus } from '../src/data/securityPlusExam.js';
import { securityPlusDepth } from '../src/data/securityPlusDepth.js';
import { securityPlusCourse, securityPlusLessons, securityPlusDetails, securityPlusWalkthroughs } from '../src/data/securityPlus.js';

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

test('all ten Security+ lessons have distinct depth, terminology, diagnosis and runnable practice', () => {
  assert.equal(securityPlusDepth.length, 10);
  assert.equal(securityPlusCourse.topics.length, 10);
  for (const [i, topic] of securityPlusCourse.topics.entries()) {
    const depth = securityPlusDepth[i];
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

test('all baseline lesson identifiers and progress storage contract are preserved', () => {
  const baseline = JSON.parse(readFileSync(new URL('./baseline-lesson-ids.json', import.meta.url), 'utf8'));
  assert.deepEqual(baseline.filter((id) => !lessons[id]), []);
  const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.ok(app.includes("const STORAGE_KEY = 'sysadmin-path-2026-progress'"));
  const landing = readFileSync(new URL('../src/components/LandingPage.jsx', import.meta.url), 'utf8');
  assert.ok(!landing.includes('Настоящая карта профессии'));
  assert.ok(!landing.includes('landing-map-node'));
});
