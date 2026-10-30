'use client';

import dynamic from 'next/dynamic';
import { Component } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import type { DocentStage as DocentStageType } from './DocentStage';

const DocentStage = dynamic(() => import('./DocentStage').then((m) => m.DocentStage), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center font-mono text-xs text-[color:var(--fg-subtle)]">
      waking the docent...
    </div>
  ),
});

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

export function DocentLoader({
  onFail,
  ...stage
}: ComponentProps<typeof DocentStageType> & { onFail: () => void }) {
  return (
    <StageBoundary onFail={onFail}>
      <DocentStage {...stage} />
    </StageBoundary>
  );
}
