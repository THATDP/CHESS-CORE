import { Component, useState } from 'react';
import type { ReactNode } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Scene, cameraPresets } from './Scene';
import type { SceneProps, SceneVariant } from './Scene';
import { SceneFallback } from '../components/SceneFallback';
import {
  devicePixelRatioCap, usePrefersReducedMotion, useQualityTier, webglSupported,
} from './quality';

type BoundaryProps = { children: ReactNode; onError: () => void };
class WebGLBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export type ChessCanvasProps = Omit<SceneProps, 'quality' | 'reducedMotion'> & {
  className?: string;
};

/**
 * Lazy-loaded real-time 3D scene. Pages wrap it in <Suspense> with the
 * lightweight poster as a fallback; this component also keeps the poster
 * behind the canvas so the transition into WebGL is seamless.
 */
export default function ChessCanvas({ className, variant = 'hero', ...props }: ChessCanvasProps) {
  const quality = useQualityTier();
  const reducedMotion = usePrefersReducedMotion();
  const [supported, setSupported] = useState(() => webglSupported());
  const [ready, setReady] = useState(false);
  const preset = cameraPresets[variant];

  const dpr = devicePixelRatioCap(quality);

  return (
    <div className={`chess-canvas ${className ?? ''}`} data-ready={ready}>
      <SceneFallback variant={variant as SceneVariant} />
      {supported && (
        <WebGLBoundary onError={() => setSupported(false)}>
          <Canvas
            style={{ position: 'absolute', inset: 0 }}
            shadows={quality !== 'low'}
            dpr={dpr}
            camera={{ fov: preset.fov, near: 0.1, far: 160, position: preset.position }}
            gl={{
              antialias: false,
              alpha: false,
              stencil: false,
              powerPreference: 'high-performance',
            }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.06;
              setReady(true);
            }}
          >
            <Scene
              variant={variant}
              quality={quality}
              reducedMotion={reducedMotion}
              {...props}
            />
          </Canvas>
        </WebGLBoundary>
      )}
    </div>
  );
}

