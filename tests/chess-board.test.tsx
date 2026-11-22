import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Square } from 'chess.js';
import { ChessBoard } from '../src/components/ChessBoard';
import type { BoardPiece } from '../src/components/ChessBoard';
import { Play } from '../src/pages/Play';
import { PromotionDialog } from '../src/components/PromotionDialog';
import { readPieces } from '../src/chess/board';

afterEach(cleanup);

const initial = readPieces('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

function cell(container: HTMLElement, square: Square): HTMLElement {
  const node = container.querySelector(`[data-square="${square}"]`);
  if (!node) throw new Error(`casa ${square} não encontrada`);
  return node as HTMLElement;
}

describe('ChessBoard', () => {
  it('renderiza 64 casas com as 32 peças na posição inicial', () => {
    const { container } = render(<ChessBoard pieces={initial} orientation="white" />);
    expect(container.querySelectorAll('.board__cell')).toHaveLength(64);
    expect(container.querySelectorAll('.board__piece')).toHaveLength(32);
    expect(container.querySelector('[data-square="e2"] .board__piece')).toBeTruthy();
    expect(container.querySelector('[data-square="e7"] .board__piece')).toBeTruthy();
  });

  it('a1 é escura e h1 é clara, independentemente da orientação', () => {
    const white = render(<ChessBoard pieces={[]} orientation="white" />);
    expect(cell(white.container, 'a1').className).toContain('board__cell--dark');
    expect(cell(white.container, 'h1').className).toContain('board__cell--light');
    cleanup();
    const black = render(<ChessBoard pieces={[]} orientation="black" />);
    expect(cell(black.container, 'a1').className).toContain('board__cell--dark');
    expect(cell(black.container, 'h1').className).toContain('board__cell--light');
  });

  it('inverte a ordem das casas na orientação preta', () => {
    const { container } = render(<ChessBoard pieces={initial} orientation="black" />);
    const squares = [...container.querySelectorAll('.board__cell')].map(
      (node) => (node as HTMLElement).dataset.square,
    );
    expect(squares[0]).toBe('h1');
    expect(squares[63]).toBe('a8');
    expect(container.querySelector('[data-testid="board"]')?.getAttribute('data-orientation')).toBe('black');
  });

  it('mostra os alvos de lance legal', () => {
    const targets: Square[] = ['e3', 'e4'];
    const { container } = render(
      <ChessBoard pieces={initial} orientation="white" selected="e2" legalTargets={targets} />,
    );
    expect(cell(container, 'e2').className).toContain('board__cell--selected');
    expect(cell(container, 'e3').querySelector('.board__hint-dot')).toBeTruthy();
    expect(cell(container, 'e4').querySelector('.board__hint-dot')).toBeTruthy();
  });

  it('marca captura com anel', () => {
    const pieces: BoardPiece[] = [
      { square: 'e4', role: 'pawn', color: 'white' },
      { square: 'd5', role: 'pawn', color: 'black' },
    ];
    const { container } = render(
      <ChessBoard pieces={pieces} orientation="white" selected="e4" legalTargets={['d5']} />,
    );
    expect(cell(container, 'd5').querySelector('.board__hint-ring')).toBeTruthy();
  });

  it('marca a última jogada e o xeque', () => {
    const { container } = render(
      <ChessBoard
        pieces={initial}
        orientation="white"
        lastMove={{ from: 'e2', to: 'e4' }}
        checkSquare="e1"
      />,
    );
    expect(cell(container, 'e2').className).toContain('board__cell--last');
    expect(cell(container, 'e4').className).toContain('board__cell--last');
    expect(cell(container, 'e1').className).toContain('board__cell--check');
  });

  it('responde ao clique na casa', () => {
    const onSquareClick = vi.fn();
    const { container } = render(
      <ChessBoard pieces={initial} orientation="white" onSquareClick={onSquareClick} />,
    );
    fireEvent.click(cell(container, 'e2'));
    expect(onSquareClick).toHaveBeenCalledWith('e2');
  });

  it('aceita arrastar e soltar em uma casa de destino', () => {
    const onDropMove = vi.fn();
    const { container } = render(
      <ChessBoard pieces={initial} orientation="white" onDropMove={onDropMove} />,
    );
    const dragEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragEvent, 'dataTransfer', {
      value: { setData: () => {}, effectAllowed: '' },
    });
    fireEvent(cell(container, 'e2'), dragEvent);
    fireEvent.drop(cell(container, 'e4'), { dataTransfer: { getData: () => 'e2' } });
    expect(onDropMove).toHaveBeenCalledWith('e2', 'e4');
  });

  it('mostra as coordenadas quando ligadas', () => {
    const { container } = render(<ChessBoard pieces={[]} orientation="white" coordinates />);
    const labels = [...container.querySelectorAll('.board__coord')].map((node) => node.textContent);
    expect(labels).toContain('a');
    expect(labels).toContain('1');
  });

  it('esconde as coordenadas quando desligadas', () => {
    const { container } = render(<ChessBoard pieces={[]} orientation="white" coordinates={false} />);
    expect(container.querySelector('.board__coord')).toBeNull();
  });
});

describe('página Jogar', () => {
  it('oferece os controles de tempo exigidos', () => {
    render(<Play />);
    for (const label of ['Sem limite', '1 + 0', '3 + 0', '3 + 2', '5 + 0', '10 + 0', '15 + 10']) {
      expect(screen.getByRole('radio', { name: label })).toBeTruthy();
    }
  });

  it('começa uma partida com dois jogadores no mesmo dispositivo', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    expect(screen.getByRole('status').textContent).toBe('Brancas a jogar');
    expect(document.querySelectorAll('.board__cell')).toHaveLength(64);
    expect(document.querySelectorAll('.board__piece')).toHaveLength(32);
  });

  it('mostra os lances legais ao selecionar uma peça', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    fireEvent.click(cell(document.body, 'e2'));
    expect(document.querySelectorAll('.board__hint').length).toBeGreaterThan(0);
    expect(document.querySelector('[data-square="e2"]')?.className).toContain('board__cell--selected');
  });

  it('joga um lance e registra no histórico em SAN', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    fireEvent.click(cell(document.body, 'e2'));
    fireEvent.click(cell(document.body, 'e4'));
    expect(screen.getByRole('status').textContent).toBe('Pretas a jogar');
    expect(document.querySelector('.match__moves')?.textContent).toContain('e4');
    expect(document.querySelector('[data-square="e4"] .board__piece')).toBeTruthy();
    expect(document.querySelector('[data-square="e2"] .board__piece')).toBeNull();
  });

  it('desfaz e refaz um lance', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    fireEvent.click(cell(document.body, 'e2'));
    fireEvent.click(cell(document.body, 'e4'));
    fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
    expect(screen.getByRole('status').textContent).toBe('Brancas a jogar');
    expect(document.querySelector('[data-square="e2"] .board__piece')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Refazer' }));
    expect(document.querySelector('[data-square="e4"] .board__piece')).toBeTruthy();
  });

  it('reinicia a partida', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    fireEvent.click(cell(document.body, 'e2'));
    fireEvent.click(cell(document.body, 'e4'));
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(document.querySelectorAll('.board__piece')).toHaveLength(32);
    expect(document.querySelector('.match__history-empty')).toBeTruthy();
  });

  it('inverte a orientação do tabuleiro', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    const before = document.querySelector('[data-testid="board"]')?.getAttribute('data-orientation');
    fireEvent.click(screen.getByRole('button', { name: 'Inverter tabuleiro' }));
    const after = document.querySelector('[data-testid="board"]')?.getAttribute('data-orientation');
    expect(before).toBe('white');
    expect(after).toBe('black');
  });

  it('encerra por desistência com o resultado na tela', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    fireEvent.click(screen.getByRole('button', { name: 'Desistir' }));
    expect(screen.getAllByText(/desistiram/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Nova partida' })).toBeTruthy();
  });

  it('encerra por empate acordado', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    fireEvent.click(screen.getByRole('button', { name: 'Empate' }));
    expect(screen.getAllByText('Empate').length).toBeGreaterThan(0);
  });

  it('mostra o aviso de que motores chegam na Fase 5', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('radio', { name: /Motor de xadrez/ }));
    expect(screen.getByText(/Motores chegam na Fase 5/)).toBeTruthy();
    expect(screen.getByText(/Stockfish/)).toBeTruthy();
    expect(screen.getByText(/Fairy-Stockfish/)).toBeTruthy();
  });

  it('mostra o relógio do controle de tempo escolhido', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('radio', { name: '10 + 0' }));
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    expect(screen.getByTestId('clock-white').textContent).toBe('10:00');
    expect(screen.getByTestId('clock-black').textContent).toBe('10:00');
  });

  it('marca o jogador que tem a vez', () => {
    render(<Play />);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    expect(document.querySelector('.match__player.is-active')?.textContent).toContain('Você');
    fireEvent.click(cell(document.body, 'e2'));
    fireEvent.click(cell(document.body, 'e4'));
    expect(document.querySelector('.match__player.is-active')?.textContent).toContain('Jogador 2');
  });
});

describe('promoção', () => {
  it('oferece dama, torre, bispo e cavalo', () => {
    const onChoose = vi.fn();
    render(<PromotionDialog color="white" onChoose={onChoose} onCancel={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: /Promoção/ });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Dama' }));
    expect(onChoose).toHaveBeenCalledWith('queen');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Torre' }));
    expect(onChoose).toHaveBeenCalledWith('rook');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Bispo' }));
    expect(onChoose).toHaveBeenCalledWith('bishop');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cavalo' }));
    expect(onChoose).toHaveBeenCalledWith('knight');
  });

  it('permite cancelar a promoção', () => {
    const onCancel = vi.fn();
    render(<PromotionDialog color="black" onChoose={() => {}} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalled();
  });
});
