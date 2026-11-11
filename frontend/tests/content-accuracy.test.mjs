import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { lessons } from '../src/data/lessons.js';

function inLab(run) {
  const cwd = mkdtempSync(join(tmpdir(), 'content-accuracy-'));
  try { return run(cwd); } finally { rmSync(cwd, { recursive: true, force: true }); }
}
const exercise = (id) => lessons[id].lab.extraCommands[0].commands;

test('storage copy exercise rejects a corrupted backup instead of checking only the source', () => {
  inLab((cwd) => {
    const script = exercise('ct-storage-filesystems');
    execFileSync('bash', ['-e', '-c', script], { cwd });
    const corrupt = script.replace('cmp ', "printf 'corruption' >> storage-lab/backup.txt\ncmp ");
    assert.notEqual(corrupt, script);
    assert.throws(() => execFileSync('bash', ['-e', '-c', corrupt], { cwd, stdio: 'pipe' }));
  });
});

test('password KDF example verifies correct, incorrect and independently salted inputs', () => {
  const output = execFileSync('bash', ['-e', '-c', lessons['eth-passwords-hashes'].lab.commands], { encoding: 'utf8', timeout: 10000 });
  assert.match(output, /correct password: True/);
  assert.match(output, /wrong password: False/);
  assert.match(output, /same password, different salt: True/);
});

test('signature laboratory accepts the original and explicitly rejects the modified file', () => {
  inLab((cwd) => {
    execFileSync('bash', ['-e', '-c', lessons['secplus-crypto-pki'].lab.commands], { cwd, stdio: 'pipe' });
    const output = execFileSync('bash', ['-e', '-c', exercise('secplus-crypto-pki')], { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    assert.match(output, /Verified OK/);
    assert.match(output, /EXPECTED: modified file rejected/);
  });
});

test('SSH example does not reload either service when syntax validation fails', () => {
  inLab((cwd) => {
    const prelude = `
sudo() {
  if [ "$1" = sshd ]; then
    if [ "$2" = -t ]; then return 1; fi
    printf '%s\\n' 'passwordauthentication no' 'kbdinteractiveauthentication no' 'permitrootlogin no'
  elif [ "$1" = tee ]; then cat >/dev/null
  elif [ "$1" = systemctl ]; then printf '%s\\n' "$*" >> "$COURSE_TEST_LOG"
  fi
  return 0
}
systemctl() { return 0; }
export -f sudo systemctl
`;
    const log = join(cwd, 'reload.log'); writeFileSync(log, '');
    const run = spawnSync('bash', ['-e', '-c', prelude + exercise('lsec-ssh-hardening')], { cwd, env: { ...process.env, COURSE_TEST_LOG: log }, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    assert.equal(readFileSync(log, 'utf8'), '');
    assert.equal((run.stderr.match(/Syntax error: no reload/g) || []).length, 2);

  });
});

test('sysctl runtime laboratory restores the exact prior value even when its body fails', () => {
  inLab((cwd) => {
    const state = join(cwd, 'value');
    const prelude = `
sysctl() {
  if [ "$1" = -n ]; then cat "$COURSE_TEST_STATE"
  elif [ "$1" = -w ]; then printf '%s' "\${2#*=}" > "$COURSE_TEST_STATE"
  else cat "$COURSE_TEST_STATE"
  fi
}
sudo() { "$@"; }
export -f sysctl sudo
`;
    for (const fails of [false, true]) {
      writeFileSync(state, '1');
      const original = exercise('lsec-hardening-audit');
      const script = fails ? original.replace('# Здесь выполните функциональный тест;', 'false\n# Здесь выполните функциональный тест;') : original;
      const run = () => execFileSync('bash', ['-e', '-c', prelude + script], { cwd, env: { ...process.env, COURSE_TEST_STATE: state }, stdio: 'pipe' });
      if (fails) assert.throws(run); else run();
      assert.equal(readFileSync(state, 'utf8'), '1');
    }
  });
});
