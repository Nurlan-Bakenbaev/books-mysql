import Fuse from 'fuse.js';

export function createFuzzySearch(items, keys, options = {}) {
  const index = new Fuse(items, {
    keys, threshold: 0.32, ignoreLocation: true, minMatchCharLength: 2,
    ...options,
  });
  return (query) => query.trim() ? index.search(query.trim()).map(({ item }) => item) : items;
}
