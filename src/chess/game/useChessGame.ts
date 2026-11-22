/**
 * Hook da partida.
 *
 * Concentra regras + relógio + desfazer/refazer + desfecho em um único objeto
 * para a interface. O tabuleiro é um componente separado e não conhece este
 * hook.
 */
import { useCallback, useEffect, useState } from 'react';
import type { Move, PieceSymbol, Square } from 'chess.js';
import { ChessGame } from './game';
import type { GameSnapshot } from './game';
import { ChessClock } from './clock';
import type { ClockSnapshot } from './clock';
import { legalMovesFrom } from '../rules';
import type { GameResult, PlayerInfo, Side, TimeControl } from './types';
import { otherSide, sideLabel } from './types';

export type MatchSettings = {
  control: TimeControl;
  players: { white: PlayerInfo; black: PlayerInfo };
};

export type MatchPhase = 'setup' | 'playing' | 'finished';

export type MatchState = {
  snapshot: GameSnapshot;
  clock: ClockSnapshot;
  result: GameResult | null;
  phase: MatchPhase;
  /** Lances legais a partir da casa selecionada (vazio quando nada selecionado). */
  legalTargets: Square[];
  selected: Square | null;
  pendingPromotion: { from: Square; to: Square } | null;
  canUndo: boolean;
  canRedo: boolean;
  /** Lado que está pensando (humano local ou engine). */
  thinking: Side | null;
  /** Versão da partida: muda a cada lance, desfazer/refazer ou reinício. */
  version: number;
};

export type MatchActions = {
  selectSquare: (square: Square) => void;
  /** Joga direto de uma casa para outra (usado pelo arrastar). */
  tryMove: (from: Square, to: Square) => void;
  playFromTo: (from: Square, to: Square, promotion?: PieceSymbol) => void;
  undo: () => void;
  redo: () => void;
  restart: (nextControl?: TimeControl) => void;
  resign: (side: Side) => void;
  draw: () => void;
  setControl: (control: TimeControl) => void;
  /** Reinicia e já começa a partida com o controle informado. */
  begin: (nextControl: TimeControl) => void;
};

const initialClockSnapshot = (control: TimeControl): ClockSnapshot => {
  const total = (control.initial ?? 0) * 1000;
  return { white: total, black: total, active: null, running: false };
};

export function useChessGame(initial: MatchSettings): {
  state: MatchState;
  actions: MatchActions;
} {
  const [game] = useState(() => new ChessGame());

  const [control, setControl] = useState<TimeControl>(initial.control);
  const [phase, setPhase] = useState<MatchPhase>('setup');
  const [result, setResult] = useState<GameResult | null>(null);
  const [version, setVersion] = useState(0);
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [thinking, setThinking] = useState<Side | null>(null);
  const [clock, setClock] = useState<ClockSnapshot>(() => initialClockSnapshot(initial.control));

  const finish = useCallback((next: GameResult) => {
    setResult(next);
    setPhase('finished');
    setThinking(null);
    setLegalTargets([]);
    setSelected(null);
    setPendingPromotion(null);
  }, []);

  const onFlag = useCallback((winner: Side) => {
    finish({ kind: 'timeout', winner, reason: `${sideLabel(winner)} vencem por tempo esgotado` });
  }, [finish]);

  const [clockInstance, setClockInstance] = useState(
    () => new ChessClock({
      control: initial.control,
      hasLimit: initial.control.initial !== null,
      onFlag,
      onTick: (snapshot) => setClock(snapshot),
    }),
  );

  const buildClock = useCallback(
    (nextControl: TimeControl) => new ChessClock({
      control: nextControl,
      hasLimit: nextControl.initial !== null,
      onFlag,
      onTick: (snapshot) => setClock(snapshot),
    }),
    [onFlag],
  );

  // O relógio é um recurso externo: é encerrado junto com o componente.
  useEffect(() => () => {
    clockInstance.dispose();
  }, [clockInstance]);

  const bump = useCallback(() => setVersion((value) => value + 1), []);

  const refresh = useCallback((): GameSnapshot => {
    const snapshot = game.snapshot();
    bump();
    setLegalTargets(selected ? legalMovesFrom(game.raw, selected).map((move) => move.to) : []);
    if (snapshot.result) {
      finish(snapshot.result);
      return snapshot;
    }
    // O lance acabou de ser jogado pelo lado que tinha a vez; o tempo dele
    // para (recebe o incremento) e a vez passa a ser do adversário.
    clockInstance.applyMove(snapshot.turn === 'white' ? 'black' : 'white');
    setClock(clockInstance.snapshot());
    return snapshot;
  }, [bump, clockInstance, finish, game, selected]);

  const playFromTo = useCallback((from: Square, to: Square, promotion?: PieceSymbol) => {
    const move = game.play(from, to, promotion);
    if (!move) return;
    setSelected(null);
    setLegalTargets([]);
    setPendingPromotion(null);
    const snapshot = refresh();
    if (snapshot.result) return;
    setThinking(snapshot.turn);
  }, [game, refresh]);

  const tryMove = useCallback((from: Square, to: Square) => {
    if (phase === 'finished' || pendingPromotion) return;
    const isPromotion = legalMovesFrom(game.raw, from).some(
      (move) => move.to === to && move.promotion !== undefined,
    );
    if (isPromotion) {
      setPendingPromotion({ from, to });
      return;
    }
    playFromTo(from, to);
  }, [game, pendingPromotion, phase, playFromTo]);

  const selectSquare = useCallback((square: Square) => {
    if (phase === 'finished' || pendingPromotion) return;
    const turn = game.raw.turn();
    if (selected && legalTargets.includes(square)) {
      tryMove(selected, square);
      return;
    }
    if (selected === square) {
      setSelected(null);
      setLegalTargets([]);
      return;
    }
    const piece = game.raw.get(square);
    if (piece && piece.color === turn) {
      setSelected(square);
      setLegalTargets(legalMovesFrom(game.raw, square).map((move) => move.to));
      return;
    }
    setSelected(null);
    setLegalTargets([]);
  }, [game, legalTargets, pendingPromotion, phase, selected, tryMove]);

  const undo = useCallback(() => {
    const san = game.undo();
    if (!san) return;
    setSelected(null);
    setLegalTargets([]);
    setPendingPromotion(null);
    setResult(null);
    if (phase === 'finished') setPhase('playing');
    bump();
    setClock(clockInstance.snapshot());
    setThinking(game.snapshot().turn);
  }, [bump, clockInstance, game, phase]);

  const redo = useCallback(() => {
    const san = game.redo();
    if (!san) return;
    setSelected(null);
    setLegalTargets([]);
    setPendingPromotion(null);
    bump();
    const snapshot = game.snapshot();
    if (snapshot.result) {
      finish(snapshot.result);
      return;
    }
    setClock(clockInstance.snapshot());
    setThinking(snapshot.turn);
  }, [bump, clockInstance, finish, game]);

  const restart = useCallback((nextControl?: TimeControl) => {
    const effective = nextControl ?? control;
    setControl(effective);
    game.reset();
    const instance = buildClock(effective);
    setClockInstance(instance);
    setClock(instance.snapshot());
    setResult(null);
    setPhase('setup');
    setSelected(null);
    setLegalTargets([]);
    setPendingPromotion(null);
    setThinking(null);
    bump();
  }, [bump, buildClock, control, game]);

  const begin = useCallback((nextControl: TimeControl) => {
    const effective = nextControl ?? control;
    setControl(effective);
    game.reset();
    const instance = buildClock(effective);
    setClockInstance(instance);
    setClock(instance.snapshot());
    setResult(null);
    setPhase('playing');
    setSelected(null);
    setLegalTargets([]);
    setPendingPromotion(null);
    setThinking(null);
    bump();
    if (effective.initial !== null) instance.start();
    else instance.setRunning('white', true);
    setClock(instance.snapshot());
  }, [bump, buildClock, control, game]);

  const resign = useCallback((side: Side) => {
    finish({
      kind: 'resignation',
      winner: otherSide(side),
      reason: `${sideLabel(side)} desistiram`,
    });
  }, [finish]);

  const draw = useCallback(() => {
    finish(game.drawByAgreement());
  }, [finish, game]);

  const snapshot = game.snapshot();

  const state: MatchState = {
    snapshot,
    clock,
    result,
    phase,
    legalTargets,
    selected,
    pendingPromotion,
    canUndo: game.canUndo(),
    canRedo: game.canRedo(),
    thinking,
    version,
  };

  const actions: MatchActions = {
    selectSquare,
    tryMove,
    playFromTo,
    undo,
    redo,
    restart,
    resign,
    draw,
    setControl,
    begin,
  };

  return { state, actions };
}

export type { Move };
