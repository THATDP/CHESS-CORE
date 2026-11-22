/**
 * Demonstrative piece layouts for the 3D scenes.
 * These are purely visual: no chess rules are modelled or enforced.
 */

export type PieceCode =
  | 'K' | 'Q' | 'R' | 'B' | 'N' | 'P'
  | 'k' | 'q' | 'r' | 'b' | 'n' | 'p'
  | '';

export type Arrangement = PieceCode[];
export type PieceSide = 'white' | 'black';
export type PieceRole = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';

export function parseArrangement(rows: string[]): Arrangement {
  const out: Arrangement = [];
  for (const row of rows) {
    for (const ch of row.replace(/\s/g, '')) {
      out.push(ch === '.' ? '' : (ch as PieceCode));
    }
  }
  if (out.length !== 64) throw new Error(`Arranjo inválido: ${out.length} casas.`);
  return out;
}

export function roleOf(code: PieceCode): PieceRole | null {
  switch (code.toLowerCase()) {
    case 'k': return 'king';
    case 'q': return 'queen';
    case 'r': return 'rook';
    case 'b': return 'bishop';
    case 'n': return 'knight';
    case 'p': return 'pawn';
    default: return null;
  }
}

export function sideOf(code: PieceCode): PieceSide | null {
  if (!code) return null;
  return code === code.toUpperCase() ? 'white' : 'black';
}

export const arrangements = {
  /** Classic opening position, used where a familiar board reads best. */
  initial: parseArrangement([
    'rnbqkbnr',
    'pppppppp',
    '........',
    '........',
    '........',
    '........',
    'PPPPPPPP',
    'RNBQKBNR',
  ]),

  /** Curated mid-game used by the home hero: open centre, developed knights. */
  hero: parseArrangement([
    'r.bqkb.r',
    'pp..ppp.',
    '..n..n..',
    '...Pp...',
    '..P.....',
    '..N..P..',
    'PP...PP.',
    'R.BQKB.R',
  ]),

  /** Sparse duel for the computer page: two monarchs and a handful of pieces. */
  duel: parseArrangement([
    '....k...',
    '........',
    '........',
    '...N....',
    '....Q...',
    '........',
    '........',
    '....K...',
  ]),

  /** Tactical sketch for puzzles and analysis panels. */
  tactical: parseArrangement([
    '....k...',
    '..r.....',
    '........',
    '...Q....',
    '........',
    '..P...p.',
    '.....K..',
    '........',
  ]),

  /** Rich middlegame for the analysis page. */
  middlegame: parseArrangement([
    '..r.k..r',
    'p.pq.p.p',
    '..n.....',
    '....p...',
    '...P...Q',
    '..N..P..',
    'PP..P.PP',
    'R...K..R',
  ]),
};
