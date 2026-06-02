import { z } from "zod";

const optionalQueryNumber = z.preprocess(
  (value) => value === undefined ? undefined : Number(value),
  z.number().nonnegative().optional(),
);

const optionalPositiveInteger = z.preprocess(
  (value) => value === undefined ? undefined : Number(value),
  z.number().int().positive().optional(),
);

const optionalQueryText = z.preprocess(
  (value) => typeof value === "string" && value.trim() === "" ? undefined : value,
  z.string().trim().min(1).optional(),
);

export const listProductsQuerySchema = z
  .object({
    category: optionalQueryText,
    search: optionalQueryText,
    minPrice: optionalQueryNumber,
    maxPrice: optionalQueryNumber,
    page: optionalPositiveInteger,
    limit: z.preprocess(
      (value) => value === undefined ? undefined : Number(value),
      z.number().int().positive().max(100).optional(),
    ),
  })
  .refine(
    ({ minPrice, maxPrice }) =>
      minPrice === undefined ||
      maxPrice === undefined ||
      minPrice <= maxPrice,
    {
      message: "minPrice must be less than or equal to maxPrice.",
      path: ["minPrice"],
    },
  );

export const productIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const compareProductsBodySchema = z.object({
  ids: z
    .array(z.number().int().positive())
    .min(2)
    .refine(
      (ids) => new Set(ids).size === ids.length,
      "Product ids must be unique.",
    ),
});
