import type { RingShape } from '../lib/ring-shapes';

type Cut = Exclude<RingShape, 'sketch' | 'undecided' | 'other'>;

// Each top-view cut has its own silhouette, open table and facet pattern.
// The square viewBox keeps the chosen proportions at every screen size.
const cuts: Record<Cut, { outline: string; facets: string }> = {
  round: {
    outline: 'M32 7a25 25 0 1 1 0 50 25 25 0 1 1 0-50Z',
    facets: 'M32 7 49.7 14.3 57 32 49.7 49.7 32 57 14.3 49.7 7 32 14.3 14.3Z M26 18h12l8 8v12l-8 8H26l-8-8V26Z M32 7 26 18 14.3 14.3 18 26 7 32 18 38 14.3 49.7 26 46 32 57 38 46 49.7 49.7 46 38 57 32 46 26 49.7 14.3 38 18 32 7',
  },
  oval: {
    outline: 'M32 6a18 26 0 1 1 0 52 18 26 0 1 1 0-52Z',
    facets: 'M32 6 44.7 13.6 50 32 44.7 50.4 32 58 19.3 50.4 14 32 19.3 13.6Z M28 17h8l6 11v8l-6 11h-8l-6-11v-8Z M32 6 28 17 19.3 13.6 22 28 14 32 22 36 19.3 50.4 28 47 32 58 36 47 44.7 50.4 42 36 50 32 42 28 44.7 13.6 36 17 32 6',
  },
  pear: {
    outline: 'M32 6C27 14 15.75 27 15.75 38a16.25 20 0 0 0 32.5 0C48.25 27 37 14 32 6Z',
    facets: 'M32 6 32 18 22 32 23 43 28 49h8l5-6 1-11-10-14 M32 6 20 26 15.75 38 20 51 32 58 44 51 48.25 38 44 26Z M20 26 22 32 15.75 38 23 43 20 51 28 49 32 58 36 49 44 51 41 43 48.25 38 42 32 44 26 M20 26 32 18 44 26',
  },
  marquise: {
    outline: 'M32 6C41 14 45 23 45 32S41 50 32 58C23 50 19 41 19 32S23 14 32 6Z',
    facets: 'M32 6 41 19 45 32 41 45 32 58 23 45 19 32 23 19Z M32 17 39 28v8l-7 11-7-11v-8Z M32 6v11 M23 19 32 17 41 19 39 28 45 32 39 36 41 45 32 47 23 45 25 36 19 32 25 28 23 19 M32 47v11',
  },
  heart: {
    outline: 'M32 55C25 48 8 36 8 22C8 7 25 5 32 18C39 5 56 7 56 22C56 36 39 48 32 55Z',
    facets: 'M32 18 23 13 13 16 8 22 14 35 23 46 32 55 41 46 50 35 56 22 51 16 41 13Z M32 25 25 21 19 25 20 33 32 44 44 33 45 25 39 21Z M32 18v7 M23 13 25 21 13 16 19 25 8 22 M14 35 20 33 23 46 32 44 41 46 44 33 50 35 M56 22 45 25 51 16 39 21 41 13 M32 44v11',
  },
  emerald: {
    outline: 'M19 6h26l5 5v42l-5 5H19l-5-5V11Z',
    facets: 'M21 10h22l3 3v38l-3 3H21l-3-3V13Z M23 14h18l2 2v32l-2 2H23l-2-2V16Z M19 6l2 4 2 4 M45 6l-2 4-2 4 M50 11l-4 2-3 3 M50 53l-4-2-3-3 M45 58l-2-4-2-4 M19 58l2-4 2-4 M14 53l4-2 3-3 M14 11l4 2 3 3',
  },
  radiant: {
    outline: 'M18 6h28l5 5v42l-5 5H18l-5-5V11Z',
    facets: 'M25 16h14l6 10v12l-6 10H25l-6-10V26Z M18 6 25 16 32 6 39 16 46 6 M51 11 39 16 45 26 51 32 45 38 39 48 51 53 M46 58 39 48 32 58 25 48 18 58 M13 53 25 48 19 38 13 32 19 26 25 16 13 11 M13 11l6 15 M51 11l-6 15 M13 53l6-15 M51 53l-6-15',
  },
  cushion: {
    outline: 'M20 8Q32 6 44 8Q54 10 56 21Q58 32 56 43Q54 54 44 56Q32 58 20 56Q10 54 8 43Q6 32 8 21Q10 10 20 8Z',
    facets: 'M20 8 44 8 56 21v22L44 56H20L8 43V21Z M25 19h14l6 6v14l-6 6H25l-6-6V25Z M20 8 25 19 32 7 39 19 44 8 M56 21 45 25 57 32 45 39 56 43 M44 56 39 45 32 57 25 45 20 56 M8 43 19 39 7 32 19 25 8 21 M20 8 19 25 M44 8 45 25 M44 56 45 39 M20 56 19 39',
  },
  princess: {
    outline: 'M8 8h48v48H8Z',
    facets: 'M8 8 23 20h18L56 8 44 23v18l12 15-15-12H23L8 56l12-15V23Z M23 20 26 26h12l6-3 M44 41l-6-3v-12 M41 44l-3-6H26l-3 6 M20 41l6-3V26l-6-3 M8 8l18 18 M56 8 38 26 M56 56 38 38 M8 56l18-18 M8 8l12 15 M56 8 41 20 M56 56 44 41 M8 56l15-12',
  },
  asscher: {
    outline: 'M17 8h30l9 9v30l-9 9H17l-9-9V17Z',
    facets: 'M19 12h26l7 7v26l-7 7H19l-7-7V19Z M21 16h22l5 5v22l-5 5H21l-5-5V21Z M23 20h18l3 3v18l-3 3H23l-3-3V23Z M17 8l6 12 M47 8l-6 12 M56 17l-12 6 M56 47l-12-6 M47 56l-6-12 M17 56l6-12 M8 47l12-6 M8 17l12 6',
  },
  trilliant: {
    outline: 'M32 9Q47 28 58 54Q32 59 6 54Q17 28 32 9Z',
    facets: 'M32 9 47 31 58 54 32 57 6 54 17 31Z M32 23 44 44 20 44Z M32 9v14 M47 31 32 23 17 31 20 44 6 54 M20 44l12 13 12-13 14 10 M47 31 44 44 M17 31 32 23',
  },
  baguette: {
    outline: 'M21.6 6h20.8v52H21.6Z',
    facets: 'M24.6 9h14.8v46H24.6Z M27.6 12h8.8v40H27.6Z M21.6 6l6 6 M42.4 6l-6 6 M42.4 58l-6-6 M21.6 58l6-6',
  },
  shield: {
    outline: 'M15 6h34l5 11-22 41-22-41Z',
    facets: 'M21 16h22l3 6-14 25-14-25Z M15 6l6 10 M49 6l-6 10 M10 17l8 5 M54 17l-8 5 M32 47v11 M10 17l11-1 M54 17l-11-1 M21 16l11 31 11-31',
  },
};

export function RingShapeIcon({ shape }: { shape: RingShape }) {
  const cut = shape in cuts ? cuts[shape as Cut] : null;
  return <svg className="ring-shape-icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" focusable="false">
    {cut ? <><path d={cut.outline} strokeWidth="1.5" /><path d={cut.facets} /></> : shape === 'sketch' ? <path d="m13 47 4-13L44 7l12 12-27 27-16 4Zm4-13 12 12M40 11l12 12M13 47l7-1-5-5M12 56h42M44 7l-4 4" /> : shape === 'undecided' ? <><circle cx="32" cy="32" r="24" /><path d="M24 24a8 8 0 1 1 13 7c-5 3-5 5-5 9M32 47v1" /></> : <><circle cx="10" cy="32" r="8" /><path d="M32 18Q48 32 32 46Q16 32 32 18ZM49 22h13v20H49Z" /></>}
  </svg>;
}
