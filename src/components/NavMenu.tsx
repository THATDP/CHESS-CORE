import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, House, X } from 'lucide-react';
import { homePage, navCategories, pages, pagesByCategory } from '../app/navigation';
import type { NavCategoryId, PageId } from '../app/navigation';

type MenuProps = {
  current: PageId;
  openId: NavCategoryId | null;
  onToggle: (id: NavCategoryId) => void;
  onClose: () => void;
};

/**
 * Navegação principal do cabeçalho amplo: Início direto e as categorias em
 * dropdowns. Só um dropdown aberto por vez; clique fora e ESC fecham.
 */
export function NavMenu({ current, openId, onToggle, onClose }: MenuProps) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openId) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const trigger = document.getElementById(`nav-trigger-${openId}`);
      onClose();
      trigger?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openId, onClose]);

  const lastCentered = navCategories.length - 2;

  return (
    <nav ref={navRef} className="header__nav" aria-label="Navegação principal">
      <a
        className={`nav-link ${current === homePage.id ? 'is-active' : ''}`}
        href={`#/${homePage.id}`}
        aria-current={current === homePage.id ? 'page' : undefined}
        onClick={onClose}
      >
        <House size={15} strokeWidth={1.7} aria-hidden="true" />
        <span>{homePage.label}</span>
      </a>

      {navCategories.map((category, index) => {
        const items = pagesByCategory(category.id);
        const isOpen = openId === category.id;
        const isCurrent = items.some((page) => page.id === current);
        return (
          <div className="nav-dropdown" key={category.id}>
            <button
              id={`nav-trigger-${category.id}`}
              type="button"
              className={`nav-trigger ${isCurrent ? 'is-current' : ''}`}
              aria-expanded={isOpen}
              aria-controls={`nav-panel-${category.id}`}
              onClick={() => onToggle(category.id)}
            >
              <category.icon size={15} strokeWidth={1.7} aria-hidden="true" />
              <span>{category.label}</span>
              <ChevronDown size={14} className="nav-trigger__chevron" aria-hidden="true" />
            </button>

            {isOpen && (
              <div
                id={`nav-panel-${category.id}`}
                className={`nav-panel ${index >= lastCentered ? 'nav-panel--right' : ''}`}
                role="region"
                aria-label={category.label}
              >
                <div className="nav-panel__head">
                  <span className="nav-panel__eyebrow">
                    <category.icon size={12} strokeWidth={1.8} aria-hidden="true" />
                    {category.label.toUpperCase()}
                  </span>
                  <p>{category.description}</p>
                </div>
                <ul className="nav-panel__list">
                  {items.map((page) => (
                    <li key={page.id}>
                      <a
                        className={`nav-panel__item ${current === page.id ? 'is-current' : ''}`}
                        href={`#/${page.id}`}
                        aria-current={current === page.id ? 'page' : undefined}
                        onClick={onClose}
                      >
                        <page.icon size={17} strokeWidth={1.7} aria-hidden="true" />
                        <span className="nav-panel__copy">
                          <strong>{page.label}</strong>
                          <small>{page.features[0]}</small>
                        </span>
                        {current === page.id && <span className="nav-panel__current">ATUAL</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

type DrawerProps = {
  current: PageId;
  onClose: () => void;
  children?: ReactNode;
};

/**
 * Navegação para telas estreitas: painel abaixo do cabeçalho com busca,
 * atalhos e as categorias em acordeões. Substitui a navegação lateral, que
 * deixou de existir.
 */
export function NavDrawer({ current, onClose, children }: DrawerProps) {
  const currentPage = pages.find((page) => page.id === current);
  const [openCategory, setOpenCategory] = useState<NavCategoryId | null>(currentPage?.category ?? 'jogar');

  return (
    <div className="nav-drawer" role="dialog" aria-label="Menu de navegação">
      <div className="nav-drawer__head">
        <span className="nav-drawer__title">MENU</span>
        <button className="icon-button" onClick={onClose} type="button" aria-label="Fechar menu">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="nav-drawer__scroll">
        {children}

        <nav className="nav-drawer__nav" aria-label="Categorias">
          <a
            className={`nav-drawer__home ${current === homePage.id ? 'is-active' : ''}`}
            href={`#/${homePage.id}`}
            aria-current={current === homePage.id ? 'page' : undefined}
            onClick={onClose}
          >
            <House size={16} strokeWidth={1.7} aria-hidden="true" />
            <span>{homePage.label}</span>
          </a>

          {navCategories.map((category) => {
            const items = pagesByCategory(category.id);
            const isOpen = openCategory === category.id;
            return (
              <div className={`nav-accordion ${isOpen ? 'is-open' : ''}`} key={category.id}>
                <button
                  type="button"
                  className="nav-accordion__trigger"
                  aria-expanded={isOpen}
                  aria-controls={`drawer-panel-${category.id}`}
                  onClick={() => setOpenCategory(isOpen ? null : category.id)}
                >
                  <category.icon size={15} strokeWidth={1.7} aria-hidden="true" />
                  <span>{category.label}</span>
                  <ChevronDown size={14} className="nav-accordion__chevron" aria-hidden="true" />
                </button>
                {isOpen && (
                  <div id={`drawer-panel-${category.id}`} className="nav-accordion__body">
                    {items.map((page) => (
                      <a
                        key={page.id}
                        className={`nav-accordion__link ${current === page.id ? 'is-active' : ''}`}
                        href={`#/${page.id}`}
                        aria-current={current === page.id ? 'page' : undefined}
                        onClick={onClose}
                      >
                        <page.icon size={15} strokeWidth={1.7} aria-hidden="true" />
                        <span>{page.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
