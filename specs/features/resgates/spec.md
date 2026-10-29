# Spec: Feed e Gestão de Resgates (`/animais`)

## 🎯 Objetivo
Permitir que usuários e voluntários registrem animais em situação de risco, feridos ou resgatados, criando um feed colaborativo em tempo real para conectar quem encontrou o animal a quem pode socorrê-lo ou adotá-lo.

---

## 📍 Rota Principal
- `src/app/animais/page.tsx`
- Detalhes do resgate: `src/app/animais/[id]/page.tsx`
- Novo resgate: `src/app/animais/novo/page.tsx`

---

## 📋 Funcionalidades Principais

### 1. Feed Público de Ocorrências
- Listagem em cards com foto, espécie, localização aproximada (bairro/cidade), data e status.
- Filtros por:
  - Espécie (Cão, Gato, Ave, Silvestre, Outro).
  - Urgência (Crítica/Emergência, Alta, Média, Baixa).
  - Status (Pendente, Em Andamento, Acolhido, Disponível para Adoção, Concluído).
  - Cidade / Estado.

### 2. Cadastro de Ocorrência / Resgate
- Formulário aberto a usuários logados:
  - Título / Breve descrição.
  - Espécie e características físicas (porte, pelagem, cor).
  - Condição de saúde (ferido, atropelado, desnutrido, saudável).
  - Localização geográfica (endereço / ponto de referência / coordenadas).
  - Fotos do animal e do local (upload de imagens).
  - Contato de quem está no local.

### 3. Acompanhamento & Linha do Tempo
- Atualizações de status registradas por ONGs ou voluntários credenciados.
- Comentários ou mensagens de apoio/oferta de lar temporário.

---

## 🔌 API & Procedimentos tRPC Sugeridos (`src/server/api/routers/rescue.ts`)
- `rescue.getAll({ status, species, city, cursor, limit })` -> Query pública paginada.
- `rescue.getById({ id })` -> Query de detalhes.
- `rescue.create({ title, description, species, urgency, location, images })` -> Mutation protegida.
- `rescue.updateStatus({ id, status, notes })` -> Mutation para voluntários/ONGs.

---

## 🗄️ Modelo de Dados Previsto
Ver detalhes completos em [`schema-plan.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/database/schema-plan.md).
- Entidade `RescueCase` / `Animal`:
  - `id`, `title`, `description`, `species`, `urgency`, `status`, `city`, `state`, `address`, `photos`, `createdById`, `assignedNgoId`.
