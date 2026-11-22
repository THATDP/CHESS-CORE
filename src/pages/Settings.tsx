import { useEffect, useState } from 'react';
import {
  Bell, Box, Brush, Download, Gauge, ImageOff, Moon, Navigation2, Sparkles, Trash2,
} from 'lucide-react';
import { Badge, Button, Eyebrow, Panel, SectionHeading, Toggle } from '../components/ui';
import { updateNavPreferences, useNavPreferences } from '../app/preferences';

const accents = [
  { value: 'emerald', label: 'Esmeralda', color: '#3ce6a6' },
  { value: 'sky', label: 'Céu', color: '#5cc8ff' },
  { value: 'amber', label: 'Âmbar', color: '#ffc46b' },
  { value: 'violet', label: 'Violeta', color: '#b79bff' },
];

const qualities = [
  { value: 'auto', label: 'Automática', detail: 'Detecta o dispositivo' },
  { value: 'high', label: 'Alta', detail: 'Sombras e pós-processamento' },
  { value: 'medium', label: 'Média', detail: 'Sombras, sem bloom' },
  { value: 'low', label: 'Baixa', detail: 'Cena enxuta, sem sombras' },
];

export function Settings() {
  const nav = useNavPreferences();
  const [accent, setAccent] = useState(() => window.localStorage.getItem('cc-accent') ?? 'emerald');
  const [quality, setQuality] = useState(() => window.localStorage.getItem('cc-quality') ?? 'auto');
  const [saved, setSaved] = useState(false);
  const [motion, setMotion] = useState(true);
  const [effects, setEffects] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [shareActivity, setShareActivity] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    window.localStorage.setItem('cc-accent', accent);
  }, [accent]);

  useEffect(() => {
    if (quality === 'auto') window.localStorage.removeItem('cc-quality');
    else window.localStorage.setItem('cc-quality', quality);
  }, [quality]);

  return (
    <div className="page settings page-enter">
      <div className="page-intro">
        <Eyebrow><Brush size={13} aria-hidden="true" /> PREFERÊNCIAS &nbsp;/&nbsp; CONFIGURAÇÕES</Eyebrow>
        <h1>Do seu <em>jeito.</em></h1>
        <p>Personalize sua experiência para que você possa se concentrar no que importa: o jogo.</p>
      </div>

      <div className="settings__grid">
        <Panel className="settings__panel">
          <SectionHeading index="01 / NAVEGAÇÃO" title="Comportamento do cabeçalho" description="A navegação responde a estas escolhas." />
          <div className="settings__stack">
            <Toggle
              checked={nav.pinned}
              onChange={(pinned) => updateNavPreferences({ pinned })}
              label="Cabeçalho fixo ao rolar"
              description="Mantém a navegação visível durante a rolagem."
            />
            <Toggle
              checked={nav.compactMatches}
              onChange={(compactMatches) => updateNavPreferences({ compactMatches })}
              label="Modo compacto em partidas"
              description="Reduz o cabeçalho em Jogar e Computador para sobrar espaço ao tabuleiro."
            />
          </div>
          <p className="settings__hint">
            <Navigation2 size={13} aria-hidden="true" /> As preferências são aplicadas na hora, inclusive durante uma partida.
          </p>
        </Panel>

        <Panel className="settings__panel">
          <SectionHeading index="02 / APARÊNCIA" title="Acento visual" description="Aplica-se imediatamente a toda a interface." />
          <div className="swatch-row">
            {accents.map((item) => (
              <button
                key={item.value}
                className={`swatch ${accent === item.value ? 'is-selected' : ''}`}
                onClick={() => setAccent(item.value)}
                aria-pressed={accent === item.value}
                type="button"
              >
                <span className="swatch__color" style={{ background: item.color }} aria-hidden="true" />
                <strong>{item.label}</strong>
                <small>{accent === item.value ? 'Em uso' : 'Aplicar'}</small>
              </button>
            ))}
          </div>

          <div className="settings__row">
            <div className="settings__row-copy">
              <strong><Moon size={15} aria-hidden="true" /> Tema escuro</strong>
              <small>A interface é desenhada para o modo escuro; o claro chega depois.</small>
            </div>
            <Badge tone="emerald">Ativo</Badge>
          </div>
        </Panel>

        <Panel className="settings__panel">
          <SectionHeading index="03 / MOVIMENTO" title="Animação" description="A cena 3D acompanha estas escolhas." />
          <div className="settings__stack">
            <Toggle checked={motion} onChange={setMotion} label="Parallax e flutuação" description="Movimento discreto da câmera e das peças" />
            <Toggle checked={effects} onChange={setEffects} label="Brilho e vinheta" description="Pós-processamento cinematográfico" />
          </div>
          <p className="settings__hint">O sistema respeita <code>prefers-reduced-motion</code> automaticamente.</p>
        </Panel>

        <Panel className="settings__panel">
          <SectionHeading index="04 / CENA E DESEMPENHO" title="Cena 3D" description="Liga ou desliga o ambiente tridimensional em tempo real." />
          <div className="settings__stack">
            <Toggle
              checked={nav.scene3d}
              onChange={(scene3d) => updateNavPreferences({ scene3d })}
              label="Cena 3D em tempo real"
              description={nav.scene3d ? 'Tabuleiro, peças e luz renderizados no navegador.' : 'O pôster estilizado assume o lugar da cena.'}
            />
            <div className="scene-state" aria-hidden="true">
              {nav.scene3d ? <Box size={16} /> : <ImageOff size={16} />}
              <span>{nav.scene3d ? 'Cena ativa' : 'Cena desativada'}</span>
            </div>
          </div>

          <div className="quality-list">
            {qualities.map((item) => (
              <label key={item.value} className={`quality ${quality === item.value ? 'is-selected' : ''}`}>
                <input type="radio" name="qualidade" value={item.value} checked={quality === item.value} onChange={() => setQuality(item.value)} />
                <span className="quality__copy">
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </span>
                <Gauge size={16} aria-hidden="true" className="quality__icon" />
              </label>
            ))}
          </div>
        </Panel>

        <Panel className="settings__panel">
          <SectionHeading index="05 / NOTIFICAÇÕES" title="Avisos" description="Nada é enviado nesta fase." />
          <div className="settings__stack">
            <Toggle checked={notifications} onChange={setNotifications} label="Convites de partida" description="Quando alguém quiser jogar com você" />
            <Toggle checked={weekly} onChange={setWeekly} label="Resumo semanal" description="Um retrato da sua evolução" />
          </div>
        </Panel>

        <Panel className="settings__panel">
          <SectionHeading index="06 / PRIVACIDADE" title="Sua presença" description="Controles demonstrativos." />
          <div className="settings__stack">
            <Toggle checked={publicProfile} onChange={setPublicProfile} label="Perfil público" description="Visível para outros jogadores" />
            <Toggle checked={shareActivity} onChange={setShareActivity} label="Compartilhar atividade" description="Mostre quando você está online" />
          </div>
        </Panel>

        <Panel className="settings__panel">
          <SectionHeading index="07 / DADOS" title="Seus dados" description="Nada é persistido nesta fase." />
          <div className="settings__actions">
            <Button variant="outline" size="sm"><Download size={15} aria-hidden="true" /> Exportar demonstração</Button>
            <Button variant="outline" size="sm"><Trash2 size={15} aria-hidden="true" /> Limpar preferências</Button>
          </div>
          <p className="settings__hint">As preferências visuais ficam apenas neste navegador.</p>
        </Panel>
      </div>

      <div className="settings__bar">
        <span className="settings__bar-status">
          <Sparkles size={14} aria-hidden="true" /> Preferências aplicadas em tempo real
        </span>
        <Button variant="primary" onClick={() => setSaved(true)}>
          <Bell size={15} aria-hidden="true" /> Salvar alterações
        </Button>
        {saved && <span className="settings__saved" role="status">Preferências demonstrativas salvas.</span>}
      </div>
    </div>
  );
}
