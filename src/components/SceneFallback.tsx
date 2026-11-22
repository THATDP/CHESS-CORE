import { PieceIcon } from './PieceIcon';
import type { PieceRole } from '../three/arrangements';
import type { SceneVariant } from '../three/Scene';

type PlacedPiece = {
  role: PieceRole;
  side: 'light' | 'dark';
  left: string;
  bottom: string;
  size: number;
  opacity: number;
};

const PIECES: PlacedPiece[] = [
  { role: 'queen', side: 'light', left: '12%', bottom: '26%', size: 92, opacity: 0.95 },
  { role: 'king', side: 'dark', left: '26%', bottom: '18%', size: 78, opacity: 0.9 },
  { role: 'knight', side: 'light', left: '40%', bottom: '30%', size: 66, opacity: 0.85 },
  { role: 'bishop', side: 'dark', left: '55%', bottom: '16%', size: 70, opacity: 0.8 },
  { role: 'rook', side: 'light', left: '68%', bottom: '26%', size: 74, opacity: 0.85 },
  { role: 'pawn', side: 'dark', left: '82%', bottom: '12%', size: 52, opacity: 0.7 },
];

/**
 * Lightweight poster shown while the WebGL scene loads, and as the graceful
 * fallback on devices without WebGL. It is a real CSS 3D composition, not a
 * photograph.
 */
export function SceneFallback({ variant = 'hero' }: { variant?: SceneVariant }) {
  return (
    <div className={`scene-fallback scene-fallback--${variant}`} aria-hidden="true">
      <div className="scene-fallback__haze scene-fallback__haze--emerald" />
      <div className="scene-fallback__haze scene-fallback__haze--warm" />

      <div className="scene-fallback__board">
        <div className="scene-fallback__grid">
          {Array.from({ length: 64 }, (_, index) => {
            const row = Math.floor(index / 8);
            const col = index % 8;
            const dark = (row + col) % 2 === 1;
            return <span key={index} className={dark ? 'is-dark' : 'is-light'} />;
          })}
        </div>
        <div className="scene-fallback__board-frame" />
        <div className="scene-fallback__board-glow" />
      </div>

      {PIECES.map((piece) => (
        <span
          key={`${piece.role}-${piece.side}`}
          className="scene-fallback__slot"
          style={{ left: piece.left, bottom: piece.bottom, opacity: piece.opacity }}
        >
          <PieceIcon
            role={piece.role}
            size={piece.size}
            className={`scene-fallback__piece scene-fallback__piece--${piece.side}`}
          />
        </span>
      ))}

      <div className="scene-fallback__vignette" />
    </div>
  );
}
