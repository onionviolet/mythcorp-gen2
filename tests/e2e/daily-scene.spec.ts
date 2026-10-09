import { expect, test, type Page } from '@playwright/test';

const DAY_KEY = 'mythcorp:hold-cold-day';
const SCENE_KEY = 'mythcorp:hold-cold-scene';

function scene(page: Page, name: string) {
  return expect(page.getByRole('button', { name: /^scene,/ }))
    .toHaveAccessibleName(`scene, ${name}, activate to change`);
}

test('the first load of a Chicago day opens the shared scene, then the rotation continues', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-08T17:00:00Z'));
  await page.goto('/?room=installation');
  await scene(page, 'Drift');
  await page.reload();
  await scene(page, 'Surface');
  await page.reload();
  await scene(page, 'Signal');
});

test('a new Chicago day returns to the daily scene', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-08T17:00:00Z'));
  await page.goto('/?room=installation');
  await scene(page, 'Drift');
  await page.evaluate(([dayKey, sceneKey]) => {
    localStorage.setItem(dayKey, '2026-10-07');
    localStorage.setItem(sceneKey, 'Signal');
  }, [DAY_KEY, SCENE_KEY]);
  await page.reload();
  await scene(page, 'Drift');
});

test('blocked storage gets the daily scene on every load', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-08T17:00:00Z'));
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, 'getItem', { value() { throw new Error('Storage blocked'); } });
    Object.defineProperty(Storage.prototype, 'setItem', { value() { throw new Error('Storage blocked'); } });
  });
  await page.goto('/?room=installation');
  await scene(page, 'Drift');
  await page.reload();
  await scene(page, 'Drift');
});

test('a pinned scene writes nothing to storage', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-08T17:00:00Z'));
  await page.goto('/?room=installation&scene=surface');
  await scene(page, 'Surface');
  expect(await page.evaluate(key => localStorage.getItem(key), DAY_KEY)).toBeNull();
});

test.describe('chicago row', () => {
  test('shows real Chicago time across daylight saving', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    await page.setViewportSize({ width: 1280, height: 800 });
    const row = page.locator('dd[data-row="chicago"]');

    await page.clock.setFixedTime(new Date('2026-10-08T19:05:00Z'));
    await page.goto('/?room=installation&scene=signal&sun=noon');
    await expect(row).toContainText('14:05');

    await page.clock.setFixedTime(new Date('2026-12-01T19:05:00Z'));
    await page.reload();
    await expect(row).toContainText('13:05');
    expect(errors).toEqual([]);
  });

  test('hides on short compact screens and shows on taller ones', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-08T19:05:00Z'));
    const row = page.locator('dd[data-row="chicago"]');

    await page.setViewportSize({ width: 390, height: 600 });
    await page.goto('/?room=installation&scene=signal&sun=noon');
    await expect(page.locator('[data-readout="compact"]')).toBeVisible();
    await expect(row).toBeHidden();

    await page.setViewportSize({ width: 390, height: 844 });
    await expect(row).toBeVisible();
    await expect(row).toContainText('14:05');
  });
});

test('night pin labels both suns without requesting viewer geolocation', async ({ page }) => {
  const errors: string[] = [];
  const skyRequests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/api/sky') skyRequests.push(request.url());
  });
  await page.goto('/?room=installation&scene=signal&sun=night');
  await expect(page.locator('dd[data-row="sun"]')).toContainText('night');
  await expect(page.locator('dd[data-row="you"]')).toContainText('night');
  await expect(page.locator('[data-linkedin-pet]')).toHaveCount(1);
  expect(skyRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('sky endpoint exposes only the private solar contract or unavailable', async ({ request }) => {
  const response = await request.get('/api/sky');
  expect(response.headers()['cache-control']).toBe('private, no-store');
  expect(response.headers()['content-type']).toContain('application/json');
  expect([200, 503]).toContain(response.status());
  const body = await response.json();
  if (response.status() === 503) {
    expect(body).toEqual({ error: 'unavailable' });
  } else {
    expect(Object.keys(body).sort()).toEqual(['azimuth', 'elevation', 'moonPhase', 'timezone']);
    expect(Number.isInteger(body.elevation)).toBe(true);
    expect(body.elevation).toBeGreaterThanOrEqual(-90);
    expect(body.elevation).toBeLessThanOrEqual(90);
    expect(Number.isInteger(body.azimuth)).toBe(true);
    expect(body.azimuth).toBeGreaterThanOrEqual(0);
    expect(body.azimuth).toBeLessThanOrEqual(360);
    expect(body.timezone === null || typeof body.timezone === 'string').toBe(true);
    expect(typeof body.moonPhase).toBe('number');
    expect(body.moonPhase).toBeGreaterThanOrEqual(0);
    expect(body.moonPhase).toBeLessThanOrEqual(1);
  }
});

test('horizon keyboard sweep advances Chicago an hour and eases home', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-08T19:05:00Z'));
  await page.goto('/?room=installation&scene=signal&sun=noon');
  const clock = page.locator('dd[data-row="chicago"]');
  const slider = page.getByRole('slider', { name: 'Sweep the time of day' });
  await slider.press('Home');
  await expect(clock).toContainText('14:05');
  await slider.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuenow', '60');
  await expect(clock).toContainText('15:05');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');
  await expect(clock).toContainText('14:05');
  await slider.press('ArrowRight');
  await expect(clock).toContainText('15:05');
  await slider.press('Home');
  await expect(slider).toHaveAttribute('aria-valuenow', '0');
  await expect(clock).toContainText('14:05');
});
