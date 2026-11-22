# GitHub Pages

O workflow `.github/workflows/deploy.yml` valida e constrói o site e envia `dist/` ao Pages com as ações oficiais. Executa em pushes para `main` e também permite disparo manual, mas o deploy só ocorre a partir de `main`. O CI separado roda em pushes e pull requests. Não requer token pessoal; usa o `GITHUB_TOKEN` e permissões do workflow.

## Ativação manual

1. Envie as alterações da branch atual ao GitHub e integre-as em `main` por um pull request, quando aprovado. Os arquivos locais não publicam nada por si só.
2. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions** como Source. Se necessário, confira permissões de Actions e proteção do ambiente `github-pages` nas configurações do repositório.
3. Após o push em `main`, acompanhe **Actions → Deploy GitHub Pages**, incluindo a etapa `deploy`. Alternativamente, execute **Run workflow** escolhendo `main`.
4. Consulte a URL em Settings → Pages ou na saída do deploy e verifique o site e refresh. Para este repositório, se público e sem domínio customizado, a URL normalmente é `https://thatdp.github.io/CHESS-CORE/`; a URL efetiva depende das configurações do GitHub.

GitHub Pages em repositórios privados depende do plano/elegibilidade do GitHub. Consulte [disponibilidade](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) e [limites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits); não contratar plano pago. Se não houver permissão administrativa, solicite ao proprietário a configuração.

## Caminhos e navegação

Vite usa `base: './'`, gerando caminhos relativos para JS e CSS tanto na raiz quanto sob o prefixo do repositório. Hoje só existe `index.html`: carregar e atualizar a URL inicial funciona sem fallback. Não há roteamento profundo. Futuras rotas devem usar fragmento ou uma estratégia explícita para o 404 do Pages; base relativa sozinha não resolve URLs HTML5 profundas. Referencie arquivos públicos futuros com `import.meta.env.BASE_URL` ou imports Vite, não com `/` absoluto.

Teste local: `npm run build` e `npm run preview`, abra a URL exibida e atualize. Para simular subdiretório, sirva o conteúdo de `dist` sob um prefixo e verifique carregamento dos assets. Isso não confirma o deploy real. Não comite `dist/`. Consulte [documentação oficial do deploy via Actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
