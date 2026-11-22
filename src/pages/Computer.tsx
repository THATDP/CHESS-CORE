import { useState } from 'react';
import { Bot, Brain, Cpu, Gauge, Sparkles, Swords, Zap } from 'lucide-react';
import { SceneSlot } from '../components/SceneSlot';
import { Badge, Eyebrow, Panel, SectionHeading, Stat } from '../components/ui';
import { arrangements } from '../three/arrangements';

const levels = [
  { value: 'iniciante', label: 'Iniciante', detail: 'Erros gentis, ritmo tranquilo', depth: 'Profundidade 8' },
  { value: 'intermediario', label: 'Intermediário', detail: 'Jogadas consistentes', depth: 'Profundidade 14' },
  { value: 'mestre', label: 'Mestre', detail: 'Precisão de alto nível', depth: 'Profundidade 24' },
];

export function Computer() {
  const [level, setLevel] = useState('intermediario');

  return (
    <div className="page computer page-enter">
      <div className="page-intro">
        <Eyebrow><Bot size={13} aria-hidden="true" /> ÁREA DE JOGO &nbsp;/&nbsp; COMPUTADOR</Eyebrow>
        <h1>Um adversário <em>à sua altura.</em></h1>
        <p>
          A máquina está pronta na outra ponta do tabuleiro. Escolha o nível e observe
          a cena responder — a avaliação, a profundidade e o ritmo são demonstrativos.
        </p>
      </div>

      <div className="computer__grid">
        <Panel className="computer__scene-panel">
          <SceneSlot variant="board" arrangement={arrangements.duel} interactive className="computer__scene" />
          <div className="computer__scene-bar">
            <span className="status-dot" aria-hidden="true" />
            <span>Máquina pensando</span>
            <span className="computer__scene-bar-value">0.4s</span>
          </div>
        </Panel>

        <div className="computer__side">
          <Panel className="eval-panel">
            <div className="eval-panel__head">
              <span>AVALIAÇÃO</span>
              <Badge tone="emerald">Vantagem branca</Badge>
            </div>
            <div className="eval-bar" role="img" aria-label="Avaliação demonstrativa: leve vantagem branca">
              <span className="eval-bar__fill" style={{ width: '62%' }} />
            </div>
            <div className="eval-panel__scale"><span>−8</span><span>0</span><span>+8</span></div>
            <div className="eval-panel__stats">
              <Stat label="Profundidade" value={level === 'mestre' ? 24 : level === 'intermediario' ? 14 : 8} hint="camadas" />
              <Stat label="Nós" value="1.2M" hint="por jogada" />
              <Stat label="Tempo" value="0.4s" hint="resposta" />
            </div>
          </Panel>

          <Panel>
            <SectionHeading index="01 / NÍVEL" title="Escolha a força da máquina" />
            <div className="level-list">
              {levels.map((item) => (
                <label key={item.value} className={`level ${level === item.value ? 'is-selected' : ''}`}>
                  <input type="radio" name="nível" value={item.value} checked={level === item.value} onChange={() => setLevel(item.value)} />
                  <span className="level__icon" aria-hidden="true">
                    {item.value === 'mestre' ? <Brain size={19} /> : item.value === 'intermediario' ? <Cpu size={19} /> : <Zap size={19} />}
                  </span>
                  <span className="level__copy">
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <span className="level__meta">{item.depth}</span>
                </label>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="computer__strip">
        <Panel className="computer__strip-item">
          <Gauge size={18} aria-hidden="true" />
          <div><strong>Ritmo adaptado</strong><small>O motor acompanha o seu nível sem pressionar.</small></div>
        </Panel>
        <Panel className="computer__strip-item">
          <Sparkles size={18} aria-hidden="true" />
          <div><strong>Cenas temáticas</strong><small>Cada nível muda a iluminação da sala.</small></div>
        </Panel>
        <Panel className="computer__strip-item">
          <Swords size={18} aria-hidden="true" />
          <div><strong>Revisão ao final</strong><small>Os lances ficam disponíveis para análise.</small></div>
        </Panel>
      </div>
    </div>
  );
}
