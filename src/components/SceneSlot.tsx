import { useEffect, useRef, useState } from 'react';
import type { ChessCanvasProps } from '../three/ChessCanvas';
import { Scene } from './Scene';
import { useSceneEnabled } from '../app/preferences';
import { SceneFallback } from './SceneFallback';

/**
 * Mounts the WebGL scene only when the slot approaches the viewport, so
 * pages with several compositions stay cheap. Until then (and if WebGL is
 * unavailable) the crafted poster carries the visual.
 */
export function SceneSlot({ className = '', ...props }: ChessCanvasProps) {
  const sceneEnabled = useSceneEnabled();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: '260px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scene-slot ${className}`}>
      <SceneFallback variant={props.variant} />
      {!sceneEnabled && (
        <span className="scene-slot__note">Cena 3D desativada nas configurações.</span>
      )}
      {active && sceneEnabled && <Scene {...props} />}
    </div>
  );
}
