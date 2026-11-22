import type { ReactNode } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Scene } from '../src/three/Scene';

/**
 * The scene builds its surfaces on a 2D canvas. In jsdom that API is absent,
 * so the texture module is replaced by plain three textures; the geometry,
 * materials, lights and graph are still exercised for real.
 */
vi.mock('../src/three/textures', async () => {
  const THREE = await import('three');
  const stub = () => new THREE.Texture();
  return {
    woodTexture: stub,
    marbleTexture: stub,
    microSurfaceTexture: stub,
    glowTexture: stub,
    shaftTexture: stub,
    gridTexture: stub,
    mulberry32: () => () => 0.5,
  };
});

// Pós-processamento exige um contexto WebGL real; aqui ele só precisa montar.
vi.mock('@react-three/postprocessing', async () => {
  const passthrough = (name: string) => {
    const Component = ({ children }: { children?: ReactNode }) => (
      <group name={name}>{children}</group>
    );
    Component.displayName = name;
    return Component;
  };
  return {
    EffectComposer: passthrough('EffectComposer'),
    Bloom: passthrough('Bloom'),
    Noise: passthrough('Noise'),
    Vignette: passthrough('Vignette'),
    SMAA: passthrough('SMAA'),
  };
});

beforeAll(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: false, addListener: () => undefined, removeListener: () => undefined }));
});

describe('cena 3D', () => {
  it('monta a composição do hero sem erros', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Scene variant="hero" quality="low" reducedMotion />,
    );
    const meshes = renderer.scene.findAll((node) => node.type === 'Mesh');
    expect(meshes.length).toBeGreaterThan(60);
    const lights = renderer.scene.findAll((node) => node.type === 'SpotLight' || node.type === 'PointLight');
    expect(lights.length).toBeGreaterThanOrEqual(3);
    await renderer.unmount();
  });

  it('monta a cena de tabuleiro com peças e destaque', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Scene variant="board" quality="medium" reducedMotion interactive selectedSquares={[27, 35]} />,
    );
    const meshes = renderer.scene.findAll((node) => node.type === 'Mesh');
    expect(meshes.length).toBeGreaterThan(60);
    await renderer.unmount();
  });

  it('monta a cena ambiente com peças flutuantes', async () => {
    const renderer = await ReactThreeTestRenderer.create(
      <Scene variant="ambient" quality="high" reducedMotion />,
    );
    expect(renderer.scene.findAll((node) => node.type === 'Points').length).toBe(1);
    await renderer.unmount();
  });
});
