# Desenvolvimento local

Requisitos: Git, Node.js 22.12+ (recomendado 22 LTS) e npm. A instalação utiliza o registro npm e não requer conta nem credenciais. Na raiz do repositório:

```sh
npm ci
npm run dev
```

Acesse a URL informada por Vite; encerre com Ctrl+C. `npm run dev` escuta em todas as interfaces para permitir uso em ambiente de preview; em uma rede compartilhada restrinja o acesso ou execute `npx vite --host 127.0.0.1`.

```sh
npm run typecheck  # TypeScript
npm run lint       # ESLint
npm test           # Vitest, execução única
npm run build      # valida tipos e gera dist/
npm run preview    # serve o build localmente
```

Os testes em `tests/` usam jsdom e Testing Library; não substituem testes reais de navegação e acessibilidade. CI roda as mesmas verificações. Após mudar dependências, atualize `package-lock.json` e versione-o. `node_modules/`, `dist/`, arquivos de cache TypeScript e `.env` ficam fora do Git. Nunca coloque segredos em variáveis `VITE_`: elas são públicas no build.
