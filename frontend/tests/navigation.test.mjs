import test from 'node:test';
import assert from 'node:assert/strict';
import { routeFromLocation } from '../src/navigation.js';

test('default URL opens the public landing page', () => {
  assert.deepEqual(routeFromLocation({ search: '', hash: '' }), { type: 'landing', id: null });
});

test('new view URLs resolve to separate application pages', () => {
  assert.deepEqual(routeFromLocation({ search: '?view=overview', hash: '' }), { type: 'view', id: 'overview' });
  assert.deepEqual(routeFromLocation({ search: '?view=roadmap', hash: '' }), { type: 'view', id: 'roadmap' });
  assert.deepEqual(routeFromLocation({ search: '?view=labs', hash: '' }), { type: 'view', id: 'labs' });
});

test('lesson URLs keep priority and removed chapter URLs lead to resources', () => {
  assert.deepEqual(routeFromLocation({ search: '?lesson=net-osi&view=roadmap', hash: '#overview' }), { type: 'lesson', id: 'net-osi' });
  assert.deepEqual(routeFromLocation({ search: '?chapter=chapter-01', hash: '#roadmap' }), { type: 'view', id: 'resources' });
});

test('legacy dashboard and hash URLs remain compatible', () => {
  assert.deepEqual(routeFromLocation({ search: '?view=dashboard', hash: '' }), { type: 'view', id: 'overview' });
  assert.deepEqual(routeFromLocation({ search: '?view=simulators', hash: '' }), { type: 'view', id: 'labs' });
  assert.deepEqual(routeFromLocation({ search: '?view=book', hash: '' }), { type: 'view', id: 'resources' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#overview' }), { type: 'view', id: 'overview' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#roadmap' }), { type: 'view', id: 'roadmap' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#security-plus' }), { type: 'view', id: 'security-plus' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#computer-technologies' }), { type: 'view', id: 'computer-technologies' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#book-extra' }), { type: 'view', id: 'resources' });
});
