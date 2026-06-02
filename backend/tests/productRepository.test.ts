import axios from 'axios';
import { ProductRepository } from '../src/modules/products/repositories/ProductRepository';
import { cache } from '../src/shared/config/cache';
import {
  getMetricsSnapshot,
  resetMetrics,
} from '../src/shared/config/metrics';

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
    priceHistory: [],
  },
];

describe('ProductRepository', () => {
  beforeEach(() => {
    cache.flushAll();
    resetMetrics();
    mockedAxios.get.mockReset();
  });

  it('fetches products from external API and caches the result', async () => {
    mockedAxios.get.mockResolvedValue({ data: { products: exampleProducts } });

    const repository = new ProductRepository();
    const products = await repository.getAllProducts();

    expect(products[0]).toEqual(
      expect.objectContaining({
        ...exampleProducts[0],
        priceHistory: expect.any(Array),
      }),
    );
    expect(products[0].priceHistory).toHaveLength(5);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(getMetricsSnapshot().externalProviderSuccesses).toBe(1);
    expect((cache.get('products') as any)[0]).toEqual(
      expect.objectContaining({
        ...exampleProducts[0],
        priceHistory: expect.any(Array),
      }),
    );
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

  it('returns the last valid snapshot when the provider becomes unavailable', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { products: exampleProducts } });

    const repository = new ProductRepository();
    const products = await repository.getAllProducts();

    cache.del('products');
    mockedAxios.get.mockRejectedValue(new Error('Network failure'));

    await expect(repository.getAllProducts()).resolves.toEqual(products);
    expect(getMetricsSnapshot().staleCacheFallbacks).toBe(1);
  });

  it('rejects invalid external payloads when no snapshot is available', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { products: [{ id: 1 }] } });

    const repository = new ProductRepository();

    await expect(repository.getAllProducts()).rejects.toThrow(
      'Failed to retrieve products from external provider.',
    );
    expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    expect(getMetricsSnapshot().externalProviderRetries).toBe(2);
  });
});
