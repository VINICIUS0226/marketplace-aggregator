import request from 'supertest';
import app from '../src/app';
import { ProductRepository } from '../src/modules/products/repositories/ProductRepository';

const mockedProducts = [
  {
    id: 1,
    title: 'Test Product 1',
    description: 'Description 1',
    price: 100,
    category: 'electronics',
    rating: 4.5,
    stock: 10,
    thumbnail: 'image1.png',
    images: ['image1.png'],
  },
  {
    id: 2,
    title: 'Test Product 2',
    description: 'Description 2',
    price: 200,
    category: 'home',
    rating: 4.0,
    stock: 5,
    thumbnail: 'image2.png',
    images: ['image2.png'],
  },
];

describe('Products API', () => {
  beforeEach(() => {
    jest
      .spyOn(ProductRepository.prototype, 'getAllProducts')
      .mockResolvedValue(mockedProducts as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return health check status', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('uptime');
  });

  it('should list products with pagination', async () => {
    const response = await request(app).get('/products?page=1&limit=1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(1);
    expect(response.body).toHaveProperty('totalItems', 2);
    expect(response.body).toHaveProperty('totalPages', 2);
  });

  it('should return a product by id', async () => {
    const response = await request(app).get('/products/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
  });

  it('should return 404 for a non-existing product', async () => {
    const response = await request(app).get('/products/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
  });

  it('should return categories list', async () => {
    const response = await request(app).get('/products/categories');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(['electronics', 'home']));
  });

  it('should compare products by ids', async () => {
    const response = await request(app)
      .post('/products/compare')
      .send({ ids: [1, 2] });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should return 400 when compare ids is invalid', async () => {
    const response = await request(app)
      .post('/products/compare')
      .send({ ids: [] });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 when compare receives only one product', async () => {
    const response = await request(app)
      .post('/products/compare')
      .send({ ids: [1] });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 when compare ids contains a non-numeric value', async () => {
    const response = await request(app)
      .post('/products/compare')
      .send({ ids: [1, 'invalid'] });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });

  it('should login and return a JWT token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail login with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpass' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  it('should refresh product cache when authorized', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' });

    const token = loginResponse.body.token;

    jest
      .spyOn(ProductRepository.prototype, 'refreshProducts')
      .mockResolvedValue(mockedProducts as any);

    const response = await request(app)
      .post('/products/refresh-cache')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('totalItems', mockedProducts.length);
  });

  it('should return 401 for refresh cache without token', async () => {
    const response = await request(app).post('/products/refresh-cache');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
