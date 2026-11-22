import type { LucideIcon } from 'lucide-react';

type Option = { value: string; label: string; detail?: string; icon?: LucideIcon };

type Props = {
  legend: string;
  index: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  layout?: 'two' | 'three' | 'four';
};

export function OptionGroup({
  legend, index, value, options, onChange, layout = 'three',
}: Props) {
  return (
    <fieldset className="option-group">
      <legend>
        <span className="option-group__index">{index}</span>
        {legend}
      </legend>
      <div className={`option-grid option-grid--${layout}`}>
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <label className={`option ${selected ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name={legend}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              {Icon && <Icon className="option__icon" size={19} strokeWidth={1.5} aria-hidden="true" />}
              <span className="option__text">
                <strong>{option.label}</strong>
                {option.detail && <small>{option.detail}</small>}
              </span>
              <span className="option__indicator" aria-hidden="true" />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
