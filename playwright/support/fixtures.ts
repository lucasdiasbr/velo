import { test as base } from '@playwright/test'

import { createCheckoutActions } from './actions/checkoutActions'
import { createConfiguratorActions } from './actions/configuratorActions'
import { createOrderLookupActions } from './actions/orderLookupActions'
import { createHeroActions } from './actions/heroActions'

import { mocksCreditAnalysis } from './mock.api'
// Papito, o meu código estava dando alguns erros por causa de algumas implementações com IA - que ficaram diferentes. 
// Mas gostei de usar o usar ReturnType pra pegar os tipos das actions é inteligente e evita duplicação. 

type App = {
  checkout: ReturnType<typeof createCheckoutActions>
  configurator: ReturnType<typeof createConfiguratorActions>
  orderLookup: ReturnType<typeof createOrderLookupActions>
  hero: ReturnType<typeof createHeroActions>
  mock: {
    creditAnalysis: (score: number) => Promise<void>
  }
}

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    const app: App = {
      checkout: createCheckoutActions(page),
      configurator: createConfiguratorActions(page),
      orderLookup: createOrderLookupActions(page),
      hero: createHeroActions(page),
      mock: {
        creditAnalysis: async (score: number) => await mocksCreditAnalysis(page, score),
      }
    }
    await use(app)
  },
})

export { expect } from '@playwright/test'