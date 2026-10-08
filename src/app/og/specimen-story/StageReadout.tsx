'use client';

import type { StageTelemetry } from './SpecimenStage';
import { STORY_STEPS } from './storyData';
import type { Treatment } from './storyData';

const TREATMENT_LABEL: Record<Treatment, string> = {
  veil: 'veil',
  solid: 'solid ink',
  flat: 'faceted',
  wire: 'lattice',
  gloss: 'gloss',
};

function movementState(level: number) {
  if (level >= 0.65) return 'SURGE';
  if (level >= 0.05) return 'ACTIVE';
  return 'CALM';
}

function pad(value: number, width: number) {
  return Math.round(value).toString().padStart(width, '0');
}

export function StageReadout({
  step,
  telemetry,
  reduced,
}: {
  step: number;
  telemetry: StageTelemetry | null;
  reduced: boolean;
}) {
  const info = STORY_STEPS[step];
  const pose = telemetry ?? {
    step,
    azimuth: ((info.pose.azimuth % 360) + 360) % 360,
    elevation: info.pose.elevation,
    distance: info.pose.distance,
    movement: 0,
  };
  const isActors = info.id === 'actors';
  const isHalo = info.id === 'halo';

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 font-mono text-[11px] leading-5 tracking-wide">
      <dt className="text-[color:var(--fg-subtle)]">act</dt>
      <dd className="text-[color:var(--fg)]">
        {pad(info.act, 2)}
        {info.tag.length > 1 ? info.tag.slice(1) : ''} / 05 {info.id}
      </dd>
      <dt className="text-[color:var(--fg-subtle)]">camera</dt>
      <dd className="text-[color:var(--fg)]">
        az {pad(pose.azimuth, 3)}° el {pad(pose.elevation, 2)}° d {pose.distance.toFixed(1)}h
      </dd>
      <dt className="text-[color:var(--fg-subtle)]">style</dt>
      <dd className="text-[color:var(--fg-muted)]">
        {TREATMENT_LABEL[info.treatment]}
        {info.renderer ? ` (stand-in for ${info.renderer})` : ''}
      </dd>
      {isActors && (
        <>
          <dt className="text-[color:var(--fg-subtle)]">movement</dt>
          <dd className="flex items-center gap-2 text-[color:var(--fg)]">
            <span aria-hidden className="relative h-1.5 w-24 overflow-hidden bg-[color:var(--border)]">
              <span
                className="absolute inset-y-0 left-0 bg-[color:var(--accent)]"
                style={{ width: `${Math.round(pose.movement * 100)}%` }}
              />
            </span>
            {reduced ? 'CALM (held)' : movementState(pose.movement)}
          </dd>
        </>
      )}
      {isHalo && (
        <>
          <dt className="text-[color:var(--fg-subtle)]">halo</dt>
          <dd className="text-[color:var(--fg)]">active</dd>
        </>
      )}
    </dl>
  );
}
