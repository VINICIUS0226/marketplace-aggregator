# Marketplace Aggregator

> Solução Fullstack desenvolvida como resposta ao Case Técnico para a posição de Desenvolvedor Fullstack Sênior da Webcontinental.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-green)
![CI](https://github.com/VINICIUS0226/marketplace-aggregator/actions/workflows/ci.yml/badge.svg)
![Coverage](https://img.shields.io/badge/coverage-unknown-lightgrey)

---

# Sumário

- [Visão Geral](#visão-geral)
- [Objetivos](#objetivos)
- [Arquitetura da Solução](#arquitetura-da-solução)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Fonte de Dados](#fonte-de-dados)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Padrão Arquitetural](#padrão-arquitetural)
- [Fluxo de Dados](#fluxo-de-dados)
- [Backend](#backend)
- [Frontend](#frontend)
- [Tratamento de Erros](#tratamento-de-erros)
- [Estratégia de Cache](#estratégia-de-cache)
- [Resiliência](#resiliência)
- [Segurança](#segurança)
- [Docker](#docker)
- [Testes](#testes)
- [Como Executar](#como-executar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Decisões Arquiteturais](#decisões-arquiteturais)
- [Trade-offs Assumidos](#trade-offs-assumidos)
- [Melhorias Futuras](#melhorias-futuras)
- [Evidências](#evidências)
- [Autor](#autor)

---

# Visão Geral

O Marketplace Aggregator é uma aplicação Fullstack responsável por consolidar produtos provenientes de uma fonte externa, disponibilizando-os através de uma API REST e de uma interface web para consulta, filtragem e comparação.

O projeto foi desenvolvido com foco em:

- Arquitetura limpa
- Separação de responsabilidades
- Escalabilidade
- Legibilidade
- Manutenibilidade
- Boas práticas de desenvolvimento
- Experiência do usuário

O objetivo principal foi simular um cenário próximo ao contexto real de marketplaces, onde produtos oriundos de diferentes fontes precisam ser centralizados para análise e comparação.

---

# Objetivos

Este projeto busca demonstrar competências relacionadas a:

- Desenvolvimento Fullstack
- Arquitetura de Software
- Integração com APIs externas
- Organização de código
- Design de APIs REST
- Boas práticas de frontend moderno
- Tratamento de erros
- Documentação técnica
- Containerização

---

# Arquitetura da Solução

```text
┌────────────────────────────┐
│      React + MUI UI        │
└─────────────┬──────────────┘
              │ HTTP
              ▼
┌────────────────────────────┐
│     Node.js + Express      │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│      Product Service       │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│    Product Repository      │
└─────────────┬──────────────┘
              │
              ▼
┌────────────────────────────┐
│      DummyJSON API         │
└────────────────────────────┘
```

---

# Tecnologias Utilizadas

## Backend

- Node.js
- Express
- TypeScript
- Axios
- Swagger / OpenAPI
- Node Cache
- Express Rate Limit
- Jest
- Supertest

## Frontend

- React
- TypeScript
- Vite
- Material UI
- React Router
- React Query (TanStack Query)
- Axios
- Context API

## Infraestrutura

- Docker
- Docker Compose

---

# Fonte de Dados

Os produtos são consumidos através da API pública DummyJSON:

https://dummyjson.com/products

A escolha foi realizada considerando:

- Facilidade de integração
- Disponibilidade pública
- Estrutura consistente
- Ausência de autenticação
- Boa variedade de dados

Exemplo de payload:

```json
{
  "id": 1,
  "title": "Product",
  "description": "Description",
  "price": 100,
  "category": "smartphones",
  "rating": 4.5,
  "stock": 10
}
```

---

# Funcionalidades Implementadas

## Ingestão de Dados

- Consumo de API externa
- Timeout configurado
- Tratamento de falhas
- Cache local
- Reutilização dos dados em memória

---

## Listagem de Produtos

Funcionalidades:

- Paginação
- Busca textual
- Filtro por categoria
- Filtro por faixa de preço

Exemplos:

```http
GET /products?page=1&limit=10
```

```http
GET /products?search=iphone
```

```http
GET /products?category=smartphones
```

```http
GET /products?minPrice=100&maxPrice=500
```

---

## Detalhamento de Produto

Exibe:

- Nome
- Categoria
- Preço
- Descrição
- Rating
- Estoque
- Imagens

---

## Comparação de Produtos

Permite selecionar múltiplos produtos e compará-los lado a lado.

Atributos comparados:

- Preço
- Categoria
- Rating
- Estoque

---

## Documentação da API

Documentação interativa disponível através do Swagger:

```text
http://localhost:3000/api-docs
```

---

# Estrutura do Projeto

```text
marketplace-aggregator

├── backend
│
│   ├── src
│   │
│   ├── modules
│   │   └── products
│   │       ├── controllers
│   │       ├── services
│   │       ├── repositories
│   │       ├── routes
│   │       ├── dtos
│   │       └── types
│   │
│   ├── shared
│   │   ├── config
│   │   ├── errors
│   │   ├── middlewares
│   │   └── utils
│   │
│   ├── tests
│   │
│   ├── app.ts
│   └── server.ts
│
├── frontend
│
│   ├── src
│   │
│   ├── pages
│   ├── components
│   ├── contexts
│   ├── hooks
│   ├── routes
│   ├── services
│   ├── theme
│   └── types
│
├── docs
│
├── docker-compose.yml
│
└── README.md
```

---

# Padrão Arquitetural

Foi adotada uma arquitetura baseada em camadas:

```text
Routes
 ↓
Controllers
 ↓
Services
 ↓
Repositories
```

---

## Controllers

Responsáveis por:

- Receber requisições HTTP
- Validar parâmetros
- Encaminhar chamadas para a camada de serviço

---

## Services

Responsáveis por:

- Regras de negócio
- Paginação
- Filtros
- Comparação
- Processamento dos dados

---

## Repositories

Responsáveis por:

- Consumo da API externa
- Cache
- Recuperação dos dados

---

# Fluxo de Dados

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
External API
   ↓
Response
```

---

# Backend

## Endpoints

### Listagem de Produtos

```http
GET /products
```

### Query Params

| Parâmetro | Tipo |
|------------|--------|
| page | number |
| limit | number |
| search | string |
| category | string |
| minPrice | number |
| maxPrice | number |

---

### Buscar Produto por ID

```http
GET /products/:id
```

---

### Listar Categorias

```http
GET /products/categories
```

---

### Comparar Produtos

```http
POST /products/compare
```

Body:

```json
{
  "ids": [1,2,3]
}
```

---

# Tratamento de Erros

Foi implementado um middleware global de tratamento de erros.

Componentes:

```text
AppError
```

```text
errorHandler
```

Exemplo de resposta:

```json
{
  "message": "Product not found"
}
```

---

# Estratégia de Cache

Foi utilizado:

```text
Node Cache
```

Configuração:

```text
TTL: 300 segundos
```

Objetivos:

- Reduzir chamadas externas
- Melhorar desempenho
- Melhorar disponibilidade

---

# Resiliência

Foram implementadas estratégias para lidar com falhas externas:

- Timeout configurado
- Try/Catch centralizado
- Tratamento de exceções
- Cache local
- Mensagens padronizadas

---

# Frontend

## Tecnologias

- React
- Material UI
- React Router
- React Query
- Axios
- Context API

---

## React Query

Utilizado para:

- Cache de requisições
- Controle de loading
- Revalidação automática
- Sincronização de dados

---

## Context API

Utilizado para gerenciamento da seleção de produtos para comparação.

Motivos:

- Simplicidade
- Baixo acoplamento
- Escopo adequado ao projeto

---

## Material UI

Utilizado para:

- Padronização visual
- Componentização
- Responsividade
- Agilidade no desenvolvimento

---

# Interface

## Tela de Produtos

Funcionalidades:

- Busca
- Paginação
- Filtro por categoria
- Seleção para comparação

---

## Tela de Detalhes

Exibe:

- Imagem
- Nome
- Categoria
- Preço
- Descrição
- Rating
- Estoque

---

## Tela de Comparação

Exibe os produtos selecionados em formato tabular permitindo comparação visual rápida.

---

# Segurança

Foram implementados:

## Helmet

Proteção básica contra vulnerabilidades HTTP.

---

## CORS

Controle de acesso entre frontend e backend.

---

## Rate Limiting

Proteção contra excesso de requisições.

Exemplo:

```text
100 requisições por IP a cada 15 minutos
```

---

# Docker

A aplicação pode ser executada integralmente através do Docker.

Executar:

```bash
docker compose up --build
```

---

## Docker (modo desenvolvimento)

Para desenvolvimento com hot-reload e mapeamento de código fonte:

```bash
docker compose up --build
# abre o frontend em http://localhost:5173 e backend em http://localhost:3000
```

O `docker-compose.yml` monta os diretórios `./frontend` e `./backend` como volumes para facilitar o fluxo dev.

## Docker (modo produção)

Para executar em modo produção (buildar artefatos e servir conteúdo estático), ajuste o `Dockerfile` do frontend para usar um servidor estático (nginx ou `serve`) e então:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Considere criar `docker-compose.prod.yml` com serviços otimizados para produção.


## Serviços

| Serviço | Porta |
|----------|----------|
| Frontend | 5173 |
| Backend | 3000 |

---

# Como Executar

## Clonar Projeto

```bash
git clone <url-do-repositorio>
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Variáveis de Ambiente

## Frontend

Arquivo:

```text
frontend/.env
```

Conteúdo:

```env
VITE_API_URL=http://localhost:3000
```

---

## Backend

Arquivo:

```text
backend/.env
```

Conteúdo:

```env
PORT=3000
```

---

# Testes

### Backend

```bash
cd backend
npm test
```

A suíte atual cobre os endpoints principais de produtos e garante a lógica de filtros, busca, comparação e tratamento de erros.

---

# CI

A pipeline de integração contínua está configurada em `.github/workflows/ci.yml` e executa:

- `npm install`
- `npm test` no backend
- `npm run build` no frontend

---

# Decisões Arquiteturais

## Por que Express?

Foi escolhido pela simplicidade, maturidade e produtividade para o escopo do desafio.

---

## Por que React?

Permite componentização, reutilização e desenvolvimento rápido de interfaces modernas.

---

## Por que Material UI?

Permite criar interfaces consistentes e responsivas utilizando componentes amplamente adotados pelo mercado.

---

## Por que React Query?

Reduz significativamente a complexidade do gerenciamento de estado assíncrono.

---

## Por que Context API?

O volume de estado compartilhado é pequeno e não justifica bibliotecas mais robustas como Redux ou Zustand.

---

## Por que não utilizar banco de dados?

O desafio explicitamente permite persistência em memória.

Dessa forma, foi priorizado o foco na arquitetura e organização do código.

---

# Trade-offs Assumidos

Para manter foco nos objetivos do desafio, não foram implementados:

- Autenticação JWT
- Banco de dados relacional
- Histórico persistente de preços
- Mensageria
- Deploy em nuvem

Esses itens agregariam complexidade sem impactar diretamente os critérios principais de avaliação.

---

# Melhorias Futuras

## Backend

- PostgreSQL
- Prisma ORM
- Redis
- JWT
- Refresh Tokens
- RabbitMQ
- OpenTelemetry
- Logs estruturados
- CI/CD
- Testes E2E

---

## Frontend

- Zustand
- React Hook Form
- Debounce na busca
- DataGrid Avançado
- Dark Mode
- Internacionalização

---

## Infraestrutura

- AWS
- Kubernetes
- Nginx
- GitHub Actions
- Monitoramento
- Observabilidade

---

# Evidências

## Swagger

Adicionar screenshot:

```text
/docs/swagger.png
```

---

## Produtos

Adicionar screenshot:

```text
/docs/products.png
```

---

## Detalhes

Adicionar screenshot:

```text
/docs/product-detail.png
```

---

## Comparação

Adicionar screenshot:

```text
/docs/comparison.png
```

---

# Considerações Finais

O foco principal deste projeto foi demonstrar a construção de uma aplicação Fullstack organizada, escalável e alinhada às boas práticas de engenharia de software.

Mesmo sem a utilização de persistência relacional, a estrutura foi planejada para permitir evolução futura com baixo acoplamento e mínima necessidade de refatoração.

A arquitetura adotada busca refletir cenários encontrados em ambientes corporativos reais, priorizando legibilidade, manutenção e extensibilidade.

---

# Autor

**Vinícius Nuñez Lopes**

Bacharel em Ciência da Computação  
Mestrando em Engenharia de Software

## Tecnologias Principais

- React
- Node.js
- TypeScript
- Laravel
- Vue.js
- Python
- Machine Learning
- Data Science

## Contato

GitHub: https://github.com/VINICIUS0226

LinkedIn: https://linkedin.com/in/vinicius-nunez-811245aa