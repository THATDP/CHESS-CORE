import { lazy, Suspense } from 'react';
import type { ChessCanvasProps } from '../three/ChessCanvas';
import { SceneFallback } from './SceneFallback';

const ChessCanvas = lazy(() => import('../three/ChessCanvas'));

/**
 * Lazy boundary so the WebGL scene (three.js, R3F, post-processing) is a
 * separate chunk and never blocks first paint. The poster holds the frame
 * until the scene is ready.
 */
export function Scene(props: ChessCanvasProps) {
  return (
    <Suspense fallback={<SceneFallback variant={props.variant} />}>
      <ChessCanvas {...props} />
    </Suspense>
  );
}
