import type { LucideIcon } from 'lucide-react';

type Option = { value: string; label: string; detail?: string; icon?: LucideIcon };
type Props = { legend: string; index: string; value: string; options: Option[]; onChange: (value: string) => void; layout?: 'three' | 'four' | 'two' };
export function OptionGroup({ legend, index, value, options, onChange, layout = 'three' }: Props) {
  return <fieldset className="option-group"><legend><span>{index}</span> {legend}</legend><div className={`option-grid option-grid--${layout}`}>
    {options.map((option) => <label className={`option ${value === option.value ? 'option--selected' : ''}`} key={option.value}>
      <input type="radio" name={legend} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)}/>
      {option.icon && <option.icon className="option-icon" size={20} strokeWidth={1.5}/>}<span className="option-text"><strong>{option.label}</strong>{option.detail && <small>{option.detail}</small>}</span><span className="option-indicator" aria-hidden="true"/>
    </label>)}
  </div></fieldset>;
}
