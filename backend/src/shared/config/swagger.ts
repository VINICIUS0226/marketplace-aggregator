import swaggerJsdoc from "swagger-jsdoc";

/**
 * Configuração do Swagger/OpenAPI.
 *
 * Responsável pela geração automática da documentação
 * a partir das anotações presentes nas rotas.
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
        email: "seu-email@exemplo.com"
      }
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Development"
      }
    ],

    tags: [
      {
        name: "Products",
        description: "Operações relacionadas aos produtos"
      },
      {
        name: "System",
        description: "Monitoramento e saúde da aplicação"
      }
    ],

    components: {
      schemas: {
        Product: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            title: {
              type: "string",
              example: "Essence Mascara Lash Princess"
            },
            description: {
              type: "string",
              example: "Popular mascara from Essence"
            },
            category: {
              type: "string",
              example: "beauty"
            },
            price: {
              type: "number",
              example: 9.99
            },
            rating: {
              type: "number",
              example: 4.8
            },
            stock: {
              type: "integer",
              example: 99
            },
            thumbnail: {
              type: "string",
              example:
                "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg"
            },
            images: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        },

        PaginatedProducts: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Product"
              }
            },
            totalItems: {
              type: "integer",
              example: 100
            },
            totalPages: {
              type: "integer",
              example: 10
            },
            page: {
              type: "integer",
              example: 1
            },
            limit: {
              type: "integer",
              example: 10
            }
          }
        },

        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Product not found"
            }
          }
        }
      }
    }
  },

  apis: [
    "./src/modules/**/*.ts",
    "./src/app.ts"
  ]
};

export const swaggerSpec = swaggerJsdoc(options);