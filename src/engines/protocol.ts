/**
 * Contrato de motor de xadrez.
 *
 * A interface é deliberadamente pequena: uma engine recebe uma posição (FEN),
 * devolve um lance em notação de casas (`e2e4`, `e7e8q`) e sabe carregar e
 * encerrar os próprios recursos. Regras oficiais NÃO vivem aqui — a partida
 * continua sendo validada por `src/chess/rules.ts`, nunca pela engine.
 *
 * Na Fase 5, `UciEngine` fala UCI por cima de um Worker com WebAssembly;
 * `Lc0Engine` pode falar outro protocolo. Todas implementam este mesmo
 * contrato, e o registro abaixo é o único lugar que conhece os nomes.
 */
export type EngineProtocol = 'uci' | 'custom';

export type EngineMove = {
  /** Notação de casas, ex.: `e2e4`, `e7e8q`. */
  uci: string;
  /** Peça promovida, se houver. */
  promotion?: 'q' | 'r' | 'b' | 'n';
  from: string;
  to: string;
};

export type EngineOptions = {
  /** Tempo de reflexão. `null` quando a engine decide o próprio tempo. */
  movetime: number | null;
  /** Limites de tempo, quando a engine usa relógio. */
  whiteTime?: number;
  blackTime?: number;
  whiteIncrement?: number;
  blackIncrement?: number;
  /** Profundidade máxima, se a engine aceitar. */
  depth?: number | null;
};

export type EngineInfo = {
  id: string;
  name: string;
  /** Protocolo usado para falar com a engine. */
  protocol: EngineProtocol;
  /** Versão declarada pela engine. */
  version?: string;
  /** Caminho do artefato WASM (nenhum asset é baixado nesta fase). */
  asset?: string;
};

export type EngineStatus = 'idle' | 'loading' | 'ready' | 'thinking' | 'error';

export interface ChessEngine {
  readonly info: EngineInfo;
  readonly status: EngineStatus;
  readonly supported: boolean;
  /** Mensagem de erro quando `status === 'error'`. */
  readonly error: string | null;

  /** Carrega o binário/worker. Falha silenciosa: `status` vira `error`. */
  load(): Promise<void>;
  /** Encerra o worker e libera memória. */
  dispose(): void;
  /**
   * Pede um lance para a posição dada. `signal` permite cancelar o pedido
   * (troca de partida, desistência, navegação).
   */
  requestMove(fen: string, options: EngineOptions, signal: AbortSignal): Promise<EngineMove | null>;
  /** Opções de engine (profundidade, threads, hash…) por instância. */
  setOption?(name: string, value: string | number | boolean): void;
}
