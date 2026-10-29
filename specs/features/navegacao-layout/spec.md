# Spec: Navegação & Layout Global

## 🎯 Objetivo
Fornecer a estrutura visual padrão da aplicação, garantindo uma identidade consistente inspirada na preservação da fauna e natureza (tons de verde/esmeralda), e navegação rápida entre os módulos principais.

---

## 🧭 Barra de Navegação (`Navbar`)

### Localização
- Arquivo do componente: `src/app/_components/navbar.tsx`
- Injetado em: `src/app/layout.tsx`

### Links e Seções Atuais
| Rota | Rótulo | Descrição |
| :--- | :--- | :--- |
| `/` | `🐾 Guardiões da Fauna` | Logotipo e link para a página inicial |
| `/animais` | `Feed de Resgates` | Lista de ocorrências e animais em situação de resgate |
| `/ongs` | `ONGs Parceiras` | Diretório de instituições parceiras |
| `/doacoes` | `Central de Doações` | Campanhas de financiamento e doação de insumos |
| `/perfil` | `Meu Perfil` | Área autenticada com histórico e ações do usuário |

---

## 🎨 Identidade Visual
- **Cor Primária**: Tons esmeralda/verde floresta (`bg-emerald-700` ou similar), remetendo a natureza e preservação ambiental.
- **Tipografia**: `Geist Sans` via `next/font/google`.
- **Tema Geral**: Suporte a modo escuro/claro ou tons contrastantes para leitura acessível.
- **Responsividade**:
  - Desktop: Barra horizontal superior fixa ou sticky.
  - Mobile: Menu hamburguer retrátil (a implementar).

---

## 📋 Requisitos Futuros
1. **Indicador de Autenticação na Navbar**:
   - Se logado: Exibir avatar do usuário, nome e botão de logout.
   - Se deslogado: Exibir botão "Entrar".
2. **Menu Mobile**:
   - Gaveta lateral (*drawer*) para dispositivos com largura menor que `768px`.
3. **Rodapé Global (Footer)**:
   - Links úteis, contato emergencial de órgãos ambientais (IBAMA, Polícia Ambiental) e termos de uso.
