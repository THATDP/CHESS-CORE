import { useState } from 'react';
import {
  ArrowLeft, ArrowRight, Bot, Clock3, Globe2, Grid2X2, Info, Layers3, MousePointer2, UsersRound,
} from 'lucide-react';
import { OptionGroup } from '../components/OptionGroup';
import { SceneSlot } from '../components/SceneSlot';
import { Eyebrow } from '../components/ui';
import { arrangements } from '../three/arrangements';

export function Play() {
  const [opponent, setOpponent] = useState('pessoa');
  const [mode, setMode] = useState('padrao');
  const [time, setTime] = useState('rapid');
  const [notice, setNotice] = useState(false);

  return (
    <div className="play page-enter">
      <div className="play__topline">
        <a href="#/inicio"><ArrowLeft size={15} aria-hidden="true" /> VOLTAR AO INÍCIO</a>
        <span>O PRÓXIMO MOVIMENTO É SEU &nbsp;/&nbsp; 01</span>
      </div>

      <div className="play__layout">
        <section className="play__scene" aria-label="Cena tridimensional do tabuleiro">
          <SceneSlot variant="board" arrangement={arrangements.initial} interactive className="play__canvas" />
          <div className="play__scene-shade" aria-hidden="true" />
          <div className="play__scene-copy">
            <Eyebrow>CHESS CORE &nbsp;/&nbsp; JOGAR</Eyebrow>
            <h1>Prepare-se<br />para o <em>jogo.</em></h1>
            <p>Grandes partidas começam com uma escolha. O tabuleiro já está montado — e responde ao seu toque.</p>
          </div>
          <div className="play__scene-hint">
            <MousePointer2 size={13} aria-hidden="true" />
            Passe o mouse sobre as casas
          </div>
          <div className="play__scene-foot">
            <span>ESTRATÉGIA. PRESENÇA. INTENÇÃO.</span>
            <span>01 — 64</span>
          </div>
        </section>

        <section className="setup-panel" aria-labelledby="setup-heading">
          <div className="setup-heading">
            <div>
              <span className="section-heading__index">SUA PRÓXIMA PARTIDA</span>
              <h2 id="setup-heading">Configure seu jogo<span className="accent">.</span></h2>
              <p>Escolha como você quer jogar.</p>
            </div>
            <span className="demo-label"><span aria-hidden="true" /> DEMONSTRAÇÃO</span>
          </div>

          <OptionGroup
            index="01" legend="Adversário" value={opponent} onChange={setOpponent}
            options={[
              { value: 'pessoa', label: 'Qualquer pessoa', detail: 'Encontre um jogador', icon: Globe2 },
              { value: 'amigo', label: 'Um amigo', detail: 'Joguem juntos', icon: UsersRound },
              { value: 'computador', label: 'Computador', detail: 'Pratique sozinho', icon: Bot },
            ]}
          />
          <OptionGroup
            index="02" legend="Modalidade" value={mode} onChange={setMode} layout="two"
            options={[
              { value: 'padrao', label: 'Xadrez padrão', detail: 'O jogo clássico', icon: Layers3 },
              { value: 'variantes', label: 'Variantes futuras', detail: 'Novas formas de jogar', icon: Grid2X2 },
            ]}
          />
          <OptionGroup
            index="03" legend="Controle de tempo" value={time} onChange={setTime} layout="four"
            options={[
              { value: 'bullet', label: 'Bullet', detail: '1 min' },
              { value: 'blitz', label: 'Blitz', detail: '3 min' },
              { value: 'rapid', label: 'Rapid', detail: '10 min' },
              { value: 'classico', label: 'Clássico', detail: '30 min' },
            ]}
          />

          <button className="btn btn--primary btn--lg setup-button" type="button" onClick={() => setNotice(true)}>
            Jogar <ArrowRight size={18} aria-hidden="true" />
          </button>

          {notice ? (
            <div className="setup-notice" role="status">
              <Info size={16} aria-hidden="true" />
              As partidas ainda não estão disponíveis. Suas escolhas são apenas demonstrativas.
            </div>
          ) : (
            <p className="setup-disclaimer">
              <Clock3 size={14} aria-hidden="true" />
              Interface demonstrativa. Nenhuma partida será iniciada.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
