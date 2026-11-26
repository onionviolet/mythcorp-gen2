export function DoorRibbon({ folded = false }: { folded?: boolean }) {
  return (
    <svg data-door-ribbon="" aria-hidden="true" viewBox="0 0 300 64" preserveAspectRatio="none"
      className={folded
        ? 'pointer-events-none absolute bottom-[12%] left-[28%] z-10 h-10 w-[32%] max-w-64'
        : 'pointer-events-none relative z-10 mt-2 block h-px w-full'}
      style={{ overflow: 'visible', transformOrigin: 'top left' }} fill="none" stroke="currentColor">
      {[-1, -0.5, 0, 0.5, 1].map(strand => (
        <path key={strand} vectorEffect="non-scaling-stroke" opacity={strand === 1 ? 0.8 : 0.32}
          d={`M 0 60 C 52 55, 85 ${44 + strand * 25}, 128 19 S 210 ${28 - strand * 28}, 243 23 Q 270 ${8 + strand * 12}, 300 4`} />
      ))}
    </svg>
  );
}
