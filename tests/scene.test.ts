import { describe, expect, it } from 'vitest';
import { buildPieceGeometries, PIECE_HEIGHT } from '../src/three/pieces';
import { arrangements, parseArrangement, roleOf, sideOf } from '../src/three/arrangements';

const roles = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'] as const;

describe('geometria das peças', () => {
  for (const role of roles) {
    it(`gera uma silhueta válida para ${role}`, () => {
      const geometries = buildPieceGeometries(role);
      expect(geometries.length).toBeGreaterThan(0);
      const box = geometries[0].boundingBox ?? (geometries[0].computeBoundingBox(), geometries[0].boundingBox)!;
      for (const geometry of geometries) {
        const position = geometry.getAttribute('position');
        expect(position.count).toBeGreaterThanOrEqual(24);
        for (let index = 0; index < position.array.length; index += 1) {
          expect(Number.isFinite(position.array[index])).toBe(true);
        }
        geometry.computeBoundingBox();
        const bounds = geometry.boundingBox!;
        expect(Number.isFinite(bounds.min.y)).toBe(true);
        expect(Number.isFinite(bounds.max.y)).toBe(true);
      }
      expect(box.max.y).toBeGreaterThan(PIECE_HEIGHT[role] * 0.85);
      expect(box.max.y).toBeLessThan(PIECE_HEIGHT[role] * 1.35);
    });
  }

  it('o cavaleiro tem espessura e não é plano', () => {
    const [geometry] = buildPieceGeometries('knight');
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    expect(box.max.z - box.min.z).toBeGreaterThan(0.2);
    expect(box.max.x - box.min.x).toBeGreaterThan(0.4);
  });
});

describe('arranjos demonstrativos', () => {
  it('todos os arranjos têm 64 casas', () => {
    for (const arrangement of Object.values(arrangements)) {
      expect(arrangement.length).toBe(64);
      expect(arrangement.some((code) => roleOf(code) === 'king')).toBe(true);
    }
  });

  it('reconhece lado e papel de cada código', () => {
    expect(sideOf('K')).toBe('white');
    expect(sideOf('q')).toBe('black');
    expect(sideOf('')).toBeNull();
    expect(roleOf('N')).toBe('knight');
    expect(roleOf('b')).toBe('bishop');
  });

  it('rejeita arranjos com tamanho errado', () => {
    expect(() => parseArrangement(['........'])).toThrow();
  });
});
