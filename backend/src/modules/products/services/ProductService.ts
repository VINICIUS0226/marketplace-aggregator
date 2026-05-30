import { ProductRepository } from "../repositories/ProductRepository";
import { AppError } from "../../../shared/errors/AppError";

interface Filters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export class ProductService {
  private repository = new ProductRepository();

  async listProducts(filters: Filters) {
    const products = await this.repository.getAllProducts();

    let result = [...products];

    if (filters.category) {
      result = result.filter(
        (product) =>
          product.category.toLowerCase() === filters.category?.toLowerCase(),
      );
    }

    if (filters.search) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(filters.search!.toLowerCase()),
      );
    }

    if (filters.minPrice) {
      result = result.filter((product) => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      result = result.filter((product) => product.price <= filters.maxPrice!);
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const start = (page - 1) * limit;
    const end = start + limit;

    const paginated = result.slice(start, end);

    return {
      data: paginated,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / limit),
      page,
      limit,
    };
  }

  async getProductById(id: number) {
    const products = await this.repository.getAllProducts();

    const product = products.find((product) => product.id === id);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    return product;
  }
}
