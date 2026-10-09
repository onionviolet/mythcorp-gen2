/** Per-frame inputs the specimen renderers read inside their own frame loop.
 *  Writers mutate fields directly; nothing here triggers a React render.
 *  Each field has one owner:
 *  - `key`, `ambient`: the sun (`sky/`).
 *  - `gaze`: the pointer-facing turn.
 *  - `gather`: press-and-hold.
 *  Renderers must treat every field as optional influence and stay correct at
 *  the defaults, which reproduce the look before this file existed. */
export type SpecimenPose = {
  /** Unit vector from the model toward the key light, in view space (x right, y up, z toward the viewer). */
  key: { dir: [number, number, number]; intensity: number };
  /** 0..1 fill so the shadow side never goes fully black. */
  ambient: number;
  /** Radians, eased by the writer. Positive yaw turns toward screen right, positive pitch looks up.
   *  `face` (0..1) is engagement: at 1 the turntable stops and the model turns to face the camera. */
  gaze: { yaw: number; pitch: number; face: number };
  /** 0 at rest, 1 fully gathered. Eased by the writer. */
  gather: number;
};

export const DEFAULT_SPECIMEN_POSE: SpecimenPose = {
  key: { dir: [0, 0, 1], intensity: 1 },
  ambient: 1,
  gaze: { yaw: 0, pitch: 0, face: 0 },
  gather: 0,
};

export const specimenPose: SpecimenPose = structuredClone(DEFAULT_SPECIMEN_POSE);
