import {
  Activity, Bot, ChartNoAxesCombined, Clock3, GraduationCap, House, Puzzle, Settings2, Swords,
  Trophy, UserRound, UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type PageId =
  | 'inicio' | 'jogar' | 'computador' | 'treinamento' | 'quebra-cabecas' | 'analise'
  | 'torneios' | 'aprendizado' | 'amigos' | 'historico' | 'perfil' | 'configuracoes';

export type PageGroup = 'JOGAR' | 'EVOLUIR' | 'COMUNIDADE' | 'CONTA';

export type Page = {
  id: PageId;
  label: string;
  icon: LucideIcon;
  group: PageGroup;
  eyebrow: string;
  title: string;
  description: string;
  features: [string, string, string];
};

export const pages: Page[] = [
  {
    id: 'inicio', label: 'Início', icon: House, group: 'JOGAR', eyebrow: 'SEU ESPAÇO',
    title: 'Início', description: '', features: ['', '', ''],
  },
  {
    id: 'jogar', label: 'Jogar', icon: Swords, group: 'JOGAR', eyebrow: 'ÁREA DE JOGO',
    title: 'Toda grande partida começa aqui.',
    description: 'Seu próximo desafio está tomando forma. Escolha como jogar e encontre seu lugar à mesa — a configuração é demonstrativa.',
    features: ['Partidas online', 'Jogue com amigos', 'Diferentes ritmos'],
  },
  {
    id: 'computador', label: 'Computador', icon: Bot, group: 'JOGAR', eyebrow: 'ÁREA DE JOGO',
    title: 'Um adversário à sua altura.',
    description: 'Um espaço para explorar ideias e praticar no seu ritmo, contra um oponente de computador.',
    features: ['Níveis de dificuldade', 'Prática individual', 'Evolução no seu ritmo'],
  },
  {
    id: 'treinamento', label: 'Treinamento', icon: Activity, group: 'EVOLUIR', eyebrow: 'EVOLUA SEU JOGO',
    title: 'A prática constrói a confiança.',
    description: 'Uma rotina de treino pensada para transformar intenção em progresso, uma posição de cada vez.',
    features: ['Rotinas de treino', 'Acompanhe seu progresso', 'Prática direcionada'],
  },
  {
    id: 'quebra-cabecas', label: 'Quebra-cabeças', icon: Puzzle, group: 'EVOLUIR', eyebrow: 'EVOLUA SEU JOGO',
    title: 'Encontre a melhor jogada.',
    description: 'Posições para aguçar seu olhar, reconhecer padrões e descobrir novas possibilidades.',
    features: ['Desafios diários', 'Padrões táticos', 'Dificuldade progressiva'],
  },
  {
    id: 'analise', label: 'Análise', icon: ChartNoAxesCombined, group: 'EVOLUIR', eyebrow: 'EVOLUA SEU JOGO',
    title: 'Cada jogada tem uma história.',
    description: 'Revisite suas decisões e encontre oportunidades para entender melhor cada partida.',
    features: ['Revisão de partidas', 'Momentos decisivos', 'Análise de posições'],
  },
  {
    id: 'torneios', label: 'Torneios', icon: Trophy, group: 'COMUNIDADE', eyebrow: 'COMPETIÇÃO',
    title: 'Seu próximo grande desafio.',
    description: 'Um espaço para competir, encontrar adversários e fazer parte de algo maior.',
    features: ['Eventos competitivos', 'Classificações', 'Diferentes formatos'],
  },
  {
    id: 'aprendizado', label: 'Aprendizado', icon: GraduationCap, group: 'EVOLUIR', eyebrow: 'EVOLUA SEU JOGO',
    title: 'Aprender é parte do jogo.',
    description: 'Construa seu conhecimento com uma jornada que começa nos fundamentos e vai além.',
    features: ['Trilhas de aprendizado', 'Fundamentos', 'Conteúdo progressivo'],
  },
  {
    id: 'amigos', label: 'Amigos', icon: UsersRound, group: 'COMUNIDADE', eyebrow: 'COMUNIDADE',
    title: 'O jogo é melhor compartilhado.',
    description: 'Conecte-se com outras pessoas e encontre companhia para sua próxima partida.',
    features: ['Sua lista de amigos', 'Convites para jogar', 'Conexões'],
  },
  {
    id: 'historico', label: 'Histórico', icon: Clock3, group: 'COMUNIDADE', eyebrow: 'SUA JORNADA',
    title: 'Toda partida deixa uma marca.',
    description: 'Seu arquivo pessoal de partidas e momentos para revisitar e aprender.',
    features: ['Partidas anteriores', 'Resultados', 'Revisão de jogos'],
  },
  {
    id: 'perfil', label: 'Perfil', icon: UserRound, group: 'CONTA', eyebrow: 'SUA JORNADA',
    title: 'Sua história no tabuleiro.',
    description: 'Um espaço para acompanhar sua evolução e construir sua identidade no CHESS CORE.',
    features: ['Seu perfil', 'Estatísticas', 'Conquistas'],
  },
  {
    id: 'configuracoes', label: 'Configurações', icon: Settings2, group: 'CONTA', eyebrow: 'PREFERÊNCIAS',
    title: 'Do seu jeito.',
    description: 'Personalize sua experiência para que você possa se concentrar no que importa: o jogo.',
    features: ['Aparência', 'Preferências de jogo', 'Privacidade'],
  },
];

export const pageForHash = (hash: string): Page => pages.find((page) => `#/${page.id}` === hash) ?? pages[0];

export const navGroups: { group: PageGroup; items: Page[] }[] = (
  ['JOGAR', 'EVOLUIR', 'COMUNIDADE'] as PageGroup[]
).map((group) => ({ group, items: pages.filter((page) => page.group === group) }));

export const accountPages = pages.filter((page) => page.group === 'CONTA');
