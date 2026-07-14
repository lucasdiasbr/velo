# Velô Sprint - Configurador de Veículo Elétrico

Aplicação web em React para configuração e compra do veículo elétrico **Velô Sprint**.

## Sobre o Projeto

Uma SPA (Single Page Application) que permite:
- Personalizar cores, rodas e opcionais do veículo
- Calcular preços em tempo real
- Realizar pedidos com análise de crédito
- Consultar status de pedidos

**Especificações do Velô Sprint:** 450 km de autonomia | 0-100 km/h em 3.2s | 500 cv

---

## Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Estado** | Zustand (global), React Hook Form (formulários) |
| **Validação** | Zod |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (PostgreSQL + Edge Functions) |

---

## Instalação

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Acesse: `http://localhost:8080`

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em **New Project**
3. Escolha um nome e senha para o banco
4. Aguarde a criação (~2 minutos)

### 2. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_PROJECT_ID="seu_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_anon_publica"
VITE_SUPABASE_URL="https://seu_project_id.supabase.co"
```

> Encontre essas informações em: **Project Settings → API**

### 3. Deploy (banco + functions)

```bash
# Instalar CLI
npm install -g supabase

# Login e vincular projeto
supabase login
supabase link --project-ref SEU_PROJECT_ID

# Aplicar migrações (cria tabelas e RLS)
supabase db push

# Deploy das Edge Functions
supabase functions deploy
```

Pronto! O banco e as functions estarão configurados.

---

## Estrutura Principal

```
src/
├── pages/           # Páginas da aplicação
├── components/      # Componentes React
│   ├── configurator/   # Configurador do carro
│   ├── landing/        # Landing page
│   └── ui/             # Componentes shadcn/ui
├── store/           # Estado global (Zustand)
├── hooks/           # Hooks customizados
└── integrations/    # Cliente Supabase
```

---

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/configure` | Configurador do veículo |
| `/order` | Checkout/Pedido |
| `/success` | Confirmação do pedido |
| `/lookup` | Consulta de pedidos |

---

## Modelo de Preços

- **Preço base:** R$ 40.000
- **Rodas Sport:** +R$ 2.000
- **Precision Park:** +R$ 5.500
- **Flux Capacitor:** +R$ 5.000
- **Financiamento:** 12x com juros de 2% a.m.

---

## Banco de Dados

**Tabela `orders`** — campos principais:
- `order_number` — Formato: VLO-XXXXXX
- `color`, `wheel_type`, `optionals` — Configuração
- `customer_name`, `customer_email`, `customer_cpf` — Cliente
- `payment_method`, `total_price` — Pagamento
- `status` — pending, approved, rejected, analysis

---

## Análise de Crédito

| Score | Resultado |
|-------|-----------|
| > 700 | Aprovado |
| 501-700 | Em análise |
| ≤ 500 | Reprovado |

*Se entrada ≥ 50% do total, aprova mesmo com score < 700*

---

## Fluxo Principal

```
Landing → Configurador → Checkout → Análise de Crédito → Confirmação
```

---

## Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run lint     # Verificar código
```

---

## 🏆 Desafio Final — Ambiente de Preview com Banco Isolado

Este projeto foi configurado com ambientes isolados de Preview e Produção, impedindo a poluição do banco de dados de produção por execuções de testes E2E ou acessos a deploys de preview.

### Resolução e Racional de Decisão

#### 1. Por que não utilizar `vercel promote`?
* O comando `vercel promote` apenas aponta o tráfego do domínio de produção para o build existente gerado em preview, sem recompilar o código.
* Como o projeto utiliza Vite, as variáveis de ambiente prefixadas com `VITE_` (como as credenciais do Supabase) são embutidas diretamente como strings literais no bundle Javascript final no momento do build.
* Se promovêssemos o build de preview diretamente, a aplicação em produção continuaria se comunicando com o **Supabase de Preview**.
* **Solução Adotada:** Ajustamos o pipeline no `.github/workflows/cd.yml` substituindo o job de `promote` por um job de `deploy-production`. Ele realiza um `vercel pull --environment=production` seguido de `vercel build --prod` e `vercel deploy --prebuilt --prod`. Isso gera um novo bundle com as variáveis do Supabase de produção injetadas corretamente no build final de produção.

#### 2. Migração para o Supabase Client nos Testes E2E
* Substituímos a dependência do PostgreSQL direto (Kysely) em `playwright/support/database/orderRepository.ts` e configuramos o cliente administrativo do Supabase (`db`) em `database.ts` usando a `SUPABASE_SERVICE_ROLE_KEY`.
* A utilização do cliente PostgREST do Supabase via HTTPS elimina a necessidade de conexões TCP diretas ao banco de dados via IPv6 ou pools de conexão em ambientes CI/CD, simplificando a infraestrutura de automação de testes.

### Como Rodar os Testes E2E Localmente com Banco de Preview

1. Adicione a chave Service Role do Supabase de Preview no seu arquivo `.env` local:
   ```env
   SUPABASE_SERVICE_ROLE_KEY="sua_chave_service_role_de_preview"
   ```
2. Execute o comando dos testes do Playwright:
   ```bash
   npx playwright test
   ```