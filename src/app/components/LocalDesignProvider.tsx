'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const DesignProvider = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_POPMELT_DEV_SESSION
  ? dynamic(() => import('./PopmeltToolbar'), { ssr: false })
  : null;

export function LocalDesignProvider({ children }: { children: ReactNode }) {
  return DesignProvider ? <DesignProvider>{children}</DesignProvider> : children;
}
