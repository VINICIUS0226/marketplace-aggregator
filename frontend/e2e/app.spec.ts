import { test, expect } from '@playwright/test';

test('should load product list page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Marketplace Aggregator')).toBeVisible();

  const detailItems = page.getByText('View details');
  await expect(detailItems.first()).toBeVisible();
  expect(await detailItems.count()).toBeGreaterThan(0);
});

test('should navigate to product detail page', async ({ page }) => {
  await page.goto('/');

  const firstDetailLink = page.getByText('View details').first();
  await expect(firstDetailLink).toBeVisible();

  await firstDetailLink.click();
  await expect(page).toHaveURL(/\/products\/\d+/);
  await expect(page.getByText('Back')).toBeVisible();
});

test('should compare two selected products', async ({ page }) => {
  await page.goto('/');

  const checkboxes = page.getByRole('checkbox');
  await expect(checkboxes.nth(1)).toBeVisible();

  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();

  await page.getByRole('button', { name: /Open comparison/i }).click();

  await expect(page).toHaveURL(/\/compare$/);
  await expect(page.getByText('Product Comparison')).toBeVisible();
  await expect(page.getByText('Price')).toBeVisible();
  await expect(page.getByText('Stock')).toBeVisible();
});

test('should protect cache refresh with JWT authentication', async ({ request }) => {
  const unauthorizedResponse = await request.post(
    'http://127.0.0.1:3000/products/refresh-cache',
  );
  expect(unauthorizedResponse.status()).toBe(401);

  const loginResponse = await request.post(
    'http://127.0.0.1:3000/auth/login',
    {
      data: {
        username: 'admin',
        password: 'admin123',
      },
    },
  );
  expect(loginResponse.ok()).toBeTruthy();

  const { token } = await loginResponse.json();
  const refreshResponse = await request.post(
    'http://127.0.0.1:3000/products/refresh-cache',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  expect(refreshResponse.ok()).toBeTruthy();
});
