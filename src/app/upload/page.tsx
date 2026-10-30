'use client';
import { useEffect, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { DropConsole } from './DropConsole';
export default function UploadPage() {
  const [apiKey, setApiKey] = useState('');
  // eslint-disable-next-line react-hooks/set-state-in-effect -- URL fragment and localStorage are browser-only; seeding in render would break hydration
  useEffect(() => { const fragment = new URLSearchParams(window.location.hash.replace(/^#/, '')); const fromFragment = fragment.get('key'); const saved = localStorage.getItem('mc_upload_key') ?? ''; const next = fromFragment || saved; if (next) { setApiKey(next); localStorage.setItem('mc_upload_key', next); } if (fromFragment) history.replaceState(null, '', window.location.pathname); }, []);
  useEffect(() => { if (apiKey) localStorage.setItem('mc_upload_key', apiKey); }, [apiKey]);
  return <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]"><SiteHeader /><main className="mx-auto max-w-xl px-6 pt-28 pb-16"><p className="mb-3 font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">[ upload / ingest / wip ]</p><h1 className="mb-3 font-serif text-3xl font-semibold tracking-tight md:text-4xl">Drop an image, get a link</h1><p className="mb-8 text-sm leading-relaxed text-[color:var(--fg-muted)]">A small public asset terminal. Your key stays in this browser and travels only in the request header.</p><label className="mb-2 block font-mono text-xs uppercase tracking-widest text-[color:var(--fg-subtle)]" htmlFor="upload-key">Your upload key</label><input id="upload-key" data-upload-key type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder="mc_..." className="mb-7 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-2 font-mono text-sm text-[color:var(--fg)] outline-none focus:border-[color:var(--accent)]" /><DropConsole apiKey={apiKey} /></main></div>;
}
