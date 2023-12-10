import "@cmmn/core";
import {test, expect, Page} from '@playwright/test';

test('simple case', async ({ page, context, browser }) => {
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
  const itemsCount = await adminPage.locator('.note_card_cardContainer').count();
  expect(itemsCount).toBe(2);
  await publishNote(adminPage);
  await publishNote(adminPage);

  await userPage.goto(`http://localhost:5002/notes`);
  await userPage.waitForTimeout(3000);
  const userItems = await userPage.locator('.note_card_cardContainer').all();
  expect(userItems).toHaveLength(2);
  const myItems = await page.locator('.note_card_cardContainer').all();
  expect(myItems).toHaveLength(2);
});

async function publishNote(adminPage: Page){
  await adminPage.waitForTimeout(3000);
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
}
