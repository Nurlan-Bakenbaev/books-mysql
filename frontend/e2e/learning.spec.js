import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { securityPlusExam } from '../src/data/securityPlusExam.js';

test.beforeEach(async ({ page }) => {
  // External videos are independently hosted; test the site's own UI deterministically.
  await page.route(/youtube|googleapis|gstatic/, (route) => route.abort());
});

test('fuzzy course search finds a lesson, supports keyboard close and opens a glossary term', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Поиск по курсу', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Поиск по курсу' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('searchbox').fill('криптогрфия');
  await dialog.getByRole('button', { name: 'Урок', exact: true }).click();
  await dialog.getByRole('link', { name: /Криптография, хеширование и PKI/ }).click();
  await expect(page).toHaveURL(/lesson=secplus-crypto-pki/);
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await page.getByRole('button', { name: 'Поиск по курсу', exact: true }).click();
  await dialog.getByRole('searchbox').fill('MFA');
  await dialog.getByRole('button', { name: 'Термин', exact: true }).click();
  await dialog.getByRole('link', { name: /MFA/ }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('heading', { name: /MFA/ })).toBeVisible();
  await page.getByRole('button', { name: 'Закрыть', exact: true }).click();
});

test('resource search tolerates typos and resolves titles for both new tracks', async ({ page }) => {
  await page.goto('/?view=resources');
  await page.getByRole('searchbox', { name: 'Поиск источников' }).fill('криптогрфия');
  await expect(page.locator('.resource-card').first()).toBeVisible();
  const uses = page.locator('.resource-study-plan').first();
  await uses.getByText('Как использовать в курсе', { exact: false }).click();
  await expect(page.locator('.resource-card a[data-route-link]').first()).not.toHaveText(/^secplus-|^ct-/);
  await page.getByRole('searchbox', { name: 'Поиск источников' }).fill('zzzzzzzzzzzzzz');
  await expect(page.getByText('По вашему запросу ничего не найдено. Измените поиск или тип источника.')).toBeVisible();
});

test('Shiki preserves the exact source when highlighting and copying', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?lesson=ip-addressing');
  const block = page.locator('.lesson-code').first();
  await block.scrollIntoViewIfNeeded();
  const code = block.locator('code');
  const original = await code.textContent();
  await expect(code).toHaveAttribute('data-highlighted', 'true');
  await expect(code).toHaveText(original, { useInnerText: false });
  await block.getByRole('button', { name: /Копировать/ }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(original);
  await expect(code.locator('span').first()).toHaveAttribute('style', /color/);
  const accessibility = await new AxeBuilder({ page }).include('.lesson-code').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('exam submits only a complete attempt, grades it and resets on retry', async ({ page }) => {
  await page.goto('/?view=security-plus');
  const exam = page.locator('.security-exam');
  await expect(exam.getByRole('button', { name: 'Завершить экзамен' })).toBeDisabled();
  await expect(exam.locator('.assessment-feedback')).toHaveCount(0);
  for (let i = 0; i < 30; i++) {
    await exam.locator('fieldset').nth(i).getByRole('radio').nth(i < 24 ? securityPlusExam[i].answer : (securityPlusExam[i].answer + 1) % 4).check();
  }
  await exam.getByRole('button', { name: 'Завершить экзамен' }).click();
  await expect(exam.getByRole('heading', { name: 'Результат: 24 из 30 · 80%' })).toBeVisible();
  await expect(exam.locator('.assessment-feedback[data-correct="false"]')).toHaveCount(6);
  await exam.getByRole('button', { name: 'Повторить экзамен', exact: true }).click();
  await expect(exam.locator('input:checked')).toHaveCount(0);
  await expect(exam.locator('.assessment-feedback')).toHaveCount(0);
});

test('existing progress and navigation remain usable after reload and search', async ({ page, isMobile }) => {
  const saved = ['network-models', 'secplus-crypto-pki', 'ct-uefi-boot', 'future-id'];
  await page.goto('/');
  await page.evaluate((ids) => localStorage.setItem('sysadmin-path-2026-progress', JSON.stringify(ids)), saved);
  await page.goto('/?lesson=secplus-crypto-pki');
  await expect(page.getByRole('button', { name: 'Отменить отметку' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Отменить отметку' })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 600));
  await expect(page.locator('.topbar')).toBeInViewport();
  if (isMobile) {
    await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
    await expect(page.locator('.academy-sidebar')).toBeVisible();
    await page.locator('.academy-sidebar .sidebar-close').click();
  } else {
    await page.getByRole('button', { name: 'Свернуть боковое меню' }).click();
    await page.reload();
    await expect(page.locator('.academy-sidebar')).toHaveClass(/is-collapsed/);
    await page.getByRole('button', { name: 'Развернуть боковое меню' }).click();
    await expect(page.locator('.academy-sidebar')).not.toHaveClass(/is-collapsed/);
    await page.getByRole('button', { name: 'Свернуть боковое меню' }).click();
  }
  await page.setViewportSize({ width: 320, height: 844 });
  await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
  await page.locator('.academy-nav-group-toggle').filter({ hasText: 'Все курсы' }).click();
  await page.locator('.academy-nav-group-toggle').filter({ hasText: 'Все курсы' }).click();
  await expect(page.locator('.academy-sidebar').getByRole('link', { name: 'Компьютерные технологии', exact: true })).toBeVisible();
  await page.locator('.academy-sidebar .sidebar-close').click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sysadmin-path-2026-progress')))).toEqual(saved);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('axe checks the landing, open search, lesson and final exam', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const theme of ['dark', 'light']) {
    await page.evaluate((value) => localStorage.setItem('sysadmin-path-2026-theme', JSON.stringify(value)), theme);
    for (const url of ['/', '/?lesson=ip-addressing', '/?view=security-plus']) {
      await page.goto(url);
      await expect(page.locator('h1')).toBeVisible();
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(result.violations).toEqual([]);
    }
  }
  await page.getByRole('button', { name: 'Поиск по курсу', exact: true }).click();
  await page.getByRole('dialog', { name: 'Поиск по курсу' }).getByRole('searchbox').fill('MFA');
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
});
