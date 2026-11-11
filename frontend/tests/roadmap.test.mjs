import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { topicById } from '../src/data/catalog.js';
import { lessons } from '../src/data/lessons.js';
import { routeFromLocation } from '../src/navigation.js';
import { sysadminRoadmapSource, sysadminRoadmapNodes, sysadminRoadmapLevels } from '../src/data/sysadminRoadmap.js';

const documentSource = readFileSync(new URL('../../docs/sysadmin-roadmap-2026.mmd', import.meta.url), 'utf8');

test('published Mermaid source exactly matches the reusable roadmap document', () => {
  assert.equal(sysadminRoadmapSource, documentSource);
  assert.match(sysadminRoadmapSource, /^flowchart TD\b/m);
  assert.doesNotMatch(sysadminRoadmapSource, /```/);
});

test('every diagram node has unique metadata, a level and a matching click target', () => {
  const declaredIds = [...sysadminRoadmapSource.matchAll(/^\s*(\w+)\s*\["/gm)].map((match) => match[1]);
  const clickTargets = [...sysadminRoadmapSource.matchAll(/^\s*click\s+(\w+)\s+(?:href\s+)?"([^"]+)"/gm)]
    .map((match) => [match[1], match[2]]);
  const nodeIds = sysadminRoadmapNodes.map((node) => node.id);
  const levelIds = sysadminRoadmapLevels.map((level) => level.id);

  assert.ok(nodeIds.length > 0);
  assert.equal(new Set(nodeIds).size, nodeIds.length);
  assert.equal(new Set(declaredIds).size, declaredIds.length);
  assert.equal(new Set(clickTargets.map(([id]) => id)).size, clickTargets.length);
  assert.deepEqual([...declaredIds].sort(), [...nodeIds].sort());
  assert.deepEqual(clickTargets.sort(([a], [b]) => a.localeCompare(b)),
    sysadminRoadmapNodes.map(({ id, href }) => [id, href]).sort(([a], [b]) => a.localeCompare(b)));
  assert.deepEqual(levelIds, [0, 1, 2, 3, 4]);
  assert.deepEqual([...new Set(sysadminRoadmapNodes.map((node) => node.level))].sort(), levelIds);
  for (const level of sysadminRoadmapLevels) assert.ok(level.title, `Level ${level.id}: title`);
  for (const node of sysadminRoadmapNodes) {
    assert.ok(node.title && node.description, `${node.id}: accessible description`);
    assert.ok(levelIds.includes(node.level), `${node.id}: unknown level ${node.level}`);
  }
});

test('all roadmap links resolve to published lessons or application views', () => {
  const views = new Set(['roadmap', 'labs', 'certifications']);
  for (const node of sysadminRoadmapNodes) {
    const url = new URL(node.href, 'https://sysadmin.example/');
    assert.equal(url.origin, 'https://sysadmin.example', `${node.id}: internal link`);
    assert.equal(url.pathname, '/', `${node.id}: application route`);
    const route = routeFromLocation(url);
    if (route.type === 'lesson') {
      assert.ok(topicById.has(route.id), `${node.id}: unknown topic ${route.id}`);
      assert.ok(lessons[route.id], `${node.id}: unpublished lesson ${route.id}`);
    } else {
      assert.equal(route.type, 'view', `${node.id}: missing application destination`);
      assert.ok(views.has(route.id), `${node.id}: unknown view ${route.id}`);
    }
  }
});

test('the roadmap covers the requested technologies and career outcomes', () => {
  const required = [
    'OSI', 'TCP/IP', 'DNS', 'DHCP', 'IPv4', 'IPv6', 'Windows', 'Linux',
    'Ubuntu', 'Debian', 'RHEL', 'AD', 'GPO', 'IIS', 'Docker', 'Proxmox',
    'VMware', 'Hyper-V', 'AWS', 'Yandex Cloud', 'Azure', 'IAM', 'VPN', 'DR',
    'Bash', 'Python', 'PowerShell', 'Zabbix', 'Prometheus', 'Grafana', 'Git',
    'Ansible', 'IaC', 'CI/CD', 'Junior', 'Middle', 'DevOps',
  ];
  for (const keyword of required) {
    assert.ok(sysadminRoadmapSource.includes(keyword), `Missing requested topic: ${keyword}`);
  }
});
