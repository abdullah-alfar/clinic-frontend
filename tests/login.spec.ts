
import { test, expect } from '@playwright/test';

test('login test', async ({ page }) => {
  await page.goto('http://localhost:3001/login');
  await page.getByLabel('Email').fill('admin@demo.com');
  await page.getByLabel('Password').fill('123456');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/dashboard/);
});
