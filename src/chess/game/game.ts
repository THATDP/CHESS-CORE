/**
 * Estado de uma partida de xadrez.
 *
 * Guarda a posição (via chess.js), o histórico de lances e a pilha de
 * desfazer/refazer. A instância de `Chess` é mutável, então quem consumir este
 * objeto deve pedir `snapshot()` (ou observar `version`) em vez de guardar a
 * referência da posição.
 */
import { Chess } from 'chess.js';
import type { Move, PieceSymbol, Square } from 'chess.js';
import { createGame, playMove, resultFromPosition } from '../rules';
import type { GameResult, Side } from './types';

export type HistoryEntry = {
  san: string;
  /** `null` no primeiro lance, quando as brancas jogam. */
  by: Side;
  moveNumber: number;
};

export type GameSnapshot = {
  fen: string;
  turn: Side;
  /** Lances em SAN, na ordem em que foram jogados. */
  sanHistory: string[];
  result: GameResult | null;
  inCheck: boolean;
  /** Lance executado por último (`null` na posição inicial). */
  lastMove: { from: Square; to: Square } | null;
  /** Número de meus lances (65 no máximo para 32 lances). */
  ply: number;
};

export class ChessGame {
  private chess: Chess;
  /** Lances desfeitos, prontos para refazer (o mais recente por último). */
  private redoStack: Move[] = [];
  private _version = 0;

  constructor(fen?: string) {
    this.chess = createGame(fen);
  }

  get version(): number {
    return this._version;
  }

  get raw(): Chess {
    return this.chess;
  }

  /** Posição atual, já em forma serializável para a interface. */
  snapshot(): GameSnapshot {
    const fen = this.chess.fen();
    return {
      fen,
      turn: this.chess.turn() === 'w' ? 'white' : 'black',
      sanHistory: this.chess.history(),
      result: resultFromPosition(this.chess),
      inCheck: this.chess.isCheck(),
      lastMove: lastMoveOf(this.chess),
      ply: this.chess.history().length,
    };
  }


  /**
   * Joga um lance. Retorna `null` quando ele é ilegal ou a partida já acabou,
   * sem alterar a posição.
   */
  play(from: Square, to: Square, promotion?: PieceSymbol): Move | null {
    const move = playMove(this.chess, from, to, promotion);
    if (!move) return null;
    this.redoStack = [];
    this._version += 1;
    return move;
  }

  /**
   * Desfaz o último lance. Retorna o SAN desfeito, ou `null` quando não há
   * nada a desfazer.
   */
  undo(): string | null {
    const move = this.chess.undo();
    if (!move) return null;
    this.redoStack.push(move);
    this._version += 1;
    return move.san;
  }

  /** Refaz o lance desfeito mais recente. Retorna o SAN, ou `null`. */
  redo(): string | null {
    if (!this.redoStack.length) return null;
    const move = this.redoStack[this.redoStack.length - 1];
    const played = playMove(this.chess, move.from, move.to, move.promotion);
    if (!played) {
      this.redoStack = [];
      return null;
    }
    this.redoStack = this.redoStack.slice(0, -1);
    this._version += 1;
    return played.san;
  }

  canUndo(): boolean {
    return this.chess.history().length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /** Volta à posição inicial, limpa o histórico e as pilhas. */
  reset(fen?: string): void {
    this.chess = createGame(fen);
    this.redoStack = [];
    this._version += 1;
  }

  history(): HistoryEntry[] {
    const moves = this.chess.history({ verbose: true });
    return moves.map((move, index) => ({
      san: move.san,
      by: move.color === 'w' ? 'white' : 'black',
      moveNumber: Math.floor(index / 2) + 1,
    }));
  }

  /** Sequência de SAN usada para exportar/importar partidas. */
  pgn(): string {
    return this.chess.pgn();
  }

  /** Empate por acordo: só faz sentido com as duas partes de acordo. */
  drawByAgreement(): GameResult {
    return { kind: 'agreement', winner: null, reason: 'Acordo mútuo' };
  }
}

function lastMoveOf(chess: Chess): { from: Square; to: Square } | null {
  const moves = chess.history({ verbose: true });
  const last = moves[moves.length - 1];
  return last ? { from: last.from, to: last.to } : null;
}
