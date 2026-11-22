# Decisões tecnológicas

## Contexto e seleção

A fundação deve ser estática, gratuita e pequena. React + TypeScript + Vite oferecem componentes, verificação estática e build de arquivos estáticos sem exigir servidor. React facilita a futura composição de áreas independentes; TypeScript limita erros nas fronteiras; Vite trata módulos e recursos para Pages. Todos têm código aberto e podem ser usados sem assinatura; verificar licenças dos componentes adicionados futuramente. npm e lockfile tornam instalações reproduzíveis.

- **React em vez de HTML/JS puro:** há muitas áreas interativas previstas; o custo inicial de bundle é aceitável, sem biblioteca de estado ou componentes agora.
- **Vite em vez de framework SSR:** Pages não executa servidor; SSR e backend neste momento seriam complexidade e custo desnecessários.
- **CSS nativo:** suficiente para a fundação; tokens e componentes surgirão conforme necessidades reais, sem framework visual obrigatório.
- **ESLint, TypeScript, Vitest e Testing Library:** verificações e testes de unidade/integração locais e no CI, sem serviço pago. Não há suíte de navegador real nesta fase.
- **Navegação:** hash routing próprio, sem biblioteca de roteamento — o fragmento não é enviado ao servidor e o build `base: './'` continua funcionando no Pages. O catálogo de páginas e a hierarquia de categorias ficam em `src/app/navigation.ts`; os componentes de cabeçalho e dropdown consomem esse catálogo, então uma seção nova não exige mudar a navegação. Dropdowns são implementados na mão (clique, ESC, clique fora, foco) em vez de uma biblioteca: o comportamento exigido é pequeno e evita dependência e CSS conflitante.
- **Preferências de navegação:** `src/app/preferences.ts` guarda cabeçalho fixo, modo compacto em partidas e cena 3D ligada/desligada em `localStorage`, com um evento próprio para propagar a mudança para cabeçalho e páginas sem estado global.
- **3D em tempo real:** three.js com React Three Fiber. A cena é montada por componentes e os assets (geometria, materiais, texturas, ambiente de reflexão) são gerados por código, evitando downloads e licenças de modelos. Post-processing fica em chunk próprio e é carregado sob demanda. Drei foi avaliado e descartado: `Grid` e `Sparkles` foram reimplementados em dezenas de linhas, reduzindo o bundle. three.js é a base; não há servidor de assets.
- **Fontes:** Fraunces (display), Manrope (interface) e JetBrains Mono (etiquetas) empacotadas com Fontsource, sem depender de CDN ou de sistema do usuário.
- **Chess/Stockfish:** não instalados. Avaliar biblioteca de regras e distribuição WebAssembly/worker do Stockfish apenas em fase própria, incluindo compatibilidade de navegador, desempenho, licenças GPL e obrigações de distribuição. Comunicação via contrato independente da UI.
- **Multiplayer:** recomendação futura Supabase Free, com servidor autoritativo e limites explicitados em [MULTIPLAYER_PLAN.md](MULTIPLAYER_PLAN.md). Não conectado nem garantido para escala ilimitada.

Não escolhemos banco local como fonte de verdade competitiva, serviço de IA pago ou um backend prematuro. Nenhum serviço gratuito é garantia de disponibilidade ou de escala ilimitada. Revisar versões, licenças, custos e limites antes de novas decisões.
