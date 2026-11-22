import {
  Award, BookOpen, Check, GraduationCap, Lock, Play, Route,
} from 'lucide-react';
import { Badge, Eyebrow, Panel, Progress, ProgressRing, SectionHeading } from '../components/ui';

const steps = [
  { title: 'Fundamentos do tabuleiro', text: 'Casas, coordenadas, movimentos e o valor das peças.', lessons: 8, time: '45 min', state: 'done' },
  { title: 'Primeiros planos', text: 'Desenvolvimento, roque e controle do centro.', lessons: 10, time: '1 h', state: 'done' },
  { title: 'Tática essencial', text: 'Cravadas, garfos, fraudes e candidatos a lance.', lessons: 14, time: '1 h 30', state: 'current' },
  { title: 'Estratégia posicional', text: 'Estruturas de peões, casas fracas e manobras.', lessons: 12, time: '1 h 20', state: 'locked' },
  { title: 'Finais práticos', text: 'Conversão de vantagem e técnicas de resistência.', lessons: 16, time: '2 h', state: 'locked' },
];

const trails = [
  { name: 'Aberturas clássicas', lessons: 24, level: 'Iniciante' },
  { name: 'Defesa moderna', lessons: 18, level: 'Intermediário' },
  { name: 'Repertório de finais', lessons: 30, level: 'Avançado' },
];

export function Learning() {
  return (
    <div className="page learning page-enter">
      <div className="page-intro">
        <Eyebrow><GraduationCap size={13} aria-hidden="true" /> EVOLUA SEU JOGO &nbsp;/&nbsp; APRENDIZADO</Eyebrow>
        <h1>Aprender é <em>parte do jogo.</em></h1>
        <p>Construa seu conhecimento com uma jornada que começa nos fundamentos e vai além.</p>
      </div>

      <div className="learning__grid">
        <Panel className="path-panel">
          <SectionHeading index="01 / SUA JORNADA" title="Trilha principal" description="Um caminho contínuo, do primeiro lance ao repertório avançado." />
          <ol className="path">
            {steps.map((step, index) => (
              <li className={`path__step path__step--${step.state}`} key={step.title}>
                <span className="path__node" aria-hidden="true">
                  {step.state === 'done' ? <Check size={14} /> : step.state === 'current' ? <Play size={13} /> : <Lock size={13} />}
                </span>
                <div className="path__card">
                  <div className="path__card-head">
                    <span className="path__index">ETAPA {index + 1}</span>
                    {step.state === 'current' && <Badge tone="emerald">Em andamento</Badge>}
                    {step.state === 'locked' && <Badge>Bloqueada</Badge>}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <div className="path__meta">
                    <span>{step.lessons} lições</span>
                    <span aria-hidden="true">·</span>
                    <span>{step.time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <div className="learning__side">
          <Panel className="learning__progress">
            <ProgressRing value={34} size={104} stroke={9} label="Progresso geral" />
            <div>
              <strong>34% da trilha</strong>
              <p>Você está na etapa 3 de 5. Continue para desbloquear estratégia posicional.</p>
            </div>
          </Panel>

          <Panel>
            <SectionHeading index="02 / TRILHAS" title="Explorar por tema" />
            <div className="trail-list">
              {trails.map((trail) => (
                <a className="trail-row" href="#/aprendizado" key={trail.name}>
                  <span className="trail-row__icon" aria-hidden="true"><Route size={16} /></span>
                  <span className="trail-row__copy">
                    <strong>{trail.name}</strong>
                    <small>{trail.lessons} lições · {trail.level}</small>
                  </span>
                  <span className="trail-row__arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </Panel>

          <Panel className="learning__certificate">
            <Award size={22} aria-hidden="true" />
            <div>
              <strong>Certificado de conclusão</strong>
              <p>Emitido ao final da trilha, com seu nome e desempenho.</p>
            </div>
          </Panel>
        </div>
      </div>

      <div className="learning__courses">
        <SectionHeading index="03 / CURSOS LIVRES" title="Aula aberta da semana" />
        <div className="course-grid">
          <Panel className="course-card">
            <span className="course-card__icon" aria-hidden="true"><BookOpen size={20} /></span>
            <h3>O centro como base</h3>
            <p>Por que e4, d4 e Cf3 aparecem em quase todas as partidas fortes.</p>
            <Progress value={100} label="Assista em 12 min" />
          </Panel>
          <Panel className="course-card">
            <span className="course-card__icon" aria-hidden="true"><BookOpen size={20} /></span>
            <h3>Erros que custam a partida</h3>
            <p>Os cinco descuidos mais comuns entre jogadores de 1400 a 1800.</p>
            <Progress value={62} label="Continuar assistindo" />
          </Panel>
        </div>
      </div>
    </div>
  );
}
