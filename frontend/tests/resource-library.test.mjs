import test from 'node:test';
import assert from 'node:assert/strict';
import { resources, lessonResources } from '../src/data/resources.js';
import { buildLibrary, libraryCategories, resourceCategory } from '../src/lib/resourceLibrary.js';

test('library publishes learning formats while lesson references remain resolvable', () => {
  const library = buildLibrary(resources);
  assert.deepEqual(new Set(library.map((resource) => resource.category)), new Set(libraryCategories));
  for (const id of ['linux-community', 'network-roadmap', 'sp-juice-shop', 'sp-nvd', 'ne-netbox', 'ne-ccna']) {
    assert.ok(resources.some((resource) => resource.id === id), `${id}: original reference retained`);
    assert.ok(!library.some((resource) => resource.sourceIds.includes(id)), `${id}: excluded from library`);
  }
  assert.equal(resourceCategory(resources.find((resource) => resource.id === 'csf-rfc9110')), 'Документация');
  assert.equal(resourceCategory(resources.find((resource) => resource.id === 'sp-messer')), 'Курсы');
  assert.equal(resourceCategory(resources.find((resource) => resource.id === 'sp-ms-identity')), 'Документация');
  const registeredIds = new Set(resources.map((resource) => resource.id));
  assert.ok(Object.values(lessonResources).flat().every((reference) => registeredIds.has(reference.sourceId)));
});

test('library merges repeated links and retains all lesson source identities', () => {
  const library = buildLibrary(resources);
  const ostep = library.filter((resource) => resource.url === 'https://pages.cs.wisc.edu/~remzi/OSTEP/');
  assert.equal(ostep.length, 1);
  assert.ok(ostep[0].sourceIds.includes('csf-ostep-vm'));
  assert.ok(ostep[0].sourceIds.includes('csf-ostep-processes'));
});
