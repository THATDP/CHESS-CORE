import { Award, Camera, Medal, Pencil, Shield, Swords, Target, Trophy } from 'lucide-react';
import { Avatar, Badge, Button, Eyebrow, Panel, Progress, SectionHeading, Stat } from '../components/ui';

const achievements = [
  { icon: Target, name: 'Primeiro mate', text: 'Vença uma partida com um mate direto.', done: true },
  { icon: Medal, name: 'Semana perfeita', text: 'Complete sete dias de treino.', done: true },
  { icon: Shield, name: 'Muralha', text: 'Mantenha uma vantagem por 20 lances.', done: false },
  { icon: Award, name: 'Estrategista', text: 'Vença uma partida clássica sem sacrificar peças.', done: false },
];

const activity = [
  { title: 'Partida rapid contra Ana Beatriz', detail: 'Vitória · 42 lances', when: 'há 2 h' },
  { title: 'Treino de tática', detail: '18 puzzles resolvidos', when: 'há 5 h' },
  { title: 'Etapa 3 desbloqueada', detail: 'Aprendizado · Tática essencial', when: 'ontem' },
];

export function Profile() {
  return (
    <div className="page profile page-enter">
      <Panel className="profile__hero">
        <div className="profile__identity">
          <span className="profile__avatar">
            <Avatar initials="JD" tone="emerald" size={92} />
            <span className="profile__avatar-edit" aria-hidden="true"><Camera size={14} /></span>
          </span>
          <div>
            <Eyebrow>SUA JORNADA &nbsp;/&nbsp; PERFIL</Eyebrow>
            <h1>Jogador demo</h1>
            <p className="profile__handle">@jogador.demo · Conta demonstrativa</p>
            <div className="profile__badges">
              <Badge tone="emerald"><Trophy size={12} aria-hidden="true" /> 1.428</Badge>
              <Badge>Clube Obsidiana</Badge>
              <Badge tone="amber">Nível 6</Badge>
            </div>
          </div>
        </div>
        <div className="profile__actions">
          <Button variant="primary" onClick={() => undefined}><Pencil size={15} aria-hidden="true" /> Editar perfil</Button>
          <Button variant="outline" href="#/configuracoes">Preferências</Button>
        </div>
      </Panel>

      <div className="profile__stats">
        <Stat icon={<Swords size={16} aria-hidden="true" />} label="Partidas" value="86" hint="28 neste mês" />
        <Stat icon={<Trophy size={16} aria-hidden="true" />} label="Vitórias" value="47" hint="55%" />
        <Stat icon={<Target size={16} aria-hidden="true" />} label="Precisão" value="79%" hint="nos lances" />
        <Stat icon={<Medal size={16} aria-hidden="true" />} label="Sequência" value="9 dias" hint="recorde 14" />
      </div>

      <div className="profile__grid">
        <Panel>
          <SectionHeading index="01 / CONQUISTAS" title="Seu acervo" description="Quatro das doze conquistas disponíveis." />
          <div className="achievement-grid">
            {achievements.map((item) => (
              <div className={`achievement ${item.done ? 'is-done' : ''}`} key={item.name}>
                <span className="achievement__icon" aria-hidden="true"><item.icon size={18} /></span>
                <strong>{item.name}</strong>
                <small>{item.text}</small>
                {!item.done && <span className="achievement__lock">Bloqueada</span>}
              </div>
            ))}
          </div>
        </Panel>

        <div className="profile__side">
          <Panel>
            <SectionHeading index="02 / EVOLUÇÃO" title="Rating em 6 meses" />
            <Progress value={64} label="1.290 → 1.428" />
            <div className="profile__milestones">
              <span><i className="is-done" aria-hidden="true" /> 1.300</span>
              <span><i className="is-done" aria-hidden="true" /> 1.400</span>
              <span><i aria-hidden="true" /> 1.500</span>
            </div>
          </Panel>

          <Panel>
            <SectionHeading index="03 / ATIVIDADE" title="Acontecendo" />
            <div className="profile__activity">
              {activity.map((item) => (
                <div className="profile__activity-row" key={item.title}>
                  <span className="profile__activity-dot" aria-hidden="true" />
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </div>
                  <em>{item.when}</em>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
