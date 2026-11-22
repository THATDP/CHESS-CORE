/**
 * Ponto de entrada da camada de engines.
 *
 * Importar este módulo NÃO baixa nenhuma engine: o registro começa vazio e só
 * descreve os motores planejados para a Fase 5. A interface de partida usa
 * `localAdapter()` para o modo de dois humanos no mesmo tabuleiro.
 */
export {
  registerEngine,
  unregisterEngine,
  getEngineDefinition,
  listEngines,
  engineIds,
  createEngine,
  PLANNED_ENGINES,
  isPlannedEngine,
} from './registry';
export type {
  ChessEngine,
  EngineInfo,
  EngineOptions,
  EngineMove,
  EngineProtocol,
  EngineStatus,
} from './protocol';

import type { EngineMove, EngineProtocol, EngineStatus } from './protocol';
import type { Side } from '../chess/game/types';

/** Controller local: dois humanos no mesmo tabuleiro. */
export type LocalController = {
  readonly info: { id: 'local'; name: 'Dois jogadores (este dispositivo)'; protocol: EngineProtocol };
  readonly status: EngineStatus;
  readonly supported: boolean;
  readonly error: null;
  load(): Promise<void>;
  dispose(): void;
  /** Devolve `null`: quem joga é quem está na frente do teclado. */
  requestMove(): Promise<EngineMove | null>;
  play(side: Side, move: EngineMove): void;
};

export function localController(): LocalController {
  return {
    info: { id: 'local', name: 'Dois jogadores (este dispositivo)', protocol: 'custom' },
    status: 'ready',
    supported: true,
    error: null,
    async load() {},
    dispose() {},
    async requestMove() {
      return null;
    },
    play() {},
  };
}

/**
 * Normaliza um lance vindo de uma engine para o formato de casas aceito por
 * `src/chess/rules.ts`. `null` quando o lance não é reconhecível.
 */
export function parseEngineMove(uci: string): { from: string; to: string; promotion?: 'q' | 'r' | 'b' | 'n' } | null {
  const clean = uci.trim().toLowerCase();
  if (clean.length < 4 || clean.length > 5) return null;
  const from = clean.slice(0, 2);
  const to = clean.slice(2, 4);
  const promotion = clean[4];
  if (!/^[a-h][1-8]$/.test(from) || !/^[a-h][1-8]$/.test(to)) return null;
  if (promotion && !['q', 'r', 'b', 'n'].includes(promotion)) return null;
  const promo = promotion as 'q' | 'r' | 'b' | 'n' | undefined;
  return { from, to, promotion: promo };
}
