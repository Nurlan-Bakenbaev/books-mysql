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

test('lesson and chapter URLs keep priority over view and hash', () => {
  assert.deepEqual(routeFromLocation({ search: '?lesson=net-osi&view=roadmap', hash: '#overview' }), { type: 'lesson', id: 'net-osi' });
  assert.deepEqual(routeFromLocation({ search: '?chapter=chapter-01', hash: '#roadmap' }), { type: 'chapter', id: 'chapter-01' });
});

test('legacy dashboard and hash URLs remain compatible', () => {
  assert.deepEqual(routeFromLocation({ search: '?view=dashboard', hash: '' }), { type: 'view', id: 'overview' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#overview' }), { type: 'view', id: 'overview' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#roadmap' }), { type: 'view', id: 'roadmap' });
  assert.deepEqual(routeFromLocation({ search: '', hash: '#book-extra' }), { type: 'view', id: 'book' });
});
