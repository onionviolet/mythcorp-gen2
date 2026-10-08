'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { HoldRoomProps } from './HoldRoomFrame';
import { SchemePicker } from './HoldPickers';
import { drawLinkedInBanner } from './bannerDrawing';
import styles from './LinkedInBanner.module.css';

export function LinkedInBanner({ scheme, schemeChoice, onSchemeChoice, onExit }: Pick<HoldRoomProps, 'scheme' | 'schemeChoice' | 'onSchemeChoice'> & { onExit: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [phone, setPhone] = useState(false);
  const [safeArea, setSafeArea] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let live = true;
    setReady(false);
    setNotice('');
    document.fonts.ready.then(() => {
      if (!live || !canvas.current) return;
      try {
        const tokens = getComputedStyle(document.documentElement);
        drawLinkedInBanner(canvas.current,
          tokens.getPropertyValue('--font-mono').trim() || 'monospace',
          tokens.getPropertyValue('--bg').trim(),
          tokens.getPropertyValue('--fg').trim());
        setError('');
        setReady(true);
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Banner could not be drawn.');
      }
    });
    return () => { live = false; };
  }, [scheme]);

  const download = () => {
    canvas.current?.toBlob(blob => {
      if (!blob) { setError('PNG export failed.'); return; }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mythcorp-linkedin-${scheme}-1584x396.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice('PNG downloaded.');
    }, 'image/png');
  };

  return (
    <main className={styles.workshop}>
      <header className={styles.header}>
        <nav className={styles.tabs} aria-label="Mythcorp views">
          <Link href="/" onClick={event => { event.preventDefault(); onExit(); }}>Installation</Link>
          <span aria-current="page">Banner</span>
        </nav>
        <SchemePicker choice={schemeChoice} onPick={onSchemeChoice} />
      </header>
      <section className={styles.content}>
        <h1>LinkedIn banner</h1>
        <p>A still from the installation. One frame, built to stay.</p>
        <div className={styles.views} aria-label="Preview size">
          <button type="button" aria-pressed={!phone} onClick={() => setPhone(false)}>Full banner</button>
          <button type="button" aria-pressed={phone} onClick={() => setPhone(true)}>Phone size</button>
        </div>
        <div className={`${styles.preview} ${phone ? styles.phone : ''}`} data-banner-preview>
          <canvas ref={canvas} role="img" aria-label="Mythcorp banner: an ascending ASCII ribbon flowing into Work in progress" />
          {safeArea && <div className={styles.safeArea}>Profile photo<br />approximate overlap</div>}
        </div>
        <div className={styles.controls}>
          <button type="button" onClick={download} disabled={!ready}>Download PNG</button>
          <label><input type="checkbox" checked={safeArea} onChange={event => setSafeArea(event.target.checked)} /> Show photo overlap</label>
          <span>1584 × 396</span>
        </div>
        <p className={styles.note}>Phone size checks legibility at 390px wide, not the exact LinkedIn crop. The overlap guide stays out of the download. LinkedIn cropping varies by screen.</p>
        <details className={styles.guidance}>
          <summary>What works on LinkedIn</summary>
          <p>Use one light PNG for this portrait. The still keeps the gaze connected to the ribbon; the website carries the live installation. An uploaded banner keeps its own colors in either LinkedIn theme.</p>
          <p>JPG or PNG, below 8 MB; 1584 × 396 recommended. GIF backgrounds are unsupported. Some paid plans offer up to five stills rotating every three seconds. A LinkedIn Live broadcast can temporarily replace the cover with its stream.</p>
          <p>Keep the main message clear of the photo and edges. Fine particles and small text may soften after upload; check the final profile on a phone. The URL is a visual signature, not a clickable banner link.</p>
          <p><a href="https://www.linkedin.com/help/linkedin/answer/a568217" target="_blank" rel="noopener noreferrer">Cover image rules</a> · <a href="https://www.linkedin.com/help/linkedin/answer/a7145577" target="_blank" rel="noopener noreferrer">Slideshow support</a> · <a href="https://www.linkedin.com/help/linkedin/answer/a564109/" target="_blank" rel="noopener noreferrer">Media formats</a></p>
        </details>
        <p role="status">{error || notice || (ready ? 'Ready. Screenshot the banner or download the same pixels.' : 'Preparing lettering…')}</p>
      </section>
    </main>
  );
}
