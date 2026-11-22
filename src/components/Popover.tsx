import { useEffect, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';

export type PopoverTrigger = (props: {
  open: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) => ReactNode;

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  trigger: PopoverTrigger;
  children: ReactNode;
  align?: 'right' | 'left';
  className?: string;
  panelClassName?: string;
};

/**
 * Primitivo de painel ancorado: o gatilho permanece responsável por
 * `aria-expanded` e este componente cuida do fechamento por clique fora, por
 * ESC e do retorno do foco ao gatilho.
 */
export function Popover({
  open, onClose, label, trigger, children, align = 'right', className = '', panelClassName = '',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      onClose();
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div ref={rootRef} className={`popover popover--${align} ${className}`}>
      {trigger({ open, buttonRef: triggerRef })}
      {open && (
        <div className={`popover__panel ${panelClassName}`} role="dialog" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}
