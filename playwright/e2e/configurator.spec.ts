import { expect } from '@playwright/test'

import { test } from '../support/fixtures.ts'

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open()
  })

  test('deve atualizar a imagem e manter o preço base ao trocar a cor do veículo', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectColor('Midnight Black')
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/midnight-black-aero-wheels.png')
  })

  test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.selectWheels(/Sport Wheels/)
    await app.configurator.expectPrice('R$ 42.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-sport-wheels.png')

    await app.configurator.selectWheels(/Aero Wheels/)
    await app.configurator.expectPrice('R$ 40.000,00')
    await app.configurator.expectCarImageSrc('/src/assets/glacier-blue-aero-wheels.png')
  })

  test('deve atualizar o preço ao marcar e desmarcar opcionais e persistir no checkout', async ({
    app,
    page,
  }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.toggleOptional('opt-precision-park')
    await app.configurator.expectPrice('R$ 45.500,00')

    await app.configurator.toggleOptional('opt-flux-capacitor')
    await app.configurator.expectPrice('R$ 50.500,00')

    await app.configurator.toggleOptional('opt-precision-park')
    await app.configurator.toggleOptional('opt-flux-capacitor')
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.goToCheckout()
    await app.configurator.expectCheckoutSummaryTotal('R$ 40.000,00')
    await expect(page.getByRole('button', { name: /À Vista/ })).toContainText('R$ 40.000,00')
  })
  // Olá Professor Fernando Papito,
  // Aqui foi feita a refatoração do teste para utilizar o padrão de Fixture Actions.
  // Movemos as buscas de elementos (getByRole) e validações para dentro do configuratorActions.ts.
  // Assim, o teste ficou mais limpo, semântico e aderente ao padrão do projeto.
  test('deve levar opcionais selecionados e preço total para o checkout', async ({ app }) => {
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.expectOptionalVisible(/Precision Park/i)
    await app.configurator.expectOptionalVisible(/Flux Capacitor/i)

    await app.configurator.checkOptional(/Precision Park/i)
    await app.configurator.expectPrice('R$ 45.500,00')

    await app.configurator.checkOptional(/Flux Capacitor/i)
    await app.configurator.expectPrice('R$ 50.500,00')

    await app.configurator.uncheckOptional(/Precision Park/i)
    await app.configurator.uncheckOptional(/Flux Capacitor/i)
    await app.configurator.expectPrice('R$ 40.000,00')

    await app.configurator.goToCheckout()

    await app.configurator.expectCheckoutHeading()

    await app.configurator.expectCheckoutSummaryTotal('R$ 40.000,00')
  })
})