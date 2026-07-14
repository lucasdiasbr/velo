import { db } from './database'
import { OrderTable } from './schema'

import { OrderDetails } from '../actions/orderLookupActions'

import crypto from 'crypto'

export function normalizeValue(value: string) {
  if (!value) return '';

  return value
    .normalize('NFD') // separa acentos
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, '') // remove espaços
    .toLowerCase(); // lowercase
}

export async function insertOrder(order: OrderDetails) {

  const data: OrderTable = {
    id: crypto.randomUUID(),
    order_number: order.number,
    color: order.color.toLowerCase().replace(' ', '-'),
    wheel_type: order.wheels.replace(' Wheels', '').toLowerCase(),
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_cpf: order.customer.document,
    payment_method: normalizeValue(order.payment),
    total_price: order.total_price,
    status: order.status,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    optionals: [],
  }

  const { error } = await db.from('orders').insert(data)
  if (error) {
    throw error
  }
}

export async function deleteOrderByNumber(orderNumber: string) {
  const { error } = await db.from('orders').delete().eq('order_number', orderNumber)
  if (error) {
    throw error
  }
}

// Desafio - Controle de Dados
export async function deleteOrderByEmail(email: string) {
  if (!email?.trim()) {
    throw new Error('Email is required')
  }

  const { data, error } = await db
    .from('orders')
    .delete()
    .eq('customer_email', email.trim())
    .select()

  if (error) {
    throw error
  }

  return data
}