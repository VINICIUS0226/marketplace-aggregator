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
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    price: z.number().nonnegative(),
    rating: z.number().min(0).max(5),
    stock: z.number().int().nonnegative(),
    thumbnail: z.url(),
    images: z.array(z.url()).min(1),
  })
  .passthrough();

export const externalProductsResponseSchema = z.object({
  products: z.array(externalProductSchema),
});

export type ExternalProduct = z.infer<typeof externalProductSchema>;
