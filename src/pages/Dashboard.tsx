import { ArrowDownRight, ArrowRight, Bot, ChevronRight, Crosshair, Swords, UsersRound } from 'lucide-react';

export function Dashboard() {
  return <div className="immersive-home page-enter">
    <section className="home-hero">
      <div className="hero-art" aria-hidden="true" />
      <div className="home-copy">
        <div className="chapter"><span className="chapter-line" /> THE HEART OF CHESS <span className="chapter-number">01 / 64</span></div>
        <h1>O jogo começa<br/><span>antes da primeira</span><br/>jogada<span className="period">.</span></h1>
        <p>Um espaço para pensar, evoluir e encontrar beleza em cada movimento.</p>
        <div className="hero-actions"><a className="action-primary" href="#/jogar">Preparar partida <ArrowRight size={18}/></a><a className="action-secondary" href="#/aprendizado">Conhecer a plataforma <ArrowDownRight size={17}/></a></div>
      </div>
      <div className="hero-bottom"><span>ESTRATÉGIA EM SUA FORMA MAIS PURA</span><span>CHESS CORE &nbsp; / &nbsp; 001</span></div>
    </section>
    <section className="paths-section"><div className="paths-heading"><div><span className="section-index">01 &nbsp; / &nbsp; ENCONTRE SEU JOGO</span><h2>Escolha seu próximo movimento<span className="period">.</span></h2></div><p>Um universo de possibilidades.<br/>Um tabuleiro de cada vez.</p></div>
      <div className="paths-list">
        <a href="#/jogar" className="path-row"><span className="path-number">01</span><span className="path-icon"><Swords size={22}/></span><span className="path-title"><strong>Jogar uma partida</strong><small>Escolha seu adversário e seu ritmo</small></span><span className="path-tag">CONFIGURAÇÃO DEMO</span><span className="path-arrow"><ArrowRight size={19}/></span></a>
        <a href="#/computador" className="path-row"><span className="path-number">02</span><span className="path-icon"><Bot size={22}/></span><span className="path-title"><strong>Contra o computador</strong><small>Encontre seu ritmo e refine suas ideias</small></span><span className="path-tag">EM DESENVOLVIMENTO</span><span className="path-arrow"><ArrowRight size={19}/></span></a>
        <a href="#/amigos" className="path-row"><span className="path-number">03</span><span className="path-icon"><UsersRound size={22}/></span><span className="path-title"><strong>Jogar com amigos</strong><small>Compartilhe o jogo com quem você conhece</small></span><span className="path-tag">EM DESENVOLVIMENTO</span><span className="path-arrow"><ArrowRight size={19}/></span></a>
      </div>
    </section>
    <section className="home-note"><div className="note-mark"><Crosshair size={20}/></div><div><span>UMA NOVA FORMA DE VER O JOGO</span><p>O CHESS CORE está em construção. Explore a interface e acompanhe o que vem por aí.</p></div><a href="#/treinamento">Explorar treinamento <ChevronRight size={16}/></a></section>
  </div>;
}
