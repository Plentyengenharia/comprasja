/**
 * Smoke — layout referência + Entrega A
 *   cd public-html/tests && npm i @playwright/test@1.49.0
 *   npx playwright install chromium
 *   npx playwright test -c playwright.config.mjs
 */
import { test, expect } from '@playwright/test';

const viewports = [
  { name: '320', width: 320, height: 720 },
  { name: '375', width: 375, height: 812 },
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1440', width: 1440, height: 900 },
];

for (const vp of viewports) {
  test(`nav @${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    const toggle = page.locator('[data-nav-toggle]');
    if (vp.width < 1024) {
      await expect(toggle).toBeVisible();
      await toggle.click();
      await expect(page.locator('[data-nav-panel]')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('[data-nav-panel]')).toBeHidden();
    } else {
      await expect(toggle).toBeHidden();
      await expect(page.locator('.nav')).toBeVisible();
      await expect(page.getByRole('navigation').getByText('LICIA')).toBeVisible();
    }
  });
}

test('homepage reference sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /comprasja\.plentyengenharia\.com\.br/);
  await expect(page.getByRole('heading', { name: /nova geração das licitações/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Sou fornecedor/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /Sou órgão público/i })).toBeVisible();
  await expect(page.locator('#licia')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sala de Disputas' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Oportunidades em destaque' })).toBeVisible();
  await expect(page.locator('.site-footer .brand img')).toBeVisible();
});

test('contato mailto form', async ({ page }) => {
  await page.goto('/pages/contato.html');
  await expect(page.locator('[data-contact-form]')).toBeVisible();
});

test('login noindex', async ({ page }) => {
  await page.goto('/pages/login.html');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
