'use client';

export function PrintPaperButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--fg)]"
    >
      Print or save as PDF
    </button>
  );
}
