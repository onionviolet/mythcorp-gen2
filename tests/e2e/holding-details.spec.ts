import { expect, test } from '@playwright/test';

test('locked homepage loads its own assets and identity', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => requests.push(new URL(request.url()).pathname));
  await page.goto('/');

  await expect(page).toHaveTitle('MYTHCORP / work in progress');
  await expect(page.locator('html')).toHaveClass(/theme-ready/);
  await expect(page.locator('#page-root main')).toHaveCount(0);
  await expect(page.locator('link[rel="preload"][href="/spectre.glb"]')).toHaveCount(1);
  await expect(page.locator('link[rel="preload"][href="/fonts/Inter_Bold.json"]')).toHaveCount(0);
  await expect(page.locator('link[rel="preload"][href="/chicagoskyline.jpg"]')).toHaveCount(0);
  expect(requests).not.toContain('/fonts/Inter_Bold.json');
  expect(requests).not.toContain('/chicagoskyline.jpg');
});

test('the plain field responds to motion preference changes during a visit', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const field = page.locator('canvas[data-plain-field]');
  const light = page.getByRole('button', { name: 'light', exact: true });

  await expect.poll(() => field.evaluate(canvas => (canvas as HTMLCanvasElement).width)).toBeGreaterThan(0);
  await light.hover();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => field.evaluate(canvas => (canvas as HTMLCanvasElement).width)).toBe(0);
  await expect(light.locator('[aria-hidden]')).toHaveText('light');
  await expect(page.getByRole('heading', { name: 'Mythcorp, work in progress' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Find me on LinkedIn (opens in a new tab)' })).toBeVisible();

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => field.evaluate(canvas => (canvas as HTMLCanvasElement).width)).toBeGreaterThan(0);
});

test('readout hints follow actual next values and only the activated control acknowledges', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const scene = page.getByRole('button', { name: /^scene,/ });
  const render = page.getByRole('button', { name: /^render,/ });

  await expect(scene).toHaveAccessibleDescription('Next value: Suspension');
  await expect(page.locator('[data-activated="true"]')).toHaveCount(0);
  await scene.focus();
  await expect(page.locator('[data-readout-hint="scene"]')).toHaveText('next: Suspension');
  await scene.evaluate(button => {
    button.addEventListener('animationstart', () => button.setAttribute('data-observed-acknowledgement',
      [...document.querySelectorAll('[data-activated="true"]')].map(element =>
        element.getAttribute('aria-label')?.split(',')[0] ?? '').join(','),
    ), { once: true });
  });
  await scene.press('Enter');
  await expect(scene).toHaveAttribute('data-observed-acknowledgement', 'scene');
  await expect(scene).toHaveAccessibleName('scene, Suspension, activate to change');
  await expect(scene).toHaveAccessibleDescription('Next value: Drift');
  await expect(page.locator('[data-readout-hint="scene"]')).toHaveText('next: Drift');
  await expect(scene).toBeFocused();
  await expect(render).not.toHaveAttribute('data-activated', 'true');
  await expect(render).toHaveAccessibleDescription('Next value: swarm');

  await scene.press('Enter');
  await expect(scene).toHaveAccessibleName('scene, Drift, activate to change');
  await expect(scene).not.toHaveAttribute('data-activated', 'true');
});

test('readout remembers an explicit choice across reload and viewport changes', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.locator('[data-readout]')).toHaveAttribute('data-readout', 'full');
  await page.getByRole('button', { name: 'Compact readout' }).click();
  await page.reload();
  await expect(page.locator('[data-readout]')).toHaveAttribute('data-readout', 'compact');

  await page.setViewportSize({ width: 320, height: 568 });
  await page.getByRole('button', { name: 'Full readout' }).click();
  await page.reload();
  await expect(page.locator('[data-readout]')).toHaveAttribute('data-readout', 'full');
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

for (const storage of ['invalid', 'blocked']) {
  test(`readout stays usable with ${storage} preference storage`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(mode => {
      if (mode === 'invalid') {
        localStorage.setItem('mythcorp:hold-readout', 'unexpected');
      } else {
        Object.defineProperty(Storage.prototype, 'getItem', { value() { throw new Error('Storage blocked'); } });
        Object.defineProperty(Storage.prototype, 'setItem', { value() { throw new Error('Storage blocked'); } });
      }
    }, storage);
    await page.goto('/');
    await expect(page.locator('[data-readout]')).toHaveAttribute('data-readout', 'compact');
    await page.getByRole('button', { name: 'Full readout' }).click();
    await expect(page.locator('[data-readout]')).toHaveAttribute('data-readout', 'full');
  });
}

test('cat reacts only to deliberate scene changes and settles under reduced motion', async ({ page }) => {
  await page.goto('/');
  const pet = page.locator('[data-linkedin-pet]');
  const scene = page.getByRole('button', { name: /^scene,/ });
  await expect(page.locator('[data-linkedin-invite]')).toHaveAttribute('data-pulse-enabled', 'true');
  await expect(pet).toHaveAttribute('data-pet-reaction', 'idle');
  await pet.evaluate(element => {
    const onStart = (event: Event) => {
      if (!(event as AnimationEvent).animationName.includes('pet-ear-flick')) return;
      element.removeEventListener('animationstart', onStart);
      element.setAttribute('data-observed-reaction', element.getAttribute('data-pet-reaction') ?? '');
    };
    element.addEventListener('animationstart', onStart);
  });
  await scene.click();
  await expect(pet).toHaveAttribute('data-observed-reaction', 'active');
  await expect(pet).toHaveAttribute('data-pet-reaction', 'idle');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await scene.click();
  await expect(pet).toHaveAttribute('data-pet-reaction', 'idle');
  await expect.poll(() => pet.locator('g').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});

test('specimen waits for its model and keeps the loaded canvas through promotion', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  let releaseModel!: () => void;
  const modelGate = new Promise<void>(resolve => { releaseModel = resolve; });
  await page.route('**/models/calibration.glb', async route => {
    await modelGate;
    await route.continue();
  });
  await page.goto('/');
  await expect(page.locator('[data-hold-overlay="scan"] canvas').first()).toBeAttached();
  const haloCanvases = await page.locator('[data-hold-overlay="scan"] canvas').elementHandles();
  await expect(page.locator('[data-specimen-layer="current"] canvas')).toHaveCount(1);
  await page.getByRole('button', { name: /^specimen,/ }).click();
  const incoming = page.locator('[data-specimen-layer="incoming"]');
  await expect(incoming).toHaveAttribute('data-ready', 'false');
  await expect(page.locator('[data-specimen-layer="outgoing"]')).toHaveCSS('opacity', '1');
  await expect(incoming.locator('canvas')).toHaveCount(1);
  const incomingCanvas = await incoming.locator('canvas').elementHandle();
  releaseModel();
  await expect(page.locator('[data-specimen-layer]')).toHaveCount(1);
  expect(await incomingCanvas?.evaluate(canvas => canvas.isConnected)).toBe(true);
  for (const halo of haloCanvases) expect(await halo.evaluate(canvas => canvas.isConnected)).toBe(true);
});

test('rapid scene changes settle on the latest render without accumulating layers', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/');
  const scene = page.getByRole('button', { name: /^scene,/ });
  await scene.focus();
  for (const name of ['Suspension', 'Drift', 'Surface', 'Signal', 'Suspension']) {
    await scene.press('Enter');
    await expect(scene).toHaveAccessibleName(`scene, ${name}, activate to change`);
    expect(await page.locator('[data-specimen-layer]').count()).toBeLessThanOrEqual(2);
  }
  await expect(page.locator('[data-specimen-layer]')).toHaveCount(1);
  await expect(page.locator('[data-specimen-layer="current"]')).toHaveAttribute('data-specimen-render', 'particle');
  await expect(page.getByRole('button', { name: /^render,/ })).toHaveAccessibleName('render, particle, activate to change');

  await scene.click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-specimen-layer]')).toHaveCount(1);
  await expect(page.locator('[data-specimen-layer="incoming"]')).toHaveCount(0);
});

test('a failed alternate specimen returns to Spectre and releases the failed layer', async ({ page }) => {
  await page.route('**/models/calibration.glb', route => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: /^specimen,/ }).click();
  await expect(page.getByRole('status')).toHaveText('Calibration unavailable. Showing Spectre.');
  await expect(page.getByRole('button', { name: /^specimen,/ })).toHaveAccessibleName('specimen, Spectre, activate to change');
  await expect(page.locator('[data-specimen-layer]')).toHaveCount(1);
});

test('a failed replacement render keeps the previous specimen and releases its candidate', async ({ page }) => {
  const firstModel = page.waitForResponse(response => new URL(response.url()).pathname === '/spectre.glb' && response.ok());
  await page.goto('/');
  await firstModel;
  await expect(page.locator('[data-specimen-layer="current"] canvas')).toHaveCount(1);
  await page.route('**/spectre.glb', route => route.abort());
  await page.getByRole('button', { name: /^render,/ }).click();
  await expect(page.getByRole('status')).toHaveText('Specimen unavailable. Try another render.');
  await expect(page.locator('[data-specimen-layer]')).toHaveCount(1);
  await expect(page.locator('[data-specimen-layer="current"]')).toHaveAttribute('data-specimen-render', 'ascii');
});

test.describe('touch readout', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test('expanded controls have room below the specimen', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Full readout' }).tap();
    const readout = await page.locator('[data-readout="full"]').boundingBox();
    const specimen = await page.locator('[data-specimen-layer="current"]').boundingBox();
    const control = await page.getByRole('button', { name: /^scene,/ }).boundingBox();
    if (!readout || !specimen || !control) throw new Error('Missing touch layout');
    expect(control.height).toBeGreaterThanOrEqual(44);
    expect(readout.y).toBeGreaterThanOrEqual(specimen.y + specimen.height + 16);
    await page.getByRole('button', { name: /^render,/ }).tap();
    await expect(page.getByRole('button', { name: /^render,/ })).toHaveAccessibleName('render, particle, activate to change');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
