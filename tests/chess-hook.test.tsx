import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useChessGame } from '../src/chess/game/useChessGame';
import { timeControlById } from '../src/chess/game/types';
import type { PlayerInfo } from '../src/chess/game/types';

afterEach(() => {
  // O hook descarta o relógio ao desmontar.
});

const players = {
  white: { name: 'Você', side: 'white' as const, controller: 'local' },
  black: { name: 'Jogador 2', side: 'black' as const, controller: 'local' },
};

function setup(controlId: string = '3+0') {
  return renderHook(() => useChessGame({ control: timeControlById(controlId), players }));
}

describe('useChessGame', () => {
  it('começa na posição inicial, parado, com as brancas na vez', () => {
    const { result } = setup();
    expect(result.current.state.phase).toBe('setup');
    expect(result.current.state.snapshot.turn).toBe('white');
    expect(result.current.state.snapshot.sanHistory).toEqual([]);
    expect(result.current.state.clock.running).toBe(false);
    expect(result.current.state.canUndo).toBe(false);
  });

  it('selecionar uma peça expõe os lances legais', () => {
    const { result } = setup();
    act(() => result.current.actions.selectSquare('e2'));
    expect(result.current.state.selected).toBe('e2');
    expect(result.current.state.legalTargets).toEqual(['e3', 'e4']);
  });

  it('não seleciona peça adversária', () => {
    const { result } = setup();
    act(() => result.current.actions.selectSquare('e7'));
    expect(result.current.state.selected).toBeNull();
    expect(result.current.state.legalTargets).toEqual([]);
  });

  it('inicia a partida e o relógio passa a correr', () => {
    const { result } = setup('1+0');
    act(() => result.current.actions.begin(timeControlById('1+0')));
    expect(result.current.state.phase).toBe('playing');
    expect(result.current.state.clock.running).toBe(true);
    expect(result.current.state.clock.active).toBe('white');
    expect(result.current.state.clock.white).toBeLessThanOrEqual(60_000);
    expect(result.current.state.clock.white).toBeGreaterThan(55_000);
  });

  it('joga um lance, registra o SAN e alterna o relógio', () => {
    const { result } = setup('3+2');
    act(() => result.current.actions.begin(timeControlById('3+2')));
    act(() => result.current.actions.tryMove('e2' as never, 'e4' as never));
    expect(result.current.state.snapshot.sanHistory).toEqual(['e4']);
    expect(result.current.state.snapshot.turn).toBe('black');
    expect(result.current.state.clock.active).toBe('black');
    expect(result.current.state.clock.white).toBeGreaterThan(180_000);
  });

  it('desfaz e refaz pelo hook', () => {
    const { result } = setup();
    act(() => result.current.actions.begin(timeControlById('3+0')));
    act(() => result.current.actions.tryMove('e2' as never, 'e4' as never));
    expect(result.current.state.canUndo).toBe(true);
    act(() => result.current.actions.undo());
    expect(result.current.state.snapshot.sanHistory).toEqual([]);
    expect(result.current.state.canRedo).toBe(true);
    act(() => result.current.actions.redo());
    expect(result.current.state.snapshot.sanHistory).toEqual(['e4']);
  });

  it('reinicia a partida com o controle informado', () => {
    const { result } = setup();
    act(() => result.current.actions.begin(timeControlById('3+0')));
    act(() => result.current.actions.tryMove('e2' as never, 'e4' as never));
    act(() => result.current.actions.begin(timeControlById('10+0')));
    expect(result.current.state.snapshot.sanHistory).toEqual([]);
    expect(result.current.state.clock.white).toBeLessThanOrEqual(600_000);
    expect(result.current.state.clock.white).toBeGreaterThan(590_000);
    expect(result.current.state.phase).toBe('playing');
  });

  it('abre a promoção e só conclui com a peça escolhida', () => {
    const { result } = setup();
    act(() => result.current.actions.begin(timeControlById('3+0')));
    const line: [string, string][] = [
      ['h2', 'h4'], ['a7', 'a6'],
      ['h4', 'h5'], ['a6', 'a5'],
      ['h5', 'h6'], ['a5', 'a4'],
      ['h6', 'g7'], ['a4', 'a3'],
    ];
    for (const [from, to] of line) {
      act(() => result.current.actions.tryMove(from as never, to as never));
    }
    act(() => result.current.actions.tryMove('g7' as never, 'h8' as never));
    expect(result.current.state.pendingPromotion).toEqual({ from: 'g7', to: 'h8' });

    act(() => result.current.actions.playFromTo('g7' as never, 'h8' as never, 'q'));
    expect(result.current.state.pendingPromotion).toBeNull();
    expect(result.current.state.snapshot.sanHistory).toContain('gxh8=Q');
    expect(result.current.state.snapshot.fen).toContain('Q');
  });

  it('encerra por desistência e por empate', () => {
    const { result } = setup();
    act(() => result.current.actions.resign('white'));
    expect(result.current.state.result).toMatchObject({ kind: 'resignation', winner: 'black' });
    expect(result.current.state.phase).toBe('finished');

    const second = renderHook(() => useChessGame({ control: timeControlById('3+0'), players }));
    act(() => second.result.current.actions.draw());
    expect(second.result.current.state.result).toMatchObject({ kind: 'agreement', winner: null });
  });

  it('bloqueia lances depois do fim da partida', () => {
    const { result } = setup();
    act(() => result.current.actions.resign('black'));
    act(() => result.current.actions.tryMove('e2' as never, 'e4' as never));
    expect(result.current.state.snapshot.sanHistory).toEqual([]);
  });

  it('detalha o hook com o controle sem limite', () => {
    const { result } = setup('sem-limite');
    act(() => result.current.actions.begin(timeControlById('sem-limite')));
    expect(result.current.state.clock.running).toBe(true);
    expect(result.current.state.clock.white).toBeGreaterThanOrEqual(0);
  });
});

export type { PlayerInfo };
