import { test, expect } from '@playwright/test';
import { sysadminPractices } from '../src/data/sysadminPractices.js';

test.beforeEach(async ({ page }) => {
  await page.route(/youtube|googlevideo/, route => route.abort());
});

test('all 55 Sysadmin practices expose eleven sections and semantic code blocks', async ({ page }) => {
  test.setTimeout(180000);
  for (const [id, doc] of Object.entries(sysadminPractices)) {
    await page.goto(`/?lesson=${id}`, { waitUntil: 'domcontentloaded' });
    const practice = page.locator('.sysadmin-practice');
    await expect(practice).toBeVisible();
    await expect(practice.locator(':scope > h3, :scope > .sysadmin-safety > h3')).toHaveCount(11);
    await expect(practice.locator('pre > code')).toHaveCount(doc.blocks.length + doc.cleanupBlocks.length + Number(Boolean(doc.output)));
    await expect(practice.locator('pre > code').first()).toHaveText(doc.blocks[0].code);
    expect(await page.locator('#lesson-practice').count()).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('copy preserves exact command text and long lines scroll inside the container', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?lesson=linux-first-commands', { waitUntil: 'domcontentloaded' });
  const block = page.locator('.sysadmin-code').first();
  await block.getByRole('button', { name: /Копировать/ }).click();
  await expect(block.getByRole('status')).toHaveText('Скопировано');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(sysadminPractices['linux-first-commands'].blocks[0].code);
  await page.goto('/?lesson=pki-ca', { waitUntil: 'domcontentloaded' });
  const dimensions = await page.locator('.sysadmin-code pre').first().evaluate(el => ({ scroll: el.scrollWidth, client: el.clientWidth, overflow: getComputedStyle(el).overflowX }));
  expect(dimensions.overflow).toBe('auto');
  expect(dimensions.scroll).toBeGreaterThan(dimensions.client);
  await page.locator('.sysadmin-practice').screenshot({ path: `/tmp/sysadmin-practice-${test.info().project.name}.png` });
});

test('another course retains its existing practice presentation', async ({ page }) => {
  await page.goto('/?lesson=csf-cpu-architecture', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#lesson-practice')).toBeVisible();
  await expect(page.locator('.sysadmin-practice')).toHaveCount(0);
});
