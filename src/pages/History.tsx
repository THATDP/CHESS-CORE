import { useState } from 'react';
import { Clock3, Download, Trophy } from 'lucide-react';
import { Eyebrow, Panel, SectionHeading, Stat, Tabs } from '../components/ui';
import { MiniBoard } from '../components/MiniBoard';
import { arrangements } from '../three/arrangements';

type GameResult = 'win' | 'loss' | 'draw';

const games: { id: number; result: GameResult; delta: string; opponent: string; rating: number; date: string; mode: string; moves: number; opening: string }[] = [
  { id: 1, result: 'win', delta: '+12', opponent: 'Ana Beatriz', rating: 1984, date: 'Hoje · 21:14', mode: 'Rapid · 10 min', moves: 42, opening: 'Ruy López' },
  { id: 2, result: 'loss', delta: '−9', opponent: 'R. Monteiro', rating: 1931, date: 'Hoje · 19:02', mode: 'Blitz · 3 min', moves: 58, opening: 'Siciliana' },
  { id: 3, result: 'draw', delta: '+4', opponent: 'K. Nogueira', rating: 1890, date: 'Ontem · 22:40', mode: 'Clássico · 30 min', moves: 64, opening: 'Francesa' },
  { id: 4, result: 'win', delta: '+18', opponent: 'L. Prates', rating: 1412, date: 'Ontem · 18:05', mode: 'Rapid · 10 min', moves: 35, opening: 'Caro-Kann' },
  { id: 5, result: 'win', delta: '+7', opponent: 'M. Saito', rating: 1377, date: '20 nov · 20:12', mode: 'Bullet · 1 min', moves: 47, opening: 'Escocesa' },
  { id: 6, result: 'loss', delta: '−14', opponent: 'C. Fontoura', rating: 1502, date: '19 nov · 16:30', mode: 'Rapid · 10 min', moves: 51, opening: 'Nzo. Indiana' },
];

const labels = { win: 'Vitória', loss: 'Derrota', draw: 'Empate' };

export function History() {
  const [filter, setFilter] = useState('todas');

  const visible = games.filter((game) => filter === 'todas' || game.result === filter);

  return (
    <div className="page history page-enter">
      <div className="page-intro">
        <Eyebrow><Clock3 size={13} aria-hidden="true" /> SUA JORNADA &nbsp;/&nbsp; HISTÓRICO</Eyebrow>
        <h1>Toda partida <em>deixa uma marca.</em></h1>
        <p>Seu arquivo pessoal de partidas e momentos para revisitar e aprender.</p>
      </div>

      <div className="history__grid">
        <Panel className="history__list-panel">
          <div className="history__list-head">
            <SectionHeading index="01 / PARTIDAS" title="Partidas recentes" />
            <Tabs
              value={filter}
              onChange={setFilter}
              tabs={[
                { value: 'todas', label: 'Todas' },
                { value: 'win', label: 'Vitórias' },
                { value: 'loss', label: 'Derrotas' },
                { value: 'draw', label: 'Empates' },
              ]}
            />
          </div>

          <div className="game-list">
            {visible.map((game) => (
              <article className="game-row" key={game.id}>
                <span className={`game-row__result game-row__result--${game.result}`}>{labels[game.result]}</span>
                <div className="game-row__main">
                  <strong>{game.opponent}</strong>
                  <small>{game.rating} · {game.moves} lances · {game.opening}</small>
                </div>
                <div className="game-row__meta">
                  <span>{game.mode}</span>
                  <small>{game.date}</small>
                </div>
                <span className={`game-row__delta ${game.delta.startsWith('−') ? 'is-down' : 'is-up'}`}>{game.delta} elo</span>
                <button className="icon-button" aria-label={`Revisar partida contra ${game.opponent}`} type="button">
                  <Download size={16} aria-hidden="true" />
                </button>
              </article>
            ))}
            {visible.length === 0 && <p className="history__empty">Nenhuma partida neste filtro.</p>}
          </div>
        </Panel>

        <div className="history__side">
          <Panel className="history__featured">
            <SectionHeading index="02 / DESTAQUE" title="Revisitar" />
            <MiniBoard arrangement={arrangements.middlegame} coordinates highlights={[{ square: 22, tone: 'emerald' }]} />
            <div className="history__featured-copy">
              <strong>Contra Ana Beatriz</strong>
              <small>Rapid · 10 min · 42 lances</small>
              <button className="btn btn--outline btn--sm" type="button">Abrir análise</button>
            </div>
          </Panel>

          <Panel>
            <SectionHeading index="03 / RESUMO" title="Este mês" />
            <div className="history__stats">
              <Stat icon={<Trophy size={16} aria-hidden="true" />} label="Partidas" value="28" hint="novembro" />
              <Stat label="Vitórias" value="17" hint="61%" />
              <Stat label="Rating" value="1.428" hint="+32" />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
