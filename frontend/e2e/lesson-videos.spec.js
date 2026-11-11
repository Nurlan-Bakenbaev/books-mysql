import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { lessonVideos } from '../src/data/lessonVideos.js';
import { russianLessonVideos, videoUrls } from '../src/data/russianLessonVideos.js';

test.beforeEach(async ({ page }) => {
  await page.route(/youtube|googleapis|gstatic/, (route) => route.abort());
});

test('English is the initial video; Russian switches the player and resets on reload/navigation', async ({ page }) => {
  await page.goto('/?lesson=linux-basics');
  const section = page.locator('#lesson-video');
  await expect(section.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(section.locator('iframe')).toHaveAttribute('src', videoUrls(lessonVideos['linux-basics']).embed);
  await section.getByRole('button', { name: 'Русский', exact: true }).click();
  await expect(section.locator('iframe')).toHaveCount(1);
  await expect(section.locator('iframe')).toHaveAttribute('src', videoUrls(russianLessonVideos['linux-basics']).embed);
  await expect(section.getByRole('link', { name: /Открыть курс на YouTube/ })).toHaveAttribute('href', videoUrls(russianLessonVideos['linux-basics']).watch);
  await page.reload();
  await expect(section.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await section.getByRole('button', { name: 'Русский', exact: true }).click();
  const next = page.locator('.lesson-neighbors a').last();
  const nextId = new URL(await next.getAttribute('href'), 'http://localhost/').searchParams.get('lesson');
  await next.click();
  await expect(page).toHaveURL(new RegExp(`lesson=${nextId}`));
  await expect(section.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(section.locator('iframe')).toHaveAttribute('src', videoUrls(lessonVideos[nextId]).embed);
});

test('a missing Russian counterpart is explicit and never plays an unrelated video', async ({ page }) => {
  await page.goto('/?lesson=az-entra-fundamentals');
  const section = page.locator('#lesson-video');
  await section.getByRole('button', { name: 'Русский', exact: true }).click();
  await expect(section.getByRole('status')).toContainText('Русское видео для этого урока пока не подобрано');
  await expect(section.locator('iframe')).toHaveCount(0);
  await section.getByRole('button', { name: 'English', exact: true }).click();
  await expect(section.locator('iframe')).toHaveAttribute('src', videoUrls(lessonVideos['az-entra-fundamentals']).embed);
});

test('language controls work by keyboard and pass accessibility checks in both themes', async ({ page }) => {
  await page.goto('/?lesson=devops-basics');
  const section = page.locator('#lesson-video');
  await section.getByRole('button', { name: 'English', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(section.getByRole('button', { name: 'Русский', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(section.getByRole('button', { name: 'Русский', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(section.locator('iframe')).toHaveAttribute('src', videoUrls(russianLessonVideos['devops-basics']).embed);
  for (const theme of ['dark', 'light']) {
    await page.evaluate((value) => { document.querySelector('.app-shell').dataset.theme = value; }, theme);
    const result = await new AxeBuilder({ page }).include('#lesson-video').withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(result.violations).toEqual([]);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});


test('an uncurated English video stays explicit and links to the Security+ course', async ({ page }) => {
  await page.goto('/?lesson=secplus-exam-orientation');
  const section = page.locator('#lesson-video');
  await expect(section.locator('iframe')).toHaveCount(0);
  await expect(section.getByRole('status')).toContainText('Отдельное встроенное видео для этого урока не подобрано');
  await expect(section.getByRole('group', { name: 'Язык видео' })).toHaveCount(0);
  await expect(section.getByRole('link', { name: 'Видеокурс Professor Messer · SY0-701', exact: true })).toHaveAttribute('href', /professormesser\.com/);
});
