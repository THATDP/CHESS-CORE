import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { CornerDownLeft, Search, SearchX, X } from 'lucide-react';
import { homePage, navCategories, pages, searchPages } from '../app/navigation';
import type { Page } from '../app/navigation';

const SUGGESTIONS: Page[] = [
  homePage,
  pages.find((page) => page.id === 'jogar') ?? homePage,
  pages.find((page) => page.id === 'quebra-cabecas') ?? homePage,
  pages.find((page) => page.id === 'analise') ?? homePage,
  pages.find((page) => page.id === 'torneios') ?? homePage,
  pages.find((page) => page.id === 'configuracoes') ?? homePage,
];

type ListProps = {
  results: Page[];
  current: string;
  onSelect: () => void;
  registerRef: (index: number, node: HTMLAnchorElement | null) => void;
};

function ResultList({ results, current, onSelect, registerRef }: ListProps) {
  return (
    <ul className="search-results" role="listbox" aria-label="Resultados">
      {results.map((page, index) => (
        <li key={page.id} role="option" aria-selected={index === 0}>
          <a
            ref={(node) => registerRef(index, node)}
            className={`search-result ${current === page.id ? 'is-current' : ''}`}
            href={`#/${page.id}`}
            onClick={onSelect}
          >
            <span className="search-result__icon" aria-hidden="true">
              <page.icon size={17} strokeWidth={1.7} />
            </span>
            <span className="search-result__copy">
              <strong>{page.label}</strong>
              <small>{page.eyebrow}</small>
            </span>
            {current === page.id && <span className="search-result__tag">ATUAL</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * Busca do cabeçalho. Procura apenas entre as seções que existem de fato —
 * nenhum resultado inventado, nenhum destino falso.
 */
export function SearchPanel({ current, onClose }: { current: string; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const results = useMemo(() => searchPages(query), [query]);
  const visible = query.trim() ? results : SUGGESTIONS;

  const registerRef = (index: number, node: HTMLAnchorElement | null) => {
    itemRefs.current[index] = node;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!visible.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.min(active + 1, visible.length - 1);
      setActive(next);
      itemRefs.current[next]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.max(active - 1, 0);
      setActive(next);
      itemRefs.current[next]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
      itemRefs.current[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      const last = visible.length - 1;
      setActive(last);
      itemRefs.current[last]?.focus();
    }
  };

  return (
    <div className="search-panel">
      <div className="search-box">
        <Search size={16} aria-hidden="true" />
        <input
          type="text"
          value={query}
          autoFocus
          placeholder="Buscar seções e recursos"
          aria-label="Buscar seções e recursos"
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
        />
        {query ? (
          <button className="search-box__clear" onClick={() => { setQuery(''); setActive(0); }} type="button" aria-label="Limpar busca">
            <X size={14} aria-hidden="true" />
          </button>
        ) : (
          <kbd className="search-box__hint"><CornerDownLeft size={11} aria-hidden="true" /> ENTER</kbd>
        )}
      </div>

      <div className="search-panel__meta">
        <span>{query.trim() ? `${results.length} resultado${results.length === 1 ? '' : 's'}` : 'SUGESTÕES'}</span>
        <span>{navCategories.length} categorias</span>
      </div>

      {visible.length ? (
        <ResultList results={visible} current={current} onSelect={onClose} registerRef={registerRef} />
      ) : (
        <div className="search-empty">
          <SearchX size={18} aria-hidden="true" />
          <strong>Nada encontrado</strong>
          <p>Busque por seção ou recurso — por exemplo, “tática”, “partida” ou “perfil”.</p>
        </div>
      )}
    </div>
  );
}
