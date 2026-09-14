'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';

type AnimalGif = {
  url: string;
  source: string;
  title: string;
  emoji: string;
  description: string;
};

const ANIMAL_GIFS: ReadonlyArray<AnimalGif> = [
  {
    url: 'https://media.giphy.com/media/lhekVSXhExiYo/giphy.gif',
    source: 'https://giphy.com/gifs/lhekVSXhExiYo',
    title: 'Guinea Pig Munching Veggies',
    emoji: '🐹🥬',
    description: 'Working through a pile of fresh greens, one nibble at a time.',
  },
  {
    url: 'https://media.giphy.com/media/9FXP14IY0KIYjwS92m/giphy.gif',
    source: 'https://giphy.com/gifs/9FXP14IY0KIYjwS92m',
    title: 'Guinea Pig Eating Spinach',
    emoji: '🐹🥗',
    description: 'Spinach: the snack of champions. (via The Dodo)',
  },
  {
    url: 'https://media.giphy.com/media/nZpqJDxUW9tMBYUUZ8/giphy.gif',
    source: 'https://giphy.com/gifs/nZpqJDxUW9tMBYUUZ8',
    title: 'Hamster Munching Dinner',
    emoji: '🐹🥕',
    description: 'Tiny paws, enormous appetite.',
  },
  {
    url: 'https://media.giphy.com/media/xTiTnymLkyJtVXzc2s/giphy.gif',
    source: 'https://giphy.com/gifs/xTiTnymLkyJtVXzc2s',
    title: 'Bunny Eating Greens',
    emoji: '🐰🥬',
    description: 'This bunny takes its salad very seriously.',
  },
  {
    url: 'https://media.giphy.com/media/HzKsrt22tjTtC/giphy.gif',
    source: 'https://giphy.com/gifs/HzKsrt22tjTtC',
    title: 'Rabbit Munch Munch',
    emoji: '🐇🥦',
    description: 'Munch, munch, munch. A rabbit at work.',
  },
];

export default function AnimalsPage() {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const current = ANIMAL_GIFS[index];

  const pickRandomGif = () => {
    if (ANIMAL_GIFS.length < 2) return;
    let next = index;
    while (next === index) {
      next = Math.floor(Math.random() * ANIMAL_GIFS.length);
    }
    setIndex(next);
  };

  useEffect(() => {
    setIndex(Math.floor(Math.random() * ANIMAL_GIFS.length));
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-16 sm:px-6">
        <DraftBanner note="This intermission was live, then pulled back for a real rebuild." />
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
            [ INTERMISSION ]
          </p>
          <h1 className="themed-heading mt-3 text-3xl font-semibold sm:text-4xl">
            🐹 Animal Break Time 🥕
          </h1>
          <p className="mt-3 text-sm text-[color:var(--fg-muted)]">
            Take a moment. Enjoy some animals enjoying some snacks.
          </p>
        </div>

        <div className="themed-surface mt-8 p-6">
          <div className="text-center">
            <div className="mb-4 text-7xl motion-safe:animate-bounce sm:text-8xl">
              {current.emoji}
            </div>
            {failed[current.url] ? (
              <div className="mx-auto flex aspect-video w-full max-w-xl flex-col items-center
                              justify-center gap-2 rounded-lg border border-dashed
                              border-[color:var(--border)] bg-[color:var(--bg)] p-6">
                <p className="text-sm font-semibold text-[color:var(--fg-muted)]">
                  This clip wandered off.
                </p>
                <p className="text-xs text-[color:var(--fg-subtle)]">
                  Try another one, the rest are still grazing.
                </p>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.url}
                alt={current.title}
                className="mx-auto w-full max-w-xl rounded-lg"
                onError={() => setFailed((f) => ({ ...f, [current.url]: true }))}
              />
            )}
            <p className="mt-4 text-lg font-semibold text-[color:var(--accent-soft)]">
              {current.title}
            </p>
            <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
              {current.description}
            </p>
            <a
              href={current.source}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest
                         text-[color:var(--fg-subtle)] underline underline-offset-4
                         transition-colors hover:text-[color:var(--accent)]"
            >
              View on GIPHY ↗
            </a>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {ANIMAL_GIFS.map((g, i) => (
              <button
                key={g.url}
                onClick={() => setIndex(i)}
                aria-label={g.title}
                aria-pressed={i === index}
                className={`themed-pill px-3 py-1.5 text-lg transition-opacity ${
                  i === index
                    ? 'opacity-100 ring-1 ring-[color:var(--accent)]'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                {g.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={pickRandomGif}
            className="themed-button px-6 py-2.5 text-sm uppercase tracking-wide"
          >
            🎲 Show me another
          </button>
          <Link
            href="/"
            className="themed-pill px-6 py-2.5 font-mono text-xs uppercase tracking-widest
                       text-[color:var(--fg)] transition-colors hover:text-[color:var(--accent)]"
          >
            ← Back home
          </Link>
        </div>

        <div className="themed-surface mt-10 p-5">
          <h3 className="mb-2 font-serif text-base font-semibold text-[color:var(--accent-warm)]">
            🌟 Did you know?
          </h3>
          <ul className="space-y-1.5 text-sm text-[color:var(--fg-muted)]">
            <li>• Guinea pigs need fresh veggies daily, they can&rsquo;t produce their own Vitamin C.</li>
            <li>• Rabbits can eat their weight in hay every week.</li>
            <li>• Hamsters store food in their cheek pouches for later.</li>
            <li>• Guinea pig teeth never stop growing, so they chew constantly.</li>
          </ul>
        </div>

        <p className="mt-8 text-center text-xs text-[color:var(--fg-subtle)]">
          This page exists because sometimes you just need to watch a cute animal eat a carrot.
          <br />
          Powered by{' '}
          <a
            href="https://giphy.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 transition-colors hover:text-[color:var(--accent)]"
          >
            GIPHY
          </a>
          .
        </p>
      </main>
    </div>
  );
}
