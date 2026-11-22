/**
 * Painel lateral da partida: jogadores, relógio, histórico, controles.
 */
import type { GameResult, PlayerInfo, Side } from '../chess/game/types';
import { resultLabel, sideLabel } from '../chess/game/types';
import { formatClock } from '../chess/game/clock';
import type { HistoryEntry } from '../chess/game/game';

export type MatchPanelProps = {
  players: { white: PlayerInfo; black: PlayerInfo };
  turn: Side;
  whiteTime: number;
  blackTime: number;
  history: HistoryEntry[];
  result: GameResult | null;
  orientation: Side;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onRestart: () => void;
  onResign: (side: Side) => void;
  onDraw: () => void;
  onFlip: () => void;
};

export function MatchPanel({
  players,
  turn,
  whiteTime,
  blackTime,
  history,
  result,
  orientation,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onRestart,
  onResign,
  onDraw,
  onFlip,
}: MatchPanelProps) {
  const rows: { number: number; white?: HistoryEntry; black?: HistoryEntry }[] = [];
  for (let index = 0; index < history.length; index += 2) {
    rows.push({
      number: index / 2 + 1,
      white: history[index],
      black: history[index + 1],
    });
  }

  return (
    <aside className="match" aria-label="Painel da partida">
      <div className="match__players">
        <PlayerRow player={players.black} time={blackTime} active={turn === 'black' && !result} />
        <PlayerRow player={players.white} time={whiteTime} active={turn === 'white' && !result} />
      </div>

      <div className="match__controls">
        <button type="button" className="btn btn--ghost" onClick={onUndo} disabled={!canUndo}>
          Desfazer
        </button>
        <button type="button" className="btn btn--ghost" onClick={onRedo} disabled={!canRedo}>
          Refazer
        </button>
        <button type="button" className="btn btn--ghost" onClick={onFlip}>
          Inverter tabuleiro
        </button>
      </div>

      <div className="match__controls">
        <button type="button" className="btn btn--ghost" onClick={onResign.bind(null, orientation)}>
          Desistir
        </button>
        <button type="button" className="btn btn--ghost" onClick={onDraw} disabled={!!result}>
          Empate
        </button>
        <button type="button" className="btn btn--primary" onClick={onRestart}>
          Reiniciar
        </button>
      </div>

      {result && (
        <div className="match__result" role="status">
          <p className="match__result-title">{resultLabel(result)}</p>
          <p className="match__result-reason">{result.reason}</p>
        </div>
      )}

      <div className="match__history" aria-label="Histórico de lances">
        {rows.length === 0 ? (
          <p className="match__history-empty">Nenhum lance ainda.</p>
        ) : (
          <ol className="match__moves">
            {rows.map((row) => (
              <li key={row.number} className="match__row">
                <span className="match__number">{row.number}.</span>
                <span className="match__san">{row.white?.san ?? ''}</span>
                <span className="match__san">{row.black?.san ?? ''}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}

function PlayerRow({ player, time, active }: { player: PlayerInfo; time: number; active: boolean }) {
  return (
    <div className={`match__player${active ? ' is-active' : ''}`}>
      <span className="match__player-name">{player.name}</span>
      <span className="match__player-side">{sideLabel(player.side)}</span>
      <span className="match__clock" data-testid={`clock-${player.side}`}>
        {formatClock(time)}
      </span>
    </div>
  );
}
