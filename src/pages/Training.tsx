import { Activity, ArrowRight, CalendarCheck, Check, Flame, Target } from 'lucide-react';
import { Eyebrow, Panel, Progress, ProgressRing, SectionHeading, Stat } from '../components/ui';
import { MiniBoard } from '../components/MiniBoard';
import { arrangements } from '../three/arrangements';
import { Badge } from '../components/ui';

const week = [
  { day: 'S', done: true }, { day: 'T', done: true }, { day: 'Q', done: true },
  { day: 'S', done: true }, { day: 'S', done: false }, { day: 'D', done: false }, { day: 'S', active: true },
];

const modules = [
  { title: 'Aberturas clássicas', text: 'Desenvolva peças com propósito nos primeiros lances.', progress: 72 },
  { title: 'Tática intermediária', text: 'Cravadas, garfos e overweight em sequências curtas.', progress: 48 },
  { title: 'Finais essenciais', text: 'Rei e peão, torres e técnicas de conversão.', progress: 35 },
  { title: 'Estratégia posicional', text: 'Estruturas, casas fracas e planos de longo prazo.', progress: 18 },
];

export function Training() {
  return (
    <div className="page training page-enter">
      <div className="page-intro">
        <Eyebrow><Activity size={13} aria-hidden="true" /> EVOLUA SEU JOGO &nbsp;/&nbsp; TREINAMENTO</Eyebrow>
        <h1>A prática constrói <em>a confiança.</em></h1>
        <p>Uma rotina de treino pensada para transformar intenção em progresso, uma posição de cada vez.</p>
      </div>

      <div className="training__top">
        <Panel className="routine">
          <SectionHeading index="01 / SEMANA" title="Sua rotina" description="Quatro sessões concluídas. Continue." />
          <div className="routine__days">
            {week.map((item, index) => (
              <div
                key={index}
                className={[
                  'routine__day',
                  item.done ? 'is-done' : '',
                  item.active ? 'is-active' : '',
                ].filter(Boolean).join(' ')}
              >
                <span>{item.day}</span>
                {item.done && <Check size={12} aria-hidden="true" />}
              </div>
            ))}
          </div>
          <Progress value={57} label="Semana 8 de 12" />
          <div className="routine__footer">
            <span className="routine__streak"><Flame size={14} aria-hidden="true" /> 6 dias seguidos</span>
            <span className="routine__next"><CalendarCheck size={14} aria-hidden="true" /> Próxima: tática</span>
          </div>
        </Panel>

        <Panel className="next-session">
          <div className="next-session__head">
            <SectionHeading index="02 / AGORA" title="Próxima sessão" />
            <Badge tone="emerald">12 min</Badge>
          </div>
          <div className="next-session__body">
            <MiniBoard arrangement={arrangements.tactical} highlights={[{ square: 35, tone: 'emerald' }, { square: 27, tone: 'amber' }]} coordinates />
            <div className="next-session__copy">
              <h3>Recursos escondidos</h3>
              <p>Encontre a defesa que mantém a vantagem em três lances.</p>
              <div className="next-session__tags">
                <span>Tática</span><span>Défesa</span>
              </div>
              <button className="btn btn--primary btn--sm" type="button">Iniciar sessão <ArrowRight size={15} aria-hidden="true" /></button>
            </div>
          </div>
        </Panel>
      </div>

      <div className="training__modules">
        <SectionHeading index="03 / MÓDULOS" title="Continue de onde parou" />
        <div className="module-grid">
          {modules.map((module) => (
            <article className="module-card" key={module.title}>
              <div className="module-card__top">
                <h3>{module.title}</h3>
                <ProgressRing value={module.progress} size={58} stroke={5} />
              </div>
              <p>{module.text}</p>
              <div className="module-card__footer">
                <span>{module.progress}% concluído</span>
                <a href="#/treinamento" aria-label={`Continuar ${module.title}`}>Continuar <ArrowRight size={14} aria-hidden="true" /></a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="training__stats">
        <Stat icon={<Target size={16} aria-hidden="true" />} label="Precisão" value="82%" hint="+6% este mês" />
        <Stat icon={<Flame size={16} aria-hidden="true" />} label="Sequência" value="6 dias" hint="recorde: 14" />
        <Stat icon={<Activity size={16} aria-hidden="true" />} label="Tempo de treino" value="4.6h" hint="esta semana" />
      </div>
    </div>
  );
}
