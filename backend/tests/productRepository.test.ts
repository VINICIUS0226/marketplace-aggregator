import axios from 'axios';
import { ProductRepository } from '../src/modules/products/repositories/ProductRepository';
import { cache } from '../src/shared/config/cache';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const exampleProducts = [
  {
    id: 1,
    title: 'Test Product',
    description: 'Test description',
    price: 50,
    category: 'test',
    rating: 4,
    stock: 10,
    thumbnail: 'test.png',
    images: ['test.png'],
  },
];

describe('ProductRepository', () => {
  beforeEach(() => {
    cache.flushAll();
  });

  it('fetches products from external API and caches the result', async () => {
    mockedAxios.get.mockResolvedValue({ data: { products: exampleProducts } });

    const repository = new ProductRepository();
    const products = await repository.getAllProducts();

    expect(products).toEqual(exampleProducts);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(cache.get('products')).toEqual(exampleProducts);
  });

  it('returns cached products when available', async () => {
    cache.set('products', exampleProducts);

    const repository = new ProductRepository();
    const products = await repository.getAllProducts();

    expect(products).toEqual(exampleProducts);
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('throws a general error when external API fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network failure'));

    const repository = new ProductRepository();

    await expect(repository.getAllProducts()).rejects.toThrow(
      'Failed to retrieve products from external provider.',
    );
  });
});
