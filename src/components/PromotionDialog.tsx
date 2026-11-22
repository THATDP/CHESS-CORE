/**
 * Escolha da peça de promoção.
 */
import { PieceIcon } from './PieceIcon';

export type PromotionChoice = 'queen' | 'rook' | 'bishop' | 'knight';

export type PromotionDialogProps = {
  color: 'white' | 'black';
  onChoose: (piece: PromotionChoice) => void;
  onCancel: () => void;
};

const ORDER: PromotionChoice[] = ['queen', 'rook', 'bishop', 'knight'];

const LABELS: Record<PromotionChoice, string> = {
  queen: 'Dama',
  rook: 'Torre',
  bishop: 'Bispo',
  knight: 'Cavalo',
};

export function PromotionDialog({ color, onChoose, onCancel }: PromotionDialogProps) {
  return (
    <div className="promotion" role="dialog" aria-modal="true" aria-label="Promoção do peão">
      <p className="promotion__title">Promover para</p>
      <div className="promotion__options">
        {ORDER.map((choice) => (
          <button
            key={choice}
            type="button"
            className="promotion__option"
            onClick={() => onChoose(choice)}
            aria-label={LABELS[choice]}
          >
            <PieceIcon role={choice} color={color} />
          </button>
        ))}
      </div>
      <button type="button" className="btn btn--ghost promotion__cancel" onClick={onCancel}>
        Cancelar
      </button>
    </div>
  );
}
