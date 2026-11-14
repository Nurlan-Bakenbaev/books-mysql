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
  if (lessonVideos[nextId]) {
    await expect(section.getByRole('button', { name: 'English', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(section.locator('iframe')).toHaveAttribute('src', videoUrls(lessonVideos[nextId]).embed);
  } else {
    await expect(section.locator('iframe')).toHaveCount(0);
    await expect(section.locator('.video-unavailable')).toBeVisible();
  }
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
  await page.emulateMedia({ reducedMotion: 'reduce' });
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


test('Security+ introduction has a specific English video and a complete catalogue', async ({ page }) => {
  await page.goto('/?lesson=secplus-exam-orientation');
  await expect(page.locator('#lesson-video iframe')).toHaveAttribute('src', /KiEptGbnEBc/);
  await expect(page.locator('#lesson-video')).toContainText('English');
  await page.goto('/?view=security-plus');
  await page.getByText('Открыть индекс всех 121 тем', {exact:true}).click();
  await expect(page.locator('a[href*="#security-topic-"]')).toHaveCount(121);
});
