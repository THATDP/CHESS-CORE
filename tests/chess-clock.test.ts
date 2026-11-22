import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChessClock, formatClock } from '../src/chess/game/clock';
import { timeControlById } from '../src/chess/game/types';

describe('formatClock', () => {
  it('formata minutos e segundos', () => {
    expect(formatClock(0)).toBe('0:00');
    expect(formatClock(999)).toBe('0:01');
    expect(formatClock(60_000)).toBe('1:00');
    expect(formatClock(599_000)).toBe('9:59');
  });

  it('inclui horas acima de sessenta minutos', () => {
    expect(formatClock(3_661_000)).toBe('1:01:01');
  });

  it('nunca mostra valor negativo', () => {
    expect(formatClock(-500)).toBe('0:00');
  });
});

describe('relógio com limite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia com o tempo do controle escolhido', () => {
    const clock = new ChessClock({
      control: timeControlById('3+0'),
      hasLimit: true,
      onFlag: () => {},
    });
    const snapshot = clock.snapshot();
    expect(snapshot.white).toBe(180_000);
    expect(snapshot.black).toBe(180_000);
    expect(snapshot.active).toBe('white');
    expect(snapshot.running).toBe(false);
    clock.dispose();
  });

  it('desconta o tempo do lado ativo', () => {
    const clock = new ChessClock({
      control: timeControlById('3+0'),
      hasLimit: true,
      onFlag: () => {},
    });
    clock.start();
    vi.advanceTimersByTime(5_000);
    expect(clock.snapshot().white).toBeLessThanOrEqual(175_000);
    expect(clock.snapshot().white).toBeGreaterThan(170_000);
    clock.dispose();
  });

  it('aplica o incremento ao lado que jogou', () => {
    const clock = new ChessClock({
      control: timeControlById('3+2'),
      hasLimit: true,
      onFlag: () => {},
    });
    clock.start();
    vi.advanceTimersByTime(4_000);
    clock.applyMove('white');
    const snapshot = clock.snapshot();
    // 180s - 4s + 2s de incremento.
    expect(Math.round(snapshot.white / 1000)).toBe(178);
    expect(snapshot.active).toBe('black');
    clock.dispose();
  });

  it('para o tempo do adversário depois do lance', () => {
    const clock = new ChessClock({
      control: timeControlById('3+0'),
      hasLimit: true,
      onFlag: () => {},
    });
    clock.start();
    vi.advanceTimersByTime(3_000);
    clock.applyMove('white');
    const after = clock.snapshot().white;
    vi.advanceTimersByTime(3_000);
    expect(clock.snapshot().white).toBe(after);
    expect(clock.snapshot().black).toBeLessThan(180_000);
    clock.dispose();
  });

  it('declara fim por tempo quando o tempo zera', () => {
    const onFlag = vi.fn();
    const clock = new ChessClock({
      control: timeControlById('1+0'),
      hasLimit: true,
      onFlag,
    });
    clock.start();
    vi.advanceTimersByTime(61_000);
    expect(onFlag).toHaveBeenCalledWith('black');
    expect(clock.snapshot().running).toBe(false);
    clock.dispose();
  });

  it('não estoura o tempo quando está pausado', () => {
    const onFlag = vi.fn();
    const clock = new ChessClock({
      control: timeControlById('1+0'),
      hasLimit: true,
      onFlag,
    });
    clock.start();
    clock.pause();
    vi.advanceTimersByTime(120_000);
    expect(onFlag).not.toHaveBeenCalled();
    clock.dispose();
  });
});

describe('relógio sem limite', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('conta para cima apenas para exibição', () => {
    const clock = new ChessClock({
      control: timeControlById('sem-limite'),
      hasLimit: false,
      onFlag: () => {},
    });
    clock.setRunning('white', true);
    vi.advanceTimersByTime(2_000);
    expect(clock.snapshot().white).toBeGreaterThan(1_500);
    expect(clock.snapshot().active).toBe('white');
    clock.dispose();
  });

  it('alterna o lado após um lance', () => {
    const clock = new ChessClock({
      control: timeControlById('sem-limite'),
      hasLimit: false,
      onFlag: () => {},
    });
    clock.setRunning('white', true);
    vi.advanceTimersByTime(1_000);
    clock.applyMove('white');
    const white = clock.snapshot().white;
    vi.advanceTimersByTime(1_000);
    expect(clock.snapshot().white).toBe(white);
    expect(clock.snapshot().black).toBeGreaterThan(500);
    clock.dispose();
  });

  it('nunca dispara fim por tempo', () => {
    const onFlag = vi.fn();
    const clock = new ChessClock({
      control: timeControlById('sem-limite'),
      hasLimit: false,
      onFlag,
    });
    clock.setRunning('white', true);
    vi.advanceTimersByTime(600_000);
    expect(onFlag).not.toHaveBeenCalled();
    clock.dispose();
  });
});
