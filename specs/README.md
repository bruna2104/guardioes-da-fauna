# Guardiões da Fauna — Especificações do Projeto (Specs)

Bem-vindo à central de especificações técnicas e de negócio do projeto **Guardiões da Fauna**.

## Objetivo da Pasta `specs`
O objetivo desta estrutura é centralizar o escopo, requisitos de negócio, arquitetura técnica e modelo de dados de cada funcionalidade. Assim, ao desenvolver novas tarefas ou tirar dúvidas com o agente de IA ou entre a equipe, basta referenciar diretamente o arquivo da feature correspondente (ex: `specs/features/resgates/spec.md`).

---

## 🗂️ Estrutura de Pastas

```text
specs/
├── README.md                           # Índice geral e guia de uso das especificações
├── architecture/
│   └── stack.md                        # Stack técnica, convenções e arquitetura geral
├── database/
│   └── schema-plan.md                  # Planejamento do esquema Prisma e entidades
└── features/
    ├── navegacao-layout/
    │   └── spec.md                     # Navbar, layout geral e identidade visual
    ├── auth/
    │   └── spec.md                     # Autenticação, sessões e permissões (NextAuth)
    ├── resgates/
    │   └── spec.md                     # Feed e gestão de resgates de animais (/animais)
    ├── ongs/
    │   └── spec.md                     # Catálogo e gestão de ONGs parceiras (/ongs)
    ├── doacoes/
    │   └── spec.md                     # Central de campanhas e doações financeiras/itens (/doacoes)
    └── perfil/
        └── spec.md                     # Painel e histórico do usuário/voluntário (/perfil)
```

---

## 📌 Status Atual das Features

| Feature | Rota | Status | Spec |
| :--- | :--- | :--- | :--- |
| **Arquitetura Base** | `/` | 🟡 Em Configuração (T3 Stack inicializado) | [`stack.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/architecture/stack.md) |
| **Navegação & Layout** | Global | 🟡 Navbar criada, rotas pendentes | [`navegacao-layout/spec.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/features/navegacao-layout/spec.md) |
| **Autenticação** | `/api/auth/*` | 🟡 NextAuth v5 configurado (Discord base) | [`auth/spec.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/features/auth/spec.md) |
| **Feed de Resgates** | `/animais` | ⚪ Não iniciado | [`resgates/spec.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/features/resgates/spec.md) |
| **ONGs Parceiras** | `/ongs` | ⚪ Não iniciado | [`ongs/spec.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/features/ongs/spec.md) |
| **Central de Doações** | `/doacoes` | ⚪ Não iniciado | [`doacoes/spec.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/features/doacoes/spec.md) |
| **Meu Perfil** | `/perfil` | ⚪ Não iniciado | [`perfil/spec.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/features/perfil/spec.md) |
| **Modelagem de Dados** | Prisma | 🟡 Modelos base (User/Post), novos pendentes | [`schema-plan.md`](file:///c:/Users/Bruna/guardioes-da-fauna/specs/database/schema-plan.md) |

---

## 💡 Como Usar Estas Specs nos Prompts
Ao solicitar alterações ou novas implementações, mencione a spec no seu comando:
- *"Consulte a spec `specs/features/resgates/spec.md` e implemente a página `/animais` com listagem e filtro."*
- *"Atualize o esquema do Prisma de acordo com `specs/database/schema-plan.md`."*
- *"Implemente o fluxo de login de acordo com `specs/features/auth/spec.md`."*
