import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { allTopics, courseCatalog, topicById } from '../src/data/catalog.js';
import { lessons } from '../src/data/lessons.js';
import { lessonDetails } from '../src/data/lessonDetails.js';
import { lessonWalkthroughs } from '../src/data/lessonWalkthroughs.js';
import { resources, resourcesById, lessonResources } from '../src/data/resources.js';
import { lessonVideos } from '../src/data/lessonVideos.js';
import { getTrackMeta } from '../src/data/tracks.js';
import {
  networkEngineerCourse, networkEngineerPhases, networkEngineerProfiles,
  networkEngineerLessons, networkEngineerDetails, networkEngineerWalkthroughs,
  networkEngineerResources, networkEngineerLessonResources, networkEngineerCertifications,
} from '../src/data/networkEngineer.js';
import { lessonHref, routeFromLocation, viewHref } from '../src/navigation.js';
import { courseSearchItems, searchCourse } from '../src/lib/courseSearch.js';
import { curriculum } from '../scripts/content-data.mjs';
import { curriculumSchema, questionSchema } from '../src/lib/contentSchema.js';

const baseline = JSON.parse(readFileSync(new URL('./baseline-lesson-ids.json', import.meta.url), 'utf8'));
const newIds = networkEngineerCourse.topics.map((topic) => topic.id);

test('Network Engineer publishes twenty ordered lessons without replacing baseline identifiers', () => {
  assert.equal(baseline.length, 107);
  assert.equal(networkEngineerCourse.id, 'network-engineer');
  assert.equal(newIds.length, 20);
  assert.equal(new Set(newIds).size, 20);
  assert.ok(newIds.every((id) => id.startsWith('ne-')));
  assert.equal(newIds.at(-1), 'ne-capstone-career');
  assert.deepEqual(newIds.filter((id) => baseline.includes(id)), []);
  assert.deepEqual(networkEngineerPhases.flatMap((phase) => phase.topics.map((topic) => topic.id)), newIds);
  assert.equal(new Set(networkEngineerPhases.map((phase) => phase.id)).size, networkEngineerPhases.length);
  assert.ok(networkEngineerPhases.every((phase) => phase.title && phase.topics.length));
  assert.deepEqual(courseCatalog.find((course) => course.id === 'network-engineer'), networkEngineerCourse);

  for (const id of baseline) {
    assert.ok(topicById.has(id), `${id}: baseline topic retained`);
    assert.ok(lessons[id] && lessonDetails[id] && lessonWalkthroughs[id] && lessonResources[id], `${id}: baseline content retained`);
  }
  assert.equal(new Set(allTopics.map((topic) => topic.id)).size, allTopics.length);
});

test('every network lesson has distinct theory, terminology, practical tasks and a valid assessment', () => {
  assert.deepEqual(networkEngineerProfiles.map((profile) => profile.id), newIds);
  for (const content of [networkEngineerLessons, networkEngineerDetails, networkEngineerWalkthroughs, networkEngineerLessonResources]) {
    assert.deepEqual(Object.keys(content).sort(), [...newIds].sort());
  }
  for (const profile of networkEngineerProfiles) {
    const { id } = profile;
    const lesson = networkEngineerLessons[id];
    const detail = networkEngineerDetails[id];
    const walkthrough = networkEngineerWalkthroughs[id];
    assert.ok(profile.theory.length >= 3 && profile.theory.every((paragraph) => typeof paragraph === 'string' && paragraph.trim()), `${id}: theory`);
    assert.equal(new Set(profile.theory).size, profile.theory.length, `${id}: repeated theory`);
    assert.ok(profile.terms.length >= 3 && profile.terms.every((item) => item.term && item.definition), `${id}: terminology`);
    assert.equal(new Set(profile.terms.map((item) => item.term.trim().toLocaleLowerCase())).size, profile.terms.length, `${id}: distinct terminology`);
    assert.ok(lesson.intro && lesson.sections.length && lesson.sections.every((section) => section.title && section.paragraphs.length), `${id}: lesson sections`);
    assert.ok(detail.goals.length >= 3 && detail.goals.every(Boolean), `${id}: learning goals`);
    assert.ok(detail.deepDive.length >= 2 && detail.deepDive.every(Boolean), `${id}: detailed theory`);
    const publishedTheory = [...lesson.sections.flatMap((section) => section.paragraphs), ...detail.deepDive];
    assert.ok(profile.theory.every((paragraph) => publishedTheory.includes(paragraph)), `${id}: all theory is published`);
    assert.ok(profile.terms.every(({ term, definition }) => publishedTheory.some((paragraph) => paragraph.includes(term) && paragraph.includes(definition))), `${id}: terminology is explained in the lesson`);
    assert.ok(detail.diagram.length >= 3 && detail.diagram.every(Boolean), `${id}: process diagram`);
    assert.ok(detail.caseStudy.situation && detail.caseStudy.action && detail.caseStudy.result, `${id}: case study`);
    assert.ok(detail.practiceTasks.length >= 2 && detail.practiceTasks.every((task) => task.task && task.hint && task.solution), `${id}: independent practice`);
    assert.equal(detail.question.options.length, 4, `${id}: four answer choices`);
    assert.equal(questionSchema.safeParse(detail.question).success, true, `${id}: valid assessment`);
    assert.ok(lesson.lab.steps.length && lesson.lab.commands && lesson.lab.expected && lesson.lab.pitfalls.length, `${id}: executable practice and expected result`);
    assert.ok(profile.lab.prerequisites.length && profile.lab.prerequisites.every(Boolean), `${id}: lab preparation`);
    assert.ok(profile.lab.troubleshooting.length && profile.lab.troubleshooting.every(Boolean), `${id}: diagnosis`);
    assert.ok(profile.lab.cleanup.length && profile.lab.cleanup.every(Boolean), `${id}: cleanup`);
    assert.ok(profile.lab.limitations, `${id}: limits of the model`);
    assert.ok(walkthrough.title && walkthrough.context && walkthrough.steps.length >= 3 && walkthrough.verification && walkthrough.troubleshooting, `${id}: complete walkthrough`);
    assert.deepEqual(lessons[id], lesson, `${id}: published lesson`);
    assert.deepEqual(lessonDetails[id], detail, `${id}: published detail`);
    assert.deepEqual(lessonWalkthroughs[id], walkthrough, `${id}: published walkthrough`);
  }
  assert.equal(new Set(newIds.map((id) => networkEngineerDetails[id].question.question.trim().toLocaleLowerCase())).size, newIds.length);
  assert.equal(curriculumSchema.safeParse(curriculum).success, true);
});

test('each network lesson has at least two unique references to published HTTPS sources', () => {
  assert.equal(new Set(resources.map((resource) => resource.id)).size, resources.length);
  for (const source of networkEngineerResources) {
    assert.equal(new URL(source.url).protocol, 'https:', source.id);
    assert.ok(source.title && source.description && source.type && source.language && source.access, source.id);
    assert.deepEqual(resourcesById[source.id], source, `${source.id}: registered resource`);
  }
  for (const id of newIds) {
    const references = networkEngineerLessonResources[id];
    assert.ok(references.length >= 2, id);
    assert.equal(new Set(references.map((reference) => reference.sourceId)).size, references.length, id);
    for (const reference of references) {
      assert.ok(resourcesById[reference.sourceId], `${id}: unknown source ${reference.sourceId}`);
      assert.ok(reference.focus, `${id}: explain how to use ${reference.sourceId}`);
      assert.ok(lessonResources[id].some((published) => published.sourceId === reference.sourceId && published.focus === reference.focus), `${id}: reference is published`);
    }
  }
});

test('network routes and search expose every lesson in the new course', () => {
  assert.deepEqual(routeFromLocation({ search: viewHref('network-engineer'), hash: '' }), { type: 'view', id: 'network-engineer' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#network-engineer' }), { type: 'view', id: 'network-engineer' });
  assert.equal(getTrackMeta('network-engineer').hash, '#network-engineer');
  for (const topic of networkEngineerCourse.topics) {
    assert.deepEqual(routeFromLocation({ search: lessonHref(topic.id), hash: '' }), { type: 'lesson', id: topic.id });
    assert.deepEqual(topicById.get(topic.id), topic);
    const matches = courseSearchItems.filter((item) => item.id === `lesson:${topic.id}`);
    assert.equal(matches.length, 1, topic.id);
    assert.equal(matches[0].context, networkEngineerCourse.title);
    assert.equal(matches[0].href, lessonHref(topic.id));
    assert.ok(searchCourse(topic.title).some((item) => item.id === `lesson:${topic.id}`), `${topic.id}: find the lesson by title`);
  }
  assert.ok(searchCourse('Network Engineer').some((item) => item.context === networkEngineerCourse.title));
});

test('every Network Engineer topic has a sourced English video', () => {
  for (const topic of networkEngineerCourse.topics) {
    const video = lessonVideos[topic.id];
    assert.ok(video, `${topic.id}: English video metadata`);
    assert.match(video.id, /^[A-Za-z0-9_-]{11}$/, topic.id);
    assert.ok(video.title && video.sourceName, topic.id);
    assert.equal(new URL(video.source).protocol, 'https:', topic.id);
  }
});

test('network certifications include four distinct official programs', () => {
  const expected = [
    [/Network\+/, 'comptia.org'], [/\bCCNA\b/, 'cisco.com'],
    [/JNCIA-Junos/, 'juniper.net'], [/CCNP Enterprise/, 'cisco.com'],
  ];
  assert.equal(networkEngineerCertifications.length, 4);
  assert.equal(new Set(networkEngineerCertifications.map((certification) => certification.id)).size, 4);
  for (const [name, domain] of expected) {
    const certification = networkEngineerCertifications.find((item) => name.test(item.name));
    assert.ok(certification, `${name}: missing program`);
    assert.ok(certification.description, certification.name);
    const url = new URL(certification.url);
    assert.equal(url.protocol, 'https:', certification.name);
    assert.ok(url.hostname === domain || url.hostname.endsWith(`.${domain}`), `${certification.name}: official source`);
  }
});

const modelChecks = [
  ['ne-ipv4-subnetting', [/users 192\.0\.2\.0\/26 usable: 192\.0\.2\.1 - 192\.0\.2\.62 broadcast: 192\.0\.2\.63/, /voice 192\.0\.2\.64\/27/, /management 192\.0\.2\.96\/28/, /Allocated addresses: 112/, /Unallocated addresses: 144/]],
  ['ne-ipv6', [/servers 2001:db8:1200:2::\/64/, /Compressed: 2001:db8:1200:2::10/, /servers membership: PASS/, /fe80::1 is link-local: True/]],
  ['ne-routing-ospf', [/SPF: R1 -> R2 -> R3 -> R4 \| cost: 20/, /LPM: 10\.20\.30\.9 -> 10\.20\.30\.0\/24/]],
  ['ne-bgp-wan', [/Eligible: A, B/, /Selected: B \| LOCAL_PREF: 200 \| AS_PATH length: 3/, /Model only: no BGP session or route announcement/]],
  ['ne-security-access', [
    /\('udp', '10\.20\.0\.53', 53\) allow/,
    /\('tcp', '10\.20\.0\.10', 443\) allow/,
    /\('tcp', '10\.20\.0\.10', 22\) deny/,
    /\('udp', '10\.20\.0\.99', 53\) deny/,
  ]],
  ['ne-vpn', [/Before: eth1/, /After: wg0/, /MTU budget: 1420/]],
  ['ne-monitoring-telemetry', [/rate=2000000 bit\/s; utilization=2\.0%/, /Decreasing counter: unknown/]],
  ['ne-cloud-sdn', [/Rejected overlap: True/, /Corrected overlap: False/, /Subnets valid: True/]],
  ['ne-automation', [/Proposed changes: \[\('Gi0\/2', 'enabled', True, False\)\]/, /Repeated diff: \[\]/]],
  ['ne-troubleshooting-change', [/Failed before: \['https'\]/, /All acceptance checks after: True/, /Negative test remains deny/]],
];

for (const [id, checks] of modelChecks) {
  test(`${id} runs its local model and produces the documented decisions`, () => {
    const cwd = mkdtempSync(join(tmpdir(), 'network-engineer-'));
    try {
      const output = execFileSync('bash', ['-eu', '-c', networkEngineerLessons[id].lab.commands], { cwd, encoding: 'utf8', timeout: 10000 });
      for (const expected of checks) assert.match(output, expected, id);
    } finally { rmSync(cwd, { recursive: true, force: true }); }
  });
}
