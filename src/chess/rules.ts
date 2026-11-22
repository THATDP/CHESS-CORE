/**
 * Adaptador das regras oficiais de xadrez.
 *
 * Este módulo é a única fronteira com a biblioteca de regras (chess.js).
 * Nada de IA, rede ou DOM passa por aqui: só posição, lances e desfecho.
 * A Fase 5 (engines) não precisa alterar este arquivo.
 */
import { Chess } from 'chess.js';
import type { Move, PieceSymbol, Square } from 'chess.js';
import type { GameResult, ResultKind, Side } from './game/types';
import { otherSide } from './game/types';

export { Chess };
export type { Move, PieceSymbol, Square };

export const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const toSide = (color: 'w' | 'b'): Side => (color === 'w' ? 'white' : 'black');

export function createGame(fen: string = INITIAL_FEN): Chess {
  return new Chess(fen);
}

/** Lances legais a partir de uma casa. */
export function legalMovesFrom(chess: Chess, square: Square): Move[] {
  return chess.moves({ square, verbose: true });
}

export function legalTargets(chess: Chess, square: Square): Square[] {
  return legalMovesFrom(chess, square).map((move) => move.to);
}

/** Um lance é promoção quando o peão alcança a última fileira. */
export function isPromotionMove(chess: Chess, from: Square, to: Square): boolean {
  const piece = chess.get(from);
  if (!piece || piece.type !== 'p') return false;
  const rank = to[1];
  return (piece.color === 'w' && rank === '8') || (piece.color === 'b' && rank === '1');
}

export function isLegalMove(chess: Chess, from: Square, to: Square, promotion?: PieceSymbol): boolean {
  if (isPromotionMove(chess, from, to) && !promotion) return false;
  return legalMovesFrom(chess, from).some((move) => (
    move.to === to && (!promotion || move.promotion === promotion)
  ));
}

/**
 * Executa um lance. Retorna `null` (sem alterar a posição) quando o lance é
 * ilegal — inclusive quando o rei ficaria em xeque.
 */
export function playMove(chess: Chess, from: Square, to: Square, promotion?: PieceSymbol): Move | null {
  if (chess.isGameOver()) return null;
  if (!isLegalMove(chess, from, to, promotion)) return null;
  try {
    return chess.move({ from, to, promotion });
  } catch {
    return null;
  }
}

export function isCheck(chess: Chess): boolean {
  return chess.isCheck();
}


export function lastMove(chess: Chess): { from: Square; to: Square } | null {
  const history = chess.history({ verbose: true });
  const last = history[history.length - 1];
  return last ? { from: last.from, to: last.to } : null;
}


const RESULT_TEXT: Record<ResultKind, string> = {
  checkmate: 'Xeque-mate',
  stalemate: 'Afogamento',
  'insufficient-material': 'Material insuficiente',
  'threefold-repetition': 'Repetição tripla',
  'fifty-moves': 'Regra dos 50 movimentos',
  resignation: 'Desistência',
  timeout: 'Tempo esgotado',
  agreement: 'Acordo mútuo',
  abandonment: 'Abandono',
};


/**
 * Desfecho da posição, na ordem em que a FIDE costuma apresentar:
 * xeque-mate, afogamento, material insuficiente, repetição tripla e 50 lances.
 */
export function resultFromPosition(chess: Chess): GameResult | null {
  if (chess.isCheckmate()) {
    return {
      kind: 'checkmate',
      winner: otherSide(toSide(chess.turn())),
      reason: RESULT_TEXT.checkmate,
    };
  }
  if (chess.isStalemate()) {
    return { kind: 'stalemate', winner: null, reason: RESULT_TEXT.stalemate };
  }
  if (chess.isInsufficientMaterial()) {
    return {
      kind: 'insufficient-material',
      winner: null,
      reason: RESULT_TEXT['insufficient-material'],
    };
  }
  if (chess.isThreefoldRepetition()) {
    return {
      kind: 'threefold-repetition',
      winner: null,
      reason: RESULT_TEXT['threefold-repetition'],
    };
  }
  if (chess.isDrawByFiftyMoves()) {
    return { kind: 'fifty-moves', winner: null, reason: RESULT_TEXT['fifty-moves'] };
  }
  return null;
}
