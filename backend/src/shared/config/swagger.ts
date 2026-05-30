import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Marketplace Aggregator API",
      version: "1.0.0",
      description:
        "API para agregação e comparação de produtos de marketplace"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },

  apis: [
    "./src/modules/**/*.ts"
  ]
};

export const swaggerSpec =
  swaggerJsdoc(options);