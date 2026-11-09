import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { calculateSubnet } from '../src/data/subnet.js';
import { executeVirtualCommand } from '../src/data/virtualShell.js';

test('IPv4 calculator handles ordinary and /0, /31, /32 boundary cases', () => {
  assert.deepEqual(calculateSubnet('192.0.2.130', '26'), {
    network: '192.0.2.128/26', mask: '255.255.255.192', broadcast: '192.0.2.191',
    firstHost: '192.0.2.129', lastHost: '192.0.2.190', usableHosts: 62, prefix: 26,
  });
  assert.deepEqual(calculateSubnet('203.0.113.7', '31'), {
    network: '203.0.113.6/31', mask: '255.255.255.254', broadcast: '203.0.113.7',
    firstHost: '203.0.113.6', lastHost: '203.0.113.7', usableHosts: 2, prefix: 31,
  });
  assert.equal(calculateSubnet('203.0.113.7', '32').usableHosts, 1);
  assert.equal(calculateSubnet('203.0.113.7', '32').firstHost, '203.0.113.7');
  assert.equal(calculateSubnet('255.255.255.255', '0').network, '0.0.0.0/0');
  assert.equal(calculateSubnet('255.255.255.255', '0').usableHosts, 4294967294);
});

test('IPv4 calculator matches Python ipaddress for every prefix', () => {
  const addresses = ['0.0.0.0', '192.0.2.130', '203.0.113.255', '255.255.255.255'];
  const cases = addresses.flatMap((address) => Array.from({ length: 33 }, (_, prefix) => ({ address, prefix })));
  const script = [
    'import ipaddress, json, sys',
    'cases = json.load(sys.stdin)',
    'results = []',
    'for item in cases:',
    "    net = ipaddress.ip_network(f\"{item['address']}/{item['prefix']}\", strict=False)",
    '    first = net.network_address if net.prefixlen >= 31 else net.network_address + 1',
    '    last = net.broadcast_address if net.prefixlen >= 31 else net.broadcast_address - 1',
    '    count = net.num_addresses if net.prefixlen >= 31 else net.num_addresses - 2',
    '    results.append([str(net), str(net.netmask), str(net.broadcast_address), str(first), str(last), count])',
    'json.dump(results, sys.stdout)',
  ].join('\n');
  const expected = JSON.parse(execFileSync('python3', ['-c', script], { input: JSON.stringify(cases), encoding: 'utf8' }));
  cases.forEach(({ address, prefix }, index) => {
    const result = calculateSubnet(address, String(prefix));
    assert.deepEqual([result.network, result.mask, result.broadcast, result.firstHost, result.lastHost, result.usableHosts], expected[index], `${address}/${prefix}`);
  });
});

test('IPv4 calculator explicitly rejects invalid addresses and prefixes', () => {
  for (const address of ['', '256.0.0.1', '1.2.3', '1.2.3.4.5', '01.2.3.4', '1.-1.3.4', '1.2.3.x']) {
    assert.throws(() => calculateSubnet(address, '24'), /IPv4/, address);
  }
  for (const prefix of ['', '-1', '33', '2.5', '024', 'abc']) {
    assert.throws(() => calculateSubnet('192.0.2.1', prefix), /префикса/, prefix);
  }
});

test('virtual shell navigates its in-memory files and rejects real commands', () => {
  const home = '/home/student';
  assert.equal(executeVirtualCommand('pwd', home).output, home);
  assert.match(executeVirtualCommand('ls', home).output, /notes\.txt/);
  assert.match(executeVirtualCommand('cat notes.txt', home).output, /Учебная VM/);
  const moved = executeVirtualCommand('cd logs', home);
  assert.equal(moved.cwd, '/home/student/logs');
  assert.match(executeVirtualCommand('cat practice.log', moved.cwd).output, /ERROR/);
  assert.equal(executeVirtualCommand('cd ..', moved.cwd).cwd, home);
  assert.equal(executeVirtualCommand('cd /../../home/student', moved.cwd).cwd, home);
  assert.match(executeVirtualCommand('cat /etc/passwd', home).output, /не найден/);
  assert.match(executeVirtualCommand('touch /tmp/not-allowed', home).output, /не поддерживаются/);
  assert.match(executeVirtualCommand('$(whoami)', home).output, /не поддерживаются/);
  assert.equal(executeVirtualCommand('clear', home).clear, true);
});
