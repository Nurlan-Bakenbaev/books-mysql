import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { sysadminRoadmapNodes } from '../src/data/sysadminRoadmap.js';

const documentSource = readFileSync(new URL('../../docs/sysadmin-roadmap-2026.mmd', import.meta.url), 'utf8');
const progressKey = 'sysadmin-path-2026-progress';

async function openMap(page) {
  await page.goto('/');
  const mapLink = page.getByRole('navigation', { name: 'Навигация главной страницы' }).getByRole('link', { name: 'Карта', exact: true });
  await expect(mapLink).toHaveAttribute('href', '#landing-map');
  await mapLink.click();
  const map = page.locator('#landing-map.interactive-roadmap');
  await expect(map).toBeVisible();
  await expect(map.locator('.roadmap-diagram svg .node')).toHaveCount(sysadminRoadmapNodes.length);
  return map;
}

function sourceDetails(map) {
  return map.locator('details').filter({ has: map.page().locator('summary').filter({ hasText: /^Код Mermaid$/ }) });
}

function listDetails(map) {
  return map.locator('details').filter({ has: map.page().locator('summary').filter({ hasText: /^Этапы списком$/ }) });
}

test.beforeEach(async ({ page }) => {
  await page.route(/youtube|googleapis|gstatic/, (route) => route.abort());
});

test('homepage renders the complete Mermaid graph and follows an internal SVG node', async ({ page }) => {
  const map = await openMap(page);
  const anchors = map.locator('.roadmap-diagram a[data-route-link]');
  await expect(anchors).toHaveCount(sysadminRoadmapNodes.length);
  const firstNodeFits = await map.locator('.roadmap-viewport').evaluate((viewport) => {
    const first = viewport.querySelector('.node').getBoundingClientRect();
    const view = viewport.getBoundingClientRect();
    return first.left >= view.left && first.right <= view.right;
  });
  expect(firstNodeFits).toBe(true);
  const hrefs = await anchors.evaluateAll((links) => links.map((link) => link.getAttribute('href') || link.getAttribute('xlink:href')));
  expect(hrefs.sort()).toEqual(sysadminRoadmapNodes.map((node) => node.href).sort());
  const lessonLink = anchors.first();
  const href = await lessonLink.evaluate((link) => link.getAttribute('href') || link.getAttribute('xlink:href'));
  await lessonLink.click();
  await expect(page).toHaveURL(new URL(href, 'http://127.0.0.1:4175/').href);
  await expect(page.locator('.route-not-found')).toHaveCount(0);
  await expect(page.locator('h1')).toBeVisible();
});

test('Mermaid disclosure and clipboard preserve the exact reusable source', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const map = await openMap(page);
  const source = sourceDetails(map);
  await source.locator('summary').click();
  await expect(source.locator('code')).toHaveText(documentSource, { useInnerText: false });
  expect(await source.locator('code').textContent()).toBe(documentSource);
  await map.getByRole('button', { name: 'Копировать Mermaid', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(documentSource);
});

test('zoom changes diagram size and fit shows the whole diagram', async ({ page }) => {
  const map = await openMap(page);
  const diagram = map.locator('.roadmap-diagram svg');
  const initialWidth = await diagram.evaluate((svg) => svg.getBoundingClientRect().width);
  await map.getByRole('button', { name: 'Увеличить карту', exact: true }).click();
  await expect.poll(() => diagram.evaluate((svg) => svg.getBoundingClientRect().width)).toBeGreaterThan(initialWidth);
  const zoomedWidth = await diagram.evaluate((svg) => svg.getBoundingClientRect().width);
  await map.getByRole('button', { name: 'Уменьшить карту', exact: true }).click();
  await expect.poll(() => diagram.evaluate((svg) => svg.getBoundingClientRect().width)).toBeLessThan(zoomedWidth);
  await map.getByRole('button', { name: 'Показать целиком', exact: true }).click();
  const fits = await map.locator('.roadmap-viewport').evaluate((viewport) => {
    const svg = viewport.querySelector('svg').getBoundingClientRect();
    return svg.width <= viewport.clientWidth && svg.height <= viewport.clientHeight;
  });
  expect(fits).toBe(true);
});

test('the alternative list opens and navigates using the keyboard', async ({ page }) => {
  const map = await openMap(page);
  const list = listDetails(map);
  const summary = list.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(list).toHaveAttribute('open', '');
  const links = list.getByRole('link');
  await expect(links).toHaveCount(sysadminRoadmapNodes.length);
  await page.keyboard.press('Tab');
  await expect(links.first()).toBeFocused();
  const href = await links.first().getAttribute('href');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new URL(href, 'http://127.0.0.1:4175/').href);
  await expect(page.locator('.route-not-found')).toHaveCount(0);
});

test('a 320px screen contains the zoomed diagram and source without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  const map = await openMap(page);
  await map.getByRole('button', { name: 'Увеличить карту', exact: true }).click();
  await map.getByRole('button', { name: 'Увеличить карту', exact: true }).click();
  await sourceDetails(map).locator('summary').click();
  await listDetails(map).locator('summary').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(map.getByRole('button', { name: 'Показать целиком', exact: true })).toBeVisible();
});

test('using the map preserves existing and unknown saved progress', async ({ page }) => {
  const saved = ['network-models', 'secplus-crypto-pki', 'ct-uefi-boot', 'future-id'];
  await page.addInitScript(({ key, ids }) => localStorage.setItem(key, JSON.stringify(ids)), { key: progressKey, ids: saved });
  const map = await openMap(page);
  await map.getByRole('button', { name: 'Увеличить карту', exact: true }).click();
  await listDetails(map).locator('summary').click();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), progressKey)).toEqual(saved);
  await page.goto('/?lesson=secplus-crypto-pki');
  await expect(page.getByRole('button', { name: 'Отменить отметку', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Отменить отметку', exact: true })).toBeVisible();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), progressKey)).toEqual(saved);
});
