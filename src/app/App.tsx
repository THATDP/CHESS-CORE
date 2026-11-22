import { useEffect, useState } from 'react';
import { ChevronDown, Menu, Settings2 } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Dashboard } from '../pages/Dashboard';
import { PlannedPage } from '../pages/PlannedPage';
import { pageForHash } from './navigation';

export function App() {
  const [page, setPage] = useState(() => pageForHash(window.location.hash));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => {
    const update = () => { setPage(pageForHash(window.location.hash)); setProfileOpen(false); window.scrollTo?.(0, 0); };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return <div className={`app-shell ${collapsed ? 'app-shell--collapsed' : ''}`}>
    <Sidebar current={page.id} collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={() => setCollapsed(!collapsed)} onClose={() => setMobileOpen(false)}/>
    <div className="app-main"><header className="topbar"><div className="breadcrumb"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir menu"><Menu size={20}/></button><span className="breadcrumb-home">CHESS CORE</span><span className="breadcrumb-slash">/</span><strong>{page.label}</strong></div><div className="top-actions"><span className="demo-header"><span className="status-dot"/> MODO DEMONSTRAÇÃO</span><a className="icon-button settings-link" href="#/configuracoes" aria-label="Configurações"><Settings2 size={18}/></a><div className="top-divider"/><div className="profile-wrap"><button className="profile-button" aria-expanded={profileOpen} onClick={() => setProfileOpen(!profileOpen)}><span className="avatar">JD</span><span className="profile-copy"><strong>Jogador demo</strong><small>Conta demonstrativa</small></span><ChevronDown size={15}/></button>{profileOpen && <div className="profile-menu"><span>AMBIENTE DEMONSTRATIVO</span><p>Este perfil é fictício e não possui conta real.</p><a href="#/perfil">Ver perfil <ChevronDown size={14}/></a><a href="#/configuracoes">Configurações <ChevronDown size={14}/></a></div>}</div></div></header><main className="content" key={page.id}>{page.id === 'inicio' ? <Dashboard/> : <PlannedPage page={page}/>}</main><footer className="footer"><span>© CHESS CORE <span>·</span> THE HEART OF CHESS.</span><span>PROJETADO PARA O SEU PRÓXIMO MOVIMENTO <span>✳</span></span></footer></div>
  </div>;
}
