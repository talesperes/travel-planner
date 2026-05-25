# Travel Planner

Aplicação para planejamento de viagens.

## Sobre

Este repositório contém o código do Travel Planner, uma ferramenta para organizar e planejar viagens.

## Status

Projeto em fase inicial de desenvolvimento.

## Stack

- **Linguagem:** TypeScript (Node.js)
- **Backend:** API REST em Node.js + TypeScript
- **Frontend:** SPA em React + TypeScript
- **Gerenciamento:** npm workspaces (monorepo)

## Estrutura do projeto

```
travel-planner/
├── backend/                 # API REST (Node.js + TypeScript)
│   ├── src/
│   │   ├── routes/          # definição de rotas HTTP
│   │   ├── controllers/     # handlers das rotas
│   │   ├── services/        # regras de negócio
│   │   ├── models/          # modelos de dados / acesso ao banco
│   │   ├── middlewares/     # middlewares (auth, logging, erros)
│   │   ├── config/          # configurações e variáveis de ambiente
│   │   └── index.ts         # bootstrap do servidor
│   ├── tests/               # testes do backend
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # SPA (React + TypeScript)
│   ├── public/              # assets estáticos
│   ├── src/
│   │   ├── components/      # componentes reutilizáveis
│   │   ├── pages/           # páginas / rotas da aplicação
│   │   ├── hooks/           # hooks customizados
│   │   ├── services/        # clientes da API
│   │   ├── types/           # tipos TypeScript
│   │   ├── styles/          # estilos globais
│   │   └── main.tsx         # ponto de entrada do app
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                  # código compartilhado entre backend e frontend
│   ├── src/
│   │   └── types/           # contratos / DTOs compartilhados
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json             # raiz do workspace (npm workspaces)
├── tsconfig.base.json       # configuração TypeScript compartilhada
└── README.md
```

## Convenções

- **Idioma do código:** identificadores e mensagens internas em inglês; documentação em português.
- **Formatação:** Prettier + ESLint (configuração compartilhada na raiz).
- **Commits:** mensagens objetivas no imperativo.
- **Scripts:** comandos comuns (`dev`, `build`, `lint`, `test`) expostos em cada workspace e orquestrados pela raiz.
