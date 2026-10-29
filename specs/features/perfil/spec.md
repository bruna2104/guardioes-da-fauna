# Spec: Meu Perfil (`/perfil`)

## 🎯 Objetivo
Prover uma área centralizada para o usuário autenticado gerenciar suas informações, acompanhar seus resgates reportados, verificar o histórico de doações e gerenciar permissões de voluntariado ou vínculo com ONGs.

---

## 📍 Rota Principal
- Painel do Perfil: `src/app/perfil/page.tsx`
- Edição de Dados: `src/app/perfil/editar/page.tsx`

---

## 📋 Funcionalidades Principais

### 1. Dados Pessoais e Configurações
- Nome de exibição, avatar, telefone para contato em caso de emergência e localização padrão (Cidade/UF).
- Opção para exibir ou ocultar telefone no feed público de resgates.

### 2. Meus Resgates Reportados
- Listagem dos animais cadastrados pelo usuário.
- Status atualizado em tempo real de cada relato (ex: "Em atendimento pela ONG Amigos dos Bichos").
- Ação para atualizar fotos, adicionar novas informações ou marcar como "Resolvido".

### 3. Histórico de Contribuições & Doações
- Histórico de vaquinhas e campanhas apoiadas pelo usuário.
- Emissão/visualização de recibos de apoio.

### 4. Vínculo com ONGs e Voluntariado
- Indicação se o usuário faz parte do time oficial de uma ONG.
- Opção de se candidatar como "Voluntário Resgatista" ou "Lar Temporário".

---

## 🔌 API & Procedimentos tRPC Sugeridos (`src/server/api/routers/user.ts`)
- `user.getProfile()` -> Procedimento protegido que retorna dados completos do usuário logado.
- `user.updateProfile({ name, phone, city, state, showContact })` -> Atualizar perfil.
- `user.getMyRescues()` -> Listar resgates criados pelo usuário logado.
- `user.getMyDonations()` -> Listar doações vinculadas ao usuário.
