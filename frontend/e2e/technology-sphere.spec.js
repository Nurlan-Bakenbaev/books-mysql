import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const position = (node) => node.evaluate(el => [el.style.left, el.style.top].join(','));

test('sphere uses larger, colourful, front-facing icons and keeps moving behind the selected icon', async ({ page, isMobile }) => {
  await page.goto('/');
  const sphere = page.locator('.technology-sphere');
  await sphere.scrollIntoViewIfNeeded();
  await expect(sphere.getByRole('button')).toHaveCount(24);
  await expect(page.getByRole('button', { name: /Остановить сферу|Продолжить сферу/ })).toHaveCount(0);
  expect((await sphere.boundingBox()).width).toBeGreaterThan(isMobile ? 340 : 500);
  const colours = await sphere.locator('svg').evaluateAll(icons => icons.map(el => getComputedStyle(el).color));
  expect(new Set(colours).size).toBeGreaterThan(15);
  const windows = sphere.getByRole('button', { name: 'Windows', exact: true });
  const selected = windows.locator('..');
  const background = sphere.getByRole('button', { name: 'Docker', exact: true }).locator('..');
  const originalSize = (await windows.boundingBox()).width;
  if (isMobile) {
    // Moving targets intentionally do not meet Playwright's stationary-action check.
    const box = await windows.boundingBox();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  } else {
    const box = await windows.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  }
  await expect(page.getByRole('tooltip')).toContainText('Windows');
  await expect(page.getByRole('tooltip')).toContainText('Операционная система');
  await expect.poll(async () => (await windows.boundingBox()).width).toBeGreaterThan(originalSize * 1.2);
  const pinned = await position(selected);
  const moving = await position(background);
  await expect.poll(() => position(background)).not.toBe(moving);
  expect(await position(selected)).toBe(pinned);
  // A readable logo has no rotation, skew, perspective or negative scale.
  expect(await sphere.locator('.sphere-icon').evaluateAll(icons => icons.every(el => {
    const matrix = new DOMMatrix(getComputedStyle(el).transform);
    return matrix.is2D && matrix.a > 0 && matrix.d > 0 && matrix.b === 0 && matrix.c === 0;
  }))).toBe(true);
  if (!isMobile) {
    await page.getByRole('tooltip').hover();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.keyboard.press('Escape');
  } else {
    const box = await sphere.boundingBox();
    await page.touchscreen.tap(box.x + 2, box.y + 2);
  }
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await expect.poll(() => position(selected)).not.toBe(pinned);
});

test('sphere descriptions support keyboard focus and fit the narrow screen in both themes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');
  const sphere = page.locator('.technology-sphere');
  for (const theme of ['dark', 'light']) {
    if (await page.locator('.app-shell').getAttribute('data-theme') !== theme) {
      await page.getByRole('button', { name: theme === 'dark' ? 'Включить тёмную тему' : 'Включить светлую тему' }).click();
    }
    const buttons = sphere.getByRole('button');
    await buttons.first().focus();
    for (let index = 0; index < 24; index++) {
      const button = buttons.nth(index);
      await expect(button).toBeFocused();
      await expect(page.getByRole('tooltip')).toContainText(await button.getAttribute('aria-label'));
      await expect(button).toHaveAttribute('aria-describedby', await page.getByRole('tooltip').getAttribute('id'));
      const bounds = await page.getByRole('tooltip').boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
      if (index < 23) await page.keyboard.press('Tab');
    }
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  }
});

test('sphere respects reduced motion and suspends animation outside the viewport', async ({ page }) => {
  await page.goto('/');
  const sphere = page.locator('.technology-sphere');
  const node = sphere.locator('.sphere-node').first();
  await sphere.scrollIntoViewIfNeeded();
  const initial = await position(node);
  await expect.poll(() => position(node)).not.toBe(initial);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await position(node);
  await page.waitForTimeout(200);
  expect(await position(node)).toBe(reduced);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => position(node)).not.toBe(reduced);
  await page.locator('.landing-footer').scrollIntoViewIfNeeded();
  await expect(sphere).not.toBeInViewport();
  await page.waitForTimeout(100);
  const offscreen = await position(node);
  await page.waitForTimeout(200);
  expect(await position(node)).toBe(offscreen);
  await sphere.scrollIntoViewIfNeeded();
  await expect.poll(() => position(node)).not.toBe(offscreen);
});
