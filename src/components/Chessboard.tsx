const black = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];
const white = ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'];
const files = 'abcdefgh';

/** Static initial position only. This component deliberately has no chess logic. */
export function Chessboard() {
  return <div className="board" role="img" aria-label="Tabuleiro ilustrativo na posição inicial; não interativo">
    {Array.from({ length: 64 }, (_, index) => {
      const row = Math.floor(index / 8); const col = index % 8;
      const piece = row === 0 ? black[col] : row === 1 ? '♟' : row === 6 ? '♙' : row === 7 ? white[col] : '';
      const dark = (row + col) % 2 === 1;
      return <div className={`square ${dark ? 'square--dark' : 'square--light'}`} key={index}>
        {col === 0 && <span className="rank">{8 - row}</span>}
        {row === 7 && <span className="file">{files[col]}</span>}
        {piece && <span className={`piece ${row < 2 ? 'piece--black' : 'piece--white'}`}>{piece}</span>}
      </div>;
    })}
  </div>;
}
