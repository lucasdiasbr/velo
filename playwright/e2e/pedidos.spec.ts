import { test, expect } from '@playwright/test';

test('Deve consutlar um pedido aprovado', async ({ page }) => {
  await page.goto('http://localhost:5173');

  //Checkpoint
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  //Clicar em "Consultar Pedido"
  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible();
  await expect(page.getByText('Digite o número do seu pedido')).toBeVisible();

  //Preencher o campo de busca com o ID do pedido
  await page.getByTestId('search-order-id').click();
  await page.getByTestId('search-order-id').fill('VLO-JW9QKS');
  await page.getByTestId('search-order-button').click();

  //Verificar se o pedido foi encontrado
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-JW9QKS');
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO');


});