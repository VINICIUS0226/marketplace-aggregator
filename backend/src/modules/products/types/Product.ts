/**
 * Contrato interno de produto.
 *
 * Ele deriva da DummyJSON, mas é tratado como modelo da aplicação para evitar
 * espalhar detalhes da fonte externa pelas camadas de serviço e frontend.
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

  /**
   * Histórico sintético usado para cumprir o diferencial de variação de preço
   * sem adicionar persistência ao escopo obrigatório.
   */
  priceHistory: Array<{
    date: string;
    price: number;
  }>;
}
