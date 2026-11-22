import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/app/App';
import { navCategories, pages } from '../src/app/navigation';

afterEach(() => {
  cleanup();
  window.location.hash = '';
  vi.unstubAllGlobals();
  window.localStorage.clear();
  delete document.documentElement.dataset.accent;
});
describe('interface demonstrativa', () => {
  it('apresenta uma experiência imersiva e acesso à configuração', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /O jogo começa/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Preparar partida/ }).getAttribute('href')).toBe('#/jogar');
    expect(screen.getByText(/em construção/)).toBeTruthy();
  });
  it('expõe todas as seções por links hash compatíveis com Pages', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' });
    expect(within(nav).getByRole('link', { name: 'Início' }).getAttribute('href')).toBe('#/inicio');
    for (const page of pages.filter((item) => item.id !== 'inicio')) {
      const category = navCategories.find((item) => item.id === page.category);
      fireEvent.click(within(nav).getByRole('button', { name: category?.label ?? page.label }));
      const link = within(nav).getAllByRole('link').find((node) => node.getAttribute('href') === `#/${page.id}`);
      expect(link).toBeTruthy();
      expect(link?.textContent).toContain(page.label);
    }
  });
  it('abre o menu demonstrativo de perfil e o menu de navegação', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Jogador demo/ }));
    expect(screen.getByText(/perfil é fictício/)).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('button', { name: /Jogador demo/ }), { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('dialog', { name: 'Menu de navegação' })).toBeTruthy();
  });
  it('altera a página quando a navegação hash muda', () => {
    vi.stubGlobal('scrollTo', vi.fn());
    render(<App />);
    window.location.hash = '#/analise';
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(screen.getByRole('heading', { name: 'Cada jogada tem uma história.' })).toBeTruthy();
  });
  it('apresenta página planejada ao carregar uma rota hash', () => {
    window.location.hash = '#/torneios';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Seu próximo grande desafio.' })).toBeTruthy();
    expect(screen.getByText(/ainda não estão disponíveis/)).toBeTruthy();
  });
  it('monta a partida real dentro da aplicação e joga lances', () => {
    window.location.hash = '#/jogar';
    render(<App />);
    fireEvent.click(screen.getByRole('radio', { name: '5 + 0' }));
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    const cell = (square: string) => document.querySelector(`[data-square="${square}"]`) as HTMLElement;
    fireEvent.click(cell('e2'));
    fireEvent.click(cell('e4'));
    fireEvent.click(cell('e7'));
    fireEvent.click(cell('e5'));
    expect(document.querySelector('.match__moves')?.textContent).toContain('e4');
    expect(document.querySelector('.match__moves')?.textContent).toContain('e5');
    expect(screen.getByRole('status').textContent).toBe('Brancas a jogar');
    fireEvent.click(screen.getByRole('button', { name: 'Desfazer' }));
    expect(document.querySelector('.match__moves')?.textContent).not.toContain('e5');
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }));
    expect(document.querySelectorAll('.board__piece')).toHaveLength(32);
  });

  it('prepara uma partida real a partir da seção Jogar', () => {
    window.location.hash = '#/jogar';
    render(<App />);
    expect((screen.getByRole('radio', { name: /Um amigo/ }) as HTMLInputElement).checked).toBe(true);
    for (const label of ['Sem limite', '1 + 0', '3 + 0', '3 + 2', '5 + 0', '10 + 0', '15 + 10']) {
      expect(screen.getByRole('radio', { name: label })).toBeTruthy();
    }
    fireEvent.click(screen.getByRole('radio', { name: '5 + 0' }));
    expect((screen.getByRole('radio', { name: '5 + 0' }) as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Começar partida' }));
    expect(screen.getByRole('status').textContent).toBe('Brancas a jogar');
    expect(document.querySelectorAll('.board__cell')).toHaveLength(64);
  });
});

describe('fase 02 · experiência visual e páginas', () => {
  it('entrega um pôster de cena em CSS antes do WebGL e mantém a cena no DOM', () => {
    render(<App />);
    expect(document.querySelector('.scene-fallback')).toBeTruthy();
    expect(screen.getByText(/CENA 3D EM TEMPO REAL/)).toBeTruthy();
    expect(screen.getAllByText(/THE HEART OF CHESS/).length).toBeGreaterThan(0);
  });

  it('renderiza as doze seções com seu próprio título', () => {
    for (const page of pages) {
      cleanup();
      window.location.hash = `#/${page.id}`;
      render(<App />);
      if (page.id === 'inicio') {
        expect(screen.getByRole('heading', { name: /O jogo começa/ })).toBeTruthy();
      } else if (page.id === 'jogar') {
        expect(screen.getByRole('heading', { name: 'Partida no tabuleiro' })).toBeTruthy();
      } else if (page.id === 'perfil') {
        expect(screen.getByRole('heading', { name: 'Jogador demo' })).toBeTruthy();
      } else {
        expect(screen.getByRole('heading', { name: page.title })).toBeTruthy();
      }
    }
  });

  it('apresenta o tabuleiro ilustrativo de quebra-cabeças e resolve uma dica', () => {
    window.location.hash = '#/quebra-cabecas';
    render(<App />);
    expect(screen.getByRole('img', { name: /Tabuleiro ilustrativo/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Pedir dica/ }));
    expect(screen.getByText(/diagonal a2–g8/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Resolver/ }));
    expect(screen.getByRole('status').textContent).toMatch(/demonstrativa/);
  });

  it('abre o modal demonstrativo de adicionar amigo', () => {
    window.location.hash = '#/amigos';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Adicionar/ }));
    const dialog = screen.getByRole('dialog', { name: 'Adicionar amigo' });
    fireEvent.change(within(dialog).getByPlaceholderText(/Ana Beatriz/), { target: { value: 'Novo Amigo' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /Enviar convite/ }));
    expect(screen.getByRole('status').textContent).toMatch(/demonstrativo/);
  });

  it('aplica o acento visual escolhido nas configurações', () => {
    window.location.hash = '#/configuracoes';
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Céu/ }));
    expect(document.documentElement.dataset.accent).toBe('sky');
    expect(window.localStorage.getItem('cc-accent')).toBe('sky');
  });

  it('permite fixar a qualidade da cena 3D', () => {
    window.location.hash = '#/configuracoes';
    render(<App />);
    fireEvent.click(screen.getByRole('radio', { name: /Baixa/ }));
    expect(window.localStorage.getItem('cc-quality')).toBe('low');
  });

  it('mantém o gráfico de avaliação e a tabela de classificação', () => {
    window.location.hash = '#/analise';
    const { container } = render(<App />);
    expect(container.querySelector('.eval-chart svg')).toBeTruthy();
    window.location.hash = '#/torneios';
    cleanup();
    render(<App />);
    expect(screen.getByText(/Copa CHESS CORE/)).toBeTruthy();
    expect(screen.getByText(/Tabela/)).toBeTruthy();
  });
});
