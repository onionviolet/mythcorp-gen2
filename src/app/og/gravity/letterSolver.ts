export type LetterBody = {
  id: number;
  ch: string;
  line: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  w: number;
  r: number;
  size: number;
  homeX: number;
  homeY: number;
  hanging: boolean;
  inert: boolean;
  awake: boolean;
  sleepT: number;
  held: boolean;
  tx: number;
  ty: number;
};

export type LetterWorld = {
  width: number;
  height: number;
  gravity: number;
  bodies: LetterBody[];
  queue: { id: number; at: number }[];
  clock: number;
  peakImpact: number;
  lastImpact: number;
};

export const LINES = ['WORK IN PROGRESS', 'MYTHCORP'] as const;
export const MAX_SPEED = 2400;
const RESTITUTION = 0.22;
const FRICTION = 0.5;
const SLEEP_SPEED = 45;
const SLEEP_SPIN = 1.6;
const SLEEP_AFTER = 0.4;

export function createWorld(width: number, height: number, inertFirstLine: boolean): LetterWorld {
  const bodies: LetterBody[] = [];
  LINES.forEach((text, line) => {
    for (const ch of text) {
      if (ch === ' ') continue;
      bodies.push({
        id: bodies.length, ch, line, x: 0, y: 0, vx: 0, vy: 0, a: 0, w: 0, r: 10, size: 20,
        homeX: 0, homeY: 0, hanging: true, inert: inertFirstLine && line === 0,
        awake: true, sleepT: 0, held: false, tx: 0, ty: 0,
      });
    }
  });
  const world: LetterWorld = {
    width, height, gravity: 1800, bodies, queue: [], clock: 0, peakImpact: 0, lastImpact: 0,
  };
  layoutHomes(world);
  rehang(world);
  return world;
}

export function layoutHomes(world: LetterWorld): void {
  const { width, height } = world;
  const base = Math.max(14, Math.min(58, (width - 32) / 12.8));
  LINES.forEach((text, line) => {
    const scale = line === 0 ? 1 : 1.35;
    const size = base * scale;
    const pitch = size * 0.8;
    const total = text.length * pitch;
    const lineBodies = world.bodies.filter((q) => q.line === line);
    let slot = 0;
    let index = 0;
    for (const ch of text) {
      if (ch !== ' ') {
        const b = lineBodies[index];
        if (b) {
          b.size = size;
          b.r = size * 0.4;
          b.homeX = width / 2 - total / 2 + (slot + 0.5) * pitch;
          b.homeY = Math.min(height * 0.2, 90) + line * size * 1.6 + 20;
        }
        index += 1;
      }
      slot += 1;
    }
  });
}

export function rehang(world: LetterWorld): void {
  world.queue = [];
  world.peakImpact = 0;
  world.lastImpact = 0;
  for (const b of world.bodies) {
    b.x = b.homeX;
    b.y = b.homeY;
    b.vx = 0;
    b.vy = 0;
    b.a = 0;
    b.w = 0;
    b.hanging = true;
    b.held = false;
    b.awake = true;
    b.sleepT = 0;
  }
}

export function setBounds(world: LetterWorld, width: number, height: number): void {
  world.width = width;
  world.height = height;
  const hung = world.bodies.map((b) => b.hanging);
  layoutHomes(world);
  world.bodies.forEach((b, i) => {
    if (hung[i]) {
      b.x = b.homeX;
      b.y = b.homeY;
    } else {
      b.x = Math.min(Math.max(b.x, b.r), Math.max(b.r, width - b.r));
      b.y = Math.min(Math.max(b.y, b.r), Math.max(b.r, height - b.r));
      b.awake = true;
      b.sleepT = 0;
    }
  });
}

export function release(world: LetterWorld, id: number): void {
  const b = world.bodies[id];
  if (!b || b.inert || !b.hanging) return;
  b.hanging = false;
  b.awake = true;
  b.sleepT = 0;
}

export function dropAll(world: LetterWorld, staggerSeconds: number, rand: () => number): void {
  const order = world.bodies.filter((b) => b.hanging && !b.inert).map((b) => b.id);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  world.queue = order.map((id, i) => ({ id, at: world.clock + i * staggerSeconds }));
}

export function wake(world: LetterWorld, id: number): void {
  const stack = [id];
  const seen = new Set<number>(stack);
  while (stack.length) {
    const a = world.bodies[stack.pop() as number];
    a.awake = true;
    a.sleepT = 0;
    for (const b of world.bodies) {
      if (seen.has(b.id) || b.hanging || b.inert) continue;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < a.r + b.r + 3) {
        seen.add(b.id);
        stack.push(b.id);
      }
    }
  }
}

export function grab(world: LetterWorld, id: number, x: number, y: number): void {
  const b = world.bodies[id];
  release(world, id);
  wake(world, id);
  b.held = true;
  b.vx = 0;
  b.vy = 0;
  b.w = 0;
  b.tx = x;
  b.ty = y;
}

export function moveHeld(world: LetterWorld, id: number, x: number, y: number): void {
  const b = world.bodies[id];
  b.tx = Math.min(Math.max(x, b.r), world.width - b.r);
  b.ty = Math.min(Math.max(y, b.r), world.height - b.r);
}

export function letGo(world: LetterWorld, id: number, vx: number, vy: number): void {
  const b = world.bodies[id];
  b.held = false;
  const s = Math.hypot(vx, vy);
  const k = s > MAX_SPEED ? MAX_SPEED / s : 1;
  b.vx = vx * k;
  b.vy = vy * k;
  b.awake = true;
  b.sleepT = 0;
}

export function impulse(world: LetterWorld, id: number, dvx: number, dvy: number): void {
  const b = world.bodies[id];
  if (b.hanging || b.inert) return;
  wake(world, id);
  b.vx += dvx;
  b.vy += dvy;
}

const mass = (b: LetterBody) => (b.r / 10) * (b.r / 10);

function invMass(b: LetterBody): number {
  return b.held || !b.awake || b.hanging || b.inert ? 0 : 1 / mass(b);
}

function subStep(world: LetterWorld, h: number): void {
  const { width, height, bodies } = world;
  for (const b of bodies) {
    if (b.hanging || b.inert) continue;
    if (b.held) {
      const dx = b.tx - b.x;
      const dy = b.ty - b.y;
      const d = Math.hypot(dx, dy);
      const reach = b.r * 0.5;
      const f = d > reach ? reach / d : 1;
      b.x += dx * f;
      b.y += dy * f;
      continue;
    }
    if (!b.awake) continue;
    b.vy += world.gravity * h;
    b.x += b.vx * h;
    b.y += b.vy * h;
    b.a += b.w * h;
    wallContacts(world, b, h);
  }
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        pair(world, bodies[i], bodies[j]);
      }
    }
    for (const b of bodies) {
      if (b.hanging || b.inert || b.held || !b.awake) continue;
      b.x = Math.min(Math.max(b.x, b.r), Math.max(b.r, width - b.r));
      b.y = Math.min(Math.max(b.y, b.r), Math.max(b.r, height - b.r));
    }
  }
  for (const b of bodies) {
    if (b.hanging || b.inert || b.held || !b.awake) continue;
    if (Math.hypot(b.vx, b.vy) < 120) {
      const damp = 1 - Math.min(1, 4 * h);
      b.vx *= damp;
      b.vy *= damp;
      b.w *= damp;
    }
    if (Math.hypot(b.vx, b.vy) < SLEEP_SPEED && Math.abs(b.w) < SLEEP_SPIN) {
      b.sleepT += h;
      if (b.sleepT > SLEEP_AFTER) {
        b.awake = false;
        b.vx = 0;
        b.vy = 0;
        b.w = 0;
      }
    } else {
      b.sleepT = 0;
    }
  }
}

function recordImpact(world: LetterWorld, speed: number): void {
  world.lastImpact = speed;
  if (speed > world.peakImpact) world.peakImpact = speed;
}

function wallContacts(world: LetterWorld, b: LetterBody, h: number): void {
  const { width, height } = world;
  if (b.y > height - b.r) {
    b.y = height - b.r;
    if (b.vy > 0) {
      if (b.vy > 40) recordImpact(world, b.vy);
      const dvy = b.vy * (1 + (b.vy > 90 ? RESTITUTION : 0));
      b.vy = b.vy > 90 ? -b.vy * RESTITUTION : 0;
      const contactVx = b.vx - b.w * b.r;
      const cap = FRICTION * dvy;
      const dvx = Math.max(-cap, Math.min(cap, -contactVx / 3));
      b.vx += dvx;
      b.w -= (2 * dvx) / b.r;
    }
    b.vx *= 1 - Math.min(1, 0.9 * h);
    b.w *= 1 - Math.min(1, 2.2 * h);
  }
  if (b.y < b.r) {
    b.y = b.r;
    if (b.vy < 0) b.vy = -b.vy * RESTITUTION;
  }
  if (b.x < b.r) {
    b.x = b.r;
    if (b.vx < 0) {
      if (-b.vx > 40) recordImpact(world, -b.vx);
      b.vx = -b.vx * RESTITUTION;
    }
  } else if (b.x > width - b.r) {
    b.x = width - b.r;
    if (b.vx > 0) {
      if (b.vx > 40) recordImpact(world, b.vx);
      b.vx = -b.vx * RESTITUTION;
    }
  }
}

function pair(world: LetterWorld, p: LetterBody, q: LetterBody): void {
  if (p.hanging || q.hanging || p.inert || q.inert) return;
  if (!p.awake && !q.awake && !p.held && !q.held) return;
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const min = p.r + q.r;
  const d2 = dx * dx + dy * dy;
  if (d2 >= min * min) return;
  const tiny = d2 < 0.0001;
  const d = tiny ? 0.0001 : Math.sqrt(d2);
  const nx = tiny ? (p.id % 2 ? 1 : 0.6) : dx / d;
  const ny = tiny ? (p.id % 2 ? 0 : -0.8) : dy / d;
  const depth = min - d;
  let ip = invMass(p);
  let iq = invMass(q);
  const rel = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
  if ((!p.awake || !q.awake) && Math.abs(rel) > 90) {
    wake(world, p.awake ? q.id : p.id);
    ip = invMass(p);
    iq = invMass(q);
  }
  const sum = ip + iq;
  if (sum === 0) return;
  const push = (Math.max(depth - 0.2, 0) * 0.85) / sum;
  p.x -= nx * push * ip;
  p.y -= ny * push * ip;
  q.x += nx * push * iq;
  q.y += ny * push * iq;
  if (rel >= 0) return;
  if (-rel > 40) recordImpact(world, -rel);
  const e = -rel > 90 ? RESTITUTION : 0;
  const j = (-(1 + e) * rel) / sum;
  p.vx -= nx * j * ip;
  p.vy -= ny * j * ip;
  q.vx += nx * j * iq;
  q.vy += ny * j * iq;
  const tx = -ny;
  const ty = nx;
  const vt = (q.vx - p.vx) * tx + (q.vy - p.vy) * ty - q.w * q.r - p.w * p.r;
  const jt = Math.max(-FRICTION * j, Math.min(FRICTION * j, -vt / (3 * sum)));
  p.vx -= tx * jt * ip;
  p.vy -= ty * jt * ip;
  q.vx += tx * jt * iq;
  q.vy += ty * jt * iq;
  p.w -= (2 * jt * ip) / p.r;
  q.w -= (2 * jt * iq) / q.r;
}

export function step(world: LetterWorld, dt: number): void {
  const frame = Math.min(dt, 1 / 20);
  let fastest = 0;
  let smallest = Infinity;
  for (const b of world.bodies) {
    smallest = Math.min(smallest, b.r);
    if (b.held) fastest = Math.max(fastest, Math.hypot(b.tx - b.x, b.ty - b.y) / frame);
    else if (b.awake && !b.hanging) fastest = Math.max(fastest, Math.hypot(b.vx, b.vy) + world.gravity * frame);
  }
  const subs = Math.min(16, Math.max(1, Math.ceil((fastest * frame) / (smallest * 0.5))));
  const h = frame / subs;
  for (let i = 0; i < subs; i++) {
    world.clock += h;
    while (world.queue.length && world.queue[0].at <= world.clock) {
      const next = world.queue.shift() as { id: number };
      release(world, next.id);
    }
    subStep(world, h);
  }
}

export function isIdle(world: LetterWorld): boolean {
  if (world.queue.length) return false;
  return world.bodies.every((b) => b.inert || b.hanging || (!b.awake && !b.held));
}

export function settle(world: LetterWorld, maxSeconds = 6): void {
  world.queue.forEach((item) => release(world, item.id));
  world.queue = [];
  for (let t = 0; t < maxSeconds && !isIdle(world); t += 1 / 60) step(world, 1 / 60);
  for (const b of world.bodies) {
    if (!b.hanging && !b.inert && !b.held) {
      b.awake = false;
      b.vx = 0;
      b.vy = 0;
      b.w = 0;
    }
  }
}

export function readout(world: LetterWorld) {
  let awake = 0;
  let asleep = 0;
  let kinetic = 0;
  for (const b of world.bodies) {
    if (b.inert || b.hanging) continue;
    if (b.awake || b.held) {
      awake += 1;
      const m = mass(b);
      kinetic += 0.5 * m * (b.vx * b.vx + b.vy * b.vy) + 0.25 * m * b.r * b.r * b.w * b.w;
    } else {
      asleep += 1;
    }
  }
  const hanging = world.bodies.filter((b) => b.hanging && !b.inert).length;
  return { awake, asleep, hanging, kinetic: kinetic / 1000, peak: world.peakImpact };
}

export function quiesce(world: LetterWorld): void {
  for (const b of world.bodies) {
    if (b.hanging || b.inert || b.held) continue;
    b.awake = false;
    b.vx = 0;
    b.vy = 0;
    b.w = 0;
  }
}
