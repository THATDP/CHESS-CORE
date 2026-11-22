import { useState } from 'react';
import { ArrowLeft, ArrowRight, Bot, Clock3, Globe2, Grid2X2, Info, Layers3, UsersRound } from 'lucide-react';
import { OptionGroup } from '../components/OptionGroup';

export function Play() {
  const [opponent, setOpponent] = useState('pessoa');
  const [mode, setMode] = useState('padrao');
  const [time, setTime] = useState('rapid');
  const [notice, setNotice] = useState(false);
  return <div className="play-page page-enter"><div className="play-topline"><a href="#/inicio"><ArrowLeft size={15}/> VOLTAR AO INÍCIO</a><span>O PRÓXIMO MOVIMENTO É SEU &nbsp; / &nbsp; 01</span></div>
    <div className="play-layout"><div className="play-scene"><div className="play-scene-copy"><div className="chapter"><span className="chapter-line"/> CHESS CORE &nbsp; / &nbsp; JOGAR</div><h1>Prepare-se<br/>para o <span>jogo.</span></h1><p>Grandes partidas começam com uma escolha.</p></div><div className="scene-foot"><span>ESTRATÉGIA. PRESENÇA. INTENÇÃO.</span><span>01 — 64</span></div></div>
      <section className="setup-panel" aria-labelledby="setup-heading"><div className="setup-heading"><div><span className="section-index">SUA PRÓXIMA PARTIDA</span><h2 id="setup-heading">Configure seu jogo<span className="period">.</span></h2><p>Escolha como você quer jogar.</p></div><span className="demo-label"><span/> DEMONSTRAÇÃO</span></div>
      <OptionGroup index="01" legend="Adversário" value={opponent} onChange={setOpponent} options={[{value:'pessoa',label:'Qualquer pessoa',detail:'Encontre um jogador',icon:Globe2},{value:'amigo',label:'Um amigo',detail:'Joguem juntos',icon:UsersRound},{value:'computador',label:'Computador',detail:'Pratique sozinho',icon:Bot}]}/>
      <OptionGroup index="02" legend="Modalidade" value={mode} onChange={setMode} layout="two" options={[{value:'padrao',label:'Xadrez padrão',detail:'O jogo clássico',icon:Layers3},{value:'variantes',label:'Variantes futuras',detail:'Novas formas de jogar',icon:Grid2X2}]}/>
      <OptionGroup index="03" legend="Controle de tempo" value={time} onChange={setTime} layout="four" options={[{value:'bullet',label:'Bullet',detail:'1 min'},{value:'blitz',label:'Blitz',detail:'3 min'},{value:'rapid',label:'Rapid',detail:'10 min'},{value:'classico',label:'Clássico',detail:'30 min'}]}/>
      <button className="setup-button" type="button" onClick={() => setNotice(true)}>Jogar <ArrowRight size={18}/></button>
      {notice ? <div className="setup-notice" role="status"><Info size={16}/> As partidas ainda não estão disponíveis. Suas escolhas são apenas demonstrativas.</div> : <p className="setup-disclaimer"><Clock3 size={14}/> Interface demonstrativa. Nenhuma partida será iniciada.</p>}
      </section></div></div>;
}
