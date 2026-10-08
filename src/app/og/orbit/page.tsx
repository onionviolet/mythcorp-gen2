import { DraftBanner } from '../../components/DraftBanner';
import { SiteHeader } from '../../components/SiteHeader';
import { OrbitGallery } from './OrbitGallery';

export default function OrbitSketch() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />
      <main className="pt-20">
        <div className="mx-auto max-w-3xl px-6 pt-4">
          <DraftBanner note="The back-room sketches circle the spectre. Scroll to turn the spiral, or use the arrow keys. The list view is the same index without the spin." />
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ /OG / orbit ]
          </p>
          <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
            Spiral index
          </h1>
        </div>
        <OrbitGallery />
      </main>
    </div>
  );
}
