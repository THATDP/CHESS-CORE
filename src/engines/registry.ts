/**
 * Registro de engines.
 *
 * Nenhuma engine é baixada nesta fase: o registro só descreve o que existirá.
 * Novas engines entram por aqui (uma entrada + um adaptador), sem tocar em
 * tabuleiro, regras ou interface de partida.
 */
import type { ChessEngine, EngineInfo } from './protocol';

export type EngineDefinition = {
  info: EngineInfo;
  /** Fábrica sob demanda: só é chamada quando o jogador escolhe a engine. */
  create: () => ChessEngine;
};

const definitions = new Map<string, EngineDefinition>();

export function registerEngine(definition: EngineDefinition): void {
  definitions.set(definition.info.id, definition);
}

export function unregisterEngine(id: string): void {
  definitions.delete(id);
}

export function getEngineDefinition(id: string): EngineDefinition | null {
  return definitions.get(id) ?? null;
}

export function listEngines(): EngineInfo[] {
  return [...definitions.values()].map((definition) => definition.info);
}

export function engineIds(): string[] {
  return [...definitions.keys()];
}

/**
 * Instancia uma engine por id, sem carregar binário nenhum — o carregamento
 * acontece em `load()`. Retorna `null` quando o id não existe.
 */
export function createEngine(id: string): ChessEngine | null {
  const definition = definitions.get(id);
  return definition ? definition.create() : null;
}

/**
 * Engines planejadas (Fase 5). O `asset` é o nome do artefato WASM/Web
 * Worker que será publicado no site; nada é baixado antes da escolha.
 */
export const PLANNED_ENGINES: EngineInfo[] = [
  { id: 'stockfish', name: 'Stockfish', protocol: 'uci', asset: 'stockfish.wasm' },
  { id: 'leela-chess-zero', name: 'Leela Chess Zero', protocol: 'custom', asset: 'lc0.wasm' },
  { id: 'berserk', name: 'Berserk', protocol: 'uci', asset: 'berserk.wasm' },
  { id: 'koivisto', name: 'Koivisto', protocol: 'uci', asset: 'koivisto.wasm' },
  { id: 'arasan', name: 'Arasan', protocol: 'uci', asset: 'arasan.wasm' },
  { id: 'lozza', name: 'Lozza', protocol: 'uci', asset: 'lozza.wasm' },
  { id: 'rodent-iv', name: 'Rodent IV', protocol: 'uci', asset: 'rodent4.wasm' },
  { id: 'fairy-stockfish', name: 'Fairy-Stockfish', protocol: 'uci', asset: 'fairy-stockfish.wasm' },
];

/** Se um id está na lista de engines planejadas. */
export function isPlannedEngine(id: string): boolean {
  return PLANNED_ENGINES.some((engine) => engine.id === id);
}
