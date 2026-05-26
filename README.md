# Travel Planner

Planejador de viagens com assistência de IA: monta roteiros, organiza o dia a dia e sugere lugares com base em dados reais de mapas.

## Sobre

O Travel Planner ajuda o usuário a planejar uma viagem do início ao fim. A ideia é que o usuário descreva o destino, o período e suas preferências, e a IA proponha um roteiro estruturado dia a dia, com sugestões de pontos turísticos, restaurantes e deslocamentos baseadas em informações de mapas (Google Maps / Google Places).

Além de montar o roteiro inicial, a IA atua como assistente durante todo o planejamento: responde dúvidas sobre o destino, sugere alternativas, ajusta o roteiro quando o usuário muda de ideia e ajuda a comparar opções.

## Visão do produto

- **Roteiros como entidade central.** Cada viagem é um roteiro com destino, datas e preferências do usuário.
- **Planejamento por dia.** Dentro de um roteiro, o usuário organiza o que fará em cada dia (atividades, refeições, deslocamentos), podendo editar manualmente o que a IA sugerir.
- **Assistente de IA conversacional.** A IA conversa com o usuário, propõe roteiros, responde dúvidas e refina o plano conforme o feedback.
- **Dados de mapas reais.** A IA consulta um provedor de mapas (Google Maps / Google Places) para obter pontos turísticos, restaurantes, horários, avaliações e tempo de deslocamento, evitando recomendações genéricas ou desatualizadas.
- **Edição livre.** Tudo que a IA gera é apenas uma sugestão: o usuário pode reordenar, remover ou adicionar itens em qualquer ponto do roteiro.

## Funcionalidades planejadas

- Criação e listagem de roteiros (destino, datas, número de viajantes, preferências).
- Quebra do roteiro em dias, com lista ordenada de atividades por dia.
- Chat com a IA para gerar e refinar roteiros.
- Busca de pontos turísticos, restaurantes e atrações via Google Places.
- Cálculo de deslocamentos (tempo / distância) entre itens consecutivos do dia.
- Persistência por usuário (autenticação será detalhada conforme o produto evoluir).

## Integrações externas (planejadas)

- **Google Gemini** como modelo de IA para geração e refinamento de roteiros e para o chat com o usuário. O Gemini é a opção preferencial por integrar-se nativamente ao ecossistema Google (Maps / Places) via *function calling* / *tools*.
- **Google Maps Platform** (Places API, Directions API, Geocoding API) como fonte de dados de lugares e deslocamentos.

As chaves de API ficarão em variáveis de ambiente do backend e nunca serão expostas ao frontend; o frontend conversa apenas com a API do projeto.

## Status

Projeto em fase inicial de desenvolvimento. O escopo acima descreve o produto-alvo; a implementação está sendo construída em incrementos.

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

## Como rodar

Pré-requisitos: Node.js 20+ e npm 10+.

```bash
npm install         # instala dependências de todos os workspaces
npm run dev         # sobe backend (porta 3001) e frontend (porta 5173) em paralelo
npm run build       # build de shared, backend e frontend
npm run lint        # ESLint em todos os workspaces
npm test            # testes em todos os workspaces
```

O frontend (`http://localhost:5173`) faz proxy de `/api` para o backend (`http://localhost:3001`). Endpoint de verificação: `GET /api/health`.
