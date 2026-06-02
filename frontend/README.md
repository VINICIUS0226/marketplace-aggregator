# Frontend

Interface React do Marketplace Aggregator.

## Responsabilidades

- Listar produtos com paginação, busca e filtros.
- Exibir detalhes e histórico sintético de preços.
- Manter a seleção local de produtos para comparação lado a lado.
- Consumir a API REST do backend com React Query e Axios.

## Desenvolvimento

```bash
npm install
npm run dev
```

A URL do backend pode ser configurada com:

```env
VITE_API_URL=http://localhost:3000
```

Sem essa variável, o frontend usa `http://localhost:3000` para desenvolvimento e E2E.

## Validação

```bash
npm run lint
npm test
npm run build
npm run e2e:install
npm run test:e2e
```

Consulte o [README principal](../README.md) para executar a solução completa com Docker.
