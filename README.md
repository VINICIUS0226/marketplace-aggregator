# Marketplace Aggregator

> Aplicação fullstack de integração e comparação de produtos, desenvolvida como case técnico para a posição de Desenvolvedor Fullstack Sênior.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-green)

---

## Visão Geral

Marketplace Aggregator centraliza produtos de uma API externa, expõe uma API REST própria e oferece uma interface web para busca, filtragem e comparação de produtos.

O projeto foi desenvolvido com foco em:

- arquitetura modular e por camadas
- separação clara entre domínio, infraestrutura e apresentação
- melhor desempenho pelo uso de cache local
- containerização com Docker Compose

---

## O que entrega

- API backend em **Node.js + Express + TypeScript**
- frontend em **React + Vite + Material UI**
- integração com API externa **DummyJSON**
- cache local para reduzir chamadas externas
- documentação interativa via **Swagger**
- execução completa via **Docker Compose**

---

## Tecnologias principais

- Node.js 20
- React 19
- TypeScript 6
- Express 5
- Vite
- Material UI
- React Router
- React Query
- Axios
- Docker / Docker Compose
- Swagger / OpenAPI

---

## Arquitetura

A aplicação segue uma arquitetura por camadas:

- **Routes**: definem os endpoints
- **Controllers**: validam e orquestram requisões
- **Services**: encapsulam regras de negócio
- **Repositories**: acessam a API externa e o cache

Essa separação facilita manutenção e evolução, mantendo o backend testável e extensível.

---

## Estrutura do projeto

```
marketplace-aggregator/
├── backend/
│   ├── src/
│   ├── modules/
│   │   └── products/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── routes/
│   │       ├── dtos/
│   │       └── types/
│   ├── shared/
│   │   ├── config/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   └── utils/
│   ├── app.ts
│   └── server.ts
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── routes/
│   ├── services/
│   └── theme/
├── docker-compose.yml
└── README.md
```

---

## API principais

### Listar produtos

```http
GET /products
```

Query params suportados:

- `page`
- `limit`
- `search`
- `category`
- `minPrice`
- `maxPrice`

### Buscar produto por ID

```http
GET /products/:id
```

### Listar categorias

```http
GET /products/categories
```

### Comparar produtos

```http
POST /products/compare
```

Body:

```json
{
  "ids": [1, 2, 3]
}
```

---

## Como executar

### Com Docker

```powershell
docker compose up --build
```

A aplicação será exposta em:

- backend: `http://localhost:3000`
- frontend: `http://localhost:5173`
- Swagger: `http://localhost:3000/api-docs`

### Localmente

#### Backend

```powershell
cd backend
npm install
npm run dev
```

#### Frontend

```powershell
cd frontend
npm install
npm run dev
```

---

## Variáveis de ambiente

### Frontend

Arquivo: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

### Backend

Arquivo opcional: `backend/.env`

```env
PORT=3000
```

---

## Observações sobre o projeto

- O cache local foi adotado para reduzir a dependência de chamadas à API externa e melhorar latência.
- A escolha por **React Query** simplifica o gerenciamento de requisições e estados assíncronos no frontend.
- O uso da **Context API** é suficiente para o escopo de seleção e comparação de produtos.
- A aplicação não utiliza banco de dados persistente para manter o foco na arquitetura e nos fluxos de dados.

---

## Melhorias futuras

- adicionar testes unitários e integração (Jest / Supertest)
- implementar persistência com banco de dados (PostgreSQL / Prisma)
- introduzir camada de cache distribuído (Redis)
- adicionar autenticação e autorização
- criar pipelines de CI/CD
- adicionar testes E2E / Cypress

---

## Observações de avaliação

Essa versão foca em:

- clareza de arquitetura
- separação de responsabilidades
- containerização íntegra
- facilidade de execução e documentação

---

## Autor

**Vinícius Nuñez Lopes**

GitHub: https://github.com/VINICIUS0226

LinkedIn: https://linkedin.com/in/vinicius-nunez-811245aa
