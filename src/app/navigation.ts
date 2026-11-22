import {
  Activity, Bot, ChartNoAxesCombined, Clock3, GraduationCap, House, Puzzle, Settings2, Swords,
  Trophy, UserRound, UsersRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type PageId =
  | 'inicio' | 'jogar' | 'computador' | 'treinamento' | 'quebra-cabecas' | 'analise'
  | 'torneios' | 'aprendizado' | 'amigos' | 'historico' | 'perfil' | 'configuracoes';

export type NavCategoryId = 'jogar' | 'treinar' | 'estudar' | 'competir' | 'comunidade' | 'conta';

export type Page = {
  id: PageId;
  label: string;
  icon: LucideIcon;
  /** Categoria do dropdown; `null` para destinos fora de agrupamento (Início). */
  category: NavCategoryId | null;
  eyebrow: string;
  title: string;
  description: string;
  features: [string, string, string];
  /** Termos extras usados pela busca do cabeçalho. */
  keywords: string[];
};

export const pages: Page[] = [
  {
    id: 'inicio', label: 'Início', icon: House, category: null, eyebrow: 'SEU ESPAÇO',
    title: 'Início', description: '', features: ['', '', ''],
    keywords: ['home', 'começo', 'principal', 'tabuleiro', 'cena'],
  },
  {
    id: 'jogar', label: 'Jogar', icon: Swords, category: 'jogar', eyebrow: 'ÁREA DE JOGO',
    title: 'Toda grande partida começa aqui.',
    description: 'Seu próximo desafio está tomando forma. Escolha como jogar e encontre seu lugar à mesa — a configuração é demonstrativa.',
    features: ['Partidas online', 'Jogue com amigos', 'Diferentes ritmos'],
    keywords: ['partida', 'online', 'adversário', 'blitz', 'rapid', 'bullet', 'tempo'],
  },
  {
    id: 'computador', label: 'Computador', icon: Bot, category: 'jogar', eyebrow: 'ÁREA DE JOGO',
    title: 'Um adversário à sua altura.',
    description: 'Um espaço para explorar ideias e praticar no seu ritmo, contra um oponente de computador.',
    features: ['Níveis de dificuldade', 'Prática individual', 'Evolução no seu ritmo'],
    keywords: ['engine', 'máquina', 'ia', 'nível', 'força', 'oponente'],
  },
  {
    id: 'treinamento', label: 'Treinamento', icon: Activity, category: 'treinar', eyebrow: 'EVOLUA SEU JOGO',
    title: 'A prática constrói a confiança.',
    description: 'Uma rotina de treino pensada para transformar intenção em progresso, uma posição de cada vez.',
    features: ['Rotinas de treino', 'Acompanhe seu progresso', 'Prática direcionada'],
    keywords: ['treino', 'rotina', 'progresso', 'exercício', 'preparação'],
  },
  {
    id: 'quebra-cabecas', label: 'Quebra-cabeças', icon: Puzzle, category: 'treinar', eyebrow: 'EVOLUA SEU JOGO',
    title: 'Encontre a melhor jogada.',
    description: 'Posições para aguçar seu olhar, reconhecer padrões e descobrir novas possibilidades.',
    features: ['Desafios diários', 'Padrões táticos', 'Dificuldade progressiva'],
    keywords: ['tática', 'táticas', 'puzzle', 'desafio', 'padrão', 'dica'],
  },
  {
    id: 'analise', label: 'Análise', icon: ChartNoAxesCombined, category: 'estudar', eyebrow: 'EVOLUA SEU JOGO',
    title: 'Cada jogada tem uma história.',
    description: 'Revisite suas decisões e encontre oportunidades para entender melhor cada partida.',
    features: ['Revisão de partidas', 'Momentos decisivos', 'Análise de posições'],
    keywords: ['avaliação', 'revisão', 'lances', 'gráfico', 'posição', 'erros'],
  },
  {
    id: 'torneios', label: 'Torneios', icon: Trophy, category: 'competir', eyebrow: 'COMPETIÇÃO',
    title: 'Seu próximo grande desafio.',
    description: 'Um espaço para competir, encontrar adversários e fazer parte de algo maior.',
    features: ['Eventos competitivos', 'Classificações', 'Diferentes formatos'],
    keywords: ['competição', 'torneio', 'copa', 'classificação', 'tabela', 'evento'],
  },
  {
    id: 'aprendizado', label: 'Aprendizado', icon: GraduationCap, category: 'estudar', eyebrow: 'EVOLUA SEU JOGO',
    title: 'Aprender é parte do jogo.',
    description: 'Construa seu conhecimento com uma jornada que começa nos fundamentos e vai além.',
    features: ['Trilhas de aprendizado', 'Fundamentos', 'Conteúdo progressivo'],
    keywords: ['curso', 'trilha', 'lição', 'fundamentos', 'teoria', 'abrir'],
  },
  {
    id: 'amigos', label: 'Amigos', icon: UsersRound, category: 'comunidade', eyebrow: 'COMUNIDADE',
    title: 'O jogo é melhor compartilhado.',
    description: 'Conecte-se com outras pessoas e encontre companhia para sua próxima partida.',
    features: ['Sua lista de amigos', 'Convites para jogar', 'Conexões'],
    keywords: ['social', 'convite', 'jogadores', 'contatos', 'compartilhar'],
  },
  {
    id: 'historico', label: 'Histórico', icon: Clock3, category: 'estudar', eyebrow: 'SUA JORNADA',
    title: 'Toda partida deixa uma marca.',
    description: 'Seu arquivo pessoal de partidas e momentos para revisitar e aprender.',
    features: ['Partidas anteriores', 'Resultados', 'Revisão de jogos'],
    keywords: ['partidas', 'resultados', 'arquivo', 'jogos', 'registro', 'passadas'],
  },
  {
    id: 'perfil', label: 'Perfil', icon: UserRound, category: 'conta', eyebrow: 'SUA JORNADA',
    title: 'Sua história no tabuleiro.',
    description: 'Um espaço para acompanhar sua evolução e construir sua identidade no CHESS CORE.',
    features: ['Seu perfil', 'Estatísticas', 'Conquistas'],
    keywords: ['conta', 'estatísticas', 'conquistas', 'avatar', 'jogador demo'],
  },
  {
    id: 'configuracoes', label: 'Configurações', icon: Settings2, category: 'conta', eyebrow: 'PREFERÊNCIAS',
    title: 'Do seu jeito.',
    description: 'Personalize sua experiência para que você possa se concentrar no que importa: o jogo.',
    features: ['Aparência', 'Preferências de jogo', 'Privacidade'],
    keywords: ['ajustes', 'preferências', 'aparência', 'acento', 'qualidade', 'privacidade'],
  },
];

export type NavCategory = {
  id: NavCategoryId;
  label: string;
  icon: LucideIcon;
  description: string;
};

/**
 * Hierarquia da navegação. Cada categoria abre um dropdown no cabeçalho;
 * adicionar uma página ou categoria é uma entrada nesta lista, sem tocar em
 * nenhum componente.
 */
export const navCategories: NavCategory[] = [
  {
    id: 'jogar', label: 'Jogar', icon: Swords,
    description: 'Partidas contra pessoas ou contra a máquina.',
  },
  {
    id: 'treinar', label: 'Treinar', icon: Activity,
    description: 'Rotinas, tática e progresso.',
  },
  {
    id: 'estudar', label: 'Estudar', icon: GraduationCap,
    description: 'Aprendizado, análise e seu arquivo de partidas.',
  },
  {
    id: 'competir', label: 'Competir', icon: Trophy,
    description: 'Eventos e classificações.',
  },
  {
    id: 'comunidade', label: 'Comunidade', icon: UsersRound,
    description: 'Pessoas para jogar e compartilhar.',
  },
  {
    id: 'conta', label: 'Conta', icon: Settings2,
    description: 'Perfil e preferências.',
  },
];

export const homePage = pages[0];

export const pagesByCategory = (id: NavCategoryId): Page[] =>
  pages.filter((page) => page.category === id);

export const categoryById = (id: NavCategoryId): NavCategory =>
  navCategories.find((category) => category.id === id) ?? navCategories[0];

export const pageById = (id: PageId): Page => pages.find((page) => page.id === id) ?? homePage;

export const pageForHash = (hash: string): Page => pages.find((page) => `#/${page.id}` === hash) ?? homePage;

/**
 * Contextos em que o cabeçalho assume a forma compacta: as duas páginas que
 * colocam o usuário à mesa, com o tabuleiro em destaque. Páginas de estudo,
 * análise e comunidade mantêm o cabeçalho completo.
 */
export const matchPages: PageId[] = ['jogar', 'computador'];

export const isMatchPage = (id: PageId): boolean => matchPages.includes(id);

const fold = (value: string): string =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

/** Busca do cabeçalho: localiza apenas destinos que existem de fato. */
export function searchPages(query: string): Page[] {
  const term = fold(query.trim());
  if (!term) return [];
  return pages.filter((page) => {
    const haystack = fold([
      page.label, page.title, page.description, page.eyebrow,
      page.category ? categoryById(page.category).label : page.label, page.keywords.join(' '),
    ].join(' '));
    return term.split(/\s+/).every((word) => haystack.includes(word));
  });
}
