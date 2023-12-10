import "@cmmn/core";
import {test, expect, Page} from '@playwright/test';

test('create unmoderated note', async ({ page, context, browser }) => {
  await createNote(page);
});

test('admin case', async ({ page, context, browser }) => {
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();

  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();
  await adminPage.goto(`http://localhost:5002/notes/moderation?token=a9e09b890ab39d43f58df5c40c2f38b1c866d8a841fc8a10b1c9143aed5cf2bb16029c7f039ea6d2bf2ef5deb8f4d24e1823f693e8e431c6b37b7ece986cfa7d`);
  await adminPage.waitForTimeout(3000);
  await clearNotes(adminPage);
  await createNote(page);
  await createNote(userPage);
  // Expect a title "to contain" a substring.
  await adminPage.goto(`http://localhost:5002/notes/moderation`);
  await expectCount(adminPage, 2);
  await publishNote(adminPage);
  await publishNote(adminPage);

  await userPage.goto(`http://localhost:5002/notes`);
  await expectCount(userPage, 2);

  await page.goto(`http://localhost:5002/notes`);
  await expectCount(page, 2);

  await clearNotes(adminPage);
  await expectCount(page, 0);
  await expectCount(userPage, 0);

});

async function expectCount(page: Page, count: number){
  await page.waitForTimeout(2000);
  const itemsCount = await page.locator('.note_card_cardContainer').count();
  expect(itemsCount).toBe(count);
}
async function publishNote(adminPage: Page){
  await adminPage.waitForTimeout(1000);
  const first = await adminPage.$('.note_card_cardContainer');
  await first.click();
  const publish = await adminPage.locator('button', {hasText: 'Опубликовать'});
  await publish.click();
}
async function clearNotes(adminPage: Page){
  await adminPage.evaluateHandle('window.notes.clear()');
}
async function createNote(page: Page){
  await page.goto(`http://localhost:5002/notes/new/editor`);
  const title = await page.$<'input'>('[name=title]' as any)
  await title.fill('title')
  const text = await page.$<'input'>('[name=text]' as any)
  await text.fill('text');
  const author = await page.$<'input'>('[name=author]' as any)
  await author.fill('author');
  await page.waitForTimeout(100);
  const button = await page.$<'button'>('form button' as any);
  expect(await button.isDisabled()).toBeFalsy();
  await button.click();
  await page.waitForTimeout(100);
  await expect(page).toHaveURL(`http://localhost:5002/notes/new/success`);
  await page.waitForTimeout(300);
  await page.goto(`http://localhost:5002/notes/my`);
  await expectCount(page, 1);
}
