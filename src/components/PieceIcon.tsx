import { useMemo } from 'react';
import type { PieceRole } from '../three/arrangements';
import {
  BISHOP, KING, KNIGHT_OUTLINE, PAWN, QUEEN, ROOK,
} from '../three/pieces';

type Control = [number, number];

const PROFILES: Record<PieceRole, Control[]> = {
  pawn: PAWN,
  rook: ROOK,
  bishop: BISHOP,
  queen: QUEEN,
  king: KING,
  knight: KNIGHT_OUTLINE,
};

const HEIGHT: Record<PieceRole, number> = {
  pawn: 0.79, rook: 1.13, bishop: 1.31, queen: 1.55, king: 1.62, knight: 0.99,
};

/**
 * Vector silhouettes derived from the same lathe profiles used by the 3D
 * pieces, so the 2D interface and the real-time scene share one identity.
 */
function bodyPath(role: PieceRole, size: number): string {
  const profile = PROFILES[role];
  const base = size * 0.95;
  const cx = size / 2;

  if (role === 'knight') {
    const scale = (size * 0.9) / 0.94;
    const points = KNIGHT_OUTLINE.map(
      ([x, y]) => `${(cx + x * scale).toFixed(2)} ${(base - y * scale).toFixed(2)}`,
    );
    return `M${points.join('L')}Z`;
  }

  const scale = (size * 0.86) / HEIGHT[role];
  const right = profile.map(([x, y]) => `${(cx + x * scale).toFixed(2)} ${(base - y * scale).toFixed(2)}`);
  const left = profile
    .slice()
    .reverse()
    .map(([x, y]) => `${(cx - x * scale).toFixed(2)} ${(base - y * scale).toFixed(2)}`);
  return `M${[...right, ...left].join('L')}Z`;
}

function extras(role: PieceRole, size: number) {
  const cx = size / 2;
  const base = size * 0.95;
  const scale = (size * 0.86) / HEIGHT[role];

  if (role === 'king') {
    const top = base - 1.4 * scale;
    return (
      <>
        <rect x={cx - size * 0.028} y={top - size * 0.2} width={size * 0.056} height={size * 0.22} />
        <rect x={cx - size * 0.1} y={top - size * 0.155} width={size * 0.2} height={size * 0.055} />
      </>
    );
  }

  if (role === 'rook') {
    const top = base - 1.0 * scale;
    const width = size * 0.085;
    return (
      <>
        <rect x={cx - size * 0.21} y={top - size * 0.075} width={width} height={size * 0.09} />
        <rect x={cx - width / 2} y={top - size * 0.075} width={width} height={size * 0.09} />
        <rect x={cx + size * 0.21 - width} y={top - size * 0.075} width={width} height={size * 0.09} />
      </>
    );
  }

  if (role === 'queen') {
    const rimY = base - 1.19 * scale;
    const radius = 0.275 * scale;
    const balls = [0, 1, 2, 3, 4].map((index) => {
      const angle = (index / 5) * Math.PI * 2;
      return (
        <circle
          key={index}
          cx={cx + Math.cos(angle) * radius}
          cy={rimY + Math.sin(angle) * radius * 0.35}
          r={size * 0.028}
        />
      );
    });
    return (
      <>
        {balls}
        <circle cx={cx} cy={base - 1.44 * scale} r={size * 0.045} />
      </>
    );
  }

  if (role === 'bishop') {
    return <circle cx={cx} cy={base - 1.25 * scale} r={size * 0.045} />;
  }

  return null;
}

export type PieceIconProps = {
  role: PieceRole;
  /** Cor da peça: define o tema (marfim para brancas, nogueira para pretas). */
  color?: 'white' | 'black';
  className?: string;
  size?: number;
  title?: string;
};

export function PieceIcon({ role, color, className, size = 32, title }: PieceIconProps) {
  const path = useMemo(() => bodyPath(role, 32), [role]);
  const extra = useMemo(() => extras(role, 32), [role]);
  const classes = [
    className ?? '',
    color ? `piece-icon--${color}` : '',
  ].filter(Boolean).join(' ');
  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={path} className="piece-icon__body" />
      {extra}
    </svg>
  );
}
