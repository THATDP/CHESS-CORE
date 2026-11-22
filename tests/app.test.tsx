import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/app/App';
import { pages } from '../src/app/navigation';

afterEach(() => { cleanup(); window.location.hash = ''; vi.unstubAllGlobals(); });
describe('interface demonstrativa', () => {
  it('apresenta uma experiência imersiva e acesso à configuração', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /O jogo começa/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Preparar partida/ }).getAttribute('href')).toBe('#/jogar');
    expect(screen.getByText(/em construção/)).toBeTruthy();
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
  });
  it('apresenta página planejada ao carregar uma rota hash', () => {
    window.location.hash = '#/torneios';
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Seu próximo grande desafio.' })).toBeTruthy();
    expect(screen.getByText(/ainda não estão disponíveis/)).toBeTruthy();
  });
  it('permite selecionar opções demonstrativas sem iniciar partida', () => {
    window.location.hash = '#/jogar';
    render(<App />);
    expect((screen.getByRole('radio', { name: /Qualquer pessoa/ }) as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole('radio', { name: /Um amigo/ }));
    fireEvent.click(screen.getByRole('radio', { name: /Variantes futuras/ }));
    fireEvent.click(screen.getByRole('radio', { name: /Blitz/ }));
    expect((screen.getByRole('radio', { name: /Um amigo/ }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: /Variantes futuras/ }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: /Blitz/ }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('radio', { name: /Rapid/ }) as HTMLInputElement).checked).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Jogar' }));
    expect(screen.getByRole('status').textContent).toMatch(/partidas ainda não estão disponíveis/);
  });
});
