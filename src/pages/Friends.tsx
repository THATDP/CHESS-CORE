import { useState } from 'react';
import { MessageCircle, Swords, UserPlus, UsersRound, X } from 'lucide-react';
import { Avatar, Badge, Button, Eyebrow, Modal, Panel, SectionHeading } from '../components/ui';

type FriendTone = 'emerald' | 'sky' | 'violet' | 'amber' | 'rose';

const friends: { name: string; initials: string; tone: FriendTone; status: 'online' | 'partida' | 'offline'; detail: string }[] = [
  { name: 'Ana Beatriz', initials: 'AB', tone: 'emerald', status: 'online', detail: 'Disponível para jogar' },
  { name: 'R. Monteiro', initials: 'RM', tone: 'sky', status: 'partida', detail: 'Em uma partida · rapid' },
  { name: 'K. Nogueira', initials: 'KN', tone: 'violet', status: 'online', detail: 'Estudando aberturas' },
  { name: 'L. Prates', initials: 'LP', tone: 'amber', status: 'offline', detail: 'Visto há 2 h' },
  { name: 'M. Saito', initials: 'MS', tone: 'rose', status: 'offline', detail: 'Visto ontem' },
];

const invites: { name: string; initials: string; tone: FriendTone; detail: string }[] = [
  { name: 'C. Fontoura', initials: 'CF', tone: 'sky', detail: 'Convite recebido' },
  { name: 'T. Vasques', initials: 'TV', tone: 'amber', detail: 'Convite recebido' },
];

export function Friends() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="page friends page-enter">
      <div className="page-intro">
        <Eyebrow><UsersRound size={13} aria-hidden="true" /> COMUNIDADE &nbsp;/&nbsp; AMIGOS</Eyebrow>
        <h1>O jogo é melhor <em>compartilhado.</em></h1>
        <p>Conecte-se com outras pessoas e encontre companhia para sua próxima partida.</p>
      </div>

      <div className="friends__grid">
        <Panel className="friends__list-panel">
          <div className="friends__list-head">
            <SectionHeading index="01 / LISTA" title="Seus amigos" description="Cinco conexões demonstrativas." />
            <Button variant="outline" size="sm" onClick={() => { setSent(false); setModalOpen(true); }}>
              <UserPlus size={15} aria-hidden="true" /> Adicionar
            </Button>
          </div>

          <div className="friend-list">
            {friends.map((friend) => (
              <div className="friend-row" key={friend.name}>
                <span className="friend-row__avatar">
                  <Avatar initials={friend.initials} tone={friend.tone} size={42} />
                  <i className={`presence presence--${friend.status}`} aria-hidden="true" />
                </span>
                <span className="friend-row__copy">
                  <strong>{friend.name}</strong>
                  <small>{friend.detail}</small>
                </span>
                <span className={`friend-row__status friend-row__status--${friend.status}`}>
                  {friend.status === 'online' ? 'Online' : friend.status === 'partida' ? 'Em partida' : 'Offline'}
                </span>
                <span className="friend-row__actions">
                  <button className="icon-button" aria-label={`Conversar com ${friend.name}`} type="button">
                    <MessageCircle size={17} aria-hidden="true" />
                  </button>
                  <button className="icon-button" aria-label={`Desafiar ${friend.name}`} type="button">
                    <Swords size={17} aria-hidden="true" />
                  </button>
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <div className="friends__side">
          <Panel>
            <SectionHeading index="02 / CONVITES" title="Aguardando resposta" />
            <div className="invite-list">
              {invites.map((invite) => (
                <div className="invite-row" key={invite.name}>
                  <Avatar initials={invite.initials} tone={invite.tone} size={36} />
                  <span className="invite-row__copy">
                    <strong>{invite.name}</strong>
                    <small>{invite.detail}</small>
                  </span>
                  <span className="invite-row__actions">
                    <button className="icon-button" aria-label={`Aceitar ${invite.name}`} type="button">
                      <UserPlus size={16} aria-hidden="true" />
                    </button>
                    <button className="icon-button" aria-label={`Recusar ${invite.name}`} type="button">
                      <X size={16} aria-hidden="true" />
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <p className="friends__note">Nenhuma dessas pessoas existe — é uma demonstração de interface.</p>
          </Panel>

          <Panel className="friends__activity">
            <SectionHeading index="03 / ATIVIDADE" title="Acontecendo agora" />
            <div className="activity-list">
              <div className="activity-row">
                <span className="activity-row__dot activity-row__dot--emerald" aria-hidden="true" />
                <div><strong>Ana Beatriz</strong> venceu <strong>R. Monteiro</strong> por 2 a 1</div>
                <small>há 12 min</small>
              </div>
              <div className="activity-row">
                <span className="activity-row__dot activity-row__dot--sky" aria-hidden="true" />
                <div><strong>K. Nogueira</strong> resolveu 18 puzzles hoje</div>
                <small>há 40 min</small>
              </div>
              <div className="activity-row">
                <span className="activity-row__dot activity-row__dot--amber" aria-hidden="true" />
                <div><strong>M. Saito</strong> entrou para a Copa Obsidiana</div>
                <small>há 1 h</small>
              </div>
            </div>
            <Badge tone="emerald" className="friends__badge">Ambiente demo</Badge>
          </Panel>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Adicionar amigo"
        subtitle="Demonstração: nenhum convite real será enviado."
      >
        <div className="modal-form">
          <label className="field">
            <span>Nome ou apelido</span>
            <input type="text" placeholder="ex.: Ana Beatriz" />
          </label>
          {sent
            ? <p className="modal-form__status" role="status">Convite demonstrativo registrado. A lista de amigos real chega na próxima fase.</p>
            : (
              <Button variant="primary" onClick={() => setSent(true)}>
                Enviar convite <UserPlus size={16} aria-hidden="true" />
              </Button>
            )}
        </div>
      </Modal>
    </div>
  );
}
