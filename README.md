# CHESS CORE

**The heart of chess.** Interface de uma plataforma de xadrez. A cena 3D em tempo real — tabuleiro em perspectiva, peças de obsidiana e marfim, luz cinematográfica e névoa — convive com o **tabuleiro 2D Classic Walnut**, onde partidas locais já rolam de verdade: regras oficiais completas (roque, en passant, promoção, xeque-mate, afogamento, repetição tripla, 50 movimentos e material insuficiente), relógio com incremento, histórico em SAN, desfazer/refazer, desistência e tela de resultado. Não há IA, contas, multiplayer online ou backend.

A cena é construída com three.js + React Three Fiber: geometria, materiais e texturas são procedurais, e o ambiente de reflexão é pré-filtrado em tempo de execução. Sem WebGL, um pôster em CSS 3D preserva a composição.

A navegação é um cabeçalho superior com categorias em dropdown, busca funcional sobre o catálogo de seções, notificações e perfil. Em `Jogar` e `Computador` o cabeçalho assume a forma compacta, com um atalho 2D/3D ao lado do perfil. Em telas estreitas o menu vira um painel com acordeões.

Em `Jogar`, a partida é preparada com adversário (dois jogadores no mesmo dispositivo; motores de xadrez chegam na Fase 5), controle de tempo — sem limite, 1+0, 3+0, 3+2, 5+0, 10+0 e 15+10 — e nome do jogador. O tabuleiro 2D é o padrão e não carrega a cena 3D; a cena continua opcional em `Início`, `Computador` e `Análise`.

## Início rápido

Requisitos: Node.js 22.12+ (recomendado Node 22 LTS), npm e Git. Não é necessário cartão, conta externa ou arquivo de ambiente para desenvolver localmente.

```sh
npm ci
npm run dev
```

Abra a URL mostrada no terminal. Para validar: `npm run typecheck`, `npm run lint`, `npm test` e `npm run build`. O resultado de produção fica em `dist/`. Consulte [DEVELOPMENT.md](DEVELOPMENT.md) para detalhes.

## Documentação

- [Arquitetura e design system](ARCHITECTURE.md)
- [Decisões tecnológicas](TECHNOLOGY_DECISIONS.md)
- [Plano de multiplayer](MULTIPLAYER_PLAN.md)
- [Catálogo futuro](FUTURE_FEATURES.md)
- [Roadmap](ROADMAP.md)
- [Desenvolvimento](DEVELOPMENT.md)
- [Publicação](DEPLOYMENT.md)

A infraestrutura atual não requer serviço pago. GitHub Pages tem limites e condições de elegibilidade; serviços futuros gratuitos também têm cotas. O deploy usa GitHub Actions a partir da branch `main`; consulte as instruções e limitações em [DEPLOYMENT.md](DEPLOYMENT.md).
