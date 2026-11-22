import { useState } from 'react';
import { CalendarDays, Check, Lightbulb, Puzzle, Target, Trophy } from 'lucide-react';
import { Badge, Button, Eyebrow, Panel, SectionHeading, Stat } from '../components/ui';
import { MiniBoard } from '../components/MiniBoard';
import { arrangements } from '../three/arrangements';

const themes = [
  { name: 'Cravada', count: 42, tone: 'emerald' },
  { name: 'Garfo', count: 31, tone: 'amber' },
  { name: 'Sacrifício', count: 18, tone: 'rose' },
  { name: 'Mate em 2', count: 57, tone: 'sky' },
];

const daily = [
  { title: 'Mate silencioso', difficulty: 'Fácil', moves: 2 },
  { title: 'A torre decide', difficulty: 'Médio', moves: 3 },
  { title: 'Rainha em xeque', difficulty: 'Difícil', moves: 4 },
];

export function Puzzles() {
  const [solved, setSolved] = useState(false);
  const [hint, setHint] = useState(false);

  return (
    <div className="page puzzles page-enter">
      <div className="page-intro">
        <Eyebrow><Puzzle size={13} aria-hidden="true" /> EVOLUA SEU JOGO &nbsp;/&nbsp; QUEBRA-CABEÇAS</Eyebrow>
        <h1>Encontre a <em>melhor jogada.</em></h1>
        <p>Posições para aguçar o olhar, reconhecer padrões e descobrir novas possibilidades.</p>
      </div>

      <div className="puzzles__top">
        <Panel className="puzzle-feature">
          <div className="puzzle-feature__board">
            <MiniBoard
              arrangement={arrangements.tactical}
              coordinates
              highlights={[
                { square: 35, tone: 'emerald' },
                { square: 27, tone: hint ? 'amber' : 'emerald' },
                { square: 12, tone: 'rose' },
              ]}
            />
          </div>
          <div className="puzzle-feature__copy">
            <div className="puzzle-feature__meta">
              <Badge tone="amber">Médio</Badge>
              <span>Mate em 2</span>
              <span>·</span>
              <span>1.248 tentativas</span>
            </div>
            <h2>O branco joga e define.</h2>
            <p>Uma peça aparentemente presa guarda a chave. Observe a diagonal longa antes de mexer na dama.</p>
            <div className="puzzle-feature__actions">
              <Button variant="primary" onClick={() => setSolved(true)} disabled={solved}>
                {solved ? <><Check size={16} aria-hidden="true" /> Resolvido</> : 'Resolver'}
              </Button>
              <Button variant="outline" onClick={() => setHint(true)} disabled={hint || solved}>
                <Lightbulb size={16} aria-hidden="true" /> {hint ? 'Dica revelada' : 'Pedir dica'}
              </Button>
            </div>
            {hint && !solved && <p className="puzzle-feature__hint">A dama branca pode alcançar a diagonal a2–g8.</p>}
            {solved && <p className="puzzle-feature__status" role="status">Boa! Interface demonstrativa — o registro de progresso virá em breve.</p>}
          </div>
        </Panel>

        <div className="puzzles__side">
          <Panel className="puzzle-stats">
            <Stat icon={<Target size={16} aria-hidden="true" />} label="Precisão" value="88%" hint="últimos 30" />
            <Stat icon={<Trophy size={16} aria-hidden="true" />} label="Resolvidos" value="142" hint="de 320" />
            <Stat icon={<CalendarDays size={16} aria-hidden="true" />} label="Sequência" value="9 dias" hint="em andamento" />
          </Panel>

          <Panel>
            <SectionHeading index="01 / TEMAS" title="Treine por padrão" />
            <div className="theme-list">
              {themes.map((theme) => (
                <a className="theme-row" href="#/quebra-cabecas" key={theme.name}>
                  <span className={`theme-row__dot theme-row__dot--${theme.tone}`} aria-hidden="true" />
                  <strong>{theme.name}</strong>
                  <small>{theme.count} puzzles</small>
                  <span className="theme-row__arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="puzzles__daily">
        <SectionHeading index="02 / DESAFIO DIÁRIO" title="Novo todos os dias" />
        <div className="daily-grid">
          {daily.map((item) => (
            <article className="daily-card" key={item.title}>
              <span className={`daily-card__badge daily-card__badge--${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
              <h3>{item.title}</h3>
              <p>{item.moves} lances</p>
              <a href="#/quebra-cabecas">Abrir challenge</a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
