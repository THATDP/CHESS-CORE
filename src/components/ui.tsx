import { useEffect } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { X } from 'lucide-react';

/* ------------------------------------------------------------------ */

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

export function SectionHeading({
  index, title, description, action,
}: {
  index?: string; title: ReactNode; description?: ReactNode; action?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading__copy">
        {index && <span className="section-heading__index">{index}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  children, className = '', as: Tag = 'section', ...rest
}: {
  children: ReactNode; className?: string; as?: 'section' | 'div' | 'aside' | 'article';
} & Record<string, unknown>) {
  return <Tag className={`panel ${className}`} {...rest}>{children}</Tag>;
}

/* ------------------------------------------------------------------ */

type ButtonProps = {
  variant?: 'primary' | 'ghost' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  variant = 'ghost', size = 'md', href, className = '', children, ...rest
}: ButtonProps) {
  const classes = `btn btn--${variant} btn--${size} ${className}`;
  if (href) {
    return <a className={classes} href={href} {...rest}>{children}</a>;
  }
  return <button className={classes} type="button" {...rest}>{children}</button>;
}

export function Badge({
  children, tone = 'neutral', className = '',
}: {
  children: ReactNode; tone?: 'neutral' | 'emerald' | 'amber' | 'rose' | 'sky'; className?: string;
}) {
  return <span className={`badge badge--${tone} ${className}`}>{children}</span>;
}

/* ------------------------------------------------------------------ */

export function Stat({
  icon, label, value, hint,
}: {
  icon?: ReactNode; label: string; value: ReactNode; hint?: string;
}) {
  return (
    <div className="stat">
      {icon && <span className="stat__icon">{icon}</span>}
      <div className="stat__copy">
        <span className="stat__label">{label}</span>
        <strong className="stat__value">{value}</strong>
        {hint && <small className="stat__hint">{hint}</small>}
      </div>
    </div>
  );
}

export function Progress({
  value, tone = 'emerald', label, className = '',
}: {
  value: number; tone?: 'emerald' | 'amber' | 'rose'; label?: string; className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={`progress ${className}`}>
      {label && (
        <div className="progress__meta">
          <span>{label}</span>
          <strong>{clamped}%</strong>
        </div>
      )}
      <div className="progress__track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <span className={`progress__fill progress__fill--${tone}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export function ProgressRing({
  value, size = 68, stroke = 6, label, className = '',
}: {
  value: number; size?: number; stroke?: number; label?: string; className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);
  return (
    <div className={`ring ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label ? `${label} ${clamped}%` : `${clamped}%`}>
        <circle className="ring__track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} />
        <circle
          className="ring__fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ring__value">{clamped}%</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Toggle({
  checked, onChange, label, description,
}: {
  checked: boolean; onChange: (value: boolean) => void; label: string; description?: string;
}) {
  return (
    <label className={`toggle ${checked ? 'is-on' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      <span className="toggle__copy">
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}

export function Avatar({
  initials, tone = 'emerald', size = 38, className = '',
}: {
  initials: string; tone?: 'emerald' | 'amber' | 'sky' | 'rose' | 'violet'; size?: number; className?: string;
}) {
  return (
    <span
      className={`avatar avatar--${tone} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */

export function Modal({
  open, title, subtitle, onClose, children, className = '',
}: {
  open: boolean; title: ReactNode; subtitle?: ReactNode; onClose: () => void; children: ReactNode; className?: string;
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
        <div className="modal__head">
          <div>
            <span className="modal__eyebrow">DEMONSTRAÇÃO</span>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

export function Tabs({
  tabs, value, onChange,
}: {
  tabs: { value: string; label: string }[]; value: string; onChange: (value: string) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={value === tab.value}
          className={`tabs__tab ${value === tab.value ? 'is-active' : ''}`}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({
  icon, title, description, action,
}: {
  icon: ReactNode; title: string; description: string; action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  );
}
