import { PieceIcon } from './PieceIcon';
import type { Arrangement } from '../three/arrangements';
import { roleOf, sideOf } from '../three/arrangements';

export type MiniBoardHighlight = { square: number; tone?: 'emerald' | 'rose' | 'amber' };

export function MiniBoard({
  arrangement,
  className = '',
  highlights = [],
  flip = false,
  coordinates = false,
}: {
  arrangement: Arrangement;
  className?: string;
  highlights?: MiniBoardHighlight[];
  flip?: boolean;
  coordinates?: boolean;
}) {
  const files = 'abcdefgh';
  const highlightMap = new Map(highlights.map((item) => [item.square, item.tone ?? 'emerald']));

  const cells = [];
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const r = flip ? 7 - row : row;
      const c = flip ? 7 - col : col;
      const index = r * 8 + c;
      const code = arrangement[index];
      const role = roleOf(code);
      const side = sideOf(code);
      const dark = (r + c) % 2 === 1;
      const tone = highlightMap.get(index);
      cells.push(
        <span
          key={`${row}-${col}`}
          className={[
            'mini-board__cell',
            dark ? 'is-dark' : 'is-light',
            tone ? `is-highlight-${tone}` : '',
          ].filter(Boolean).join(' ')}
        >
          {role && (
            <PieceIcon
              role={role}
              size={40}
              className={`mini-board__piece mini-board__piece--${side === 'white' ? 'light' : 'dark'}`}
            />
          )}
          {coordinates && col === (flip ? 7 : 0) && <span className="mini-board__rank">{8 - r}</span>}
          {coordinates && row === (flip ? 0 : 7) && <span className="mini-board__file">{files[c]}</span>}
        </span>,
      );
    }
  }

  return (
    <div className={`mini-board ${className}`} role="img" aria-label="Tabuleiro ilustrativo de xadrez">
      {cells}
    </div>
  );
}
