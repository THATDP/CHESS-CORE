# Arquitetura

## Princípios

Uma aplicação estática React/TypeScript construída pelo Vite e servida pelo GitHub Pages. O navegador executa a interface; Pages não executa backend nem WebSockets. Não há servidor, persistência, provedor ou autenticação conectados nesta fase. A interface inclui navegação por hash, configuração de partida demonstrativa e uma cena de xadrez **tridimensional em tempo real** (three.js + React Three Fiber), com geometria, materiais e texturas gerados por código — nenhum modelo ou imagem externa é baixado. Nenhuma funcionalidade de jogo está implementada: o tabuleiro e as peças são demonstrativos e não aplicam regras.

## Organização atual

```text
.github/workflows/  CI e publicação
src/app/            composição e catálogo de navegação (12 seções)
src/components/     componentes de interface, pôster da cena, mini-tabuleiros
src/pages/          as doze páginas visuais
src/three/          motor 3D: cena, peças, materiais, texturas, qualidade
src/styles/         tokens, componentes e responsividade
src/main.tsx        ponto de entrada
tests/              testes da interface, da geometria e da montagem da cena
```

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
