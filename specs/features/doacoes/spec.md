# Spec: Central de Doações (`/doacoes`)

## 🎯 Objetivo
Facilitar a captação de recursos financeiros e materiais para tratamento médico veterinário, cirurgias, alimentação e manutenção de abrigos de fauna resgatada.

---

## 📍 Rota Principal
- Central de Doações: `src/app/doacoes/page.tsx`
- Detalhes de uma Campanha: `src/app/doacoes/[id]/page.tsx`

---

## 📋 Modalidades de Doação

### 1. Campanhas Específicas de Resgate / Vaquinhas
- Campanhas com meta financeira (ex: "Cirurgia ortopédica da cadela Luna", "Tratamento de gavião ferido").
- Barra de progresso: Total arrecadado vs. Meta.
- Prestação de contas: Notas fiscais veterinárias e recibos em anexo.

### 2. Doação Direta via PIX (Copia e Cola / QR Code)
- Geração instantânea de payload PIX estático ou dinâmico direcionado à chave oficial da ONG ou da campanha.
- Botão "Copiar Chave PIX" com feedback visual ao usuário.

### 3. Doação de Insumos Físicos (Pontos de Coleta)
- Lista de itens aceitos (ex: ração úmida para filhotes, vermífugos, caixas de transporte).
- Mapeamento de pontos físicos de coleta parceiros (ex: clínicas veterinárias ou pet shops conveniados).

---

## 🔌 API & Procedimentos tRPC Sugeridos (`src/server/api/routers/donation.ts`)
- `donation.getCampaigns({ status, ngoId })` -> Listar campanhas ativas.
- `donation.getCampaignById({ id })` -> Detalhes da campanha e prestação de contas.
- `donation.registerPaymentIntent({ campaignId, amount, donorEmail })` -> Iniciar intenção de doação.
- `donation.confirmDonation({ donationId, receiptUrl })` -> Confirmação / upload de comprovante.

---

## 🗄️ Modelo de Dados Previsto
- Entidade `Campaign`:
  - `id`, `ngoId`, `rescueId` (opcional), `title`, `goalAmount`, `currentAmount`, `deadline`, `status` (`ACTIVE`, `FINISHED`, `CANCELLED`).
- Entidade `Donation`:
  - `id`, `campaignId`, `userId` (opcional para anônimo), `amount`, `paymentMethod` (`PIX`, `CARD`), `status` (`PENDING`, `COMPLETED`, `FAILED`), `createdAt`.
