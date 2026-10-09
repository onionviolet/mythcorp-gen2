'use client';

// Walkthrough: /wc/learn/plain-mode

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import sceneStyles from './HoldStage.module.css';
import type { Scheme } from './holdScheme';
import { SCHEME_INK } from './holdScheme';
import { useReducedMotion } from './useReducedMotion';
import {
  DEFAULT_HOLD_MODEL,
  DEFAULT_HOLD_MODEL_ID,
  resolveHoldModel,
  type HoldModel,
} from './holdModels';

/** Renderers load one at a time. `ink` was cut for intermittently drawing nothing (still vendored in the lab).
 * Vendored components are heavy: keep them dynamic with ssr:false, and keep the options object an inline literal (next/dynamic reads it at compile time). */
const AsciiObject = dynamic(() => import('../canvasui/AsciiObject').then((m) => m.AsciiObject), { ssr: false });
const ParticleObject = dynamic(() => import('../canvasui/ParticleObject').then((m) => m.ParticleObject), { ssr: false });
const LiquidObject = dynamic(() => import('../canvasui/LiquidObject').then((m) => m.LiquidObject), { ssr: false });

/** Dither and glass variants were cut: they quantize or refract the backdrop, which here is transparency, so the model vanishes. */
export const HOLD_STYLES = ['ascii', 'particle', 'swarm', 'liquid'] as const;

export type HoldStyle = (typeof HOLD_STYLES)[number];

const FILL = 'absolute inset-0 h-full w-full';

/** Particle and liquid bind pointer listeners on their own canvas, so it must opt back in under the `pointer-events-none` parent. */
const REACTIVE = `${FILL} pointer-events-auto`;
const SCENE_DURATION_MS = 360;
/** The specimen reads as a body behind the title: every model frame is drawn this much larger. */
const SPECIMEN_ZOOM = 1.2;
/** World units the enlarged specimen drops, so a raised arm clears the top edge. */
const SPECIMEN_DROP = 0.6;

type SceneLayer = { id: number; style: HoldStyle; model: HoldModel };
type SceneLayers = { visible: SceneLayer; incoming: SceneLayer | null; ready: boolean };

/** Models stay transparent in every renderer so the field shows through; colours are forced monochrome. */
export type HoldStageProps = {
  style: HoldStyle;
  scheme: Scheme;
  modelId?: string | null;
  onModelError?: (model: HoldModel) => void;
};

export function HoldStage({ style, scheme, modelId, onModelError }: HoldStageProps) {
  const selectedModel = resolveHoldModel(modelId);
  const reducedMotion = useReducedMotion();
  const nextLayerId = useRef(0);
  const [layers, setLayers] = useState<SceneLayers>(() => ({
    visible: { id: 0, style, model: selectedModel },
    incoming: null,
    ready: false,
  }));

  useEffect(() => {
    setLayers(previous => {
      if (previous.visible.style === style && previous.visible.model.id === selectedModel.id) {
        return previous.incoming ? { ...previous, incoming: null, ready: false } : previous;
      }
      if (previous.incoming?.style === style && previous.incoming.model.id === selectedModel.id) {
        return previous;
      }
      const incoming = { id: ++nextLayerId.current, style, model: selectedModel };
      if (reducedMotion) {
        return { visible: incoming, incoming: null, ready: false };
      }
      return { ...previous, incoming, ready: false };
    });
  }, [style, selectedModel, reducedMotion]);

  useEffect(() => {
    if (!reducedMotion) return;
    setLayers(previous => previous.incoming
      ? { visible: previous.incoming, incoming: null, ready: false }
      : previous);
  }, [reducedMotion]);

  useEffect(() => {
    if (!layers.incoming || !layers.ready) return;
    const incomingId = layers.incoming.id;
    const timer = window.setTimeout(() => {
      setLayers(previous => previous.incoming?.id === incomingId
        ? { visible: previous.incoming, incoming: null, ready: false }
        : previous);
    }, SCENE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [layers.incoming, layers.ready]);

  const onIncomingLoad = (id: number) => {
    setLayers(previous => previous.incoming?.id === id
      ? { ...previous, ready: true }
      : previous);
  };

  const onIncomingFailure = (id: number) => {
    setLayers(previous => previous.incoming?.id === id
      ? { ...previous, incoming: null, ready: false }
      : previous);
  };

  const renderedLayers = layers.incoming
    ? [layers.visible, layers.incoming]
    : [layers.visible];

  return (
    <div
      className={sceneStyles.stage}
      style={{ '--hold-scene-duration': `${SCENE_DURATION_MS}ms` } as CSSProperties}
    >
      {renderedLayers.map(layer => {
        const incoming = layer.id === layers.incoming?.id;
        return (
          <div
            key={layer.id}
            data-specimen-layer={incoming ? 'incoming' : layers.incoming ? 'outgoing' : 'current'}
            data-specimen-render={layer.style}
            data-specimen-model={layer.model.id}
            data-ready={incoming ? layers.ready : undefined}
            className={`${sceneStyles.layer} ${incoming ? sceneStyles.incoming : ''} ${incoming && !layers.ready ? sceneStyles.waiting : ''} ${incoming && layers.ready ? sceneStyles.ready : ''} ${!incoming && layers.incoming ? sceneStyles.retired : ''} ${!incoming && layers.ready ? sceneStyles.outgoing : ''}`}
          >
            <ResolvedHoldStage
              style={layer.style}
              scheme={scheme}
              selectedModel={layer.model}
              onModelError={incoming || !layers.incoming ? onModelError : undefined}
              onLoad={incoming ? () => onIncomingLoad(layer.id) : undefined}
              onFatalError={incoming ? () => onIncomingFailure(layer.id) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

function ResolvedHoldStage({
  style,
  scheme,
  selectedModel,
  onModelError,
  onLoad,
  onFatalError,
}: {
  style: HoldStyle;
  scheme: Scheme;
  selectedModel: HoldModel;
  onModelError?: (model: HoldModel) => void;
  onLoad?: () => void;
  onFatalError?: () => void;
}) {
  const { ink, highlight } = SCHEME_INK[scheme];
  const [model, setModel] = useState(selectedModel);
  const reportedFailure = useRef<string | null>(null);
  const handleModelError = useCallback(() => {
    if (reportedFailure.current === model.id) return;
    reportedFailure.current = model.id;
    onModelError?.(model);
    if (model.id !== DEFAULT_HOLD_MODEL_ID) setModel(DEFAULT_HOLD_MODEL);
    else onFatalError?.();
  }, [model, onModelError, onFatalError]);
  const frame = { src: model.src, ...model.frame, scale: model.frame.scale * SPECIMEN_ZOOM, yOffset: (model.frame.yOffset ?? 0) - SPECIMEN_DROP };

  switch (style) {
    case 'particle':
      return (
        <ParticleObject
          {...frame}
          className={REACTIVE}
          onError={handleModelError}
          onLoad={onLoad}
          color={ink}
          count={26000}
          size={1.4}
          swirl={0.5}
          drift={0.3}
        />
      );

    // Fewer, larger, looser particles that take much longer to come home, so
    // the model reads as a swarm holding a shape rather than a solid.
    case 'swarm':
      return (
        <ParticleObject
          {...frame}
          className={REACTIVE}
          onError={handleModelError}
          onLoad={onLoad}
          color={ink}
          count={3200}
          size={5}
          sizeVariance={0.9}
          radius={0.35}
          strength={2.4}
          swirl={1.4}
          spring={0.012}
          damping={0.94}
          drift={0.8}
        />
      );

    case 'liquid':
      return (
        <LiquidObject
          {...frame}
          className={REACTIVE}
          onError={handleModelError}
          onLoad={onLoad}
          tint={ink}
          saturation={0}
          iridescence={0}
          aberration={0}
          sheen={0.4}
          grain={0.2}
          highlight={highlight}
        />
      );

    case 'ascii':
    default:
      return (
        <AsciiObject
          {...frame}
          className={FILL}
          onError={handleModelError}
          onLoad={onLoad}
          cellSize={11}
          colored={false}
          color={ink}
          contrast={1.35}
          edgeContrast={3.2}
          highlight={highlight}
        />
      );
  }
}
