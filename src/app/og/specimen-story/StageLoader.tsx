'use client';

import dynamic from 'next/dynamic';
import { Component, useSyncExternalStore } from 'react';
import type { ReactNode, RefObject } from 'react';
import type { StageTelemetry } from './SpecimenStage';

const SpecimenStage = dynamic(() => import('./SpecimenStage').then((m) => m.SpecimenStage), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center font-mono text-xs text-[color:var(--fg-subtle)]">
      booting stage...
    </div>
  ),
});

export type WebglStatus = 'checking' | 'ready' | 'none';

let webglProbe: WebglStatus | undefined;

function probeWebgl(): WebglStatus {
  if (webglProbe) return webglProbe;
  try {
    const probe = document.createElement('canvas');
    const ok = Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
    webglProbe = ok ? 'ready' : 'none';
  } catch {
    webglProbe = 'none';
  }
  return webglProbe;
}

const noopSubscribe = () => () => {};
const checkingWebgl = (): WebglStatus => 'checking';

export function useWebglStatus(): WebglStatus {
  return useSyncExternalStore(noopSubscribe, probeWebgl, checkingWebgl);
}

class StageBoundary extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function StageLoader({
  stepFloat,
  reduced,
  onTelemetry,
  onFail,
}: {
  stepFloat: RefObject<number>;
  reduced: boolean;
  onTelemetry: (t: StageTelemetry) => void;
  onFail: () => void;
}) {
  return (
    <StageBoundary onFail={onFail}>
      <SpecimenStage stepFloat={stepFloat} reduced={reduced} onTelemetry={onTelemetry} />
    </StageBoundary>
  );
}
