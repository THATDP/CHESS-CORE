/**
 * Leitura do tabuleiro a partir de um FEN.
 *
 * A posição de verdade vive em `chess.js`; aqui só convertemos o campo de
 * peças para o formato que o tabuleiro 2D renderiza.
 */
import type { Square } from 'chess.js';
import type { BoardPiece } from '../components/ChessBoard';
import type { PieceRole } from '../three/arrangements';
import type { Side } from './game/types';

const ROLES: Record<string, PieceRole> = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
};

/** Percorre as fileiras de um FEN e devolve as casas ocupadas. */
export function readPieces(fen: string): BoardPiece[] {
  const out: BoardPiece[] = [];
  const rows = fen.split(' ')[0].split('/');
  rows.forEach((row, rankIndex) => {
    let fileIndex = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) {
        fileIndex += Number(ch);
        continue;
      }
      const role = ROLES[ch.toLowerCase()];
      if (role) {
        const color = ch === ch.toUpperCase() ? 'white' : 'black';
        out.push({
          square: `${'abcdefgh'[fileIndex]}${String(8 - rankIndex)}` as Square,
          role,
          color,
        });
      }
      fileIndex += 1;
    }
  });
  return out;
}

/** Casa do rei do lado informado, ou `null` se ele não estiver no campo. */
export function findKing(fen: string, side: Side): Square | null {
  const target = side === 'white' ? 'K' : 'k';
  const rows = fen.split(' ')[0].split('/');
  for (let rankIndex = 0; rankIndex < rows.length; rankIndex += 1) {
    let fileIndex = 0;
    for (const ch of rows[rankIndex]) {
      if (/\d/.test(ch)) {
        fileIndex += Number(ch);
        continue;
      }
      if (ch === target) {
        return `${'abcdefgh'[fileIndex]}${String(8 - rankIndex)}` as Square;
      }
      fileIndex += 1;
    }
  }
  return null;
}
