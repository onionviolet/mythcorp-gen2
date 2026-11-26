import { expect, test } from '@playwright/test';

for (const reduced of [false, true]) {
  test(`Let Go returns to the same Tour control and scroll position, reduced motion ${reduced}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: reduced ? 'reduce' : 'no-preference' });
    await page.goto('/?room=tour');
    const door = page.locator('[data-lander-room]');
    const scroll = page.locator('[data-tour-scroll]');
    await expect(door).toHaveAttribute('data-lander-room', 'tour');
    const top = await scroll.evaluate(el => { el.scrollTop = 430; return el.scrollTop; });
    expect(top).toBeGreaterThan(0);
    // Sample both legs at creation so a slow frame cannot skip the hold.
    await page.evaluate(() => {
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (...args) {
        const animation = animate.apply(this, args);
        const effect = animation.effect as KeyframeEffect;
        if (effect.getKeyframes().some(frame => String(frame.transform).includes('rotate(9deg)'))) {
          const sample = document.createElement('meta');
          sample.name = 'drop-sample';
          sample.content = JSON.stringify(effect.getKeyframes().map(frame => frame.offset));
          document.head.appendChild(sample);
        }
        return animation;
      };
    });
    await door.focus();
    await page.keyboard.press('Enter');
    await expect(door).toHaveAttribute('data-lander-room', 'letgo');
    await expect(door).toBeFocused();
    await expect(page).toHaveURL(/room=letgo$/);
    await page.goBack();
    await expect(door).toHaveAttribute('data-lander-room', 'tour');
    await expect(door).toBeFocused();
    await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(top);
    await page.goForward();
    await expect(door).toHaveAttribute('data-lander-room', 'letgo');
    const samples = page.locator('meta[name="drop-sample"]');
    await expect(samples).toHaveCount(reduced ? 0 : 3);
    if (!reduced) await expect(samples.first()).toHaveAttribute('content', '[0,0.24,1]');
    await expect(page.locator('body > a[inert]')).toHaveCount(0);
  });
}
