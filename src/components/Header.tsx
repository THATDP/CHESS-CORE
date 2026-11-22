import { useCallback, useEffect, useState } from 'react';
import { Bell, Box, Check, ImageOff, Menu, Search, Settings2, UserRound } from 'lucide-react';
import type { Page } from '../app/navigation';
import { updateNavPreferences, useNavPreferences } from '../app/preferences';
import { NavDrawer, NavMenu } from './NavMenu';
import type { NavCategoryId } from '../app/navigation';
import { Popover } from './Popover';
import { PieceIcon } from './PieceIcon';
import { SearchPanel } from './SearchPanel';

type Props = {
  page: Page;
  compact: boolean;
};

function NotificationsPanel({ read, onMarkRead }: { read: boolean; onMarkRead: () => void }) {
  return (
    <div className="popover__content">
      <header className="popover__head">
        <span>NOTIFICAÇÕES</span>
        {!read && <span className="badge badge--emerald">1 nova</span>}
      </header>

      {read ? (
        <div className="empty-state empty-state--sm">
          <span className="empty-state__icon"><Check size={18} aria-hidden="true" /></span>
          <strong>Tudo em dia por aqui</strong>
          <p>Nenhuma notificação pendente neste ambiente demonstrativo.</p>
        </div>
      ) : (
        <div className="notification">
          <span className="notification__dot" aria-hidden="true" />
          <div className="notification__copy">
            <strong>Ambiente de demonstração</strong>
            <p>As notificações reais chegam na próxima etapa. Nada foi enviado a você.</p>
            <span className="notification__time">AGORA</span>
          </div>
        </div>
      )}

      <button className="popover__action" type="button" onClick={onMarkRead} disabled={read}>
        Marcar como lida
      </button>
      <p className="popover__note">Nenhuma notificação é enviada nesta fase.</p>
    </div>
  );
}

/** Atalho 2D/3D exigido durante uma partida; reflete a preferência real. */
function SceneToggle() {
  const prefs = useNavPreferences();
  const enabled = prefs.scene3d;
  return (
    <button
      type="button"
      className={`scene-toggle ${enabled ? 'is-on' : ''}`}
      aria-pressed={enabled}
      aria-label={enabled ? 'Desativar cena 3D' : 'Ativar cena 3D'}
      title="Cena 3D em tempo real"
      onClick={() => updateNavPreferences({ scene3d: !enabled })}
    >
      {enabled ? <Box size={16} aria-hidden="true" /> : <ImageOff size={16} aria-hidden="true" />}
      <span>{enabled ? '3D' : '2D'}</span>
    </button>
  );
}

export function Header({ page, compact }: Props) {
  const prefs = useNavPreferences();
  const [openId, setOpenId] = useState<NavCategoryId | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifRead, setNotifRead] = useState(false);

  const closeAll = useCallback(() => {
    setOpenId(null);
    setSearchOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
    setDrawerOpen(false);
  }, []);

  const closeNav = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    const onHashChange = () => closeAll();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [closeAll]);

  const toggle = (current: boolean, set: (value: boolean) => void) => () => {
    closeAll();
    set(!current);
  };

  return (
    <header className={`header ${compact ? 'header--compact' : ''} ${prefs.pinned ? 'header--pinned' : ''}`}>
      <div className="header__inner">
        <a className="brand" href="#/inicio" aria-label="CHESS CORE — início" onClick={closeAll}>
          <span className="brand-mark" aria-hidden="true">
            <PieceIcon role="knight" size={compact ? 24 : 30} />
          </span>
          <span className="brand-word">
            CHESS <strong>CORE</strong>
            {!compact && <small>THE HEART OF CHESS</small>}
          </span>
        </a>

        {!compact && (
          <NavMenu
            current={page.id}
            openId={openId}
            onToggle={(id) => { closeAll(); setOpenId(id); }}
            onClose={closeNav}
          />
        )}

        {compact && (
          <div className="header__context">
            <span className="header__context-eyebrow">{page.eyebrow}</span>
            <span className="header__context-label">{page.label}</span>
          </div>
        )}

        <div className="header__actions">
          <span className="header__demo">
            <span className="status-dot" aria-hidden="true" />
            MODO DEMONSTRAÇÃO
          </span>

          {!compact && (
            <Popover
              open={searchOpen}
              onClose={() => setSearchOpen(false)}
              label="Buscar"
              className="header__search"
              trigger={({ open, buttonRef }) => (
                <button
                  ref={buttonRef}
                  type="button"
                  className="icon-button popover__trigger"
                  aria-expanded={open}
                  aria-label="Buscar"
                  onClick={toggle(searchOpen, setSearchOpen)}
                >
                  <Search size={17} aria-hidden="true" />
                </button>
              )}
            >
              <SearchPanel current={page.id} onClose={() => setSearchOpen(false)} />
            </Popover>
          )}

          <Popover
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            label="Notificações"
            trigger={({ open, buttonRef }) => (
              <button
                ref={buttonRef}
                type="button"
                className="icon-button popover__trigger"
                aria-expanded={open}
                aria-label="Notificações"
                onClick={toggle(notifOpen, setNotifOpen)}
              >
                <Bell size={17} aria-hidden="true" />
                {!notifRead && <span className="header__badge" aria-hidden="true">1</span>}
              </button>
            )}
          >
            <NotificationsPanel read={notifRead} onMarkRead={() => setNotifRead(true)} />
          </Popover>

          <a
            className="icon-button header__settings"
            href="#/configuracoes"
            aria-label="Configurações"
            onClick={closeAll}
          >
            <Settings2 size={17} aria-hidden="true" />
          </a>

          <span className="header__divider" aria-hidden="true" />

          <Popover
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            label="Perfil"
            trigger={({ open, buttonRef }) => (
              <button
                ref={buttonRef}
                type="button"
                className="profile-button popover__trigger"
                aria-expanded={open}
                aria-label="Jogador demo"
                onClick={toggle(profileOpen, setProfileOpen)}
              >
                <span className="avatar avatar--emerald">JD</span>
                <span className="profile-copy">
                  <strong>Jogador demo</strong>
                  <small>Conta demonstrativa</small>
                </span>
              </button>
            )}
          >
            <div className="popover__content">
              <header className="popover__head">
                <span>AMBIENTE DEMONSTRATIVO</span>
              </header>
              <p className="profile-menu__note">Este perfil é fictício e não possui conta real.</p>
              <a className="profile-menu__link" href="#/perfil" onClick={() => setProfileOpen(false)}>
                Ver perfil <span aria-hidden="true">→</span>
              </a>
              <a className="profile-menu__link" href="#/configuracoes" onClick={() => setProfileOpen(false)}>
                Configurações <span aria-hidden="true">→</span>
              </a>
            </div>
          </Popover>

          {compact && <SceneToggle />}

          <button
            type="button"
            className="icon-button header__menu"
            aria-label="Abrir menu"
            aria-expanded={drawerOpen}
            onClick={toggle(drawerOpen, setDrawerOpen)}
          >
            <Menu size={19} aria-hidden="true" />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <NavDrawer current={page.id} onClose={() => setDrawerOpen(false)}>
          <div className="nav-drawer__quick">
            <SearchPanel current={page.id} onClose={() => setDrawerOpen(false)} />
            <div className="nav-drawer__quick-links">
              <a className="nav-drawer__quick-link" href="#/perfil" onClick={() => setDrawerOpen(false)}>
                <UserRound size={15} aria-hidden="true" /> Perfil
              </a>
              <a className="nav-drawer__quick-link" href="#/configuracoes" onClick={() => setDrawerOpen(false)}>
                <Settings2 size={15} aria-hidden="true" /> Configurações
              </a>
            </div>
          </div>
        </NavDrawer>
      )}
    </header>
  );
}
