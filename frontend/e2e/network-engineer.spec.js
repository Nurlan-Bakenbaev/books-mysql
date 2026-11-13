import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { networkEngineerCourse, networkEngineerCertifications } from '../src/data/networkEngineer.js';

const progressKey = 'sysadmin-path-2026-progress';
const firstTopic = networkEngineerCourse.topics[0];

test.beforeEach(async ({ page }) => {
  // Verify local UI and metadata independently of external video availability.
  await page.route(/youtube|googleapis|gstatic/, (route) => route.abort());
});

async function expectCourse(page) {
  await expect(page.getByRole('heading', { level: 1, name: networkEngineerCourse.title, exact: true })).toBeVisible();
  await expect(page.locator('#network-engineer .section-count')).toContainText('ТЕМЫ: 20');
  await expect(page.locator('.route-not-found')).toHaveCount(0);
}

test('the homepage and navigation open Network Engineer and its first lesson', async ({ page, isMobile }) => {
  await page.goto('/');
  const courseCard = page.locator('.landing-track-card[href="?view=network-engineer"]');
  await expect(courseCard).toContainText(networkEngineerCourse.title);
  await courseCard.click();
  await expectCourse(page);
  if (isMobile) await page.getByRole('button', { name: 'Открыть меню', exact: true }).click();
  const navigationLink = page.locator('.academy-sidebar a[href="?view=network-engineer"]');
  await expect(navigationLink).toHaveAttribute('href', '?view=network-engineer');
  await expect(navigationLink).toHaveAccessibleName(/Network Engineer|Сетевой инженер/i);
  await expect(navigationLink).toHaveAttribute('aria-current', 'page');
  await expect(navigationLink).toBeVisible();
  if (isMobile) await page.locator('.academy-sidebar .sidebar-close').click();
  const nextLesson = page.getByRole('link', { name: 'Открыть следующий урок', exact: true });
  await expect(nextLesson).toHaveAttribute('href', `?lesson=${firstTopic.id}`);
  await nextLesson.click();
  await expect(page.getByRole('heading', { level: 1, name: firstTopic.title, exact: true })).toBeVisible();
  await expect(page.locator('.lesson-back')).toHaveAttribute('href', /\?view=network-engineer$/);
  const neighbor = networkEngineerCourse.topics[1];
  await expect(page.getByRole('navigation', { name: 'Соседние уроки' }).getByRole('link', { name: neighbor.title, exact: true })).toHaveAttribute('href', `?lesson=${neighbor.id}`);
  await page.locator('.lesson-back').click();
  await expectCourse(page);
});

test('completing a network lesson survives reload and preserves old and unknown progress', async ({ page }) => {
  const saved = ['network-models', 'secplus-crypto-pki', 'future-id'];
  await page.goto('/');
  await page.evaluate(({ key, ids }) => localStorage.setItem(key, JSON.stringify(ids)), { key: progressKey, ids: saved });
  await page.goto('/?view=network-engineer');
  await page.getByRole('link', { name: 'Открыть следующий урок', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: firstTopic.title, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Тема изучена', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Отменить отметку', exact: true })).toBeVisible();
  const expected = [...saved, firstTopic.id];
  await expect.poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)), progressKey)).toEqual(expected);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Отменить отметку', exact: true })).toBeVisible();
  await page.locator('.lesson-back').click();
  await expectCourse(page);
  await expect(page.getByRole('link', { name: 'Открыть следующий урок', exact: true })).toHaveAttribute('href', `?lesson=${networkEngineerCourse.topics[1].id}`);
  await expect(page.locator('.phase-header').first().locator('.phase-progress small')).toHaveText(/^1 \/ \d+ шагов$/);
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), progressKey)).toEqual(expected);
});

test('certification cards display four programs with external official links', async ({ page }) => {
  await page.goto('/?view=network-engineer');
  const certifications = page.getByRole('region', { name: 'Сертификации сетевого инженера', exact: true });
  await expect(certifications).toHaveClass(/network-certifications/);
  await expect(certifications).toHaveAttribute('aria-labelledby', 'network-certifications-title');
  await expect(certifications.getByRole('heading', { level: 2, name: 'Сертификации сетевого инженера', exact: true })).toBeVisible();
  await expect(certifications.getByRole('link')).toHaveCount(4);
  for (const certification of networkEngineerCertifications) {
    await expect(certifications.getByText(certification.name, { exact: true })).toBeVisible();
    const officialLink = certifications.locator(`a[href="${certification.url}"]`);
    await expect(officialLink).toHaveAttribute('target', '_blank');
    await expect(officialLink).toHaveAttribute('rel', /noreferrer|noopener/);
  }
});

test('course search finds and opens a newly published network lesson', async ({ page }) => {
  await page.goto('/?view=network-engineer');
  await page.getByRole('button', { name: 'Поиск по курсу', exact: true }).click();
  const search = page.getByRole('dialog', { name: 'Поиск по курсу', exact: true });
  await search.getByRole('searchbox').fill(firstTopic.title);
  await search.getByRole('button', { name: 'Урок', exact: true }).click();
  const lesson = search.locator(`a[href="?lesson=${firstTopic.id}"]`);
  await expect(lesson).toContainText(networkEngineerCourse.title);
  await lesson.click();
  await expect(page).toHaveURL(new RegExp(`lesson=${firstTopic.id}`));
  await expect(page.getByRole('heading', { level: 1, name: firstTopic.title, exact: true })).toBeVisible();
});

test('all twenty network lesson routes render theory, practice, assessment and sources', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const topic of networkEngineerCourse.topics) {
    await page.goto(`/?lesson=${topic.id}`);
    await expect(page.getByRole('heading', { level: 1, name: topic.title, exact: true })).toBeVisible();
    await expect(page.locator('#lesson-theory')).toBeVisible();
    await expect.poll(() => page.locator('.lesson-diagram li').count()).toBeGreaterThanOrEqual(3);
    await expect(page.locator('#lesson-practice .lesson-result')).toBeVisible();
    await expect(page.locator('#lesson-check .assessment-question')).toHaveCount(1);
    await expect(page.locator('#lesson-check').getByRole('radio')).toHaveCount(4);
    expect(await page.locator('#lesson-sources .lesson-resources > li').count()).toBeGreaterThanOrEqual(2);
    await expect(page.locator('.route-not-found')).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test('the course and a lesson remain within a 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  for (const route of ['/?view=network-engineer', `/?lesson=${firstTopic.id}`]) {
    await page.goto(route);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('the network course and lesson pass accessibility checks in both themes', async ({ page }) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const theme of ['dark', 'light']) {
    await page.evaluate((value) => localStorage.setItem('sysadmin-path-2026-theme', JSON.stringify(value)), theme);
    for (const route of ['/?view=network-engineer', `/?lesson=${firstTopic.id}`]) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      const result = await new AxeBuilder({ page }).include('.route-content')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(result.violations).toEqual([]);
    }
  }
});
