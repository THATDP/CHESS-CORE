import { CalendarDays, Crown, Globe2, Swords, Trophy, UsersRound } from 'lucide-react';
import { Badge, Button, Eyebrow, Panel, SectionHeading, Stat } from '../components/ui';

const formats = [
  { icon: Swords, name: 'Round-robin', text: 'Todos contra todos em uma única tabela.' },
  { icon: CalendarDays, name: 'Suíço', text: 'Rodadas pareadas por desempenho, sem eliminação.' },
  { icon: Crown, name: 'Eliminatórias', text: 'Mata-mata direto até a grande final.' },
];

const standings = [
  { position: 1, name: 'Ana Beatriz', rating: 1984, points: 6.5, wins: 4 },
  { position: 2, name: 'R. Monteiro', rating: 1931, points: 6.0, wins: 4 },
  { position: 3, name: 'K. Nogueira', rating: 1890, points: 5.5, wins: 3 },
  { position: 4, name: 'Você', rating: 1428, points: 4.5, wins: 3, you: true },
  { position: 5, name: 'L. Prates', rating: 1412, points: 4.0, wins: 2 },
  { position: 6, name: 'M. Saito', rating: 1377, points: 3.5, wins: 2 },
];

const bracket = [
  { round: 'Quartas', matches: [['Ana B.', 'L. Prates'], ['R. Monteiro', 'M. Saito'], ['K. Nogueira', 'Você'], ['Livre', '—']] },
  { round: 'Semifinal', matches: [['Ana B.', 'R. Monteiro'], ['K. Nogueira', 'Livre']] },
  { round: 'Final', matches: [['Ana B.', 'K. Nogueira']] },
];

export function Tournaments() {
  return (
    <div className="page tournaments page-enter">
      <div className="page-intro">
        <Eyebrow><Trophy size={13} aria-hidden="true" /> COMPETIÇÃO &nbsp;/&nbsp; TORNEIOS</Eyebrow>
        <h1>Seu próximo <em>grande desafio.</em></h1>
        <p>Um espaço para competir, encontrar adversários e fazer parte de algo maior.</p>
      </div>

      <Panel className="tournament-hero">
        <div className="tournament-hero__copy">
          <Badge tone="emerald"><Trophy size={13} aria-hidden="true" /> AO VIVO EM BREVE</Badge>
          <h2>Copa CHESS CORE — Edição Obsidiana</h2>
          <p>
            Oito mesas, um único vencedor. Formato suíço com cinco rodadas,
            transmissão da final e premiação simbólica para o pódio.
          </p>
          <div className="tournament-hero__meta">
            <span><UsersRound size={14} aria-hidden="true" /> 8 vagas</span>
            <span><Swords size={14} aria-hidden="true" /> 5 rodadas</span>
            <span><Globe2 size={14} aria-hidden="true" /> Online</span>
          </div>
          <div className="tournament-hero__actions">
            <Button variant="primary">Reservar vaga <Swords size={16} aria-hidden="true" /></Button>
            <Button variant="outline">Ver regulamento</Button>
          </div>
        </div>
        <div className="tournament-hero__art" aria-hidden="true">
          <span className="tournament-hero__laurel">✳</span>
          <strong>R$ 2.000</strong>
          <small>premiação simbólica</small>
        </div>
      </Panel>

      <div className="tournaments__formats">
        {formats.map((format) => (
          <Panel className="format-card" key={format.name}>
            <span className="format-card__icon" aria-hidden="true"><format.icon size={20} strokeWidth={1.6} /></span>
            <h3>{format.name}</h3>
            <p>{format.text}</p>
          </Panel>
        ))}
      </div>

      <div className="tournaments__bottom">
        <Panel className="bracket-panel">
          <SectionHeading index="01 / CHAVE" title="Chaveamento demonstrativo" description="As classificações abaixo são fictícias." />
          <div className="bracket">
            {bracket.map((round) => (
              <div className="bracket__round" key={round.round}>
                <span className="bracket__round-name">{round.round}</span>
                <div className="bracket__matches">
                  {round.matches.map((match, index) => (
                    <div className="bracket__match" key={index}>
                      <span className="bracket__team"><i className="is-dot" aria-hidden="true" />{match[0]}</span>
                      <span className="bracket__team bracket__team--lost"><i className="is-dot" aria-hidden="true" />{match[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="bracket__round">
              <span className="bracket__round-name">Campeão</span>
              <div className="bracket__matches">
                <div className="bracket__cup" aria-hidden="true"><Crown size={26} /></div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="standings-panel">
          <SectionHeading index="02 / CLASSIFICAÇÃO" title="Tabela" />
          <div className="standings">
            <div className="standings__head"><span>#</span><span>Jogador</span><span>Rating</span><span>Pts</span></div>
            {standings.map((row) => (
              <div className={`standings__row ${row.you ? 'is-you' : ''}`} key={row.position}>
                <span className="standings__position">{row.position}</span>
                <span className="standings__name">{row.name}{row.you && <em>você</em>}</span>
                <span>{row.rating}</span>
                <span className="standings__points">{row.points.toFixed(1)}</span>
              </div>
            ))}
          </div>
          <div className="standings__footer">
            <Stat label="Rodada atual" value="4 / 5" />
            <Stat label="Sua posição" value="#4" hint="zona de premiação" />
          </div>
          <p className="tournaments__note">Partidas, classificações e premiações ainda não estão disponíveis — esta é uma demonstração visual da interface.</p>
        </Panel>
      </div>
    </div>
  );
}
