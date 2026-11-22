import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from '../src/app/App';
import { isMatchPage, navCategories, pageForHash, pages, searchPages } from '../src/app/navigation';
import type { PageId } from '../src/app/navigation';
import { defaultNavPreferences } from '../src/app/preferences';

afterEach(() => {
  cleanup();
  window.location.hash = '';
  window.localStorage.clear();
  delete document.documentElement.dataset.accent;
});

const header = () => document.querySelector('.header');
const nav = () => screen.getByRole('navigation', { name: 'Navegação principal' });

describe('etapa 2 · cabeçalho e dropdowns', () => {
  it('compõe o cabeçalho com marca, navegação central e ações', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /CHESS CORE — início/ }).getAttribute('href')).toBe('#/inicio');
    for (const category of navCategories) {
      expect(within(nav()).getByRole('button', { name: category.label })).toBeTruthy();
    }
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Configurações' }).getAttribute('href')).toBe('#/configuracoes');
    expect(screen.getByRole('button', { name: /Jogador demo/ })).toBeTruthy();
  });

  it('abre um dropdown por vez e indica a seção atual', () => {
    window.location.hash = '#/quebra-cabecas';
    render(<App />);

    fireEvent.click(within(nav()).getByRole('button', { name: 'Treinar' }));
    const panel = document.getElementById('nav-panel-treinar');
    const current = within(panel).getByRole('link', { name: /Quebra-cabeças/ });
    expect(current.getAttribute('href')).toBe('#/quebra-cabecas');
    expect(current.getAttribute('aria-current')).toBe('page');

    fireEvent.click(within(nav()).getByRole('button', { name: 'Estudar' }));
    expect(document.getElementById('nav-panel-treinar')).toBeNull();
    expect(document.getElementById('nav-panel-estudar')).toBeTruthy();
  });

  it('fecha o dropdown com ESC e devolve o foco ao gatilho', () => {
    render(<App />);
    const trigger = within(nav()).getByRole('button', { name: 'Jogar' });

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
  });

  it('fecha o dropdown ao clicar fora', () => {
    render(<App />);
    const trigger = within(nav()).getByRole('button', { name: 'Competir' });
    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    fireEvent.pointerDown(document.body);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('fecha o dropdown depois de escolher uma opção', () => {
    render(<App />);
    const trigger = within(nav()).getByRole('button', { name: 'Jogar' });
    fireEvent.click(trigger);
    const option = within(nav()).getByRole('link', { name: /Computador/ });
    expect(option.getAttribute('href')).toBe('#/computador');
    fireEvent.click(option);

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    window.location.hash = '#/computador';
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(screen.getByRole('heading', { name: /adversário à sua altura/ })).toBeTruthy();
  });

  it('fecha os painéis quando a rota muda', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    expect(screen.getByRole('dialog', { name: 'Buscar' })).toBeTruthy();

    window.location.hash = '#/historico';
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(screen.queryByRole('dialog', { name: 'Buscar' })).toBeNull();
  });
});

describe('etapa 2 · busca do cabeçalho', () => {
  it('encontra seções por palavra-chave e navega', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    const dialog = screen.getByRole('dialog', { name: 'Buscar' });
    const input = within(dialog).getByRole('textbox', { name: 'Buscar seções e recursos' });

    fireEvent.change(input, { target: { value: 'tática' } });
    const results = within(dialog).getAllByRole('option');
    expect(results.length).toBeGreaterThan(0);
    expect(within(results[0]).getByText(/Quebra-cabeças/)).toBeTruthy();

    const result = within(dialog).getByRole('link', { name: /Quebra-cabeças/ });
    expect(result.getAttribute('href')).toBe('#/quebra-cabecas');
    fireEvent.click(result);
    window.location.hash = '#/quebra-cabecas';
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(screen.getByRole('heading', { name: /Encontre a melhor jogada/ })).toBeTruthy();
  });

  it('não inventa destinos quando nada corresponde', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    const dialog = screen.getByRole('dialog', { name: 'Buscar' });
    const input = within(dialog).getByRole('textbox', { name: 'Buscar seções e recursos' });

    fireEvent.change(input, { target: { value: 'xyzzy' } });
    expect(within(dialog).getByText('Nada encontrado')).toBeTruthy();
    expect(within(dialog).queryAllByRole('link')).toHaveLength(0);
  });

  it('percorre os resultados com as setas do teclado', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));
    const dialog = screen.getByRole('dialog', { name: 'Buscar' });
    const input = within(dialog).getByRole('textbox', { name: 'Buscar seções e recursos' });

    fireEvent.change(input, { target: { value: 'partida' } });
    const results = within(dialog).getAllByRole('option');
    expect(results.length).toBeGreaterThan(1);

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(document.activeElement?.getAttribute('href'))
      .toBe(results[1].querySelector('a')?.getAttribute('href'));
  });
});

describe('etapa 2 · notificações e perfil', () => {
  it('marca as notificações como lidas e some com o indicador', () => {
    render(<App />);
    const bell = screen.getByRole('button', { name: 'Notificações' });
    expect(bell.querySelector('.header__badge')).toBeTruthy();

    fireEvent.click(bell);
    const dialog = screen.getByRole('dialog', { name: 'Notificações' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Marcar como lida' }));

    expect(bell.querySelector('.header__badge')).toBeNull();
    expect(within(dialog).getByText(/Tudo em dia/)).toBeTruthy();
  });

  it('abre e fecha o menu de perfil com ESC', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /Jogador demo/ });
    fireEvent.click(button);
    expect(screen.getByRole('dialog', { name: 'Perfil' })).toBeTruthy();

    fireEvent.keyDown(button, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Perfil' })).toBeNull();
  });
});

describe('etapa 2 · modo compacto e responsivo', () => {
  it('usa o cabeçalho compacto apenas nos contextos de partida', () => {
    window.location.hash = '#/jogar';
    const first = render(<App />);
    expect(first.container.querySelector('.header--compact')).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Navegação principal' })).toBeNull();

    cleanup();
    window.location.hash = '#/analise';
    const second = render(<App />);
    expect(second.container.querySelector('.header--compact')).toBeNull();
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeTruthy();
  });

  it('preserva menu, configurações e o atalho 2D/3D no cabeçalho compacto', () => {
    window.location.hash = '#/jogar';
    render(<App />);

    expect(screen.getByRole('link', { name: 'Configurações' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeTruthy();

    const toggle = screen.getByRole('button', { name: 'Desativar cena 3D' });
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(toggle);
    expect(window.localStorage.getItem('cc-navigation')).toContain('"scene3d":false');
    expect(screen.getByRole('button', { name: 'Ativar cena 3D' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByText(/Cena 3D desativada/)).toBeTruthy();
  });

  it('desativa o modo compacto pelas configurações', () => {
    window.localStorage.setItem('cc-navigation', JSON.stringify({ ...defaultNavPreferences, compactMatches: false }));
    window.location.hash = '#/computador';
    render(<App />);

    expect(header()?.classList.contains('header--compact')).toBe(false);
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeTruthy();
  });

  it('oferece o menu expansível com busca, atalhos e todas as categorias', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const drawer = screen.getByRole('dialog', { name: 'Menu de navegação' });

    expect(within(drawer).getByRole('link', { name: 'Início' }).getAttribute('href')).toBe('#/inicio');
    expect(within(drawer).getByRole('link', { name: 'Configurações' })).toBeTruthy();
    expect(within(drawer).getByRole('textbox', { name: 'Buscar seções e recursos' })).toBeTruthy();

    for (const page of pages.filter((item) => item.id !== 'inicio')) {
      const category = navCategories.find((item) => item.id === page.category);
      fireEvent.click(within(drawer).getByRole('button', { name: category?.label ?? page.label }));
      const link = within(drawer).getAllByRole('link').find((node) => node.getAttribute('href') === `#/${page.id}`);
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain(page.label);
    }
  });

  it('fecha o menu expansível ao escolher uma seção', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    const drawer = screen.getByRole('dialog', { name: 'Menu de navegação' });
    fireEvent.click(within(drawer).getByRole('button', { name: 'Competir' }));
    const drawerLink = within(drawer).getByRole('link', { name: 'Torneios' });
    expect(drawerLink.getAttribute('href')).toBe('#/torneios');
    fireEvent.click(drawerLink);

    expect(screen.queryByRole('dialog', { name: 'Menu de navegação' })).toBeNull();
    window.location.hash = '#/torneios';
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(screen.getByRole('heading', { name: 'Seu próximo grande desafio.' })).toBeTruthy();
  });
});

describe('etapa 2 · catálogo de navegação', () => {
  it('cobre as doze seções sem duplicar destinos', () => {
    expect(pages).toHaveLength(12);
    expect(new Set(pages.map((page) => page.id)).size).toBe(12);
    expect(pages.find((page) => page.id === 'inicio')?.category).toBeNull();

    const grouped = navCategories.flatMap((category) => (
      pages.filter((page) => page.category === category.id).map((page) => page.id)
    ));
    expect(grouped).toHaveLength(11);
    expect(new Set(grouped).size).toBe(11);
  });

  it('só marca como partida as páginas que colocam o usuário à mesa', () => {
    expect(isMatchPage('jogar')).toBe(true);
    expect(isMatchPage('computador')).toBe(true);
    const studyPages: PageId[] = ['inicio', 'treinamento', 'quebra-cabecas', 'analise', 'torneios', 'amigos', 'perfil'];
    for (const id of studyPages) {
      expect(isMatchPage(id)).toBe(false);
    }
  });

  it('resolve hashes desconhecidos para o início', () => {
    expect(pageForHash('#/rota-inexistente').id).toBe('inicio');
    expect(pageForHash('#/analise').id).toBe('analise');
    expect(pageForHash('').id).toBe('inicio');
  });

  it('busca apenas destinos reais', () => {
    expect(searchPages('')).toEqual([]);
    expect(searchPages('   ')).toEqual([]);
    for (const page of searchPages('partida')) expect(pages).toContain(page);
    for (const page of searchPages('xyzzy')) expect(pages).not.toContain(page);
  });
});
