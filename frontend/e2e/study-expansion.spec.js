import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { coreLessons } from '../src/data/coreCurriculum.js';
import { securityVideoTopics } from '../src/data/securityVideoTopics.js';
test.beforeEach(async({page})=>{await page.route(/youtube|googleapis|gstatic/,r=>r.abort());});
test('all 38 main routes render six learning sections and preserve legacy routes',async({page})=>{
 test.setTimeout(120000);
 for(const l of coreLessons){await page.goto(`/?lesson=${l.id}`);await expect(page.locator('.core-lesson > section')).toHaveCount(6);await expect(page.locator('#lesson-troubleshooting h3')).toHaveCount(3);await expect(page.locator('#lesson-independent li')).toHaveCount(l.tasks.length);await expect(page.locator('.route-not-found')).toHaveCount(0);}
 await page.goto('/?lesson=virtualization');await expect(page.locator('#lesson-practice')).toBeVisible();
});
test('Point 00 starts with beginner concepts and keeps unverified video blocks out of the way',async({page})=>{
 await page.goto('/?view=roadmap');await expect(page.locator('.phase-card').first()).toContainText('С самых азов');
 await page.goto('/?lesson=admin-engineering');await expect(page.getByRole('heading',{name:'Системный администратор: компьютер, ОС и сеть с нуля'})).toBeVisible();await expect(page.locator('#lesson-video')).toHaveCount(0);await expect(page.locator('body')).not.toContainText('Incident management');
 const guides=page.locator('.beginner-guide');await expect(guides).toHaveCount(3);await guides.first().locator('summary').focus();await page.keyboard.press('Enter');await expect(guides.first()).toHaveAttribute('open','');
 await page.setViewportSize({width:390,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('navbar stays complete on mobile and course ordering is shared',async({page})=>{
 await page.setViewportSize({width:320,height:844});await page.goto('/');const nav=page.getByRole('navigation',{name:'Разделы платформы'});await expect(nav.getByRole('link')).toHaveText(['Карта','Профессии','Курсы','Библиотека','Практика','Сертификации','Обзор']);await expect(nav.getByText('Network Engineer')).toHaveCount(0);
 await expect(page.locator('.landing-track-card').first()).toHaveAttribute('href','?view=computer-technologies');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.landing-hero-copy').evaluate(el=>el.getBoundingClientRect().right<=innerWidth && el.scrollWidth<=el.clientWidth)).toBe(true);
 await nav.getByRole('link',{name:'Профессии',exact:true}).click();await expect(page.getByRole('heading',{name:'Профессии',exact:true})).toBeVisible();
});
test('collapsed course group expands sidebar before showing items',async({page,isMobile})=>{
 test.skip(isMobile,'desktop collapse only');await page.goto('/?view=overview');await page.getByRole('button',{name:'Свернуть боковое меню',exact:true}).click();await page.locator('.academy-nav-group-toggle').filter({hasText:'Все курсы'}).click();await expect(page.locator('.academy-sidebar')).not.toHaveClass(/is-collapsed/);await expect(page.locator('.academy-nav-children').getByRole('link',{name:'Компьютерные технологии',exact:true})).toBeVisible();
});
test('topic anchor opens the correct note and lesson anchors retain their scroll',async({page})=>{
 const v=securityVideoTopics.find(v=>v.objective==='4.9');await page.goto(`/?lesson=${v.lessonId}#${v.anchor}`);await expect(page.locator(`#${v.anchor}`)).toHaveAttribute('open','');await expect(page.locator(`#${v.anchor}`)).toBeInViewport();
 await page.goto('/?lesson=network-models');await page.getByRole('link',{name:'Практика',exact:true}).last().click();await expect(page.locator('#lesson-practice')).toBeInViewport();await page.waitForTimeout(400);expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(300);
});
test('written answers and self assessment persist independently of automatic score',async({page})=>{
 await page.goto('/?lesson=network-models');const written=page.getByRole('heading',{name:'Восемь заданий урока'}).locator('..');await written.locator('textarea').first().fill('TCP устанавливает поток; HTTP проверяется отдельным запросом.');await written.getByText('Критерии самопроверки',{exact:true}).first().click();await written.getByRole('combobox').first().selectOption('meets');await page.reload();await expect(written.locator('textarea').first()).toHaveValue(/TCP устанавливает/);await expect(page.locator('.assessment-score')).toHaveText('');
});
test('moving rail respects the operating-system reduced-motion preference without extra controls',async({page})=>{
 await page.goto('/?view=roadmap');const rail=page.locator('.skill-sequence-step').first();await expect(page.getByRole('button',{name:/Остановить движение|Продолжить движение|Остановить поток|Продолжить поток/})).toHaveCount(0);const initial=await rail.evaluate(el=>getComputedStyle(el,'::after').backgroundPosition);await expect.poll(()=>rail.evaluate(el=>getComputedStyle(el,'::after').backgroundPosition),{timeout:2000}).not.toBe(initial);await page.emulateMedia({reducedMotion:'reduce'});expect(await rail.evaluate(el=>getComputedStyle(el,'::after').animationName)).toBe('none');
 await page.goto('/?view=labs');await expect(page.getByRole('button',{name:/Остановить движение|Продолжить движение|Остановить поток|Продолжить поток/})).toHaveCount(0);
});
test('new pages pass accessibility checks in both themes and at narrow width',async({page})=>{
 test.setTimeout(90000);await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['/?view=careers','/?lesson=network-models','/?view=overview']){await page.goto(route);for(const theme of ['dark','light']){if(await page.locator('.app-shell').getAttribute('data-theme')!==theme) await page.getByRole('button',{name:theme==='dark'?'Включить тёмную тему':'Включить светлую тему'}).click();await expect(page.locator('.app-shell')).toHaveAttribute('data-theme',theme);await expect(page.locator('.academy-brand-copy strong')).toHaveCSS('color',theme==='dark'?'rgb(239, 246, 253)':'rgb(18, 38, 60)');const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();expect(result.violations).toEqual([]);}await page.setViewportSize({width:320,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('reading position survives reload and imported progress merges with unknown IDs',async({page})=>{
 await page.goto('/?lesson=linux-services');await expect(page.locator('#lesson-independent')).toBeVisible();await page.waitForTimeout(400);await page.evaluate(()=>window.scrollTo(0,2200));await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sysadmin-path-2026-learning-v1')).positions['linux-services'])).toBeGreaterThan(1500);await page.reload();await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(1500);
 await page.evaluate(()=>localStorage.setItem('sysadmin-path-2026-progress','["future-id"]'));await page.goto('/?view=overview');await page.getByRole('textbox',{name:'Импорт прогресса (JSON)'}).fill(JSON.stringify({version:1,progress:['network-models'],learning:{},assessments:{}}));await page.getByRole('button',{name:'Объединить прогресс'}).click();await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sysadmin-path-2026-progress')))).toEqual(['future-id','network-models']);await expect(page.getByText('Прогресс объединён.',{exact:true})).toBeVisible();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Экспорт JSON'}).click();const download=await downloadPromise;expect(download.suggestedFilename()).toBe('sysadmin-progress.json');
});
test('module submission requires ten answers and saves a graded attempt',async({page})=>{
 await page.goto('/?view=security-plus');const module=page.locator('.module-test').first();await module.locator('summary').click();await expect(module.locator('fieldset')).toHaveCount(10);const submit=module.getByRole('button',{name:'Проверить ответы',exact:true});await expect(submit).toBeDisabled();for(let i=0;i<10;i++)await module.locator('fieldset').nth(i).getByRole('radio').first().check();await submit.click();await expect(module.locator('.assessment-score')).toContainText('из 10');await expect.poll(()=>page.evaluate(()=>Object.values(JSON.parse(localStorage.getItem('sysadmin-path-2026-assessments-v1'))).flatMap(a=>a.attempts).length)).toBe(1);await module.getByRole('button',{name:'Повторить тест'}).click();await expect(module.locator('input:checked')).toHaveCount(0);await expect(submit).toBeDisabled();
});
