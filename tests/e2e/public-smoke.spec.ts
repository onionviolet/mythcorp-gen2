import { expect, test, type Page } from '@playwright/test';

const THEME_KEY = 'mythcorp-theme-v2';

function captureRuntimeErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
  return errors;
}

async function startWithTheme(page: Page, theme: string) {
  await page.addInitScript(({ storageKey, storedTheme }) => {
    window.localStorage.setItem(storageKey, storedTheme);
  }, { storageKey: THEME_KEY, storedTheme: theme });
}

type Box = { x: number; y: number; width: number; height: number };

function boxesOverlap(first: Box, second: Box, gap = 0) {
  return !(
    first.x + first.width + gap <= second.x
    || second.x + second.width + gap <= first.x
    || first.y + first.height + gap <= second.y
    || second.y + second.height + gap <= first.y
  );
}

for (const context of [
  { name: 'fresh storage', setup: async () => {} },
  { name: 'stored nonplain theme', setup: (page: Page) => startWithTheme(page, 'luxury') },
  { name: 'reduced motion', setup: async (page: Page) => page.emulateMedia({ reducedMotion: 'reduce' }) },
]) {
  test(`/ stays on the plain holding page with ${context.name}`, async ({ page }) => {
    const errors = captureRuntimeErrors(page);
    const failedRequests: string[] = [];
    page.on('requestfailed', request => failedRequests.push(request.url()));
    await context.setup(page);

    const response = await page.goto('/');

    expect(response?.ok()).toBe(true);
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'plain');
    await expect(page.locator('html')).toHaveAttribute('data-hold', 'on');
    await expect(page.getByRole('heading', { name: /Mythcorp, work in progress/i })).toBeVisible();
    await expect(page.locator('#page-root')).toBeHidden();
    await expect(page.locator('script[src*="/_next/"]').first()).toHaveCount(1);
    expect(failedRequests).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const path of ['/about', '/experience', '/wc', '/og', '/contact']) {
  test(`${path} redirects to the holding page`, async ({ page }) => {
    const errors = captureRuntimeErrors(page);
    await startWithTheme(page, 'paper');

    await page.goto(path);

    await expect(page).toHaveURL(url => url.pathname === '/' && url.search === '');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'plain');
    await expect(page.getByRole('heading', { name: /Mythcorp, work in progress/i })).toBeVisible();
    await expect(page.locator('#page-root')).toBeHidden();
    expect(errors).toEqual([]);
  });
}

test('movement meter ignores the real pointer and reacts to click rings', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.goto('/');
  const meter = page.locator('[data-field-activity]');

  await expect(page.locator('html')).toHaveClass(/theme-ready/);
  await expect(meter).toHaveAttribute('data-field-activity', 'calm');
  await page.mouse.move(80, 120);
  await page.mouse.move(620, 240, { steps: 4 });
  await expect(meter).toHaveAttribute('data-field-activity', 'calm');

  await page.mouse.click(620, 240);
  await expect(meter).toHaveAttribute('data-field-activity', 'surge');
  expect(errors).toEqual([]);
});

test('LinkedIn invitation keeps the exact public profile contract', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.goto('/');

  const invite = page.locator('[data-linkedin-invite]');
  await expect(invite).toHaveAttribute('href', 'https://www.linkedin.com/in/0w0/');
  await expect(invite).toHaveAttribute('target', '_blank');
  await expect(invite).toHaveAttribute('rel', /\bme\b/);
  await expect(invite).toHaveAttribute('rel', /\bnoopener\b/);
  await expect(invite).toHaveAttribute('rel', /\bnoreferrer\b/);
  await expect(invite).toContainText('Find me on LinkedIn');
  await expect(page.getByRole('link', { name: 'Find me on LinkedIn (opens in a new tab)' }))
    .toBeVisible();
  await expect(invite.locator('[data-linkedin-cue]')).toHaveCount(0);
  await expect(page.getByText('profile signal', { exact: true })).toHaveCount(0);
  await expect(invite.locator('[data-linkedin-mark]')).toHaveText('in');
  await expect(invite.locator('[data-linkedin-arrow]')).toHaveText('↗');
  expect(errors).toEqual([]);
});

test('LinkedIn cat approaches, follows the pointer safely, and exposes proximity and pulse state', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  const invite = page.locator('[data-linkedin-invite]');
  const pet = page.locator('[data-linkedin-pet]');
  const meter = page.locator('[data-field-activity]');
  await expect(pet).toHaveAttribute('data-pet-phase', 'waiting');
  await expect(invite).toHaveAttribute('data-pointer-near', 'false');
  await expect(invite).toHaveAttribute('data-pulse-enabled', 'true');
  await expect(invite).toHaveAttribute('data-magnetic-return', 'false');
  await expect.poll(() => invite.evaluate(element => getComputedStyle(element, '::before').animationName))
    .not.toBe('none');

  await expect(pet).toHaveAttribute('data-pet-phase', 'approaching', { timeout: 6_000 });
  await expect(meter).not.toHaveAttribute('data-field-activity', 'calm');
  await expect(pet).toHaveAttribute('data-pet-phase', 'settled', { timeout: 3_500 });

  const initialPetBox = await pet.boundingBox();
  expect(initialPetBox).not.toBeNull();
  if (!initialPetBox) throw new Error('LinkedIn pet has no layout box');

  await page.mouse.move(420, 280);
  await expect(invite).toHaveAttribute('data-following', 'true');
  await expect(pet).toHaveAttribute('data-pet-phase', 'following');
  await expect.poll(async () => {
    const box = await pet.boundingBox();
    if (!box) return 0;
    return Math.hypot(box.x - initialPetBox.x, box.y - initialPetBox.y);
  }).toBeGreaterThan(8);

  await page.mouse.move(2, 2);
  await expect.poll(async () => {
    const box = await pet.boundingBox();
    if (!box) return false;
    return box.x >= 0
      && box.y >= 0
      && box.x + box.width <= 1280
      && box.y + box.height <= 800;
  }).toBe(true);

  const inviteBox = await invite.boundingBox();
  expect(inviteBox).not.toBeNull();
  if (!inviteBox) throw new Error('LinkedIn invitation has no layout box');

  await page.mouse.move(inviteBox.x + inviteBox.width / 2, inviteBox.y + inviteBox.height / 2);
  await expect(invite).toHaveAttribute('data-pointer-near', 'true');
  await expect(pet).toHaveAttribute('data-pet-phase', 'following');
  await expect.poll(async () => {
    const currentPetBox = await pet.boundingBox();
    return currentPetBox ? boxesOverlap(currentPetBox, inviteBox, 4) : true;
  }).toBe(false);

  await expect(pet).toHaveAttribute('data-pet-phase', 'settled', { timeout: 4_500 });

  await page.mouse.move(100, 100);
  await expect(invite).toHaveAttribute('data-pointer-near', 'false');
  await expect(invite).toHaveAttribute('data-magnetic-pull', 'true', { timeout: 2_000 });
  await expect(meter).not.toHaveAttribute('data-field-activity', 'calm');
  const magneticCursor = page.locator('[data-magnetic-cursor]');
  const pullStart = await magneticCursor.boundingBox();
  await page.waitForTimeout(700);
  const pullLater = await magneticCursor.boundingBox();
  expect(pullStart).not.toBeNull();
  expect(pullLater).not.toBeNull();
  if (!pullStart || !pullLater) throw new Error('Magnetic cursor has no layout box');
  const linkCentre = {
    x: inviteBox.x + inviteBox.width / 2,
    y: inviteBox.y + inviteBox.height / 2,
  };
  const pullDistance = (box: Box) => Math.hypot(box.x - linkCentre.x, box.y - linkCentre.y);
  expect(pullDistance(pullLater)).toBeLessThan(pullDistance(pullStart));
  await expect(pet).toHaveAttribute('data-pet-phase', 'settled', { timeout: 4_500 });
  const returnStart = await magneticCursor.boundingBox();
  await page.mouse.move(120, 120);
  await expect(invite).toHaveAttribute('data-magnetic-pull', 'false');
  await expect(invite).toHaveAttribute('data-magnetic-return', 'true');
  await page.waitForTimeout(500);
  const returnLater = await magneticCursor.boundingBox();
  expect(returnStart).not.toBeNull();
  expect(returnLater).not.toBeNull();
  if (!returnStart || !returnLater) throw new Error('Magnetic cursor return has no layout box');
  const realPointer = { x: 120, y: 120 };
  const returnDistance = (box: Box) => Math.hypot(box.x - realPointer.x, box.y - realPointer.y);
  expect(returnDistance(returnLater)).toBeLessThan(returnDistance(returnStart));
  await expect(invite).toHaveAttribute('data-magnetic-return', 'false', { timeout: 3_500 });
  expect(errors).toEqual([]);
});

test('LinkedIn glow rises continuously as the pointer approaches', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const invite = page.locator('[data-linkedin-invite]');
  const box = await invite.boundingBox();
  if (!box) throw new Error('LinkedIn invitation has no layout box');
  const radius = () => invite.evaluate(element =>
    Number.parseFloat(getComputedStyle(element).getPropertyValue('--linkedin-glow-radius')));
  const core = () => invite.evaluate(element =>
    Number.parseFloat(getComputedStyle(element).getPropertyValue('--linkedin-glow-core-radius')));
  const ring = () => invite.evaluate(element =>
    Number.parseFloat(getComputedStyle(element).getPropertyValue('--linkedin-glow-ring')));
  const movePointer = async (x: number, y: number) => {
    await page.evaluate(({ clientX, clientY }) => {
      document.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true,
        clientX,
        clientY,
        isPrimary: true,
        pointerType: 'mouse',
      }));
    }, { clientX: x, clientY: y });
  };

  await movePointer(box.x - 230, box.y + box.height / 2);
  const far = await radius();
  const farCore = await core();
  const farRing = await ring();
  await movePointer(box.x - 120, box.y + box.height / 2);
  const middle = await radius();
  const middleCore = await core();
  const middleRing = await ring();
  await movePointer(box.x - 24, box.y + box.height / 2);
  const near = await radius();
  const nearCore = await core();
  const nearRing = await ring();

  expect(middle).toBeGreaterThan(far);
  expect(near).toBeGreaterThan(middle);
  expect(middleCore).toBeGreaterThan(farCore);
  expect(nearCore).toBeGreaterThan(middleCore);
  expect(middleRing).toBeGreaterThan(farRing);
  expect(nearRing).toBeGreaterThan(middleRing);
});

test('solid message cycles passively and becomes static for reduced motion', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'words, dust, activate to change' }).click();
  await page.getByRole('button', { name: 'words, field, activate to change' }).click();

  const solid = page.locator('[data-solid-label]');
  await expect(solid).toHaveCount(2);
  await expect.poll(() => solid.first().evaluate(element => getComputedStyle(element).animationName))
    .not.toBe('none');
  await expect(page.getByRole('heading', { name: /Mythcorp, work in progress/i })).toBeVisible();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => solid.first().evaluate(element => getComputedStyle(element).animationName))
    .toBe('none');
});

test('reduced motion keeps the LinkedIn cat static and disables pulse and follow', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const invite = page.locator('[data-linkedin-invite]');
  const pet = page.locator('[data-linkedin-pet]');
  await expect(pet).toHaveAttribute('data-pet-phase', 'settled');
  await expect(invite).toHaveAttribute('data-pulse-enabled', 'false');
  await expect(invite).toHaveAttribute('data-following', 'false');
  await expect(invite).toHaveAttribute('data-magnetic-pull', 'false');
  await expect(invite).toHaveAttribute('data-magnetic-return', 'false');
  await expect.poll(() => invite.evaluate(element => getComputedStyle(element, '::before').animationName))
    .toBe('none');
  const startBox = await pet.boundingBox();

  await page.mouse.move(360, 240);
  await page.waitForTimeout(300);
  await expect(pet).toHaveAttribute('data-pet-phase', 'settled');
  await expect(invite).toHaveAttribute('data-following', 'false');
  const endBox = await pet.boundingBox();
  expect(startBox).not.toBeNull();
  expect(endBox).not.toBeNull();
  if (!startBox || !endBox) throw new Error('LinkedIn pet has no layout box');
  expect(Math.hypot(endBox.x - startBox.x, endBox.y - startBox.y)).toBeLessThan(1);
  expect(errors).toEqual([]);
});

test('touch parks the LinkedIn cat without causing mobile overflow', async ({ page }) => {
  const errors = captureRuntimeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const invite = page.locator('[data-linkedin-invite]');
  const pet = page.locator('[data-linkedin-pet]');
  await expect(pet).toHaveAttribute('data-pet-phase', 'settled', { timeout: 9_000 });
  await page.mouse.move(180, 180);
  await expect(invite).toHaveAttribute('data-following', 'true');

  await page.locator('body').dispatchEvent('pointermove', {
    pointerType: 'touch', clientX: 180, clientY: 180,
  });
  await expect(invite).toHaveAttribute('data-following', 'false');
  await expect(pet).toHaveAttribute('data-pet-phase', 'settled');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    .toBe(true);
  expect(errors).toEqual([]);
});
