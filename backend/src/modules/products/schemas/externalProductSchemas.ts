import { z } from "zod";

/**
 * Contrato aceito da DummyJSON antes da normalizacao para o dominio interno.
 *
 * O passthrough preserva campos adicionais fornecidos pelo catalogo externo,
 * enquanto os campos usados pela aplicacao continuam validados explicitamente.
 */
export const externalProductSchema = z
  .object({
    id: z.number().int().positive(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    price: z.number(),
    rating: z.number(),
    stock: z.number().int(),
    thumbnail: z.string(),
    images: z.array(z.string()),
  })
  .passthrough();

export const externalProductsResponseSchema = z.object({
  products: z.array(externalProductSchema),
});

export type ExternalProduct = z.infer<typeof externalProductSchema>;
