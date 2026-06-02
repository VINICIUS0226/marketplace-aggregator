# Evidências do Projeto

Este diretório contém capturas reais usadas no README principal para facilitar a avaliação visual da entrega:

- `products.png`: listagem com filtros.
- `product-detail.png`: detalhe e histórico sintético de preços.
- `comparison.png`: comparação lado a lado.
- `comparison-mobile.png`: comparação responsiva em viewport móvel.
- `swagger.png`: documentação Swagger da API.

As imagens podem ser regeneradas executando:

```bash
cd frontend
npm run test:e2e
```

O cenário `e2e/evidence.spec.ts` percorre as telas e atualiza as capturas.
