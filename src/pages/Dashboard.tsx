import { ArrowDownLeft, ArrowRight, ArrowUpRight, Bot, ChevronRight, Clock3, Flame, GraduationCap, Puzzle, Swords, Target, Trophy, UsersRound, Zap } from 'lucide-react';
import { Chessboard } from '../components/Chessboard';

const modes = [
  { icon: Swords, title: 'Partida online', detail: 'Encontre seu próximo desafio', link: 'jogar' },
  { icon: Bot, title: 'Computador', detail: 'Pratique no seu ritmo', link: 'computador' },
  { icon: UsersRound, title: 'Jogar com amigo', detail: 'Compartilhe o tabuleiro', link: 'amigos' },
];
const games = [
  { initials: 'AM', name: 'Alex Martins', type: 'Rápida · 10 min', result: 'Vitória', color: 'win', date: 'Hoje' },
  { initials: 'CL', name: 'Camila Lopes', type: 'Blitz · 5 min', result: 'Derrota', color: 'loss', date: 'Ontem' },
  { initials: 'RN', name: 'Rafael Nunes', type: 'Rápida · 10 min', result: 'Vitória', color: 'win', date: '12 out' },
];
export function Dashboard() {
  return <div className="dashboard page-enter">
    <div className="welcome-row"><div><div className="eyebrow"><span className="status-dot" /> SEU PAINEL <span className="eyebrow-separator">/</span> VISÃO GERAL</div><h1>Bom ter você por aqui<span className="accent">.</span></h1><p>Seu próximo grande movimento começa aqui.</p></div><div className="demo-pill"><span /> Ambiente demonstrativo</div></div>
    <div className="dashboard-grid">
      <div className="main-column">
        <section className="hero-card"><div className="hero-copy"><div className="hero-kicker"><span /> O JOGO É SEU</div><h2>Um novo jogo.<br/><em>Infinitas possibilidades.</em></h2><p>Cada partida é uma oportunidade de pensar diferente. Qual será sua próxima jogada?</p><a className="primary-button" href="#/jogar">Explorar modos de jogo <ArrowRight size={16}/></a></div><div className="hero-index">01 <span>/</span> 64</div></section>
        <div className="section-heading modes-heading"><div><span className="overline">ESCOLHA SEU CAMINHO</span><h2>Como você quer jogar?</h2></div><span className="subtle-note">MODOS DE JOGO <ArrowRight size={14}/></span></div>
        <div className="mode-grid">{modes.map((mode) => <a href={`#/${mode.link}`} className="mode-card" key={mode.title}><span className="mode-icon"><mode.icon size={19} strokeWidth={1.6}/></span><span className="mode-arrow"><ArrowUpRight size={16}/></span><strong>{mode.title}</strong><small>{mode.detail}</small><span className="planned-label">EM DESENVOLVIMENTO</span></a>)}</div>
        <section className="panel recent-panel"><div className="panel-header"><div><span className="overline">SUA JORNADA</span><h2>Partidas recentes</h2></div><a className="text-link" href="#/historico">Ver histórico <ArrowRight size={14}/></a></div><div className="demo-notice">Exemplos fictícios · nenhuma partida foi jogada</div><div className="games-table"><div className="table-head"><span>OPONENTE</span><span>RESULTADO</span><span>DATA</span><span /></div>{games.map((game) => <div className="game-row" key={game.name}><div className="opponent"><span className="avatar avatar-small">{game.initials}</span><span><strong>{game.name}</strong><small>{game.type}</small></span></div><span className={`result ${game.color}`}>{game.result}</span><span className="game-date">{game.date}</span><ChevronRight className="row-chevron" size={16}/></div>)}</div></section>
      </div>
      <div className="right-column">
        <section className="panel board-panel"><div className="panel-header"><div><span className="overline">O CORAÇÃO DO JOGO</span><h2>O tabuleiro</h2></div><span className="board-badge">POSIÇÃO INICIAL</span></div><Chessboard/><div className="board-footer"><span><span className="status-dot" /> Uma nova partida espera por você</span><a href="#/jogar" aria-label="Explorar jogar"><ArrowUpRight size={16}/></a></div></section>
        <section className="panel progress-panel"><div className="panel-header"><div><span className="overline">UM PASSO DE CADA VEZ</span><h2>Sua evolução</h2></div><span className="tiny-demo">EXEMPLO</span></div><div className="stats-grid"><div><span className="stat-icon"><Trophy size={16}/></span><strong>24</strong><small>Partidas</small></div><div><span className="stat-icon"><Target size={16}/></span><strong>68<span>%</span></strong><small>Vitórias</small></div><div><span className="stat-icon"><Flame size={16}/></span><strong>7</strong><small>Sequência</small></div></div><div className="progress-line"><span>Trilha de fundamentos</span><strong>3 de 8</strong></div><div className="progress-track"><span /></div><a className="progress-link" href="#/aprendizado">Continuar aprendendo <ArrowRight size={14}/></a></section>
        <section className="challenge-card"><div className="challenge-icon"><Puzzle size={21}/></div><div><span className="overline">UM DESAFIO PARA VOCÊ</span><h2>Treine seu olhar.</h2><p>Um pequeno desafio por dia, uma jogada melhor a cada partida.</p><a href="#/quebra-cabecas">Explorar desafios <ArrowRight size={14}/></a></div><span className="challenge-spark">✳</span></section>
      </div>
    </div>
    <div className="bottom-grid"><section className="panel activity-panel"><div className="panel-header"><div><span className="overline">SUA JORNADA</span><h2>Atividade recente</h2></div><span className="tiny-demo">EXEMPLOS FICTÍCIOS</span></div><div className="activity-row"><span className="activity-icon"><Zap size={16}/></span><div><strong>Uma boa sequência</strong><small>Exemplo de conquista de treinamento</small></div><span>Hoje</span></div><div className="activity-row"><span className="activity-icon muted"><GraduationCap size={16}/></span><div><strong>Conhecimento em movimento</strong><small>Exemplo de progresso em aprendizado</small></div><span>Ontem</span></div></section><section className="panel quick-panel"><div className="panel-header"><div><span className="overline">SEMPRE À MÃO</span><h2>Acesso rápido</h2></div></div><div className="quick-links"><a href="#/treinamento"><Target size={17}/> Treinamento <ArrowUpRight size={14}/></a><a href="#/analise"><ArrowDownLeft size={17}/> Análise <ArrowUpRight size={14}/></a><a href="#/historico"><Clock3 size={17}/> Histórico <ArrowUpRight size={14}/></a></div></section></div>
  </div>;
}
