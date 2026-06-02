import swaggerJsdoc from "swagger-jsdoc";

/**
 * Configuração OpenAPI gerada a partir das anotações das rotas.
 *
 * Manter schemas centrais aqui reduz duplicação na documentação e facilita
 * validar manualmente os contratos expostos pela API.
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Marketplace Aggregator API",
      version: "1.0.0",
      description:
        "API para agregação, busca, filtragem e comparação de produtos de marketplace.",
      contact: {
        name: "Vinícius Nuñez",
      },
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development",
      },
    ],

    tags: [
      {
        name: "Products",
        description: "Operações relacionadas aos produtos",
      },
      {
        name: "Auth",
        description: "Operações de autenticação e segurança",
      },
      {
        name: "Operations",
        description: "Health check e métricas operacionais",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Essence Mascara Lash Princess" },
            description: { type: "string", example: "Popular mascara from Essence" },
            category: { type: "string", example: "beauty" },
            price: { type: "number", example: 9.99 },
            rating: { type: "number", example: 4.8 },
            stock: { type: "integer", example: 99 },
            thumbnail: {
              type: "string",
              example:
                "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
            },
            images: {
              type: "array",
              items: { type: "string" },
            },
            priceHistory: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  date: { type: "string", example: "2026-05-28" },
                  price: { type: "number", example: 99 },
                },
              },
            },
          },
        },

        PaginatedProducts: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Product",
              },
            },
            totalItems: { type: "integer", example: 100 },
            totalPages: { type: "integer", example: 10 },
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            expiresIn: {
              type: "string",
              example: "1h",
            },
          },
        },

        RefreshCacheResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Product cache refreshed successfully.",
            },
            totalItems: {
              type: "integer",
              example: 100,
            },
          },
        },

        MetricsSnapshot: {
          type: "object",
          properties: {
            externalProviderRequests: { type: "integer", example: 3 },
            externalProviderSuccesses: { type: "integer", example: 1 },
            externalProviderFailures: { type: "integer", example: 2 },
            externalProviderRetries: { type: "integer", example: 2 },
            staleCacheFallbacks: { type: "integer", example: 1 },
          },
        },

        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "ok" },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2026-06-02T15:00:00.000Z",
            },
            uptime: { type: "number", example: 120.5 },
          },
        },

        ValidationIssue: {
          type: "object",
          properties: {
            path: {
              type: "string",
              example: "limit",
            },
            message: {
              type: "string",
              example: "Too big: expected number to be <=50",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Product not found",
            },
            issues: {
              type: "array",
              description: "Detalhes opcionais retornados para erros de validacao Zod.",
              items: {
                $ref: "#/components/schemas/ValidationIssue",
              },
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/modules/**/*.ts",
    "./src/app.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
