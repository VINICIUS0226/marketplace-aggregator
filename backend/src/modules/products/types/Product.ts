/**
 * Entidade de produto utilizada pela aplicação.
 *
 * Fonte de dados:
 * https://dummyjson.com/products
 */
export interface Product {
  /**
   * Identificador único do produto.
   */
  id: number;

  /**
   * Nome do produto.
   */
  title: string;

  /**
   * Descrição detalhada.
   */
  description: string;

  /**
   * Categoria do produto.
   */
  category: string;

  /**
   * Preço atual.
   */
  price: number;

  /**
   * Avaliação média dos usuários.
   */
  rating: number;

  /**
   * Quantidade disponível em estoque.
   */
  stock: number;

  /**
   * URL da imagem principal.
   */
  thumbnail: string;

  /**
   * Galeria de imagens do produto.
   */
  images: string[];
}