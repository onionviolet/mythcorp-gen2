'use client';

// Walkthrough: /wc/learn/plain-mode

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useScramble } from './useScramble';
import { HoldClickResponse } from './HoldClickResponse';
import { HoldStatus } from './HoldStatus';
import { HoldContact, HoldContactLinks } from './HoldContact';
import { HoldOperator } from './HoldOperator';
import { HoldMessage } from './HoldMessage';
import { DisturbedText } from './DisturbedText';
import {
  MESSAGE_STYLES, getMessageStyle, getServerMessageStyle, setMessageStyle,
  subscribeMessageStyle,
} from './messageStore';
import { HoldStage, HOLD_STYLES, type HoldStyle } from './HoldStage';
import { HoldOverlay, OVERLAY_STYLES, type OverlayStyle } from './HoldOverlay';
import { SchemePicker } from './HoldPickers';
import { DEFAULT_HOLD_COMPOSITION, HOLD_COMPOSITIONS, compositionName, takeColdComposition } from './holdCompositions';
import type { HoldRoomProps } from './HoldRoomFrame';
import { DEFAULT_HOLD_MODEL_ID, HOLD_MODEL_IDS, resolveHoldModel, type HoldModel } from './holdModels';
import entrance from './holdEntrance.module.css';
import { HOLD_SCENE_CHANGE_EVENT } from './holdSceneEvents';

/** Advance to the next option, wrapping. The readout rows cycle rather than
 *  listing, which is what let fifteen buttons come off the screen. */
function next<T>(items: readonly T[], current: T): T {
  const i = items.indexOf(current);
  return items[(i + 1) % items.length];
}

function nextSecondaryOverlay(current: OverlayStyle): OverlayStyle {
  const secondary = OVERLAY_STYLES.filter(item => item !== 'scan');
  return next(secondary, current === 'scan' ? 'none' : current);
}

/**
 * The first room: the specimen, the field-drawn words and the live readout.
 */
export function HoldInstallation({ scheme, schemeChoice, onSchemeChoice, roomSwitch }: HoldRoomProps) {
  const [style, setStyle] = useState<HoldStyle>(DEFAULT_HOLD_COMPOSITION.style);
  const [overlay, setOverlay] = useState<OverlayStyle>(DEFAULT_HOLD_COMPOSITION.overlay);
  const [modelId, setModelId] = useState<string>(DEFAULT_HOLD_MODEL_ID);
  const [modelNotice, setModelNotice] = useState('');
  const handleModelError = useCallback((failed: HoldModel) => {
    setModelNotice(failed.id === DEFAULT_HOLD_MODEL_ID
      ? 'Specimen unavailable. Try another render.'
      : `${failed.label} unavailable. Showing Spectre.`);
    setModelId(DEFAULT_HOLD_MODEL_ID);
  }, []);
  const message = useSyncExternalStore(
    subscribeMessageStyle, getMessageStyle, getServerMessageStyle,
  );

  useEffect(() => {
    const composition = takeColdComposition();
    setStyle(composition.style);
    setOverlay(composition.overlay);
    setMessageStyle(composition.message);
    setModelId(DEFAULT_HOLD_MODEL_ID);
    setModelNotice('');
  }, []);

  const scene = compositionName({ style, message, overlay });
  const model = resolveHoldModel(modelId);
  const nextComposition = HOLD_COMPOSITIONS[
    (HOLD_COMPOSITIONS.findIndex(item => item.name === scene) + 1) % HOLD_COMPOSITIONS.length
  ];
  const cycleComposition = () => {
    const composition = nextComposition;
    setStyle(composition.style);
    setOverlay(composition.overlay);
    setMessageStyle(composition.message);
    window.dispatchEvent(new Event(HOLD_SCENE_CHANGE_EVENT));
  };

  const wordmark = useScramble('MYTHCORP');

  return (
    <div className={`${entrance.lander} fixed inset-0 z-10 flex flex-col justify-between p-5 sm:p-8`}>
      <HoldClickResponse />

      <div className={entrance.identity}>
        {/* Halo is the permanent atmospheric background. Scenes only change
            the specimen, words and optional secondary overlay above it. */}
        <HoldOverlay overlay="scan" scheme={scheme} />
        {overlay !== 'scan' && <HoldOverlay overlay={overlay} scheme={scheme} />}
        <HoldMessage style={message} scheme={scheme} />
        <HoldContact />
      </div>

      <div className={`${entrance.identity} relative flex items-start justify-between gap-4 font-mono text-xs`}>
        <DisturbedText
          text={wordmark}
          className="tracking-[0.45em] text-[color:var(--fg)]"
        />
        <div className="flex flex-wrap items-start justify-end gap-x-6 gap-y-1">
          {roomSwitch}
          <SchemePicker choice={schemeChoice} onPick={onSchemeChoice} />
        </div>
      </div>

      {/* The model owns the middle of the screen. The readout sits inside the
          same box so it stays put when the style changes underneath it. */}
      <div data-hold-message={message} className={`${entrance.stage} pointer-events-none relative -mx-5 flex-1 sm:-mx-8`}>
        <div className={`${entrance.specimen} absolute inset-x-0`}>
          <HoldStage style={style} scheme={scheme} modelId={model.id} onModelError={handleModelError} />
        </div>
        <div className={`${entrance.readoutDock} absolute inset-0 flex items-end pb-8`}>
          <div className={`${entrance.readout} pointer-events-auto px-6 pt-8`}>
            <HoldStatus
              scene={scene}
              onScene={cycleComposition}
              style={style}
              scheme={scheme}
              message={message}
              overlay={overlay}
              model={model.label}
              nextValues={{
                scene: nextComposition.name,
                model: resolveHoldModel(next<string>(HOLD_MODEL_IDS, model.id)).label,
                render: next(HOLD_STYLES, style),
                words: next(MESSAGE_STYLES, message),
                over: nextSecondaryOverlay(overlay),
              }}
              onModel={HOLD_MODEL_IDS.length > 1 ? () => {
                setModelNotice('');
                setModelId(next<string>(HOLD_MODEL_IDS, model.id));
              } : undefined}
              onCycle={{
                render: () => setStyle(next(HOLD_STYLES, style)),
                words: () => setMessageStyle(next(MESSAGE_STYLES, message)),
                over: () => setOverlay(nextSecondaryOverlay(overlay)),
              }}
            />
            {modelNotice && <p role="status" className="max-w-72 font-mono text-[11px] text-[color:var(--fg-muted)]">{modelNotice}</p>}
          </div>
        </div>
      </div>

      {/* The three picker rows that used to live here are gone. They listed
          fifteen buttons and every one of them duplicated a line the readout
          was already printing, which on a phone wrapped into a block taller
          than the model. The readout rows are the controls now. */}
      <div className="relative flex flex-wrap justify-between gap-5 font-mono text-xs">
        <HoldOperator />
        <HoldContactLinks />
      </div>
    </div>
  );
}
