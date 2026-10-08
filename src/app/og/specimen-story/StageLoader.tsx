'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useState } from 'react';
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

export function useWebglStatus(): WebglStatus {
  const [status, setStatus] = useState<WebglStatus>('checking');
  useEffect(() => {
    try {
      const probe = document.createElement('canvas');
      const ok = Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
      setStatus(ok ? 'ready' : 'none');
    } catch {
      setStatus('none');
    }
  }, []);
  return status;
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
