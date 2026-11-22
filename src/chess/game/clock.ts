/**
 * Relógio de partida.
 *
 * O tempo é medido por relógio de parede (`performance.now`) em vez de
 * contagens decrescentes, assim o valor exibido continua exato mesmo quando a
 * aba fica em segundo plano. O incremento só é somado ao lado que acabou de
 * jogar, e o tempo do adversário começa a correr em seguida.
 */
import type { TimeControl } from './types';

export type ClockSnapshot = {
  white: number;
  black: number;
  /** Lado cujo tempo está correndo. */
  active: 'white' | 'black' | null;
  running: boolean;
};

export type ClockOptions = {
  control: TimeControl;
  /** `false` para relógios sem limite (o tempo só conta para exibição). */
  hasLimit: boolean;
  onFlag: (winner: 'white' | 'black') => void;
  onTick?: (snapshot: ClockSnapshot) => void;
};

export class ChessClock {
  private white: number;
  private black: number;
  private active: 'white' | 'black' | null = null;
  private running = false;
  private startedAt: number | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private options: ClockOptions;

  constructor(options: ClockOptions) {
    this.options = options;
    const initial = options.control.initial ?? 0;
    this.white = initial * 1000;
    this.black = initial * 1000;
    this.active = 'white';
  }

  /** Começa a partida pelo lado das brancas. */
  start(): void {
    this.begin('white');
  }

  /** Pausa o relógio (ex.: ao desfazer um lance). */
  pause(): void {
    if (!this.running) return;
    this.elapse();
    this.running = false;
    this.clearTimer();
  }

  /** Retoma o tempo do lado ativo. */
  resume(): void {
    if (this.running || this.active === null) return;
    this.running = true;
    this.startedAt = performance.now();
    this.timer = setInterval(() => this.tick(), 250);
  }

  /**
   * Registra o lance do lado `side`: para o tempo dele, aplica o incremento e
   * passa o ponteiro para o adversário, que volta a correr.
   */
  applyMove(side: 'white' | 'black'): void {
    if (this.options.hasLimit) {
      if (this.running) this.elapse();
      if (side === 'white') this.white += this.options.control.increment * 1000;
      else this.black += this.options.control.increment * 1000;
      this.active = side === 'white' ? 'black' : 'white';
      this.running = false;
      this.clearTimer();
      this.options.onTick?.(this.snapshot());
      this.resume();
      return;
    }
    // Sem limite: só troca o ponteiro.
    if (this.running && this.active && this.active !== side) this.elapse();
    this.active = side === 'white' ? 'black' : 'white';
    if (this.running) this.startedAt = performance.now();
    this.options.onTick?.(this.snapshot());
  }

  /** Relógios sem limite: liga/desliga a contagem para exibição. */
  setRunning(side: 'white' | 'black', running: boolean): void {
    if (this.options.hasLimit) return;
    if (running) {
      if (this.running && this.active && this.active !== side) this.elapse();
      this.active = side;
      this.running = true;
      this.startedAt = performance.now();
      if (this.timer === null) this.timer = setInterval(() => this.tick(), 250);
    } else if (this.running) {
      this.elapse();
      this.running = false;
      this.clearTimer();
    }
    this.options.onTick?.(this.snapshot());
  }

  /** Zera o ponteiro (fim de partida). */
  stop(): void {
    this.running = false;
    this.active = null;
    this.clearTimer();
  }

  private begin(side: 'white' | 'black'): void {
    this.stop();
    this.active = side;
    this.resume();
  }

  /** Desconta (ou soma, sem limite) o tempo decorrido do lado ativo. */
  private elapse(): void {
    if (!this.running || this.startedAt === null || this.active === null) return;
    const elapsed = performance.now() - this.startedAt;
    const delta = this.options.hasLimit ? -elapsed : elapsed;
    if (this.active === 'white') this.white = Math.max(0, this.white + delta);
    else this.black = Math.max(0, this.black + delta);
    this.startedAt = performance.now();
  }

  private tick(): void {
    if (!this.running) return;
    this.elapse();
    if (this.active === 'white' && this.white <= 0) return this.flag('black');
    if (this.active === 'black' && this.black <= 0) return this.flag('white');
    this.options.onTick?.(this.snapshot());
  }

  private flag(winner: 'white' | 'black'): void {
    this.stop();
    this.options.onFlag(winner);
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.startedAt = null;
  }

  snapshot(): ClockSnapshot {
    if (!this.running || this.startedAt === null || this.active === null) {
      return { white: this.white, black: this.black, active: this.active, running: this.running };
    }
    const elapsed = performance.now() - this.startedAt;
    const delta = this.options.hasLimit ? -elapsed : elapsed;
    const white = this.active === 'white' ? Math.max(0, this.white + delta) : this.white;
    const black = this.active === 'black' ? Math.max(0, this.black + delta) : this.black;
    return { white, black, active: this.active, running: this.running };
  }

  dispose(): void {
    this.stop();
  }
}

/** Formata milissegundos como `m:ss` (ou `h:mm:ss` acima de uma hora). */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}
