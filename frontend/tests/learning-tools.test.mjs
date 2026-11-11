import test from 'node:test';
import assert from 'node:assert/strict';
import { searchCourse, courseSearchItems } from '../src/lib/courseSearch.js';
import { curriculum } from '../scripts/content-data.mjs';
import { curriculumSchema, questionSchema } from '../src/lib/contentSchema.js';
import { highlightCode } from '../src/lib/highlight.js';

test('course search covers every published lesson and finds misspellings across content kinds', () => {
  assert.equal(courseSearchItems.filter((item) => item.kind === 'Урок').length, 134);
  assert.ok(searchCourse('криптогрфия').some((item) => item.id === 'lesson:secplus-crypto-pki'));
  assert.ok(searchCourse('USB').some((item) => item.id === 'lesson:ct-interfaces-peripherals'));
  assert.ok(searchCourse('MFA').some((item) => item.kind === 'Термин'));
  assert.ok(searchCourse('OWASP').some((item) => item.kind === 'Источник'));
  assert.deepEqual(searchCourse('zzzzzzzzzzzzzzzz'), []);
});

test('Zod accepts the curriculum and rejects absent content, broken references and invalid quizzes', () => {
  assert.equal(curriculumSchema.safeParse(curriculum).success, true);
  const missing = structuredClone(curriculum); delete missing.lessons['secplus-crypto-pki'];
  assert.equal(curriculumSchema.safeParse(missing).success, false);
  const broken = structuredClone(curriculum); broken.references['ip-addressing'][0].sourceId = 'missing-source';
  assert.equal(curriculumSchema.safeParse(broken).success, false);
  const malformed = structuredClone(curriculum); malformed.resources[0].url = 'not a URL';
  assert.equal(curriculumSchema.safeParse(malformed).success, false);
  const missingSection = structuredClone(curriculum); delete missingSection.details['ip-addressing'].diagram;
  assert.equal(curriculumSchema.safeParse(missingSection).success, false);
  const invalid = structuredClone(curriculum); invalid.exam[0].answer = 4;
  assert.equal(curriculumSchema.safeParse(invalid).success, false);
  const duplicate = structuredClone(curriculum); duplicate.exam[1].question = duplicate.exam[0].question;
  assert.equal(curriculumSchema.safeParse(duplicate).success, false);
  assert.equal(questionSchema.safeParse({ question: 'Q', options: ['Same', 'same', 'other'], answer: 0, explanation: 'Reason' }).success, false);
});

test('Shiki supports the five target languages without altering source characters', async () => {
  const examples = [
    ['POWERSHELL', 'Get-Service | Select-Object Name'],
    ['BASH', 'printf "%s\\n" "$HOME"'],
    ['PYTHON', 'print("<script>alert(1)</script>")\n'],
    ['YAML', 'name: demo\nsteps:\n  - run: echo test'],
    ['JSON', '{"name":"demo", "enabled":true}'],
    ['BASH', "python3 - <<'PY'\nprint('hello')\nPY\n"],
  ];
  for (const [label, source] of examples) {
    const lines = await highlightCode(source, label);
    assert.equal(lines.map((line) => line.map((token) => token.content).join('')).join('\n'), source);
    assert.ok(lines.flat().some((token) => token.color));
  }
});
