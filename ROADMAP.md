# Roadmap proposto

A ordem e o escopo posteriores são propostas, não compromisso de entrega. Cada fase requer instruções e validação próprias.

1. **Fundação:** estrutura, ferramentas, documentação e publicação estática (esta fase).
2. **Produto e design:** interface demonstrativa, navegação e diretrizes visuais (Fase 02 — concluída: cena 3D em tempo real e as doze seções).
3. **Navegação:** concluída — cabeçalho superior com dropdowns, busca, notificações, perfil, responsividade e cabeçalho compacto em partidas.
4. **Núcleo de xadrez:** concluído — regras oficiais via `chess.js` 1.4.0 por uma camada própria (`src/chess/`), com testes de roque, en passant, promoção, xeque-mate, afogamento, repetição tripla, 50 movimentos e material insuficiente.
5. **Experiência local:** tabuleiro 2D (tema Classic Walnut) com clique e arrastar, relógio com incremento, histórico em SAN, desfazer/refazer, desistência e resultado. Concluída a partida local entre dois jogadores no mesmo dispositivo; a escolha de engine fica para a Fase 5.
6. **IA e análise:** avaliar Stockfish, workers, desempenho e licenças.
7. **Contas e dados:** identidade, perfis, privacidade, esquema e migrações.
8. **Multiplayer:** backend autoritativo, sincronização e testes de segurança e reconexão, sujeito às cotas gratuitas.
9. **Aprendizado:** puzzles, treinamento e progresso.
10. **Competição:** rankings, torneios, integridade e auditoria.
11. **Comunidade e expansão:** amigos, social, variantes, personalização, estatísticas e ferramentas avançadas.

Cada etapa deve confirmar custos, licenças, acessibilidade, testes e requisitos de operação antes da implementação. Não iniciar a próxima automaticamente.
