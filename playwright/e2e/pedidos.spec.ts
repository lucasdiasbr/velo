import { test, expect } from '@playwright/test';

// AAA - Arrange, Act, Assert

test('Deve consutlar um pedido aprovado', async ({ page }) => {
  await page.goto('http://localhost:5173');

  //Checkpoint - Arrange
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible();

  //Clicar em "Consultar Pedido" - Act
  await expect(page.getByText('Digite o número do seu pedido')).toBeVisible();
  await page.getByTestId('search-order-id').click();
  await page.getByTestId('search-order-id').fill('VLO-JW9QKS');
  await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  //Verificar se o pedido foi encontrado - Assert
  await expect(page.getByTestId('order-result-VLO-JW9QKS')).toContainText('VLO-JW9QKS');
  await expect(page.getByTestId('order-result-VLO-JW9QKS')).toContainText('APROVADO');

});