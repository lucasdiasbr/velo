import { Page, expect } from '@playwright/test'

type OptionalTestId = 'opt-precision-park' | 'opt-flux-capacitor'

export function createConfiguratorActions(page: Page) {
  return {
    async open() {
      await page.addInitScript(() => {
        localStorage.removeItem('velo-configurator-storage')
      })
      await page.goto('/configure')
      await expect(page.getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
    },

    async toggleOptional(testId: OptionalTestId) {
      await page.getByTestId(testId).click()
    },

    async expectOptionalVisible(name: string | RegExp) {
      await expect(page.getByRole('checkbox', { name })).toBeVisible()
    },

    async checkOptional(name: string | RegExp) {
      await page.getByRole('checkbox', { name }).check()
    },

    async uncheckOptional(name: string | RegExp) {
      await page.getByRole('checkbox', { name }).uncheck()
    },

    async goToCheckout() {
      await page.getByTestId('checkout-button').click()
      await expect(page).toHaveURL(/\/order/)
    },

    async expectCheckoutHeading() {
      await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    },

    async expectCheckoutSummaryTotal(price: string) {
      const summaryTotal = page.getByTestId('summary-total-price')
      await expect(summaryTotal).toBeVisible()
      await expect(summaryTotal).toHaveText(price)
    },

    async selectColor(name: string) {
      await page.getByRole('button', { name }).click()
    },

    async selectWheels(name: string | RegExp) {
      await page.getByRole('button', { name }).click()
    },

    async expectPrice(price: string) {
      const priceElement = page.getByTestId('total-price')
      await expect(priceElement).toBeVisible()
      await expect(priceElement).toHaveText(price)
    },

    async expectCarImageSrc(src: string) {
      const carImage = page.locator('img[alt^="Velô Sprint"]')
      await expect(carImage).toHaveAttribute('src', src)
    },
  }
}