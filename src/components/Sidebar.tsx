import { ChevronLeft, ChevronRight, PanelLeftClose, X } from 'lucide-react';
import { pages } from '../app/navigation';
import type { PageId } from '../app/navigation';

type Props = { current: PageId; collapsed: boolean; mobileOpen: boolean; onCollapse: () => void; onClose: () => void };
export function Sidebar({ current, collapsed, mobileOpen, onCollapse, onClose }: Props) {
  return <>
    {mobileOpen && <button className="sidebar-backdrop" aria-label="Fechar menu" onClick={onClose} />}
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--open' : ''}`}>
      <div className="brand-row"><a className="brand" href="#/inicio" onClick={onClose} aria-label="CHESS CORE, início"><span className="brand-mark">♞</span><span className="brand-word">CHESS <strong>CORE</strong><small>THE HEART OF CHESS</small></span></a><button className="icon-button mobile-close" onClick={onClose} aria-label="Fechar menu"><X size={19} /></button></div>
      <div className="side-caption">MENU PRINCIPAL</div>
      <nav aria-label="Navegação principal" className="side-nav">
        {pages.slice(0, 10).map((page) => <a className={`nav-link ${current === page.id ? 'active' : ''}`} href={`#/${page.id}`} key={page.id} onClick={onClose} aria-current={current === page.id ? 'page' : undefined} title={page.label}><page.icon size={18} strokeWidth={1.6} /><span>{page.label}</span>{current === page.id && <span className="active-dot" />}</a>)}
      </nav>
      <div className="side-bottom"><div className="side-caption">SUA CONTA</div><nav aria-label="Conta" className="side-nav">{pages.slice(10).map((page) => <a className={`nav-link ${current === page.id ? 'active' : ''}`} href={`#/${page.id}`} key={page.id} onClick={onClose} aria-current={current === page.id ? 'page' : undefined} title={page.label}><page.icon size={18} strokeWidth={1.6} /><span>{page.label}</span></a>)}</nav>
      <button className="collapse-button" onClick={onCollapse} aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}>{collapsed ? <ChevronRight size={16}/> : <><PanelLeftClose size={16}/><span>Recolher menu</span><ChevronLeft size={14}/></>}</button></div>
    </aside>
  </>;
}
