import { Page, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE'

export type OrderLookupExpectation = {
  number: string
  status: OrderStatus
  color: string
  wheels: string
  interior?: string
  customerName: string
  customerEmail: string
  payment: string
}

export function createOrderLockupActions(page: Page) {
  return {
    async goToLookupPage() {
      await page.goto('/')
      await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
      await page.getByRole('link', { name: 'Consultar Pedido' }).click()
      await expect(page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()
    },

    async searchOrder(code: string) {
      await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
      await page.getByRole('button', { name: 'Buscar Pedido' }).click()
    },

    async expectOrderDetails(order: OrderLookupExpectation) {
      const card = page.getByTestId(`order-result-${order.number}`)

      await expect(card).toBeVisible()
      await expect(card.getByRole('status')).toHaveText(order.status)
      await expect(card.getByRole('img', { name: 'Velô Sprint' })).toBeVisible()
      await expect(card.getByText(order.color, { exact: true })).toBeVisible()
      await expect(card.getByText('Rodas', { exact: true }).locator('+ p')).toHaveText(order.wheels, {
        ignoreCase: true,
      })
      await expect(card.getByText(order.interior ?? 'cream', { exact: true })).toBeVisible()
      await expect(card.getByText(order.customerName)).toBeVisible()
      await expect(card.getByText(order.customerEmail)).toBeVisible()
      await expect(card.getByText(order.payment, { exact: true })).toBeVisible()
      await expect(card.getByText(/\d+\/\d+\/\d+/)).toBeVisible()
      await expect(card.getByText(/R\$\s[\d.]+\,\d+/)).toBeVisible()
    },

    async expectOrderNotFound() {
      await expect(page.getByRole('heading', { name: 'Pedido não encontrado' })).toBeVisible()
      await expect(page.getByText('Verifique o número do pedido e tente novamente')).toBeVisible()
    },
  }
}
