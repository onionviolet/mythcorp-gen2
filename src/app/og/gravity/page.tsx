import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';
import { GravityLab } from './GravityLab';

export default function GravityStudy() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pt-24 pb-16 sm:px-6">
        <DraftBanner note="A bounded gravity study for the holding screen. The words let go, fall and pile up. Grab, throw, or press Space. A flat 2D solver for now; real 3D bodies are still open." />
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /OG · GRAVITY ]
        </p>
        <GravityLab />
      </main>
    </div>
  );
}
