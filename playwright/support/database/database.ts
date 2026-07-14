import 'dotenv/config'
/// <reference types="node" />
import { createClient } from '@supabase/supabase-js'
import { Database } from './schema'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  throw new Error('VITE_SUPABASE_URL (ou SUPABASE_URL) não está definida no ambiente de testes')
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY não está definida no ambiente de testes')
}

// Cliente administrativo: usa a service role key, que bypassa RLS.
// Conecta via HTTPS (PostgREST), eliminando a dependência de conexão
// TCP direta ao Postgres (IPv6) ou de connection pooler.
export const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export type { Database }