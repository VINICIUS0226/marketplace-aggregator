/**
 * Contrato de produto consumido pelo frontend.
 *
 * Mantém a UI alinhada com a resposta da API e evita espalhar `any` pelos
 * componentes principais.
 */
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  priceHistory?: Array<{
    date: string;
    price: number;
  }>;
}

export interface PaginatedProducts {
  data: Product[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
}
