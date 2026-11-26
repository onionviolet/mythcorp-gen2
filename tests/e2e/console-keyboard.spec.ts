import { expect, test } from '@playwright/test';

test('Console completes commands, restores a draft and releases keyboard focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?room=console');
  const input = page.locator('#console-input');
  await input.fill('who');
  await input.press('Tab');
  await expect(input).toHaveValue('whoami ');
  await expect(input).toBeFocused();
  await input.press('Enter');
  await input.fill('room to');
  await input.press('ArrowUp');
  await expect(input).toHaveValue('whoami');
  await input.press('ArrowDown');
  await expect(input).toHaveValue('room to');
  await input.press('Shift+Tab');
  await expect(input).not.toBeFocused();
  await input.fill('');
  await input.press('Tab');
  await expect(input).not.toBeFocused();
});
