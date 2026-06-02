import { ProductService } from '../src/modules/products/services/ProductService';
import { ProductRepository } from '../src/modules/products/repositories/ProductRepository';
import { Product } from '../src/modules/products/types/Product';

const mockedProducts: Product[] = [
  {
    id: 1,
    title: 'Phone X',
    description: 'A great phone',
    price: 300,
    category: 'electronics',
    rating: 4.7,
    stock: 12,
    thumbnail: 'phone.png',
    images: ['phone.png'],
    priceHistory: [
      { date: '2026-05-28', price: 290 },
      { date: '2026-05-29', price: 295 },
      { date: '2026-05-30', price: 300 },
      { date: '2026-05-31', price: 305 },
      { date: '2026-06-01', price: 310 },
    ],
  },
  {
    id: 2,
    title: 'Coffee Mug',
    description: 'Ceramic mug',
    price: 25,
    category: 'home',
    rating: 4.2,
    stock: 50,
    thumbnail: 'mug.png',
    images: ['mug.png'],
    priceHistory: [
      { date: '2026-05-28', price: 23 },
      { date: '2026-05-29', price: 24 },
      { date: '2026-05-30', price: 25 },
      { date: '2026-05-31', price: 26 },
      { date: '2026-06-01', price: 27 },
    ],
  },
];

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService(new ProductRepository());
    jest
      .spyOn(ProductRepository.prototype, 'getAllProducts')
      .mockResolvedValue(mockedProducts);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns paginated products when filters are applied', async () => {
    const result = await service.listProducts({ page: 1, limit: 1 });

    expect(result.data).toHaveLength(1);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(2);
  });

  it('filters products by category', async () => {
    const result = await service.listProducts({ category: 'electronics' });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].category).toBe('electronics');
    expect(result.totalItems).toBe(1);
  });

  it('filters products by search term', async () => {
    const result = await service.listProducts({ search: 'mug' });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toContain('Mug');
  });

  it('returns product by id', async () => {
    const product = await service.getProductById(1);

    expect(product).toBeDefined();
    expect(product.id).toBe(1);
  });

  it('throws when product id is missing', async () => {
    await expect(service.getProductById(999)).rejects.toThrow('Product not found');
  });

  it('compares multiple products by ids', async () => {
    const products = await service.compareProducts([1, 2]);

    expect(products).toHaveLength(2);
  });

  it('returns distinct categories', async () => {
    const categories = await service.getCategories();

    expect(categories).toEqual(['electronics', 'home']);
  });
});
