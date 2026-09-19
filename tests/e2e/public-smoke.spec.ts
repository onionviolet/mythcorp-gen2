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

test('Halo stays active behind the authored scene rotation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');

  const scene = () => page.getByRole('button', { name: /^scene,/ });
  const halo = page.locator('[data-hold-overlay="scan"]');
  await expect(scene()).toHaveAccessibleName('scene, Signal, activate to change');
  await expect(page.locator('dt').filter({ hasText: /halo/i })).toBeVisible();
  await expect(halo).toHaveCount(1);

  for (const expected of ['Suspension', 'Drift', 'Surface', 'Signal']) {
    await scene().click();
    await expect(scene()).toHaveAccessibleName(`scene, ${expected}, activate to change`);
    await expect(halo).toHaveCount(1);
  }

  await expect(page.getByRole('button', { name: /scene, (Halo|Trace),/ })).toHaveCount(0);
});

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
  test.setTimeout(90_000);
  const errors = captureRuntimeErrors(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    const samples: Array<{ phase: string; activity: string | null; x: number; y: number }> = [];
    Reflect.set(window, '__linkedinCatApproach', samples);
    const installObserver = () => {
      if (!document.documentElement) {
        document.addEventListener('DOMContentLoaded', installObserver, { once: true });
        return;
      }
      let frame: number | undefined;
      const stop = () => {
        if (frame !== undefined) window.cancelAnimationFrame(frame);
        frame = undefined;
        observer.disconnect();
      };
      const record = () => {
        const pet = document.querySelector<HTMLElement>('[data-linkedin-pet]');
        if (!pet || pet.dataset.petPhase !== 'approaching') {
          if (samples.length > 0) stop();
          return;
        }
        const rect = pet.getBoundingClientRect();
        samples.push({
          phase: pet.dataset.petPhase,
          activity: document.querySelector<HTMLElement>('[data-field-activity]')?.dataset.fieldActivity ?? null,
          x: rect.x,
          y: rect.y,
        });
        frame = window.requestAnimationFrame(record);
      };
      const begin = () => {
        const pet = document.querySelector<HTMLElement>('[data-linkedin-pet]');
        if (pet?.dataset.petPhase === 'approaching' && frame === undefined) record();
      };
      const observer = new MutationObserver(begin);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-pet-phase'],
        childList: true,
        subtree: true,
      });
      window.setTimeout(stop, 9_000);
    };
    installObserver();
  });
  await page.goto('/');

  const invite = page.locator('[data-linkedin-invite]');
  const pet = page.locator('[data-linkedin-pet]');
  await expect(pet).toHaveAttribute('data-pet-phase', 'waiting');
  await expect(invite).toHaveAttribute('data-pointer-near', 'false');
  await expect(invite).toHaveAttribute('data-pulse-enabled', 'true');
  await expect(invite).toHaveAttribute('data-magnetic-return', 'false');
  await expect.poll(() => invite.evaluate(element => getComputedStyle(element, '::before').animationName))
    .not.toBe('none');

  await expect.poll(() => page.evaluate(() => {
    const samples = Reflect.get(window, '__linkedinCatApproach') as Array<{ phase: string }>;
    return samples.some(sample => sample.phase === 'approaching');
  }), { timeout: 7_000 }).toBe(true);
  await expect.poll(() => page.evaluate(() => {
    const samples = Reflect.get(window, '__linkedinCatApproach') as Array<{ x: number; y: number }>;
    if (samples.length < 2) return 0;
    const first = samples[0];
    return Math.max(...samples.map(sample => Math.hypot(sample.x - first.x, sample.y - first.y)));
  }), { timeout: 3_500 }).toBeGreaterThan(8);
  await expect.poll(() => page.evaluate(() => {
    const samples = Reflect.get(window, '__linkedinCatApproach') as Array<{ activity: string | null }>;
    return samples.some(sample => sample.activity !== null && sample.activity !== 'calm');
  }), { timeout: 3_500 }).toBe(true);
  await expect(pet).toHaveAttribute('data-pet-phase', 'settled', { timeout: 3_500 });

  const initialPetBox = await pet.boundingBox();
  expect(initialPetBox).not.toBeNull();
  if (!initialPetBox) throw new Error('LinkedIn pet has no layout box');

  await page.mouse.move(420, 280);
  await expect.poll(() => page.evaluate((initial) => {
    const inviteElement = document.querySelector<HTMLElement>('[data-linkedin-invite]');
    const petElement = document.querySelector<HTMLElement>('[data-linkedin-pet]');
    const rect = petElement?.getBoundingClientRect();
    return {
      following: inviteElement?.dataset.following,
      moved: rect ? Math.hypot(rect.x - initial.x, rect.y - initial.y) > 8 : false,
      phase: petElement?.dataset.petPhase,
    };
  }, initialPetBox)).toMatchObject({ following: 'true', moved: true, phase: 'following' });

  await page.mouse.move(2, 2);
  await expect.poll(() => page.evaluate(() => {
    const rect = document.querySelector<HTMLElement>('[data-linkedin-pet]')?.getBoundingClientRect();
    return Boolean(rect && rect.x >= 0 && rect.y >= 0
      && rect.x + rect.width <= window.innerWidth && rect.y + rect.height <= window.innerHeight);
  })).toBe(true);

  const inviteBox = await invite.boundingBox();
  expect(inviteBox).not.toBeNull();
  if (!inviteBox) throw new Error('LinkedIn invitation has no layout box');

  await page.mouse.move(inviteBox.x + inviteBox.width / 2, inviteBox.y + inviteBox.height / 2);
  await expect.poll(() => page.evaluate(() => {
    const inviteElement = document.querySelector<HTMLElement>('[data-linkedin-invite]');
    const petElement = document.querySelector<HTMLElement>('[data-linkedin-pet]');
    const inviteRect = inviteElement?.getBoundingClientRect();
    const petRect = petElement?.getBoundingClientRect();
    const overlaps = Boolean(inviteRect && petRect && !(
      petRect.x + petRect.width + 4 <= inviteRect.x
      || inviteRect.x + inviteRect.width + 4 <= petRect.x
      || petRect.y + petRect.height + 4 <= inviteRect.y
      || inviteRect.y + inviteRect.height + 4 <= petRect.y
    ));
    return {
      clear: !overlaps,
      phase: petElement?.dataset.petPhase,
      pointerNear: inviteElement?.dataset.pointerNear,
    };
  })).toMatchObject({ clear: true, phase: 'following', pointerNear: 'true' });

  await expect(pet).toHaveAttribute('data-pet-phase', 'settled', { timeout: 4_500 });

  const pull = await page.evaluate(async () => {
    const inviteElement = document.querySelector<HTMLElement>('[data-linkedin-invite]');
    const cursor = document.querySelector<HTMLElement>('[data-magnetic-cursor]');
    if (!inviteElement || !cursor) throw new Error('LinkedIn magnetic cursor is missing');
    const copyRect = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    document.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true,
      clientX: 100,
      clientY: 100,
      isPrimary: true,
      pointerType: 'mouse',
    }));
    await new Promise<void>(resolve => window.setTimeout(resolve, 1_050));
    const start = copyRect(cursor);
    await new Promise<void>(resolve => window.setTimeout(resolve, 650));
    return {
      activity: document.querySelector<HTMLElement>('[data-field-activity]')?.dataset.fieldActivity,
      pull: inviteElement.dataset.magneticPull,
      pointerNear: inviteElement.dataset.pointerNear,
      start,
      later: copyRect(cursor),
    };
  });
  const linkCentre = {
    x: inviteBox.x + inviteBox.width / 2,
    y: inviteBox.y + inviteBox.height / 2,
  };
  const pullDistance = (box: Box) => Math.hypot(box.x - linkCentre.x, box.y - linkCentre.y);
  expect(pull.activity).not.toBe('calm');
  expect(pull.pointerNear).toBe('false');
  expect(pull.pull).toBe('true');
  expect(pullDistance(pull.later)).toBeLessThan(pullDistance(pull.start));

  const returning = await page.evaluate(async () => {
    const inviteElement = document.querySelector<HTMLElement>('[data-linkedin-invite]');
    const cursor = document.querySelector<HTMLElement>('[data-magnetic-cursor]');
    if (!inviteElement || !cursor) throw new Error('LinkedIn magnetic cursor is missing');
    const copyRect = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    const start = copyRect(cursor);
    document.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true,
      clientX: 120,
      clientY: 120,
      isPrimary: true,
      pointerType: 'mouse',
    }));
    await new Promise<void>(resolve => window.setTimeout(resolve, 500));
    return {
      pull: inviteElement.dataset.magneticPull,
      returning: inviteElement.dataset.magneticReturn,
      start,
      later: copyRect(cursor),
    };
  });
  const realPointer = { x: 120, y: 120 };
  const returnDistance = (box: Box) => Math.hypot(box.x - realPointer.x, box.y - realPointer.y);
  expect(returning.pull).toBe('false');
  expect(returning.returning).toBe('true');
  expect(returnDistance(returning.later)).toBeLessThan(returnDistance(returning.start));
  await expect(invite).toHaveAttribute('data-magnetic-return', 'false', { timeout: 3_500 });
  expect(errors).toEqual([]);
});

test('LinkedIn glow rises continuously as the pointer approaches', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const invite = page.locator('[data-linkedin-invite]');
  const box = await invite.boundingBox();
  if (!box) throw new Error('LinkedIn invitation has no layout box');
  const readings = await page.evaluate(({ x, y, height }) => {
    const target = document.querySelector<HTMLElement>('[data-linkedin-invite]');
    if (!target) throw new Error('LinkedIn invitation is missing');
    const moveAndRead = (clientX: number, clientY: number) => {
      document.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true,
        clientX,
        clientY,
        isPrimary: true,
        pointerType: 'mouse',
      }));
      const style = getComputedStyle(target);
      return {
        radius: Number.parseFloat(style.getPropertyValue('--linkedin-glow-radius')),
        core: Number.parseFloat(style.getPropertyValue('--linkedin-glow-core-radius')),
        ring: Number.parseFloat(style.getPropertyValue('--linkedin-glow-ring')),
      };
    };
    return {
      far: moveAndRead(x - 230, y + height / 2),
      middle: moveAndRead(x - 120, y + height / 2),
      near: moveAndRead(x - 24, y + height / 2),
    };
  }, box);

  expect(readings.middle.radius).toBeGreaterThan(readings.far.radius);
  expect(readings.near.radius).toBeGreaterThan(readings.middle.radius);
  expect(readings.middle.core).toBeGreaterThan(readings.far.core);
  expect(readings.near.core).toBeGreaterThan(readings.middle.core);
  expect(readings.middle.ring).toBeGreaterThan(readings.far.ring);
  expect(readings.near.ring).toBeGreaterThan(readings.middle.ring);
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
