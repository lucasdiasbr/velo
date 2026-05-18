import { test } from '../support/fixtures'
import { generateOrderCode } from '../support/helpers'
import type { OrderLookupExpectation } from '../support/actions/orderLockupActions'

const approvedOrder: OrderLookupExpectation = {
  number: 'VLO-JW9QKS',
  status: 'APROVADO',
  color: 'Glacier Blue',
  wheels: 'Aero Wheels',
  customerName: 'LUCAS DIAS',
  customerEmail: 'lucasdiasweb@gmail.com',
  payment: 'À Vista',
}

const rejectedOrder: OrderLookupExpectation = {
  number: 'VLO-Y6HWKL',
  status: 'REPROVADO',
  color: 'Lunar White',
  wheels: 'Sport Wheels',
  customerName: 'Marcos Aurelio',
  customerEmail: 'marcosaurelio@gmail.com',
  payment: 'À Vista',
}

const pendingOrder: OrderLookupExpectation = {
  number: 'VLO-XKS101',
  status: 'EM_ANALISE',
  color: 'Lunar White',
  wheels: 'Aero Wheels',
  customerName: 'Jeff Barroso',
  customerEmail: 'jeffbarroso@gmail.com',
  payment: 'À Vista',
}

test.describe('Consulta de Pedido', () => {
  test.beforeEach(async ({ app }) => {
    await app.orderLockup.goToLookupPage()
  })

  test('deve consultar um pedido aprovado', async ({ app }) => {
    await app.orderLockup.searchOrder(approvedOrder.number)
    await app.orderLockup.expectOrderDetails(approvedOrder)
  })

  test('deve consultar um pedido reprovado', async ({ app }) => {
    await app.orderLockup.searchOrder(rejectedOrder.number)
    await app.orderLockup.expectOrderDetails(rejectedOrder)
  })

  test('deve consultar um pedido em analise', async ({ app }) => {
    await app.orderLockup.searchOrder(pendingOrder.number)
    await app.orderLockup.expectOrderDetails(pendingOrder)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ app }) => {
    await app.orderLockup.searchOrder(generateOrderCode())
    await app.orderLockup.expectOrderNotFound()
  })
})