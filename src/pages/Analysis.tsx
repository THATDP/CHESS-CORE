import { useMemo } from 'react';
import { AlertTriangle, ArrowRight, ChartNoAxesCombined, Sparkles } from 'lucide-react';
import { Badge, Eyebrow, Panel, SectionHeading, Stat } from '../components/ui';
import { MiniBoard } from '../components/MiniBoard';
import { arrangements } from '../three/arrangements';

const evaluation = [
  0.2, 0.3, 0.25, 0.4, 0.6, 0.5, 0.9, 1.2, 0.8, 0.4, 0.1, -0.3, -0.8, -1.2,
  -0.9, -0.4, 0.1, 0.5, 0.9, 1.1, 0.8, 0.6, 0.4, 0.3, 0.5,
];

const moments = [
  { move: 14, tone: 'rose', label: 'Imprecisão', text: 'A troca de damas aliviou a pressão no centro.' },
  { move: 22, tone: 'emerald', label: 'Brilhante', text: 'O sacrifício de qualidade abriu a coluna h.' },
  { move: 27, tone: 'amber', label: 'Duvidoso', text: 'O peão avançado ficou exposto por um lance.' },
];

const moves = [
  { number: 20, white: 'Cxe4', black: 'Cxe4', eval: '+0.4' },
  { number: 21, white: 'Cc3', black: 'Cbd7', eval: '+0.1' },
  { number: 22, white: 'Txh7', black: 'Rxh7', eval: '+1.2', highlight: 'emerald' },
  { number: 23, white: 'Cg5', black: 'Df6', eval: '+0.9' },
  { number: 24, white: 'Dg4', black: 'Cc7', eval: '+0.8' },
  { number: 25, white: 'De3', black: 'Tad8', eval: '+0.5' },
];

export function Analysis() {
  const chart = useMemo(() => {
    const width = 620;
    const height = 220;
    const padX = 18;
    const midY = height / 2;
    const scaleY = 62;
    const points = evaluation.map((value, index) => {
      const x = padX + (index / (evaluation.length - 1)) * (width - padX * 2);
      const y = midY - Math.max(-2.2, Math.min(2.2, value)) * scaleY;
      return [x, y] as const;
    });
    const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const area = `${line} L${points[points.length - 1][0].toFixed(1)},${midY} L${points[0][0].toFixed(1)},${midY} Z`;
    return { width, height, midY, points, line, area };
  }, []);

  return (
    <div className="page analysis page-enter">
      <div className="page-intro">
        <Eyebrow><ChartNoAxesCombined size={13} aria-hidden="true" /> EVOLUA SEU JOGO &nbsp;/&nbsp; ANÁLISE</Eyebrow>
        <h1>Cada jogada tem <em>uma história.</em></h1>
        <p>Revisite suas decisões e encontre oportunidades para entender melhor cada partida.</p>
      </div>

      <div className="analysis__grid">
        <Panel className="analysis__chart-panel">
          <div className="analysis__chart-head">
            <SectionHeading index="01 / PARTIDA" title="Sua última partida" description="Clássico · 1.428 de rating" />
            <div className="analysis__chart-legend">
              <span><i className="is-emerald" aria-hidden="true" /> Você</span>
              <span><i className="is-rose" aria-hidden="true" /> Adversário</span>
            </div>
          </div>

          <div className="eval-chart">
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label="Gráfico demonstrativo de avaliação por lance">
              <defs>
                <linearGradient id="evalFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3ce6a6" stopOpacity="0.35" />
                  <stop offset="55%" stopColor="#3ce6a6" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#e06c6c" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <line x1="0" y1={chart.midY} x2={chart.width} y2={chart.midY} className="eval-chart__axis" />
              <path d={chart.area} fill="url(#evalFill)" />
              <path d={chart.line} className="eval-chart__line" />
              {chart.points.map(([x, y], index) => (
                <circle key={index} cx={x} cy={y} r={index === 22 ? 5 : 3} className={`eval-chart__point ${index === 22 ? 'is-key' : ''}`} />
              ))}
              <line x1={chart.points[22][0]} y1="0" x2={chart.points[22][0]} y2={chart.height} className="eval-chart__marker" />
            </svg>
            <div className="eval-chart__scale"><span>+2</span><span>0</span><span>−2</span></div>
          </div>

          <div className="move-list">
            <div className="move-list__head"><span>Lance</span><span>Brancas</span><span>Pretas</span><span>Aval.</span></div>
            {moves.map((move) => (
              <div className={`move-row ${move.highlight ? `is-${move.highlight}` : ''}`} key={move.number}>
                <span className="move-row__number">{move.number}.</span>
                <span>{move.white}</span>
                <span>{move.black}</span>
                <span className="move-row__eval">{move.eval}</span>
              </div>
            ))}
          </div>
        </Panel>

        <div className="analysis__side">
          <Panel className="analysis__position">
            <SectionHeading index="02 / POSIÇÃO" title="Momento decisivo" />
            <MiniBoard arrangement={arrangements.middlegame} coordinates highlights={[{ square: 22, tone: 'emerald' }, { square: 40, tone: 'rose' }]} />
            <p className="analysis__position-note">Lance 22 — a avaliação salta de +0,1 para +1,2.</p>
          </Panel>

          <Panel>
            <SectionHeading index="03 / INSIGHTS" title="O que observar" />
            <div className="insight-list">
              {moments.map((moment) => (
                <div className="insight" key={moment.move}>
                  <span className={`insight__badge insight__badge--${moment.tone}`}>{moment.move}</span>
                  <div>
                    <strong>{moment.label}</strong>
                    <small>{moment.text}</small>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="analysis__summary">
            <Stat icon={<Sparkles size={16} aria-hidden="true" />} label="Precisão" value="74%" hint="por lance" />
            <Stat icon={<AlertTriangle size={16} aria-hidden="true" />} label="Imprecisões" value="3" hint="na partida" />
          </Panel>
        </div>
      </div>

      <div className="analysis__cta">
        <Badge tone="emerald"><ArrowRight size={13} aria-hidden="true" /> Exportação e motor real chegam na próxima fase</Badge>
      </div>
    </div>
  );
}
