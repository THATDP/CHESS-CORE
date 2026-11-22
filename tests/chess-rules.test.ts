import { describe, it, expect } from 'vitest';
import {
  createGame,
  playMove,
  legalMovesFrom,
  isLegalMove,
  isPromotionMove,
  resultFromPosition,
  INITIAL_FEN,
} from '../src/chess/rules';

const startingMoves = () => createGame().moves();

describe('posição inicial', () => {
  it('começa com as peças oficiais', () => {
    expect(createGame().fen()).toBe(INITIAL_FEN);
  });

  it('oferece 20 lances legais para as brancas', () => {
    expect(startingMoves()).toHaveLength(20);
  });

  it('não permite lance de peça adversária', () => {
    const chess = createGame();
    expect(isLegalMove(chess, 'e7', 'e5')).toBe(false);
    expect(playMove(chess, 'e7', 'e5')).toBeNull();
  });

  it('não permite lance fora das regras', () => {
    const chess = createGame();
    expect(playMove(chess, 'e2', 'e5')).toBeNull();
    expect(chess.fen()).toBe(INITIAL_FEN);
  });
});

describe('capturas e en passant', () => {
  it('captura peão com peão e registra a peça capturada', () => {
    const chess = createGame();
    playMove(chess, 'd2', 'd4');
    playMove(chess, 'e7', 'e5');
    const move = playMove(chess, 'd4', 'e5');
    expect(move?.captured).toBe('p');
    expect(chess.get('e5')).toEqual({ type: 'p', color: 'w' });
  });

  it('aplica en passant quando disponível', () => {
    const chess = createGame();
    playMove(chess, 'e2', 'e4');
    playMove(chess, 'a7', 'a6');
    playMove(chess, 'e4', 'e5');
    playMove(chess, 'd7', 'd5');
    expect(chess.moves({ square: 'e5' })).toContain('e6');
    const move = playMove(chess, 'e5', 'd6');
    expect(move?.isEnPassant()).toBe(true);
    expect(chess.get('d5')).toBeUndefined();
    expect(chess.get('d6')).toEqual({ type: 'p', color: 'w' });
  });

  it('não permite en passant depois de outra jogada', () => {
    const chess = createGame();
    playMove(chess, 'e2', 'e4');
    playMove(chess, 'a7', 'a6');
    playMove(chess, 'e4', 'e5');
    playMove(chess, 'd7', 'd5');
    playMove(chess, 'a2', 'a3');
    playMove(chess, 'a6', 'a5');
    expect(legalMovesFrom(chess, 'e5').some((move) => move.isEnPassant())).toBe(false);
  });
});

describe('roque', () => {
  it('roque pequeno com o rei e a torre na posição inicial', () => {
    const chess = createGame();
    playMove(chess, 'e2', 'e4');
    playMove(chess, 'e7', 'e5');
    playMove(chess, 'g1', 'f3');
    playMove(chess, 'b8', 'c6');
    playMove(chess, 'f1', 'c4');
    playMove(chess, 'f8', 'c5');
    const move = playMove(chess, 'e1', 'g1');
    expect(move?.isKingsideCastle()).toBe(true);
    expect(chess.get('g1')).toEqual({ type: 'k', color: 'w' });
    expect(chess.get('f1')).toEqual({ type: 'r', color: 'w' });
  });

  it('roque grande move o rei para c1 e a torre para d1', () => {
    const chess = createGame();
    playMove(chess, 'd2', 'd4');
    playMove(chess, 'd7', 'd5');
    playMove(chess, 'c1', 'f4');
    playMove(chess, 'c8', 'f5');
    playMove(chess, 'b1', 'c3');
    playMove(chess, 'b8', 'c6');
    playMove(chess, 'd1', 'd2');
    playMove(chess, 'd8', 'd7');
    const move = playMove(chess, 'e1', 'c1');
    expect(move?.isQueensideCastle()).toBe(true);
    expect(chess.get('c1')).toEqual({ type: 'k', color: 'w' });
    expect(chess.get('d1')).toEqual({ type: 'r', color: 'w' });
  });

  it('não permite roque com o rei em xeque', () => {
    // Torre preta em e8 dá xeque em e1: nenhum roque é legal.
    const chess = createGame('4r2k/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    expect(chess.isCheck()).toBe(true);
    const moves = legalMovesFrom(chess, 'e1').map((move) => move.to);
    expect(moves).not.toContain('g1');
    expect(moves).not.toContain('c1');
  });

  it('não permite roque passando por casa atacada', () => {
    // Torre em d8 ataca d1: só o roque pequeno continua disponível.
    const chess = createGame('3r1k2/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    const moves = legalMovesFrom(chess, 'e1').map((move) => move.to);
    expect(moves).not.toContain('c1');
    expect(moves).toContain('g1');
  });

  it('não permite roque quando as duas rotas estão atacadas', () => {
    const chess = createGame('3rkr2/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    const moves = legalMovesFrom(chess, 'e1').map((move) => move.to);
    expect(moves).not.toContain('c1');
    expect(moves).not.toContain('g1');
  });

  it('permite os dois roques em posição limpa', () => {
    const chess = createGame('4k3/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    const moves = legalMovesFrom(chess, 'e1').map((move) => move.to);
    expect(moves).toContain('c1');
    expect(moves).toContain('g1');
  });
});

describe('promoção', () => {
  it('reconhece que a jogada é promoção', () => {
    const chess = createGame('8/3P4/8/8/8/8/8/4K2k w - - 0 1');
    expect(isPromotionMove(chess, 'd7', 'd8')).toBe(true);
    expect(isPromotionMove(chess, 'd7', 'd8')).toBe(true);
  });

  it('promove para dama quando solicitado', () => {
    const chess = createGame('8/3P4/8/8/8/8/8/4K2k w - - 0 1');
    const move = playMove(chess, 'd7', 'd8', 'q');
    expect(move?.promotion).toBe('q');
    expect(chess.get('d8')).toEqual({ type: 'q', color: 'w' });
    expect(chess.get('d7')).toBeUndefined();
  });

  it('promove para cavalo, bispo e torre', () => {
    for (const promotion of ['n', 'b', 'r'] as const) {
      const chess = createGame('8/3P4/8/8/8/8/8/4K2k w - - 0 1');
      expect(playMove(chess, 'd7', 'd8', promotion)).not.toBeNull();
      expect(chess.get('d8')?.type).toBe(promotion);
    }
  });

  it('exige a escolha da peça de promoção', () => {
    const chess = createGame('8/3P4/8/8/8/8/8/4K2k w - - 0 1');
    expect(playMove(chess, 'd7', 'd8')).toBeNull();
    expect(chess.fen()).toContain('3P4');
  });

  it('rejeita promoção inválida', () => {
    const chess = createGame('8/3P4/8/8/8/8/8/4K2k w - - 0 1');
    expect(playMove(chess, 'd7', 'd8', 'k')).toBeNull();
  });
});

describe('xeuque e xeque-mate', () => {
  it('detecta xeque-mate e indica o vencedor', () => {
    // Mate do estudioso: 1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6?? 4.Qxf7#
    const chess = createGame();
    const line = [
      ['e2', 'e4'], ['e7', 'e5'], ['d1', 'h5'], ['b8', 'c6'],
      ['f1', 'c4'], ['g8', 'f6'], ['h5', 'f7'],
    ] as [string, string][];
    for (const [from, to] of line) {
      expect(playMove(chess, from as never, to as never)).not.toBeNull();
    }
    expect(chess.isCheck()).toBe(true);
    expect(chess.isCheckmate()).toBe(true);
    expect(resultFromPosition(chess)?.kind).toBe('checkmate');
    expect(resultFromPosition(chess)?.winner).toBe('white');
    // Depois do mate nenhum lance é aceito.
    expect(playMove(chess, 'e8', 'f7')).toBeNull();
  });

  it('impede lance que deixa o próprio rei em xeque', () => {
    // O bispo preto em c5 ataca f2; o rei branco não pode andar para f2.
    const chess = createGame('4k3/8/8/2b5/8/8/5P2/4K3 w - - 0 1');
    expect(isLegalMove(chess, 'e1', 'f2')).toBe(false);
    expect(playMove(chess, 'e1', 'f2')).toBeNull();
    expect(chess.fen()).toContain('5P2');
  });

  it('impede mover a peça pregada que protege o rei', () => {
    // A torre branca em e2 segura o rei contra a torre preta em e8: ela só
    // pode continuar na coluna e.
    const chess = createGame('k3r3/8/8/8/8/8/4R3/4K3 w - - 0 1');
    const moves = legalMovesFrom(chess, 'e2').map((move) => move.to);
    expect(moves).not.toContain('d2');
    expect(moves).not.toContain('f2');
    expect(moves).toContain('e7');
  });

  it('impede o rei de capturar peça protegida', () => {
    // Dama em d2 protegida pela torre em a2: o rei não pode capturar.
    const chess = createGame('4k3/8/8/8/8/8/r2q4/4K3 w - - 0 1');
    expect(playMove(chess, 'e1', 'd2')).toBeNull();
    const moves = legalMovesFrom(chess, 'e1').map((move) => move.to);
    expect(moves).not.toContain('d2');
    expect(moves).toContain('f1');
  });
});

describe('afogamento e empates', () => {
  it('detecta afogamento', () => {
    const chess = createGame('7k/5Q2/6K1/8/8/8/8/8 b - - 0 1');
    expect(chess.isStalemate()).toBe(true);
    const result = resultFromPosition(chess);
    expect(result?.kind).toBe('stalemate');
    expect(result?.winner).toBeNull();
  });

  it('detecta material insuficiente', () => {
    expect(createGame('8/8/4k3/8/8/4K3/8/8 w - - 0 1').isInsufficientMaterial()).toBe(true);
    expect(createGame('8/8/4k3/8/8/4K3/8/4B3 w - - 0 1').isInsufficientMaterial()).toBe(true);
    expect(createGame('8/8/4k3/8/8/4K3/8/4B3 w - - 0 1').isDraw()).toBe(true);
  });

  it('não declara material insuficiente com dama em campo', () => {
    expect(createGame('8/8/4k3/8/8/4K3/8/3Q4 w - - 0 1').isInsufficientMaterial()).toBe(false);
  });

  it('detecta repetição tripla', () => {
    const chess = createGame();
    const sequence: [string, string][] = [
      ['g1', 'f3'], ['g8', 'f6'], ['f3', 'g1'], ['f6', 'g8'],
      ['g1', 'f3'], ['g8', 'f6'], ['f3', 'g1'], ['f6', 'g8'],
    ];
    for (const [from, to] of sequence) {
      expect(playMove(chess, from as never, to as never)).not.toBeNull();
    }
    expect(chess.isThreefoldRepetition()).toBe(true);
    expect(resultFromPosition(chess)?.kind).toBe('threefold-repetition');
  });

  it('não declara repetição tripla com duas ocorrências', () => {
    const chess = createGame();
    for (const [from, to] of [['g1', 'f3'], ['g8', 'f6'], ['f3', 'g1'], ['f6', 'g8']] as [string, string][]) {
      playMove(chess, from as never, to as never);
    }
    expect(chess.isThreefoldRepetition()).toBe(false);
  });

  it('detecta a regra dos 50 movimentos', () => {
    const chess = createGame('4k3/8/8/8/8/8/4R3/4K2R w K - 99 60');
    expect(playMove(chess, 'e2', 'e3')).not.toBeNull();
    expect(chess.isDrawByFiftyMoves()).toBe(true);
    expect(resultFromPosition(chess)?.kind).toBe('fifty-moves');
  });

  it('não encerra a partida antes da hora', () => {
    const chess = createGame();
    expect(resultFromPosition(chess)).toBeNull();
    expect(chess.isGameOver()).toBe(false);
  });
});

describe('desfazer e histórico', () => {
  it('desfaz até a posição inicial', () => {
    const chess = createGame();
    playMove(chess, 'e2', 'e4');
    playMove(chess, 'e7', 'e5');
    expect(chess.history()).toEqual(['e4', 'e5']);
    const undone = chess.undo();
    expect(undone?.san).toBe('e5');
    expect(chess.fen()).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1');
    chess.undo();
    expect(chess.fen()).toBe(INITIAL_FEN);
    expect(chess.undo()).toBeNull();
  });

  it('o histórico em SAN é legível', () => {
    const chess = createGame();
    playMove(chess, 'e2', 'e4');
    playMove(chess, 'e7', 'e5');
    playMove(chess, 'g1', 'f3');
    playMove(chess, 'b8', 'c6');
    expect(chess.history()).toEqual(['e4', 'e5', 'Nf3', 'Nc6']);
  });

  it('FEN carrega posições arbitrárias', () => {
    const chess = createGame('r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1');
    expect(chess.get('e1')).toEqual({ type: 'k', color: 'w' });
    expect(chess.turn()).toBe('w');
  });
});
