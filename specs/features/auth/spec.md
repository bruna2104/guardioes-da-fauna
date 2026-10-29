# Spec: Autenticação e Controle de Acesso

## 🎯 Objetivo
Gerenciar a identificação e permissões dos usuários na plataforma, permitindo ações personalizadas como publicação de resgates, doações rastreadas e administração de ONGs.

---

## 🛠️ Tecnologias
- **NextAuth.js v5** (`@auth/prisma-adapter`).
- Provedores OAuth (atualmente Discord configurado em `src/server/auth/config.ts`; expansível para Google, GitHub, Magic Links por e-mail ou Credenciais).

---

## 👥 Perfis de Usuário (Roles)
Planejamento de papéis no sistema:
1. **Cidadão / Usuário Geral**:
   - Reportar animais em risco ou encontrados.
   - Realizar doações para ONGs.
   - Acompanhar resgates que criou ou segue.
2. **Representante de ONG / Voluntário de Resgate**:
   - Assumir resgates abertos no feed.
   - Atualizar status médico e histórico do animal.
   - Cadastrar campanhas de doação para sua ONG.
3. **Administrador**:
   - Validar cadastro de novas ONGs.
   - Moderar relatos e doações suspeitas.

---

## 🗄️ Modelagem de Sessão (Prisma)
- `User`: armazena `name`, `email`, `image` e opcionalmente `role`, `phone`, `city`, `state`.
- `Account`: armazena vínculos OAuth externos.
- `Session`: sessões persistidas no banco via `@auth/prisma-adapter`.
- `VerificationToken`: tokens de validação de e-mail.

---

## 📋 Requisitos e Próximos Passos
1. Adicionar campo `role` no modelo `User` do Prisma (`CITIZEN`, `VOLUNTEER`, `NGO_ADMIN`, `SYS_ADMIN`).
2. Configurar provedor Google (além do Discord) para facilitar o acesso de voluntários e cidadãos comuns.
3. Criar middleware de proteção de rotas para `/perfil` e rotas administrativas de ONGs.
