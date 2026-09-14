'use client';

// Walkthrough: /wc/learn/plain-mode

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { HOLD_ATTR, isHeld } from './holdState';
import { usePlainScheme } from './usePlainScheme';
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
import { DEFAULT_HOLD_COMPOSITION, HOLD_COMPOSITIONS, compositionName } from './holdCompositions';
import { DEFAULT_HOLD_MODEL_ID, HOLD_MODEL_IDS, resolveHoldModel, type HoldModel } from './holdModels';
import entrance from './holdEntrance.module.css';

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
 * The WIP installation, with direct contact links and a discoverable console.
 */
export function PlainHold() {
  const { theme, ready } = useTheme();
  const pathname = usePathname() ?? '/';
  const held = isHeld(theme, pathname);
  const [mounted, setMounted] = useState(false);
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
  const { choice, scheme, setChoice } = usePlainScheme();
  const message = useSyncExternalStore(
    subscribeMessageStyle, getMessageStyle, getServerMessageStyle,
  );

  // The pre-paint script sets this attribute so the page never flashes its
  // real content. React only takes ownership once the stored theme has been
  // read back: acting a frame earlier would clear it on the default theme
  // and reveal the very page the script just hid.
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (held) root.setAttribute(HOLD_ATTR, 'on');
    else root.removeAttribute(HOLD_ATTR);
    setMounted(true);
    return () => {
      root.removeAttribute(HOLD_ATTR);
    };
  }, [held, ready]);

  useEffect(() => {
    if (!held) return;
    const composition = DEFAULT_HOLD_COMPOSITION;
    setStyle(composition.style);
    setOverlay(composition.overlay);
    setMessageStyle(composition.message);
    setModelId(DEFAULT_HOLD_MODEL_ID);
    setModelNotice('');
  }, [held]);

  const scene = compositionName({ style, message, overlay });
  const model = resolveHoldModel(modelId);
  const cycleComposition = () => {
    const index = HOLD_COMPOSITIONS.findIndex(item => item.name === scene);
    const composition = HOLD_COMPOSITIONS[(index + 1) % HOLD_COMPOSITIONS.length];
    setStyle(composition.style);
    setOverlay(composition.overlay);
    setMessageStyle(composition.message);
  };

  const wordmark = useScramble('MYTHCORP', { active: held && mounted });

  if (!held) return null;

  return (
    <div className={`${entrance.lander} fixed inset-0 z-10 flex flex-col justify-between p-5 sm:p-8`}>
      <HoldClickResponse />
      <h1 className="sr-only">Mythcorp, work in progress</h1>

      <div className={entrance.identity}>
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
        <SchemePicker choice={choice} onPick={setChoice} />
      </div>

      {/* The model owns the middle of the screen. The readout sits inside the
          same box so it stays put when the style changes underneath it. */}
      <div className={`${entrance.stage} pointer-events-none relative -mx-5 flex-1 sm:-mx-8`}>
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
