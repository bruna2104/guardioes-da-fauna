# Spec: ONGs Parceiras (`/ongs`)

## 🎯 Objetivo
Apresentar as organizações não governamentais (ONGs), protetores independentes e santuários de fauna cadastrados e validados na plataforma, oferecendo transparência, contato e meios de apoio direto.

---

## 📍 Rota Principal
- Catálogo de ONGs: `src/app/ongs/page.tsx`
- Perfil público da ONG: `src/app/ongs/[slug]/page.tsx`
- Cadastro/Solicitação de ONG: `src/app/ongs/cadastrar/page.tsx`

---

## 📋 Funcionalidades Principais

### 1. Catálogo e Busca de ONGs
- Busca por nome, cidade, estado e foco de atuação (cães e gatos, animais silvestres, equinos, etc.).
- Badge de "Verificada / Credenciada" para ONGs com CNPJ ou histórico validado pela administração.
- Visualização em mapa ou grade de cards.

### 2. Página de Perfil da ONG
- Informações institucionais (História, missão, equipe).
- Contatos (WhatsApp, E-mail, Redes Sociais, Site).
- Chave PIX oficial ou canal direto para doação financeira.
- Animais atualmente sob tutela da ONG disponíveis para adoção ou lar temporário.
- Lista de necessidades urgentes de insumos (ração, medicamentos específicos, toalhas, etc.).

### 3. Painel da ONG
- Gerenciamento de dados cadastrais.
- Vínculo de voluntários autorizados a responder por ela.
- Publicação de comunicados e metas de arrecadação.

---

## 🔌 API & Procedimentos tRPC Sugeridos (`src/server/api/routers/ngo.ts`)
- `ngo.getAll({ state, city, verifiedOnly, search })` -> Query pública.
- `ngo.getBySlug({ slug })` -> Query de perfil com dados detalhados.
- `ngo.create({ name, cnpj, description, contact, city, state })` -> Mutation para solicitação de cadastro.
- `ngo.updateProfile({ id, ...data })` -> Mutation protegida para representantes da ONG.

---

## 🗄️ Modelo de Dados Previsto
- Entidade `Ngo`:
  - `id`, `name`, `slug`, `cnpj`, `description`, `logo`, `coverImage`, `phone`, `email`, `pixKey`, `city`, `state`, `isVerified`, `createdAt`.
  - Relações: `members (User[])`, `rescues (RescueCase[])`, `campaigns (Campaign[])`.
