import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

async function waitForLoadedImages(page: Page) {
  await page.waitForFunction(() => {
    const images = Array.from(document.querySelectorAll('img'));

    return images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0);
  });
}

test('captures project evidence screenshots', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Marketplace Aggregator')).toBeVisible();
  await expect(page.getByText('View details').first()).toBeVisible();
  await waitForLoadedImages(page);
  await page.screenshot({ path: '../docs/products.png', fullPage: true });

  await page.getByText('View details').first().click();
  await expect(page.getByText('Price history')).toBeVisible();
  await waitForLoadedImages(page);
  await page.screenshot({ path: '../docs/product-detail.png', fullPage: true });

  await page.goto('/');
  await expect(page.getByText('View details').first()).toBeVisible();
  await waitForLoadedImages(page);
  const checkboxes = page.getByRole('checkbox');
  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();
  await page.getByRole('button', { name: /Open comparison/i }).click();
  await expect(page.getByText('Product Comparison')).toBeVisible();
  await waitForLoadedImages(page);
  await page.screenshot({ path: '../docs/comparison.png', fullPage: true });

  await page.goto('http://127.0.0.1:3000/api-docs');
  await expect(page.locator('section.swagger-ui')).toBeVisible();
  await page.screenshot({ path: '../docs/swagger.png', fullPage: true });
});
