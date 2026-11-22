/**
 * Tabuleiro 2D (CSS + SVG), sem nenhum renderer 3D.
 *
 * Regras ficam em `src/chess/*`; aqui só há apresentação: casas, peças,
 * destaques de lance legal, última jogada, xeque e orientação.
 */
import { useCallback, useMemo } from 'react';
import type { Square } from 'chess.js';
import { PieceIcon } from './PieceIcon';
import type { PieceRole } from '../three/arrangements';

export type BoardPiece = {
  square: Square;
  role: PieceRole;
  color: 'white' | 'black';
};

export type ChessBoardProps = {
  pieces: BoardPiece[];
  /** `white` mostra a1 no canto inferior esquerdo. */
  orientation: 'white' | 'black';
  coordinates?: boolean;
  selected?: Square | null;
  legalTargets?: Square[];
  lastMove?: { from: Square; to: Square } | null;
  /** Casa do rei em xeque. */
  checkSquare?: Square | null;
  /** Peças bloqueadas por um pedido de promoção em aberto. */
  locked?: boolean;
  onSquareClick?: (square: Square) => void;
  /** Arrastar: origem e destino em casas. */
  onDropMove?: (from: Square, to: Square) => void;
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const;

export function ChessBoard({
  pieces,
  orientation,
  coordinates = true,
  selected = null,
  legalTargets = [],
  lastMove = null,
  checkSquare = null,
  locked = false,
  onSquareClick,
  onDropMove,
}: ChessBoardProps) {
  const files = orientation === 'white' ? FILES : [...FILES].reverse();
  const ranks = orientation === 'white' ? RANKS : [...RANKS].reverse();

  const pieceBySquare = useMemo(() => {
    const map = new Map<Square, BoardPiece>();
    for (const piece of pieces) map.set(piece.square, piece);
    return map;
  }, [pieces]);

  const legalSet = useMemo(() => new Set(legalTargets), [legalTargets]);

  const handleClick = useCallback((square: Square) => {
    onSquareClick?.(square);
  }, [onSquareClick]);

  const handleDragStart = useCallback((event: React.DragEvent, square: Square) => {
    event.dataTransfer.setData('text/plain', square);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDrop = useCallback((event: React.DragEvent, square: Square) => {
    event.preventDefault();
    const from = event.dataTransfer.getData('text/plain') as Square;
    if (from && from !== square) onDropMove?.(from, square);
  }, [onDropMove]);

  const cells: React.ReactNode[] = [];
  ranks.forEach((rank, rankIndex) => {
    files.forEach((file, fileIndex) => {
      const square = `${file}${rank}` as Square;
      const piece = pieceBySquare.get(square);
      // A cor da casa é definida pela geometria do tabuleiro (a1 é escura),
      // e não pela orientação exibida.
      const light = (FILES.indexOf(file) + (8 - Number(rank))) % 2 === 0;
      const isSelected = selected === square;
      const isTarget = legalSet.has(square);
      const isLast = lastMove !== null && (lastMove.from === square || lastMove.to === square);
      const isCheck = checkSquare === square;

      const classes = [
        'board__cell',
        light ? 'board__cell--light' : 'board__cell--dark',
        isSelected ? 'board__cell--selected' : '',
        isLast ? 'board__cell--last' : '',
        isCheck ? 'board__cell--check' : '',
        piece ? 'board__cell--occupied' : '',
        isTarget ? 'board__cell--target' : '',
        locked ? 'board__cell--locked' : '',
      ].filter(Boolean).join(' ');

      cells.push(
        <div
          key={square}
          className={classes}
          data-square={square}
          role="button"
          tabIndex={0}
          aria-label={`${square}${piece ? ` ${piece.color} ${piece.role}` : ''}`}
          onClick={() => handleClick(square)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              handleClick(square);
            }
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, square)}
        >
          {isTarget && (
            <span className="board__hint" aria-hidden="true">
              {piece ? <span className="board__hint-ring" /> : <span className="board__hint-dot" />}
            </span>
          )}
          {piece && (
            <span
              className="board__piece"
              draggable={!locked}
              onDragStart={(event) => handleDragStart(event, square)}
            >
              <PieceIcon role={piece.role} color={piece.color} />
            </span>
          )}
          {coordinates && fileIndex === 0 && (
            <span className={`board__coord board__coord--rank ${light ? 'is-light' : 'is-dark'}`}>{rank}</span>
          )}
          {coordinates && rankIndex === ranks.length - 1 && (
            <span className={`board__coord board__coord--file ${light ? 'is-light' : 'is-dark'}`}>{file}</span>
          )}
          {isSelected && <span className="board__selection" aria-hidden="true" />}
        </div>,
      );
    });
  });

  return (
    <div className={`board board--${orientation}`} data-testid="board" data-orientation={orientation}>
      <div className="board__grid" role="group" aria-label="Tabuleiro">{cells}</div>
      <div className="board__frame" aria-hidden="true" />
    </div>
  );
}
