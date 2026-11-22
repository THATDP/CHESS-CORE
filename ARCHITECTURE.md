# Arquitetura

## Princípios

Uma aplicação estática React/TypeScript construída pelo Vite e servida pelo GitHub Pages. O navegador executa a interface; Pages não executa backend nem WebSockets. Não há servidor, persistência, provedor ou autenticação conectados nesta fase. A Fase 02 adiciona uma interface demonstrativa e navegação por hash; nenhuma funcionalidade de jogo está implementada.

## Organização atual

```text
.github/workflows/  CI e publicação
src/app/            composição e catálogo de navegação
src/components/     componentes reutilizáveis, incluindo tabuleiro estático
src/pages/          painel e páginas planejadas
src/assets/         recursos visuais locais
src/styles/         estilos e responsividade
src/main.tsx        ponto de entrada
tests/              testes da interface
```

Arquivos de configuração permanecem na raiz. Diretórios adicionais serão criados **quando houver código real**, evitando estruturas vazias:

- `src/pages/` e `src/navigation/`: páginas e roteamento, quando necessários; componentes de interface compartilhados em `src/components/`.
- `src/features/<domínio>/`: composição de cada funcionalidade, com suas telas e casos de uso próprios.
- `src/domain/`: modelos, regras e contratos puros de negócio, sem React, DOM ou SDKs externos. Subdomínios futuros: xadrez, partidas, competição etc.
- `src/services/`: adaptadores externos para rede, autenticação, persistência e engine. Dependem dos contratos de domínio, nunca o contrário. Configuração pública em `src/config/`; nunca segredos no frontend.
- `src/styles/`: tokens e estilos compartilhados; testes de unidade de domínio e integração em `tests/` ou próximos ao módulo.

Fluxo previsto: interface → casos de uso/contratos de domínio ← adaptadores de infraestrutura. A lógica de xadrez deverá ser isolada e testável, sem depender de telas ou transporte; IA deverá usar um adaptador para worker/engine, sem incluir Stockfish agora. Para multiplayer, o backend futuro será autoridade; o cliente não decide resultados competitivos. As interfaces serão definidas quando os casos de uso forem conhecidos, evitando abstrações especulativas.

## Navegação e recursos

A navegação atual usa fragmentos hash, sem biblioteca de roteamento. O build usa `base: './'` para funcionar na raiz ou sob `/CHESS-CORE/`. O refresh da URL inicial é compatível com hospedagem estática. Para rotas futuras, preferir hash routing (`#/...`), pois o fragmento não é enviado ao servidor; URLs HTML5 profundas precisariam de solução explícita para 404 no Pages. Recursos futuros devem ser importados pelo Vite ou referenciar `import.meta.env.BASE_URL`; não usar caminhos absolutos `/assets/...`.

## Dados e limites de confiança futuros

Modelagem inicial, não implementada: identidade separada de perfil e preferências; partidas com participantes, estado, versão, resultado e relógio; movimentos ordenados por partida com índice e representação versionada; histórico derivado das partidas; ranking com eventos de alteração auditáveis; amizades com estados de solicitação; torneios com inscrições, rodadas e resultados; puzzles e tentativas; conquistas e estatísticas derivadas. Definir chaves, índices, retenção, privacidade, exportação/exclusão e migrações antes de persistir. Não guardar senhas próprias; usar autenticação apropriada. Regras de acesso e validação precisam ser aplicadas no backend, não apenas na UI. Ver [plano multiplayer](MULTIPLAYER_PLAN.md).

## Diretrizes visuais (não são a interface final)

- Personalidade: elegância, inteligência, sofisticação e competitividade, sem ruído visual.
- Cores iniciais: fundo carvão `#101515`, texto `#edf1ed`, acento verde suave `#aac2a7`; revisar contraste para texto e estados, incluindo foco, seguindo WCAG.
- Tipografia: pilha de sistema gratuita por padrão; hierarquia clara e legível. Não depender de fontes externas.
- Espaçamento: escala consistente baseada em 4/8 px; largura de leitura limitada e margens adaptáveis.
- Bordas: discretas, raios moderados e consistentes; não transmitir interação apenas por cor.
- Componentes: semânticos, reutilizáveis, com estados de teclado, foco, erro, carregamento e acessibilidade desde a implementação. Ícones futuros preferencialmente SVGs locais com licença compatível e rótulos acessíveis.
- Movimento: transições breves e funcionais, respeitando `prefers-reduced-motion`.
- Responsividade: mobile-first, conteúdo fluido, alvos de toque adequados e testes em diferentes larguras. Não há componentes de produto implementados ainda.
