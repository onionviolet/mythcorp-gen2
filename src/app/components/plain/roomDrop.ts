/** Carry the Tour link over the room swap. Its destination stays usable throughout. */
export function captureDrop(down: boolean, running: Animation | null) {
  const link = document.querySelector<HTMLElement>('[data-lander-room]');
  if (!link) return null;
  const time = running?.playState === 'running' ? Number(running.currentTime) : undefined;
  if (!down) return { time };
  // A second click can reverse the lift before the control reaches its slot.
  // Measure its resting position and resume the fall at the captured time.
  if (running?.effect instanceof KeyframeEffect && running.effect.target === link) running.cancel();
  const label = link.cloneNode(true) as HTMLElement;
  label.removeAttribute('data-lander-room');
  label.removeAttribute('href');
  label.removeAttribute('aria-label');
  label.setAttribute('aria-hidden', 'true');
  label.inert = true;
  const rect = link.getBoundingClientRect();
  const style = getComputedStyle(link);
  Object.assign(label.style, {
    position: 'fixed', left: rect.left + 'px', top: rect.top + 'px',
    width: rect.width + 'px', height: rect.height + 'px', margin: '0',
    fontFamily: style.fontFamily, color: style.color, zIndex: '100',
    pointerEvents: 'none', webkitTextStroke: style.webkitTextStroke, paintOrder: style.paintOrder,
  });
  return { time, label };
}

export function beginDrop(direction: 'down' | 'up', target: HTMLElement, cue: NonNullable<ReturnType<typeof captureDrop>>) {
  const label = cue.label ?? target;
  const down = direction === 'down';
  if (cue.label) document.body.appendChild(cue.label);
  const start = label.getBoundingClientRect();
  const distance = window.innerHeight - start.top + start.width * 0.2;
  const duration = 440;
  const animation = label.animate([
    { offset: 0, transform: 'none', opacity: 1 },
    { offset: 0.24, transform: 'none', opacity: 1, easing: 'cubic-bezier(.54,.02,.87,.52)' },
    { offset: 1, transform: `translateY(${distance}px) rotate(9deg)`, opacity: 1 },
  ], { duration, fill: 'both' });
  animation.playbackRate = down ? 1 : -1;
  animation.currentTime = cue.time ?? (down ? 0 : duration);
  animation.play();
  const reveal = down ? target.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 100, delay: duration * 0.32, fill: 'backwards',
  }) : null;
  function dispose() {
    animation.cancel();
    reveal?.cancel();
    cue.label?.remove();
  }
  animation.onfinish = dispose;
  return { animation, dispose };
}
