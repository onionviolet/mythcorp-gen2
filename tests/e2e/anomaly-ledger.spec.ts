import { expect, test } from '@playwright/test';

const INSTALLATION = '/?room=installation&scene=signal&sun=noon';

test('without the flag the ledger shows nothing and stores nothing', async ({ page }) => {
  await page.goto(INSTALLATION);
  await expect(page.getByRole('button', { name: /^scene,/ })).toBeVisible();
  await page.getByRole('button', { name: /^scene,/ }).click();
  await page.keyboard.press('/');
  await expect(page.getByRole('dialog', { name: 'Terminal' })).toBeVisible();
  await page.keyboard.press('Escape');

  await expect(page.locator('[data-row="anomalies"]')).toHaveCount(0);
  expect(await page.evaluate(() => window.localStorage.getItem('mythcorp:anomalies'))).toBeNull();
});

test('ledger counts finds, lists them in the console and survives a reload', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`/?ledger=1&${INSTALLATION.slice(2)}`);
  const row = page.locator('[data-row="anomalies"] .sr-only');
  await expect(row).toHaveText('00 / 08');

  await page.getByRole('button', { name: /^scene,/ }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Anomaly logged: changed the scene.' })).toHaveCount(1);
  await expect(row).toHaveText('01 / 08');

  await page.keyboard.press('/');
  await expect(page.getByRole('dialog', { name: 'Terminal' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(row).toHaveText('02 / 08');

  // The flag lives for the session, so a plain address keeps the ledger on.
  await page.goto('/?room=console');
  const input = page.locator('#console-input');
  await expect(input).toBeVisible();
  await input.fill('anomalies');
  await input.press('Enter');
  const log = page.getByLabel('Console output').first();
  await expect(log).toContainText('changed the scene');
  await expect(log).toContainText('woke the operator');

  await page.goto(INSTALLATION);
  await expect(page.locator('[data-row="anomalies"] .sr-only')).toHaveText('02 / 08');
});
