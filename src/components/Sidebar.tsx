import { ChevronLeft, ChevronRight, PanelLeftClose, X } from 'lucide-react';
import { accountPages, navGroups } from '../app/navigation';
import type { PageId } from '../app/navigation';
import { PieceIcon } from './PieceIcon';

type Props = {
  current: PageId;
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onClose: () => void;
};

export function Sidebar({ current, collapsed, mobileOpen, onCollapse, onClose }: Props) {
  const linkClass = (id: PageId) => `nav-link ${current === id ? 'is-active' : ''}`;

  return (
    <>
      {mobileOpen && <button className="sidebar-backdrop" aria-label="Fechar menu" onClick={onClose} type="button" />}
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="brand-row">
          <a className="brand" href="#/inicio" onClick={onClose} aria-label="CHESS CORE, início">
            <span className="brand-mark" aria-hidden="true">
              <PieceIcon role="knight" size={30} />
            </span>
            <span className="brand-word">
              CHESS <strong>CORE</strong>
              <small>THE HEART OF CHESS</small>
            </span>
          </a>
          <button className="icon-button mobile-close" onClick={onClose} aria-label="Fechar menu" type="button">
            <X size={19} />
          </button>
        </div>

        <nav aria-label="Navegação principal" className="side-nav">
          {navGroups.map((group) => (
            <div className="side-group" key={group.group}>
              <span className="side-caption">{group.group}</span>
              {group.items.map((page) => (
                <a
                  className={linkClass(page.id)}
                  href={`#/${page.id}`}
                  key={page.id}
                  onClick={onClose}
                  aria-current={current === page.id ? 'page' : undefined}
                  title={page.label}
                >
                  <page.icon size={17} strokeWidth={1.7} aria-hidden="true" />
                  <span>{page.label}</span>
                  {current === page.id && <span className="active-dot" aria-hidden="true" />}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <div className="side-bottom">
          <span className="side-caption">CONTA</span>
          <nav aria-label="Conta" className="side-nav">
            {accountPages.map((page) => (
              <a
                className={linkClass(page.id)}
                href={`#/${page.id}`}
                key={page.id}
                onClick={onClose}
                aria-current={current === page.id ? 'page' : undefined}
                title={page.label}
              >
                <page.icon size={17} strokeWidth={1.7} aria-hidden="true" />
                <span>{page.label}</span>
                {current === page.id && <span className="active-dot" aria-hidden="true" />}
              </a>
            ))}
          </nav>

          <div className="side-status">
            <span className="side-status__dot" aria-hidden="true" />
            <div>
              <strong>Ambiente demo</strong>
              <small>Sem conta real</small>
            </div>
          </div>

          <button className="collapse-button" onClick={onCollapse} aria-label={collapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'} type="button">
            {collapsed ? <ChevronRight size={16} aria-hidden="true" /> : (
              <>
                <PanelLeftClose size={16} aria-hidden="true" />
                <span>Recolher menu</span>
                <ChevronLeft size={14} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
