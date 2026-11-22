# Arquitetura

## Princípios

Uma aplicação estática React/TypeScript construída pelo Vite e servida pelo GitHub Pages. O navegador executa a interface; Pages não executa backend nem WebSockets. Não há servidor, persistência, provedor ou autenticação conectados nesta fase. A interface inclui navegação por hash e uma cena de xadrez **tridimensional em tempo real** (three.js + React Three Fiber), com geometria, materiais e texturas gerados por código — nenhum modelo ou imagem externa é baixado. A partida roda num **tabuleiro 2D** (CSS + SVG, tema Classic Walnut), com regras oficiais completas e relógio; a cena 3D é opcional e não é carregada na partida.

## Organização atual

```text
.github/workflows/  CI e publicação
src/app/            composição e catálogo de navegação (12 seções)
src/chess/          regras, partida e relógio (domínio, sem React)
  game/             tipos de partida, ChessGame, relógio e hook da partida
  rules.ts          única fronteira com a biblioteca de regras (chess.js)
src/engines/        registro e contrato de engines (UCI; WASM + Web Worker na Fase 5)
src/components/     componentes de interface, tabuleiro 2D, painéis, pôster 3D
src/pages/          as doze páginas visuais
src/three/          motor 3D: cena, peças, materiais, texturas, qualidade
src/styles/         tokens, componentes, responsividade e tema da partida
src/main.tsx        ponto de entrada
tests/              testes de regras, relógio, partida, tabuleiro, engines e cena
```

## Partida (Fase 04)

A partida é um problema de domínio, não de componente: `src/chess/` não importa React nem DOM.

- **Regras** (`rules.ts`): adaptador único para `chess.js` 1.4.0. Expõe lances legais por casa, validação de lance (incluindo a proibição de deixar o próprio rei em xeque), detecção de promoção, xeque, desfecho (xeque-mate, afogamento, material insuficiente, repetição tripla e 50 movimentos) e o último lance. Nenhuma outra parte do código conhece a biblioteca.
- **Partida** (`game/game.ts`): `ChessGame` guarda a posição, o histórico em SAN, o PGN e a pilha de refazer. `undo()`/`redo()` devolvem o SAN afetado; não há pilha de desfazer própria, o histórico da biblioteca é a fonte.
- **Relógio** (`game/clock.ts`): medido por relógio de parede (`performance.now`), com incremento aplicado ao lado que jogou e ponteiro passado ao adversário. Sem limite, o tempo conta para cima só para exibição. `dispose()` encerra o `setInterval`.
- **Hook** (`game/useChessGame.ts`): estado da partida para a interface — seleção, alvos legais, promoção pendente, fase, resultado, desfazer/refazer e relógio. O relógio é recriado quando o controle de tempo muda; o componente o descarta ao desmontar.
- **Tabuleiro** (`components/ChessBoard.tsx`): 64 casas em CSS grid, orientação brancas/pretas, coordenadas, seleção, alvos de lance, anel de captura, última jogada e xeque. Clique e arrastar; teclado entra pela casa focada. Peças via `PieceIcon` (o mesmo SVG dos perfis 3D), com Staunton marfim para brancas e nogueira para pretas.
- **Painel** (`components/MatchPanel.tsx`): jogadores, relógio, controles (desfazer, refazer, inverter, desistir, empate, reiniciar), resultado e histórico em SAN numerado.
- **Promoção** (`components/PromotionDialog.tsx`): escolha de dama, torre, bispo ou cavalo.
- **Controles de tempo**: sem limite, 1+0, 3+0, 3+2, 5+0, 10+0 e 15+10 (`game/types.ts`).

## Engines (Fase 5)

`src/engines/` é o limite entre as regras oficiais e o adversário de IA. O contrato (`protocol.ts`) define `load`, `dispose`, `requestMove`, `setOption`, `status` e `info`; **UCI é o protocolo padrão**, e protocolos diferentes são declarados como `custom`. O registro (`registry.ts`) mapeia id → fábrica, e `createEngine(id)` instancia **uma** engine por vez, sem baixar binário antes da escolha. Na Fase 5 as engines serão WASM em Web Worker, com carregamento individual, encerramento e liberação de memória. `PLANNED_ENGINES` lista Stockfish, Leela Chess Zero, Berserk, Koivisto, Arasan, Lozza, Rodent IV e Fairy-Stockfish — nenhuma é baixada nesta fase. A seção `Jogar` já separa "um amigo neste dispositivo" de "motor de xadrez", deixando a escolha preparada.

## Cena 3D (Fase 02)

A cena é montada por `Scene` (`src/three/Scene.tsx`) em camadas independentes: iluminação, tabuleiro, peças, cenário de fundo, partículas e pós-processamento. Nada depende de assets externos.

- **Peças** (`pieces.ts` + `pieceProfiles.ts`): silhuetas de torno (lathe) para rei, rainha, torre, bispo e peão; o cavaleiro é uma extrusão com bisel do seu perfil. As mesmas silhuetas geram os ícones SVG da interface (`PieceIcon`), mantendo uma identidade única entre 2D e 3D.
- **Materiais** (`materials.ts`): obsidiana e marfim em `MeshPhysicalMaterial` com clearcoat; mármore e nogueira procedurais (`textures.ts`) desenhados em canvas. O ambiente de reflexão é pré-filtrado com PMREM a partir de uma "sala" de painéis emissivos (`environment.ts`), sem HDR externo.
- **Tabuleiro** (`Board.tsx`): moldura arredondada, 64 casas com bisel, filete de esmeralda e interação de hover/seleção demonstrativa.
- **Composição**: a variante `hero` enquadra o tabuleiro em perspectiva com peças soltas no piso, anéis, peças-fantasma, névoa, poeira e fachos de luz; `board` é o enquadramento de jogo; `ambient` usa peças flutuantes. A câmera tem parallax discreto e se reenquadra em telas estreitas.
- **Desempenho**: `ChessCanvas` é carregado sob demanda (`React.lazy`) e só monta quando entra na viewport (`SceneSlot`). O nível de qualidade (baixo/médio/alto) reduz sombras, partículas e pós-processamento; `prefers-reduced-motion` desliga parallax, flutuação e as animações de entrada. Sem WebGL, um pôster em CSS 3D assume o lugar (`SceneFallback`).
- **Pós-processamento**: bloom, grão, vinheta e SMAA via `@react-three/postprocessing`, apenas nos níveis médio e alto.

Arquivos de configuração permanecem na raiz. Diretórios adicionais serão criados **quando houver código real**, evitando estruturas vazias:

- `src/pages/` e `src/navigation/`: páginas e roteamento, quando necessários; componentes de interface compartilhados em `src/components/`.
- `src/features/<domínio>/`: composição de cada funcionalidade, com suas telas e casos de uso próprios.
- `src/chess/` e `src/engines/`: regras e contrato de adversário já existem — manter domínio puro, sem React, DOM ou SDKs de UI.
- `src/services/`: adaptadores externos para rede, autenticação, persistência e engine. Dependem dos contratos de domínio, nunca o contrário. Configuração pública em `src/config/`; nunca segredos no frontend.
- `src/styles/`: tokens e estilos compartilhados; testes de unidade de domínio e integração em `tests/` ou próximos ao módulo.

Fluxo previsto: interface → casos de uso/contratos de domínio ← adaptadores de infraestrutura. A lógica de xadrez deverá ser isolada e testável, sem depender de telas ou transporte; IA deverá usar um adaptador para worker/engine, sem incluir Stockfish agora. Para multiplayer, o backend futuro será autoridade; o cliente não decide resultados competitivos. As interfaces serão definidas quando os casos de uso forem conhecidos, evitando abstrações especulativas.

## Sistema de navegação (Etapa 2)

A navegação é um cabeçalho superior — não uma barra lateral. O catálogo de páginas e a hierarquia de categorias vivem em `src/app/navigation.ts`; adicionar uma seção é incluir uma entrada em `pages` e, se necessário, uma categoria em `navCategories`, sem tocar em componentes.

- **Cabeçalho** (`src/components/Header.tsx`): três regiões — marca (esquerda), navegação central (centro) e ações (direita). É fixo durante a rolagem por padrão, com desfoque aplicado num plano próprio (`::before`) para que os painéis continuem ancorados no gatilho.
- **Dropdowns** (`src/components/NavMenu.tsx`): categorias com descrição, itens com ícone e indicação da seção atual. Abrir um fecha o anterior; ESC e clique fora fecham; a seleção de uma opção fecha. O gatilho mantém `aria-expanded` e o painel usa `aria-controls`.
- **Busca** (`src/components/SearchPanel.tsx`): filtra o próprio catálogo por rótulo, título e palavras-chave, com normalização de acentos e setas do teclado. Nenhum resultado inventado.
- **Painéis** (`src/components/Popover.tsx`): primitivo de painel ancorado usado por busca, notificações e perfil, com fechamento por clique fora/ESC e retorno de foco ao gatilho.
- **Modo compacto**: `matchPages` em `navigation.ts` define os contextos de partida (`jogar`, `computador`). Nessas páginas o cabeçalho reduz a altura, omite os dropdowns e mantém marca, contexto, menu, configurações, perfil e o atalho 2D/3D.
- **Preferências** (`src/app/preferences.ts`): cabeçalho fixo, modo compacto em partidas e cena 3D ligada/desligada, persistidas em `localStorage` e propagadas por evento. A cena 3D desligada mantém o pôster estilizado (`SceneSlot`).
- **Responsivo**: acima de 1120px o cabeçalho usa `grid` `1fr auto 1fr` para centralizar a navegação; abaixo disso o menu expansível (`NavDrawer`) assume, com busca, atalhos e as categorias em acordeões.

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
