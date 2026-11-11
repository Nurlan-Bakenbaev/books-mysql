import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { sysadminRoadmapNodes, sysadminRoadmapLevels } from '../src/data/sysadminRoadmap.js';

const documentSource = readFileSync(new URL('../../docs/sysadmin-roadmap-2026.mmd', import.meta.url), 'utf8');
const progressKey = 'sysadmin-path-2026-progress';
const stageButton = (map, id) => map.getByRole('navigation', { name: 'Уровни дорожной карты' }).getByRole('button').nth(id);

async function expectWholeMapFits(map) {
  await expect(map.locator('.roadmap-panel')).toHaveAttribute('data-mode', 'all');
  await expect(map.locator('.roadmap-diagram svg .node')).toHaveCount(sysadminRoadmapNodes.length);
  await expect.poll(() => map.locator('.roadmap-viewport').evaluate((viewport) => {
    const svg = viewport.querySelector('svg')?.getBoundingClientRect();
    const box = viewport.getBoundingClientRect();
    return Boolean(svg && viewport.scrollWidth <= viewport.clientWidth + 1 && viewport.scrollHeight <= viewport.clientHeight + 1
      && svg.left >= box.left - 1 && svg.right <= box.right + 1 && svg.top >= box.top - 1 && svg.bottom <= box.bottom + 1);
  })).toBe(true);
}

async function openMap(page, full = true) {
  await page.goto('/');
  await expect(page.locator('#career-map')).toHaveCount(0);
  const menu = page.getByRole('button', { name: 'Открыть меню главной страницы', exact: true });
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await menu.click();
  const mapLink = page.getByRole('navigation', { name: 'Навигация главной страницы' }).getByRole('link', { name: 'Карта', exact: true });
  await expect(mapLink).toHaveAttribute('href', '?view=career-map');
  await mapLink.click();
  await expect(page).toHaveURL(/view=career-map/);
  const map = page.locator('#career-map');
  await expect(map.getByRole('heading', { name: 'Как стать системным администратором', level: 1 })).toBeVisible();
  await expectWholeMapFits(map);
  if (!full) {
    await stageButton(map, 0).click();
    await expect(map.locator('.roadmap-diagram svg .node')).toHaveCount(3);
  }
  return map;
}

test.beforeEach(async ({ page }) => {
  await page.route(/youtube|googleapis|gstatic/, (route) => route.abort());
});

test('the map opens from the hamburger menu and stays inside the platform menu', async ({ page, isMobile }) => {
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Открыть меню главной страницы', exact: true });
  await open.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation', { name: 'Навигация главной страницы' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  await expect(open).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('navigation', { name: 'Навигация главной страницы' })).toHaveCount(0);
  await openMap(page);
  await expect(page.locator('.topbar').getByRole('link', { name: 'Карта', exact: true })).toHaveCount(0);
  if (isMobile) await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
  await expect(page.locator('.academy-sidebar').getByRole('link', { name: 'Карта', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('each level displays its own readable steps and matching lesson links', async ({ page }) => {
  const map = await openMap(page);
  for (const level of sysadminRoadmapLevels) {
    const button = stageButton(map, level.id);
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    const expectedNodes = sysadminRoadmapNodes.filter((node) => node.level === level.id);
    await expect(map.locator('.roadmap-diagram svg > title')).toHaveText(level.title);
    await expect(map.locator('.roadmap-diagram svg .node')).toHaveCount(expectedNodes.length);
    await expect(map.locator('.roadmap-step-cards a')).toHaveCount(expectedNodes.length);
    const hrefs = await map.locator('.roadmap-diagram a[data-route-link]').evaluateAll((links) => links.map((link) => link.getAttribute('href') || link.getAttribute('xlink:href')));
    expect(hrefs.sort()).toEqual(expectedNodes.map((node) => node.href).sort());
  }
});

test('the full graph retains every internal link and follows an SVG node', async ({ page }) => {
  const map = await openMap(page);
  const anchors = map.locator('.roadmap-diagram a[data-route-link]');
  await expect(anchors).toHaveCount(sysadminRoadmapNodes.length);
  const hrefs = await anchors.evaluateAll((links) => links.map((link) => link.getAttribute('href') || link.getAttribute('xlink:href')));
  expect(hrefs.sort()).toEqual(sysadminRoadmapNodes.map((node) => node.href).sort());
  const href = await anchors.first().evaluate((link) => link.getAttribute('href') || link.getAttribute('xlink:href'));
  await anchors.first().click();
  await expect(page).toHaveURL(new URL(href, 'http://127.0.0.1:4175/').href);
  await expect(page.locator('.route-not-found')).toHaveCount(0);
  await expect(page.locator('h1')).toBeVisible();
});

test('Mermaid disclosure and clipboard preserve the full source in level mode', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const map = await openMap(page, false);
  await map.locator('.roadmap-source summary').click();
  expect(await map.locator('.roadmap-source code').textContent()).toBe(documentSource);
  await map.getByRole('button', { name: 'Копировать Mermaid', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(documentSource);
});

test('level zoom and fit work; returning to the complete map removes internal scrolling', async ({ page }) => {
  const map = await openMap(page, false);
  const diagram = map.locator('.roadmap-diagram svg');
  const initialWidth = await diagram.evaluate((svg) => svg.getBoundingClientRect().width);
  await map.getByRole('button', { name: 'Увеличить карту', exact: true }).click();
  await expect.poll(() => diagram.evaluate((svg) => svg.getBoundingClientRect().width)).toBeGreaterThan(initialWidth);
  await map.getByRole('button', { name: 'Показать целиком', exact: true }).click();
  await map.getByRole('button', { name: 'Полная карта', exact: true }).click();
  await expectWholeMapFits(map);
  await page.setViewportSize({ width: 320, height: 844 });
  await expectWholeMapFits(map);
});

test('the alternative list opens and navigates using the keyboard', async ({ page }) => {
  const map = await openMap(page);
  const list = map.locator('.roadmap-alternative');
  await list.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(list).toHaveAttribute('open', '');
  const links = list.getByRole('link');
  await expect(links).toHaveCount(sysadminRoadmapNodes.length);
  await page.keyboard.press('Tab');
  await expect(links.first()).toBeFocused();
  const href = await links.first().getAttribute('href');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new URL(href, 'http://127.0.0.1:4175/').href);
});

test('the old landing-map URL opens the whole map on a 320px screen', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/#landing-map');
  const map = page.locator('#career-map');
  await expectWholeMapFits(map);
  await map.locator('.roadmap-source summary').click();
  await map.locator('.roadmap-alternative summary').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('using the map preserves old, new and unknown saved progress', async ({ page }) => {
  const saved = ['network-models', 'secplus-crypto-pki', 'ct-uefi-boot', 'ne-foundations', 'secplus-risk-third-party', 'future-id'];
  await page.goto('/');
  await page.evaluate(({ key, ids }) => localStorage.setItem(key, JSON.stringify(ids)), { key: progressKey, ids: saved });
  await page.goto('/?view=career-map');
  const map = page.locator('#career-map');
  await expectWholeMapFits(map);
  await stageButton(map, 1).click();
  await expect(map.locator('.roadmap-diagram svg .node')).toHaveCount(4);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), progressKey)).toEqual(saved);
  await page.goto('/?lesson=secplus-crypto-pki');
  await expect(page.getByRole('button', { name: 'Отменить отметку', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Отменить отметку', exact: true })).toBeVisible();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), progressKey)).toEqual(saved);
});

test('full and focused maps pass accessibility checks in both themes with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const map = await openMap(page);
  for (const theme of ['dark', 'light']) {
    await page.evaluate((value) => { document.querySelector('.app-shell').dataset.theme = value; }, theme);
    for (const full of [true, false]) {
      if (full) {
        if (await map.locator('.roadmap-panel').getAttribute('data-mode') !== 'all') await map.getByRole('button', { name: 'Полная карта', exact: true }).click();
        await expectWholeMapFits(map);
      } else {
        await stageButton(map, 0).click();
        await expect(map.locator('.roadmap-diagram svg .node')).toHaveCount(3);
      }
      const result = await new AxeBuilder({ page }).include('#career-map').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(result.violations).toEqual([]);
    }
  }
});
