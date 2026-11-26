import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    recordDoorDuration(ms: number): Promise<void>;
  }
}

for (const motion of ['no-preference', 'reduce'] as const) {
  test(`ribbon doorway round trip with ${motion} motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: motion });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/?scene=signal');
    const switcher = page.locator('[data-lander-room]');
    await expect(switcher).toHaveAttribute('data-lander-room', 'installation');
    await expect(switcher).toHaveAttribute('href', '/?scene=signal&room=tour');

    const ribbons: number[] = [];
    await page.exposeFunction('recordDoorDuration', (ms: number) => ribbons.push(ms));
    await page.evaluate(() => {
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (...args) {
        const animation = animate.apply(this, args);
        if (this.hasAttribute('data-door-ribbon')) {
          const duration = animation.effect?.getTiming().duration;
          void window.recordDoorDuration(Number(duration));
        }
        return animation;
      };
    });

    await switcher.focus();
    await page.keyboard.press('Enter');
    await expect(switcher).toHaveAttribute('data-lander-room', 'tour');
    await expect(switcher).toBeFocused();
    await expect(page).toHaveURL(/scene=signal&room=tour$/);
    await page.goBack();
    await expect(switcher).toHaveAttribute('data-lander-room', 'installation');
    await expect(page).toHaveURL(/\?scene=signal$/);
    await expect(switcher).toBeFocused();
    await page.goForward();
    await expect(switcher).toHaveAttribute('data-lander-room', 'tour');
    await expect.poll(() => ribbons.length).toBe(motion === 'reduce' ? 0 : 3);
    await page.reload();
    await expect(switcher).toHaveAttribute('data-lander-room', 'tour');
    await expect(page.locator('[data-door-ribbon]')).toHaveCount(1);
  });
}
