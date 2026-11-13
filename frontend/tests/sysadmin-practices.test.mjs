import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { phases } from '../src/data/guide.js';
import { sysadminPractices } from '../src/data/sysadminPractices.js';

test('practice documentation covers exactly the Sysadmin lessons with runnable blocks and acceptance criteria', () => {
  const ids = phases.flatMap(phase => phase.topics.map(topic => topic.id));
  assert.deepEqual(Object.keys(sysadminPractices).sort(), ids.sort());
  for (const [id, doc] of Object.entries(sysadminPractices)) {
    for (const field of ['goal', 'scenario', 'expected', 'cleanup']) assert.ok(doc[field]?.trim(), `${id}: ${field}`);
    for (const field of ['requirements', 'safety', 'steps', 'blocks', 'verification', 'troubleshooting', 'report']) assert.ok(doc[field].length, `${id}: ${field}`);
    assert.ok(doc.steps.length >= 3, id);
    assert.ok(doc.troubleshooting.every(item => item.symptom && item.fix), id);
    for (const block of [...doc.blocks, ...doc.cleanupBlocks]) {
      assert.ok(block.title && block.code.trim(), id);
      assert.ok(['bash', 'powershell', 'cmd', 'text', 'ini', 'yaml', 'json', 'hcl', 'jinja2'].includes(block.language), id);
      assert.ok(['command', 'config'].includes(block.kind), id);
      if (block.language === 'bash') {
        const result = spawnSync('bash', ['-n'], { input: block.code, encoding: 'utf8' });
        assert.equal(result.status, 0, `${id}: ${block.title}: ${result.stderr}`);
      }
    }
  }
});

test('Ansible and Terraform examples include real configuration files rather than commented pseudo-files', () => {
  const ansible = sysadminPractices.ansible.blocks;
  assert.ok(ansible.some(block => block.language === 'yaml' && block.code.includes('ansible.builtin.copy:')));
  assert.ok(ansible.some(block => block.language === 'ini' && block.code.includes('[lab]')));
  const terraform = sysadminPractices.terraform.blocks;
  assert.ok(terraform.some(block => block.language === 'hcl' && block.code.includes('resource "terraform_data" "lab"')));
});

test('destructive cleanup is separated from evidence collection in file and volume labs', () => {
  for (const id of ['linux-first-commands', 'storage-filesystems', 'docker', 'linux-packages']) {
    const doc = sysadminPractices[id];
    assert.ok(doc.cleanupBlocks.length, id);
    assert.ok(doc.blocks.every(block => !/^(?:rm |rmdir |docker volume rm )/m.test(block.code)), id);
  }
});
