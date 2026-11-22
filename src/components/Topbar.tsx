import { ChevronDown, Menu, Settings2 } from 'lucide-react';
import type { Page } from '../app/navigation';

type Props = {
  page: Page;
  onMenu: () => void;
  profileOpen: boolean;
  onProfile: () => void;
};

export function Topbar({ page, onMenu, profileOpen, onProfile }: Props) {
  return (
    <header className="topbar">
      <div className="breadcrumb">
        <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Abrir menu" type="button">
          <Menu size={19} aria-hidden="true" />
        </button>
        <span className="breadcrumb-home">CHESS CORE</span>
        <span className="breadcrumb-slash" aria-hidden="true">/</span>
        <strong>{page.label}</strong>
        <span className="breadcrumb-context">{page.eyebrow}</span>
      </div>

      <div className="top-actions">
        <span className="demo-header">
          <span className="status-dot" aria-hidden="true" />
          MODO DEMONSTRAÇÃO
        </span>
        <a className="icon-button settings-link" href="#/configuracoes" aria-label="Configurações">
          <Settings2 size={17} aria-hidden="true" />
        </a>
        <span className="top-divider" aria-hidden="true" />
        <div className="profile-wrap">
          <button
            className="profile-button"
            aria-expanded={profileOpen}
            aria-label="Jogador demo"
            onClick={onProfile}
            type="button"
          >
            <span className="avatar avatar--emerald">JD</span>
            <span className="profile-copy">
              <strong>Jogador demo</strong>
              <small>Conta demonstrativa</small>
            </span>
            <ChevronDown size={15} aria-hidden="true" />
          </button>
          {profileOpen && (
            <div className="profile-menu">
              <span>AMBIENTE DEMONSTRATIVO</span>
              <p>Este perfil é fictício e não possui conta real.</p>
              <a href="#/perfil">Ver perfil <ChevronDown size={14} aria-hidden="true" /></a>
              <a href="#/configuracoes">Configurações <ChevronDown size={14} aria-hidden="true" /></a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
