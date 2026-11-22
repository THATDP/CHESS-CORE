import {
  ArrowDownRight, ArrowRight, Crosshair, Shield, Swords, UsersRound, Bot, Sparkles,
} from 'lucide-react';
import { SceneSlot } from '../components/SceneSlot';
import { Button, Eyebrow, SectionHeading } from '../components/ui';
import { PieceIcon } from '../components/PieceIcon';
import { arrangements } from '../three/arrangements';

const paths = [
  {
    href: '#/jogar', number: '01', icon: Swords, title: 'Jogar uma partida',
    text: 'Escolha seu adversário e o ritmo da partida.', tag: 'CONFIGURAÇÃO DEMO',
  },
  {
    href: '#/computador', number: '02', icon: Bot, title: 'Contra o computador',
    text: 'Encontre seu ritmo e refine suas ideias.', tag: 'EM DESENVOLVIMENTO',
  },
  {
    href: '#/amigos', number: '03', icon: UsersRound, title: 'Jogar com amigos',
    text: 'Compartilhe o jogo com quem você conhece.', tag: 'EM DESENVOLVIMENTO',
  },
];

const pillars = [
  {
    role: 'rook' as const, title: 'Tabuleiro monumental',
    text: 'Mármore, madeira e metal em uma superfície com espessura, reflexo e peso reais.',
  },
  {
    role: 'queen' as const, title: 'Peças de colecionador',
    text: 'Geometria esculpida e materiais polidos que respondem à luz como objetos físicos.',
  },
  {
    role: 'bishop' as const, title: 'Luz cinematográfica',
    text: 'Holofote quente, contorno de esmeralda e névoa que dão profundidade à cena.',
  },
];

export function Home() {
  return (
    <div className="home page-enter">
      <section className="hero">
        <SceneSlot
          variant="hero"
          arrangement={arrangements.hero}
          className="hero__scene"
        />
        <div className="hero__shade" aria-hidden="true" />

        <div className="hero__badge">
          <span className="status-dot" aria-hidden="true" />
          CENA 3D EM TEMPO REAL
        </div>

        <div className="hero__content">
          <Eyebrow className="hero__eyebrow">
            <span className="hero__eyebrow-line" aria-hidden="true" />
            THE HEART OF CHESS
          </Eyebrow>
          <h1 className="hero__title">
            O jogo começa <em>antes</em> da primeira jogada.
          </h1>
          <p className="hero__lead">
            Um universo tridimensional dedicado ao xadrez — tabuleiro, peças e luz
            construídos em tempo real para você pensar, evoluir e encontrar
            beleza em cada movimento.
          </p>
          <div className="hero__actions">
            <Button variant="primary" size="lg" href="#/jogar">
              Preparar partida <ArrowRight size={17} aria-hidden="true" />
            </Button>
            <Button variant="outline" size="lg" href="#/aprendizado">
              Conhecer a plataforma <ArrowDownRight size={16} aria-hidden="true" />
            </Button>
          </div>
          <div className="hero__stats">
            <div><strong>64</strong><span>casas</span></div>
            <div><strong>06</strong><span>peças</span></div>
            <div><strong>3D</strong><span>em tempo real</span></div>
          </div>
        </div>

        <div className="hero__side" aria-hidden="true">
          <span>CHESS CORE — CENA 001</span>
        </div>

        <div className="hero__foot">
          <span>ROLE PARA EXPLORAR</span>
          <span className="hero__foot-line" aria-hidden="true" />
          <span>01 / 64</span>
        </div>
      </section>

      <section className="section paths">
        <SectionHeading
          index="01 &nbsp;/&nbsp; ENCONTRE SEU JOGO"
          title={<>Escolha seu próximo movimento<span className="accent">.</span></>}
          description={<>Um universo de possibilidades.<br />Um tabuleiro de cada vez.</>}
        />
        <div className="paths__list">
          {paths.map((path) => (
            <a className="path-card" href={path.href} key={path.number}>
              <span className="path-card__number">{path.number}</span>
              <span className="path-card__icon" aria-hidden="true"><path.icon size={22} strokeWidth={1.5} /></span>
              <span className="path-card__copy">
                <strong>{path.title}</strong>
                <small>{path.text}</small>
              </span>
              <span className="path-card__tag">{path.tag}</span>
              <span className="path-card__arrow" aria-hidden="true"><ArrowRight size={18} /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="section pillars">
        <SectionHeading
          index="02 &nbsp;/&nbsp; UM UNIVERSO DE XADREZ"
          title={<>Construído como uma <em>obra</em>, não como um tema<span className="accent">.</span></>}
          description="Cada elemento da cena é modelado em três dimensões e iluminado como em um set de filmagem."
        />
        <div className="pillars__grid">
          {pillars.map((pillar) => (
            <article className="pillar" key={pillar.title}>
              <div className="pillar__visual" aria-hidden="true">
                <span className="pillar__glow" />
                <PieceIcon role={pillar.role} size={120} />
              </div>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto">
        <SceneSlot variant="ambient" className="manifesto__scene" />
        <div className="manifesto__copy">
          <Eyebrow><Sparkles size={13} aria-hidden="true" /> MANIFESTO</Eyebrow>
          <h2>Xadrez não é um passatempo. É uma <em>arquitetura de decisões</em>.</h2>
          <p>
            Criamos o CHESS CORE como um lugar onde o pensamento ganha espaço.
            A interface desaparece; a posição permanece. Quando a luz muda e as
            peças respondem, resta apenas o seu próximo movimento.
          </p>
          <Button variant="outline" href="#/aprendizado">
            Começar a jornada <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </section>

      <section className="home-note">
        <span className="home-note__mark" aria-hidden="true"><Crosshair size={20} /></span>
        <div>
          <span>UMA NOVA FORMA DE VER O JOGO</span>
          <p>O CHESS CORE está em construção. Explore a interface 3D e acompanhe o que vem por aí.</p>
        </div>
        <a href="#/treinamento">
          Explorar treinamento <ArrowRight size={16} aria-hidden="true" />
        </a>
      </section>

      <section className="home-strip">
        <Shield size={15} aria-hidden="true" />
        <span>Interface demonstrativa — nenhuma partida, conta ou regra real por aqui.</span>
      </section>
    </div>
  );
}
