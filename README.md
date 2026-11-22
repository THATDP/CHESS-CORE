# CHESS CORE

**The heart of chess.** Fundação para uma futura plataforma de xadrez, organizada para evoluir sem antecipar as funcionalidades do produto. Esta é somente a Fase 01: a página exibida é um aviso técnico temporário, não uma interface final. Não há tabuleiro, partidas, contas ou multiplayer.

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

A infraestrutura atual não requer serviço pago. GitHub Pages tem limites e condições de elegibilidade; serviços futuros gratuitos também têm cotas. A publicação não ocorre automaticamente até configurar Pages e integrar o workflow à branch `main`.
