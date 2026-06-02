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

test('should compare two selected products', async ({ page }) => {
  await page.goto('/');

  const checkboxes = page.getByRole('checkbox');
  await expect(checkboxes.nth(1)).toBeVisible();

  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();

  await page.getByRole('button', { name: /Abrir comparação/i }).click();

  await expect(page).toHaveURL(/\/compare$/);
  await expect(page.getByText('Comparação de Produtos')).toBeVisible();
  await expect(page.getByText('Preço')).toBeVisible();
  await expect(page.getByText('Estoque')).toBeVisible();
});
