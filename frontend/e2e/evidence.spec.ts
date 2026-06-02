import { test, expect } from '@playwright/test';

test('captures project evidence screenshots', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Marketplace Aggregator')).toBeVisible();
  await page.screenshot({ path: '../docs/products.png', fullPage: true });

  await page.getByText('Ver Detalhes').first().click();
  await expect(page.getByText('Histórico de preços')).toBeVisible();
  await page.screenshot({ path: '../docs/product-detail.png', fullPage: true });

  await page.goto('/');
  const checkboxes = page.getByRole('checkbox');
  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();
  await page.getByRole('button', { name: /Abrir comparação/i }).click();
  await expect(page.getByText('Comparação de Produtos')).toBeVisible();
  await page.screenshot({ path: '../docs/comparison.png', fullPage: true });

  await page.goto('http://127.0.0.1:3000/api-docs');
  await expect(page.locator('section.swagger-ui')).toBeVisible();
  await page.screenshot({ path: '../docs/swagger.png', fullPage: true });
});
