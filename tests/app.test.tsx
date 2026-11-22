import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/app/App';
import { pages } from '../src/app/navigation';

afterEach(() => { cleanup(); window.location.hash = ''; });
describe('interface demonstrativa', () => {
  it('mostra o painel, exemplos fictícios e um tabuleiro não interativo', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Bom ter você por aqui/ })).toBeTruthy();
    expect(screen.getByText(/Exemplos fictícios/)).toBeTruthy();
    expect(screen.getByRole('img', { name: /posição inicial; não interativo/ })).toBeTruthy();
  });
  it('disponibiliza todas as seções por links hash compatíveis com Pages', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: 'Navegação principal' });
    for (const page of pages.slice(0, 10)) expect(within(nav).getByRole('link', { name: page.label }).getAttribute('href')).toBe(`#/${page.id}`);
  });
  it('abre o menu demonstrativo de perfil e permite recolher a barra', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Jogador demo/ }));
    expect(screen.getByText(/perfil é fictício/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Recolher barra lateral' }));
    expect(screen.getByRole('button', { name: 'Expandir barra lateral' })).toBeTruthy();
  });
  it('altera a página quando a navegação hash muda', () => {
    vi.stubGlobal('scrollTo', vi.fn());
    render(<App />);
    window.location.hash = '#/analise';
    fireEvent(window, new HashChangeEvent('hashchange'));
    expect(screen.getByRole('heading', { name: 'Cada jogada tem uma história.' })).toBeTruthy();
    vi.unstubAllGlobals();
  });
  it('apresenta página planejada ao carregar uma rota hash', () => {
    window.location.hash = '#/torneios';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Seu próximo grande desafio.' })).toBeTruthy();
    expect(screen.getByText(/ainda não estão disponíveis/)).toBeTruthy();
  });
});
