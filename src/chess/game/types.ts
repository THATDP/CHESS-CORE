export type Side = 'white' | 'black';

/** Motivos de encerramento. `null` no winner significa empate. */
export type ResultKind =
  | 'checkmate'
  | 'stalemate'
  | 'insufficient-material'
  | 'threefold-repetition'
  | 'fifty-moves'
  | 'resignation'
  | 'timeout'
  | 'agreement'
  | 'abandonment';

export type GameResult = {
  kind: ResultKind;
  winner: Side | null;
  /** Texto curto e legível, usado na tela de resultado. */
  reason: string;
};

export type PlayerInfo = {
  name: string;
  /** Posição no tabuleiro. */
  side: Side;
  rating?: number;
  /** `local` (dois humanos no mesmo tabuleiro) ou uma engine da biblioteca. */
  controller: 'local' | string;
};

export type TimeControl = {
  id: string;
  label: string;
  /** Segundos iniciais por lado. `null` significa sem limite. */
  initial: number | null;
  /** Incremento em segundos aplicado a cada lance. */
  increment: number;
};

export const TIME_CONTROLS: TimeControl[] = [
  { id: 'sem-limite', label: 'Sem limite', initial: null, increment: 0 },
  { id: '1+0', label: '1 + 0', initial: 60, increment: 0 },
  { id: '3+0', label: '3 + 0', initial: 180, increment: 0 },
  { id: '3+2', label: '3 + 2', initial: 180, increment: 2 },
  { id: '5+0', label: '5 + 0', initial: 300, increment: 0 },
  { id: '10+0', label: '10 + 0', initial: 600, increment: 0 },
  { id: '15+10', label: '15 + 10', initial: 900, increment: 10 },
];

export const timeControlById = (id: string): TimeControl => (
  TIME_CONTROLS.find((control) => control.id === id) ?? TIME_CONTROLS[4]
);

export const otherSide = (side: Side): Side => (side === 'white' ? 'black' : 'white');

export const sideLabel = (side: Side): string => (side === 'white' ? 'Brancas' : 'Pretas');

export const resultLabel = (result: GameResult): string => {
  if (!result.winner) return 'Empate';
  return result.winner === 'white' ? 'Brancas vencem' : 'Pretas vencem';
};
