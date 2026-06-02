import { test, expect } from '@playwright/test';

test('should load product list page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Marketplace Aggregator')).toBeVisible();

  const detailItems = page.getByText('Ver Detalhes');
  await expect(detailItems.first()).toBeVisible();
  expect(await detailItems.count()).toBeGreaterThan(0);
});

test('should navigate to product detail page', async ({ page }) => {
  await page.goto('/');

  const firstDetailLink = page.getByText('Ver Detalhes').first();
  await expect(firstDetailLink).toBeVisible();

  await firstDetailLink.click();
  await expect(page).toHaveURL(/\/products\/\d+/);
  await expect(page.getByText('Voltar')).toBeVisible();
});
