# Arquitetura e Stack Técnica

## Visão Geral
O projeto **Guardiões da Fauna** é construído utilizando a **T3 Stack**, uma arquitetura opinionada, moderna e com segurança de tipos de ponta a ponta (*end-to-end type safety*).

---

## 🛠️ Tecnologias Principais

1. **Framework Web**: [Next.js 15 (App Router)](https://nextjs.org/)
   - Suporte a React Server Components (RSC).
   - Rotas na pasta `src/app/`.
   - Turbopack habilitado no desenvolvimento (`pnpm dev`).

2. **UI & Estilização**:
   - [React 19](https://react.dev/)
   - [Tailwind CSS v4](https://tailwindcss.com/) com PostCSS.
   - Fonte padrão: `Geist` (Google Fonts).

3. **API & Comunicação**:
   - [tRPC v11](https://trpc.io/) com `@tanstack/react-query v5`.
   - Procedimentos tipados em `src/server/api/routers/`.
   - Serialização com `superjson`.
   - Validação com [Zod](https://zod.dev/).

4. **Banco de Dados & ORM**:
   - [PostgreSQL 15](https://www.postgresql.org/) rodando via Docker (`docker-compose.yml`).
   - [Prisma ORM v6](https://www.prisma.io/) com cliente customizado gerado em `generated/prisma`.
   - Gerenciamento de conexões em `src/server/db.ts`.

5. **Autenticação**:
   - [Auth.js / NextAuth v5](https://authjs.dev/) (`5.0.0-beta.25`).
   - Adaptador do Prisma: `@auth/prisma-adapter`.
   - Configurações em `src/server/auth/config.ts`.

6. **Infraestrutura Local**:
   - `docker-compose.yml` para orquestração do PostgreSQL (banco `guardioes-da-fauna`, porta `5432`).
   - Script auxiliar `start-database.sh`.

---

## 📂 Organização do Código (`src/`)

```text
src/
├── app/                        # Páginas e rotas da aplicação (App Router)
│   ├── _components/            # Componentes reutilizáveis da aplicação (ex: navbar)
│   ├── api/                    # Rotas de API HTTP (auth, trpc)
│   ├── layout.tsx              # Layout raiz com Navbar e TRPCReactProvider
│   └── page.tsx                # Página inicial (Landing Page)
├── server/                     # Código executado exclusivamente no servidor
│   ├── api/                    # Roteadores e contexto do tRPC
│   │   ├── routers/            # Routers individuais por domínio
│   │   ├── root.ts             # Router raiz do tRPC
│   │   └── trpc.ts             # Middlewares, contextos e helpers de procedimentos
│   ├── auth/                   # Configuração e inicialização do NextAuth
│   └── db.ts                   # Instância singleton do Prisma Client
├── styles/                     # CSS global
│   └── globals.css
└── trpc/                       # Setup do cliente tRPC para React e Server Components
    ├── query-client.ts
    ├── react.tsx
    └── server.ts
```

---

## 🔒 Variáveis de Ambiente (`src/env.js`)
As variáveis são validadas em tempo de build/execução via `@t3-oss/env-nextjs`:
- `DATABASE_URL`: String de conexão com o PostgreSQL.
- `AUTH_SECRET`: Segredo criptográfico de sessão do NextAuth.
- `AUTH_DISCORD_ID` & `AUTH_DISCORD_SECRET`: Credenciais OAuth do Discord.
