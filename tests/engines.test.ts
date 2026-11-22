import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerEngine,
  unregisterEngine,
  getEngineDefinition,
  listEngines,
  engineIds,
  createEngine,
  PLANNED_ENGINES,
  isPlannedEngine,
  localController,
  parseEngineMove,
} from '../src/engines';
import type { ChessEngine, EngineInfo } from '../src/engines';

const INFO: EngineInfo = { id: 'motor-teste', name: 'Motor de Teste', protocol: 'uci' };

function fakeEngine(info: EngineInfo = INFO): ChessEngine {
  return {
    info,
    status: 'idle',
    supported: true,
    error: null,
    async load() {},
    dispose() {},
    async requestMove() {
      return { uci: 'e2e4', from: 'e2', to: 'e4' };
    },
  };
}

describe('registro de engines', () => {
  beforeEach(() => {
    unregisterEngine('motor-teste');
  });

  it('registra e lista engines', () => {
    registerEngine({ info: INFO, create: fakeEngine });
    expect(engineIds()).toContain('motor-teste');
    expect(listEngines().map((engine) => engine.id)).toContain('motor-teste');
    expect(getEngineDefinition('motor-teste')?.info.name).toBe('Motor de Teste');
  });

  it('instancia apenas engines registradas', () => {
    registerEngine({ info: INFO, create: fakeEngine });
    expect(createEngine('motor-teste')).not.toBeNull();
    expect(createEngine('inexistente')).toBeNull();
  });

  it('remove engines do registro', () => {
    registerEngine({ info: INFO, create: fakeEngine });
    unregisterEngine('motor-teste');
    expect(getEngineDefinition('motor-teste')).toBeNull();
    expect(engineIds()).not.toContain('motor-teste');
  });

  it('não baixa nenhuma engine ao importar o módulo', () => {
    // O registro começa vazio: nada é baixado antecipadamente.
    expect(engineIds()).toEqual([]);
    expect(PLANNED_ENGINES.length).toBeGreaterThan(0);
  });

  it('descreve as engines planejadas para a Fase 5', () => {
    const ids = PLANNED_ENGINES.map((engine) => engine.id);
    for (const id of ['stockfish', 'leela-chess-zero', 'berserk', 'koivisto', 'arasan', 'lozza', 'rodent-iv', 'fairy-stockfish']) {
      expect(ids).toContain(id);
      expect(isPlannedEngine(id)).toBe(true);
    }
    // UCI é o protocolo padrão; Leela usa protocolo próprio.
    const uci = PLANNED_ENGINES.filter((engine) => engine.protocol === 'uci').map((engine) => engine.id);
    expect(uci).toContain('stockfish');
    expect(PLANNED_ENGINES.find((engine) => engine.id === 'leela-chess-zero')?.protocol).toBe('custom');
  });

  it('carrega cada engine individualmente, sob demanda', async () => {
    const created: string[] = [];
    registerEngine({
      info: INFO,
      create: () => {
        created.push('criada');
        return fakeEngine();
      },
    });
    expect(created).toHaveLength(0);
    const engine = createEngine('motor-teste');
    expect(created).toHaveLength(1);
    await engine?.load();
    expect(engine?.status).toBe('idle');
    engine?.dispose();
  });
});

describe('controller local', () => {
  it('joga dois humanos no mesmo dispositivo sem engine', async () => {
    const controller = localController();
    expect(controller.supported).toBe(true);
    expect(controller.info.protocol).toBe('custom');
    await expect(controller.requestMove()).resolves.toBeNull();
    await controller.load();
    controller.dispose();
  });
});

describe('normalização de lances', () => {
  it('converte notação UCI para casas', () => {
    expect(parseEngineMove('e2e4')).toEqual({ from: 'e2', to: 'e4', promotion: undefined });
    expect(parseEngineMove('e7e8q')).toEqual({ from: 'e7', to: 'e8', promotion: 'q' });
    expect(parseEngineMove('  g1f3 ')).toEqual({ from: 'g1', to: 'f3', promotion: undefined });
  });

  it('rejeita lances inválidos', () => {
    expect(parseEngineMove('e2')).toBeNull();
    expect(parseEngineMove('e9e4')).toBeNull();
    expect(parseEngineMove('zzzz')).toBeNull();
    expect(parseEngineMove('')).toBeNull();
    expect(parseEngineMove('e2e4x')).toBeNull();
  });
});
