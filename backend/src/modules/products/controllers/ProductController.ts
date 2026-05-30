import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

const service = new ProductService();

export class ProductController {
  async list(request: Request, response: Response) {
    const result = await service.listProducts({
      category: request.query.category as string,
      search: request.query.search as string,
      minPrice: Number(request.query.minPrice),
      maxPrice: Number(request.query.maxPrice),
      page: Number(request.query.page),
      limit: Number(request.query.limit)
    });

    return response.json(result);
  }

  async show(request: Request, response: Response) {
    const id = Number(request.params.id);

    const product = await service.getProductById(id);

    if (!product) {
      return response.status(404).json({
        message: "Product not found"
      });
    }

    return response.json(product);
  }
}