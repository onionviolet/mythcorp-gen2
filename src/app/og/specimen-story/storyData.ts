export type Treatment = 'veil' | 'solid' | 'flat' | 'wire' | 'gloss';

export type StoryPose = {
  /** Camera azimuth around the specimen, degrees, unwrapped so a lap keeps counting. */
  azimuth: number;
  /** Camera elevation above the floor plane, degrees. */
  elevation: number;
  /** Camera distance from the specimen's centre, measured in specimen heights. */
  distance: number;
};

export type StoryStep = {
  id: string;
  /** Short rail label. */
  tag: string;
  act: number;
  kicker: string;
  title: string;
  body: string[];
  pose: StoryPose;
  treatment: Treatment;
  /** Which real renderer the stand-in material speaks for, when one applies. */
  renderer: string | null;
  /** What the stage should emphasise, 0 to 1 each. */
  field: number;
  actors: number;
  halo: number;
};

export const STORY_STEPS: ReadonlyArray<StoryStep> = [
  {
    id: 'field',
    tag: '1',
    act: 1,
    kicker: 'act 1 · the field',
    title: 'The floor is made of weather',
    body: [
      'Behind the lettering, the front page runs a small fluid simulation and draws it in text. The grid is made of character cells. Each cell holds a little dye and a velocity.',
      'Move your pointer and you push the velocity. The dye rides along, and how much dye a cell holds decides which of ten characters it shows, from a blank to an at-sign. A press stamps a vortex ring into the field, and a confinement pass keeps the swirls from smearing flat.',
      'From up here the lit dots are that floor, rippling under a specimen that has not moved yet.',
    ],
    pose: { azimuth: 24, elevation: 30, distance: 3.4 },
    treatment: 'veil',
    renderer: null,
    field: 1,
    actors: 0,
    halo: 0.15,
  },
  {
    id: 'specimen',
    tag: '2',
    act: 2,
    kicker: 'act 2 · the specimen',
    title: 'One figure, framed the same every time',
    body: [
      'The spectre is a single model, public/spectre.glb. Every render style shares the same asset and the same framing, so changing style never moves it.',
      'The camera starts a step back, at mid distance, because a figure reads better when you can see how it stands. It also carries a skeleton and four animation clips that nobody has played yet.',
    ],
    pose: { azimuth: 0, elevation: 6, distance: 2.2 },
    treatment: 'solid',
    renderer: null,
    field: 0.2,
    actors: 0,
    halo: 0.15,
  },
  {
    id: 'signal',
    tag: '3a',
    act: 3,
    kicker: 'act 3 · four rooms',
    title: 'Signal',
    body: [
      'The installation has four authored scenes, and the camera now walks a lap around the specimen to meet them. The first is Signal: the specimen drawn as ASCII, over lettering made of dust.',
      'Each Chicago day opens on one shared scene for everyone, and loads then carry on in order, so a reload always shows a new room. Add ?scene=drift to the address to pin one for sharing.',
    ],
    pose: { azimuth: 40, elevation: 8, distance: 1.7 },
    treatment: 'flat',
    renderer: 'ascii',
    field: 0.3,
    actors: 0,
    halo: 0.15,
  },
  {
    id: 'suspension',
    tag: '3b',
    act: 3,
    kicker: 'act 3 · four rooms',
    title: 'Suspension',
    body: [
      'Suspension swaps the drawing for a cloud of twenty-six thousand particles holding the shape. Push through it with a hand and it scatters, then comes home.',
      'The lettering switches to the field style, so the words are made of the same dye as the floor.',
    ],
    pose: { azimuth: 130, elevation: 14, distance: 1.7 },
    treatment: 'wire',
    renderer: 'particle',
    field: 0.3,
    actors: 0,
    halo: 0.15,
  },
  {
    id: 'drift',
    tag: '3c',
    act: 3,
    kicker: 'act 3 · four rooms',
    title: 'Drift',
    body: [
      'Drift thins the cloud to about three thousand loose particles that take a long time to come back, so the figure is suggested rather than held. A fog overlay settles on top, and the lettering turns solid.',
    ],
    pose: { azimuth: 220, elevation: 4, distance: 1.7 },
    treatment: 'veil',
    renderer: 'swarm',
    field: 0.3,
    actors: 0,
    halo: 0.15,
  },
  {
    id: 'surface',
    tag: '3d',
    act: 3,
    kicker: 'act 3 · four rooms',
    title: 'Surface',
    body: [
      'Surface is the liquid style: a glassy skin with a faint sheen and grain, stripped of every colour it shipped with. The lap ends here, and the next reload carries on to Signal.',
    ],
    pose: { azimuth: 310, elevation: 10, distance: 1.7 },
    treatment: 'gloss',
    renderer: 'liquid',
    field: 0.3,
    actors: 0,
    halo: 0.15,
  },
  {
    id: 'actors',
    tag: '4',
    act: 4,
    kicker: 'act 4 · the actors',
    title: 'Things that move on their own',
    body: [
      'After a fine pointer rests for 900 milliseconds, a decorative cursor echo drifts toward the LinkedIn link, and a small cat follows beside it. Clicks drop rings into the field.',
      'The MOVEMENT bar measures only those: the echo, the cat and the click rings. Your real pointer does not feed it. Slow travel raises it gently, a click ramps it faster, and it releases over about a second, passing from CALM through ACTIVE to SURGE and back.',
      'Here the camera looks straight down at the floor, and the three actors are replayed in miniature.',
    ],
    pose: { azimuth: 350, elevation: 62, distance: 2.8 },
    treatment: 'veil',
    renderer: null,
    field: 0.55,
    actors: 1,
    halo: 0.15,
  },
  {
    id: 'halo',
    tag: '5',
    act: 5,
    kicker: 'act 5 · the halo',
    title: 'The one thing that never changes scene',
    body: [
      'Halo is the permanent atmospheric background. Scenes change the specimen, the words and one optional overlay. The halo stays lit through every one of them, and the readout says so: halo active.',
      'That is the whole tour. Reload the front page and the next room is already waiting.',
    ],
    pose: { azimuth: 400, elevation: 5, distance: 3.0 },
    treatment: 'solid',
    renderer: null,
    field: 0.15,
    actors: 0,
    halo: 1,
  },
];

export const SCENE_NAMES: Record<string, string> = {
  signal: 'Signal',
  suspension: 'Suspension',
  drift: 'Drift',
  surface: 'Surface',
};

export function smooth(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

export type StageBlend = {
  azimuth: number;
  elevation: number;
  distance: number;
  field: number;
  actors: number;
  halo: number;
  nearest: number;
};

/** Blend the step table at a fractional step index. */
export function blendAt(stepFloat: number, snap: boolean): StageBlend {
  const last = STORY_STEPS.length - 1;
  const f = Math.min(last, Math.max(0, snap ? Math.round(stepFloat) : stepFloat));
  const i = Math.min(last - 1, Math.floor(f));
  const t = snap ? 0 : smooth(f - i);
  const a = STORY_STEPS[i];
  const b = STORY_STEPS[Math.min(last, i + 1)];
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    azimuth: mix(a.pose.azimuth, b.pose.azimuth),
    elevation: mix(a.pose.elevation, b.pose.elevation),
    distance: mix(a.pose.distance, b.pose.distance),
    field: mix(a.field, b.field),
    actors: mix(a.actors, b.actors),
    halo: mix(a.halo, b.halo),
    nearest: Math.round(f),
  };
}
