/**
 * JOGAR — partida real no tabuleiro 2D.
 *
 * A partida roda no dispositivo: regras em `src/chess/*`, relógio próprio e
 * histórico em SAN. Adversário de IA fica para a Fase 5 — a arquitetura de
 * engines já está separada em `src/engines/*` e a seção JOGAR prepara a
 * escolha de engine sem acoplar o tabuleiro a nenhum motor.
 */
import { useCallback, useMemo, useState } from 'react';
import type { Square } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { MatchPanel } from '../components/MatchPanel';
import { PromotionDialog } from '../components/PromotionDialog';
import type { PromotionChoice } from '../components/PromotionDialog';
import { useChessGame } from '../chess/game/useChessGame';
import { readPieces, findKing } from '../chess/board';
import type { PlayerInfo, Side, TimeControl } from '../chess/game/types';
import { TIME_CONTROLS, timeControlById, resultLabel, sideLabel } from '../chess/game/types';
import { localController, PLANNED_ENGINES } from '../engines';
import type { PieceSymbol } from 'chess.js';
import { useNavPreferences } from '../app/preferences';

const DEFAULT_ORIENTATION: Side = 'white';
const LOCAL_PLAYER = localController();

const PROMOTION_SYMBOLS: Record<PromotionChoice, PieceSymbol> = {
  queen: 'q', rook: 'r', bishop: 'b', knight: 'n',
};

type Setup = {
  control: TimeControl;
  players: { white: PlayerInfo; black: PlayerInfo };
};

export function Play() {
  const { compactMatches: compact } = useNavPreferences();
  const [controlId, setControlId] = useState(TIME_CONTROLS[3].id);
  const [orientation, setOrientation] = useState<Side>(DEFAULT_ORIENTATION);
  const [playerName, setPlayerName] = useState('Você');
  const [engineChoice, setEngineChoice] = useState('dois-jogadores');
  const [started, setStarted] = useState(false);

  const control: TimeControl = timeControlById(controlId);

  const players = useMemo<{ white: PlayerInfo; black: PlayerInfo }>(() => {
    if (engineChoice === 'dois-jogadores') {
      return {
        white: { name: playerName || 'Jogador 1', side: 'white', controller: LOCAL_PLAYER.info.id },
        black: { name: 'Jogador 2', side: 'black', controller: LOCAL_PLAYER.info.id },
      };
    }
    const engine = PLANNED_ENGINES.find((entry) => entry.id === engineChoice);
    return {
      white: { name: playerName || 'Você', side: 'white', controller: LOCAL_PLAYER.info.id },
      black: { name: engine?.name ?? 'Motor', side: 'black', controller: engine?.id ?? 'engine' },
    };
  }, [engineChoice, playerName]);

  const setup: Setup = useMemo(
    () => ({ control, players }),
    [control, players],
  );

  const { state, actions } = useChessGame(setup);

  // Escolha de orientação feita pelo painel (botão Inverter tabuleiro).
  const flipBoard = useCallback(() => {
    setOrientation((current) => (current === 'white' ? 'black' : 'white'));
  }, []);

  const pieces = useMemo<ReturnType<typeof readPieces>>(() => readPieces(state.snapshot.fen), [state.snapshot.fen]);

  const checkSquare = useMemo<Square | null>(() => {
    if (!state.snapshot.inCheck) return null;
    return findKing(state.snapshot.fen, state.snapshot.turn);
  }, [state.snapshot.fen, state.snapshot.inCheck, state.snapshot.turn]);

  const handleSquareClick = useCallback((square: Square) => {
    actions.selectSquare(square);
  }, [actions]);

  const handleDrop = useCallback((from: Square, to: Square) => {
    actions.tryMove(from, to);
  }, [actions]);

  const handlePromotion = useCallback((piece: PromotionChoice) => {
    if (!state.pendingPromotion) return;
    const symbol: PieceSymbol = PROMOTION_SYMBOLS[piece];
    actions.playFromTo(state.pendingPromotion.from, state.pendingPromotion.to, symbol);
  }, [actions, state.pendingPromotion]);

  const startMatch = useCallback(() => {
    actions.begin(control);
    setStarted(true);
  }, [actions, control]);

  return (
    <section className={`play${compact ? ' play--compact' : ''}`} aria-label="Jogar">
      <header className="play__head">
        <div>
          <p className="section__eyebrow">Jogar</p>
          <h1 className="page__title">Partida no tabuleiro</h1>
        </div>
        <span className="chip">Classic Walnut · 2D</span>
      </header>

      {!started ? (
        <div className="panel play__setup">
          <div className="setup">
            <fieldset className="setup__group">
              <legend>Adversário</legend>
              <label className="radio">
                <input
                  type="radio"
                  name="oponente"
                  value="dois-jogadores"
                  checked={engineChoice === 'dois-jogadores'}
                  onChange={() => setEngineChoice('dois-jogadores')}
                />
                <span>Um amigo (neste dispositivo)</span>
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="oponente"
                  value="motor-futuro"
                  checked={engineChoice === 'motor-futuro'}
                  onChange={() => setEngineChoice('motor-futuro')}
                />
                <span>Motor de xadrez</span>
              </label>
            </fieldset>

            {engineChoice === 'motor-futuro' ? (
              <div className="notice notice--warn" role="note">
                <strong>Motores chegam na Fase 5.</strong> A arquitetura de engines
                (registro, protocolo UCI, WebAssembly em Web Worker e carregamento
                individual) já está separada das regras — escolha a engine aqui quando
                ela estiver disponível. Nenhuma engine é baixada agora.
                <span className="notice__list">
                  Planejadas: {PLANNED_ENGINES.map((entry) => entry.name).join(', ')}.
                </span>
              </div>
            ) : null}

            <fieldset className="setup__group">
              <legend>Controle de tempo</legend>
              <div className="setup__times">
                {TIME_CONTROLS.map((entry) => (
                  <label key={entry.id} className="radio radio--inline">
                    <input
                      type="radio"
                      name="controle-tempo"
                      value={entry.id}
                      checked={controlId === entry.id}
                      onChange={() => setControlId(entry.id)}
                    />
                    <span>{entry.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="setup__group">
              <legend>Seu nome</legend>
              <input
                className="input"
                type="text"
                value={playerName}
                maxLength={24}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Você"
              />
            </fieldset>

            <button type="button" className="btn btn--primary btn--lg" onClick={startMatch}>
              Começar partida
            </button>
          </div>
        </div>
      ) : (
        <div className="play__match">
          <div className="play__board-wrap">
            <div className="play__turn" role="status">
              {state.result ? 'Partida encerrada' : `${sideLabel(state.snapshot.turn)} a jogar`}
            </div>
            <ChessBoard
              pieces={pieces}
              orientation={orientation}
              coordinates
              selected={state.selected}
              legalTargets={state.legalTargets}
              lastMove={state.snapshot.lastMove}
              checkSquare={checkSquare}
              locked={state.phase === 'finished'}
              onSquareClick={handleSquareClick}
              onDropMove={handleDrop}
            />
            {state.pendingPromotion && (
              <PromotionDialog
                color={state.snapshot.turn}
                onChoose={handlePromotion}
                onCancel={() => state.pendingPromotion && actions.selectSquare(state.pendingPromotion.from)}
              />
            )}
            {state.result && (
              <div className="play__result" role="status">
                <p className="play__result-title">{resultLabel(state.result)}</p>
                <p className="play__result-reason">{state.result.reason}</p>
                <button type="button" className="btn btn--primary" onClick={() => setStarted(false)}>
                  Nova partida
                </button>
              </div>
            )}
          </div>

          <MatchPanel
            players={players}
            turn={state.snapshot.turn}
            whiteTime={state.clock.white}
            blackTime={state.clock.black}
            history={state.snapshot.sanHistory.map((san: string, index: number) => ({
              san,
              by: index % 2 === 0 ? 'white' : 'black',
              moveNumber: Math.floor(index / 2) + 1,
            }))}
            result={state.result}
            orientation={orientation}
            canUndo={state.canUndo}
            canRedo={state.canRedo}
            onUndo={actions.undo}
            onRedo={actions.redo}
            onRestart={() => actions.begin(control)}
            onResign={actions.resign}
            onDraw={actions.draw}
            onFlip={flipBoard}
          />
        </div>
      )}
    </section>
  );
}




export { readPieces, findKing } from '../chess/board';
