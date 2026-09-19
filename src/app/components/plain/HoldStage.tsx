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

/**
 * Five ways to render one model, loaded one at a time. Four components, one of
 * them twice: `particle` holds the shape, `swarm` is the same cloud thinned
 * out and slowed down until it only suggests one.
 *
 * `ink` was cut on 2026-09-05 after it started drawing nothing at all. Not a
 * prop problem: it renders blank in `/wc/lab/canvas` too, under a completely
 * different prop set, in both schemes, at both viewport aspects, and on both
 * three 0.178 and 0.185, with the GLB fetching 200 and no error logged. It did
 * render earlier the same day, so it is intermittent rather than dead, and it
 * is the same silent failure this comment already blamed for killing the ink
 * treatment of the message and the `etch` variant. Three strikes for one
 * component. A one in five chance of an empty stage on the only page visitors
 * can see is worse than four styles that always work, so it is out of the
 * roster. `InkObject.tsx` stays vendored and stays in the lab, which is where
 * to debug it. Put the string back in HOLD_STYLES to restore it.
 *
 * Two more variants were built and cut. `matrix` (AsciiObject on a two
 * character ramp) never resolved into a figure at any exposure, and `etch`
 * (InkObject opened right up) drew nothing at all, the same silent failure
 * that killed the ink treatment of the message. Both are parameter sets on
 * components that already work here, which is worth remembering before
 * reaching for them again. Each vendored
 * component is a megabyte of WebGL and its own copy of the loader stack, so
 * they are dynamic imports: the holding screen ships none of them until a
 * style is picked, and switching fetches exactly that chunk. ssr:false because
 * every one of them reaches for a canvas on mount. The options object has to
 * be an inline literal: next/dynamic reads it at compile time, so hoisting it
 * to a shared const fails the build.
 */
const AsciiObject = dynamic(() => import('../canvasui/AsciiObject').then((m) => m.AsciiObject), { ssr: false });
const ParticleObject = dynamic(() => import('../canvasui/ParticleObject').then((m) => m.ParticleObject), { ssr: false });
const LiquidObject = dynamic(() => import('../canvasui/LiquidObject').then((m) => m.LiquidObject), { ssr: false });

/**
 * Four, not the seven the registry offers. The dither and glass variants were
 * tried and cut: both quantize or refract whatever is behind the model, and
 * here that is transparency, so the spectre simply vanished. Giving them an
 * opaque backdrop is the only thing that fixes them, and it paints a
 * rectangle over the middle of the field, which is the one thing this screen
 * cannot afford. Retried with the lighting turned up and the dither inverted,
 * on the theory that the model just needed more light: it does not, the
 * inverted clear colour simply fills the canvas box and the spectre is still
 * not there.
 */
export const HOLD_STYLES = ['ascii', 'particle', 'swarm', 'liquid'] as const;

export type HoldStyle = (typeof HOLD_STYLES)[number];

const FILL = 'absolute inset-0 h-full w-full';

/**
 * The particle and liquid renderers bind their pointer listeners to their own
 * canvas, and this whole box is `pointer-events-none` so it does not sit on
 * top of the readout. A canvas inside a non-interactive parent never receives
 * a pointermove, so the cursor push those components are built around was
 * silently doing nothing: the cloud that is supposed to scatter under your
 * hand just floated. `pointer-events: auto` on a child of a `none` parent is
 * hit-tested again, which buys back the interaction without making the box
 * itself swallow anything.
 *
 * The ascii and ink renderers register no pointer listeners, so they stay
 * inert on purpose rather than by accident.
 */
const REACTIVE = `${FILL} pointer-events-auto`;
const SCENE_DURATION_MS = 360;

type SceneLayer = { id: number; style: HoldStyle; model: HoldModel };
type SceneLayers = { visible: SceneLayer; incoming: SceneLayer | null; ready: boolean };

/**
 * The resolved model stays transparent in every renderer, so the fluid field
 * keeps showing through and the words go on inking behind it.
 *
 * Every colour below drags the component back to monochrome: the library ships
 * blue, neon and iridescence by default, which is the one thing plain mode
 * cannot have.
 */
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
  const frame = { src: model.src, ...model.frame };

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
