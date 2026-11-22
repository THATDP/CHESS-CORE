import { describe, it, expect } from 'vitest';
import { ChessGame } from '../src/chess/game/game';
import { createGame, playMove } from '../src/chess/rules';
import { readPieces, findKing } from '../src/chess/board';

describe('ChessGame', () => {
  it('registra o histórico em SAN e a vez', () => {
    const game = new ChessGame();
    game.play('e2', 'e4');
    game.play('e7', 'e5');
    game.play('g1', 'f3');
    expect(game.snapshot().sanHistory).toEqual(['e4', 'e5', 'Nf3']);
    expect(game.snapshot().turn).toBe('black');
    expect(game.history()).toEqual([
      { san: 'e4', by: 'white', moveNumber: 1 },
      { san: 'e5', by: 'black', moveNumber: 1 },
      { san: 'Nf3', by: 'white', moveNumber: 2 },
    ]);
  });

  it('desfaz e refaz lances', () => {
    const game = new ChessGame();
    game.play('e2', 'e4');
    game.play('e7', 'e5');
    expect(game.canUndo()).toBe(true);
    expect(game.undo()).toBe('e5');
    expect(game.snapshot().sanHistory).toEqual(['e4']);
    expect(game.canRedo()).toBe(true);
    expect(game.redo()).toBe('e5');
    expect(game.snapshot().sanHistory).toEqual(['e4', 'e5']);
    game.undo();
    game.undo();
    expect(game.canUndo()).toBe(false);
    expect(game.undo()).toBeNull();
    expect(game.snapshot().sanHistory).toEqual([]);
  });

  it('reinicia a partida', () => {
    const game = new ChessGame();
    game.play('e2', 'e4');
    game.play('e7', 'e5');
    game.reset();
    expect(game.snapshot().sanHistory).toEqual([]);
    expect(game.canUndo()).toBe(false);
    expect(game.canRedo()).toBe(false);
    expect(game.snapshot().turn).toBe('white');
  });

  it('rejeita lance ilegal sem alterar a posição', () => {
    const game = new ChessGame();
    expect(game.play('e2', 'e5')).toBeNull();
    expect(game.snapshot().sanHistory).toEqual([]);
    expect(game.play('e7', 'e5')).toBeNull();
  });

  it('marca o último lance e o xeque', () => {
    const game = new ChessGame();
    game.play('e2', 'e4');
    expect(game.snapshot().lastMove).toEqual({ from: 'e2', to: 'e4' });
    expect(game.snapshot().inCheck).toBe(false);
    game.play('e7', 'e5');
    game.play('d1', 'h5');
    game.play('b8', 'c6');
    game.play('f1', 'c4');
    game.play('g8', 'f6');
    game.play('h5', 'f7');
    // O lado mate está em xeque.
    expect(game.snapshot().inCheck).toBe(true);
    expect(game.snapshot().result?.kind).toBe('checkmate');
  });

  it('exporta a partida em PGN', () => {
    const game = new ChessGame();
    game.play('e2', 'e4');
    game.play('e7', 'e5');
    expect(game.pgn()).toContain('1. e4 e5');
  });

  it('reconhece empate por acordo', () => {
    const game = new ChessGame();
    expect(game.drawByAgreement()).toEqual({ kind: 'agreement', winner: null, reason: 'Acordo mútuo' });
  });
});

describe('leitura do tabuleiro', () => {
  it('lê a posição inicial com 32 peças', () => {
    const pieces = readPieces('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    expect(pieces).toHaveLength(32);
    expect(pieces.filter((piece) => piece.color === 'white')).toHaveLength(16);
    expect(pieces.filter((piece) => piece.color === 'black')).toHaveLength(16);
    expect(pieces.find((piece) => piece.square === 'e1')).toEqual({ square: 'e1', role: 'king', color: 'white' });
    expect(pieces.find((piece) => piece.square === 'd7')).toEqual({ square: 'd7', role: 'pawn', color: 'black' });
    expect(pieces.find((piece) => piece.square === 'h8')).toEqual({ square: 'h8', role: 'rook', color: 'black' });
  });

  it('encontra o rei em xeque', () => {
    expect(findKing('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'white')).toBe('e1');
    expect(findKing('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'black')).toBe('e8');
    expect(findKing('8/8/8/8/8/8/8/4K2k w - - 0 1', 'black')).toBe('h1');
  });
});

describe('integração regras + partida', () => {
  it('produz a sequência de lances do mate do estudioso', () => {
    const game = new ChessGame();
    const line: [string, string][] = [
      ['e2', 'e4'], ['e7', 'e5'], ['d1', 'h5'], ['b8', 'c6'],
      ['f1', 'c4'], ['g8', 'f6'], ['h5', 'f7'],
    ];
    for (const [from, to] of line) expect(game.play(from as never, to as never)).not.toBeNull();
    expect(game.snapshot().result).toMatchObject({ kind: 'checkmate', winner: 'white' });
    expect(game.snapshot().sanHistory).toEqual(['e4', 'e5', 'Qh5', 'Nc6', 'Bc4', 'Nf6', 'Qxf7#']);
  });

  it('aplica a regra dos 50 movimentos', () => {
    const chess = createGame('4k3/8/8/8/8/8/4R3/4K2R w K - 99 60');
    expect(playMove(chess, 'e2', 'e3')).not.toBeNull();
    expect(chess.isDrawByFiftyMoves()).toBe(true);
  });
});
