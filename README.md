## 🎬 Configuração do Projeto (Vídeo)

[![Assista à apresentação no YouTube](https://img.youtube.com/vi/hfeHjI23rsE/maxresdefault.jpg)](https://www.youtube.com/watch?v=hfeHjI23rsE)

## 📁 Estrutura do Projeto

```
backend/                             # 🧠 Backend da aplicação (Node.js + Prisma)
├── prisma/                          # 🛠️ Configurações do ORM Prisma
│   ├── migrations/                  # 📦 Histórico das migrações de banco de dados
│   │   ├── 20250531014044_init/     # 🧱 Primeira migração: criação inicial das tabelas
│   │   ├── 2025060301430_add_allocation_model/  # ➕ Adiciona modelo de alocação
│   │   ├── 20250603021442_add_client_asset_relation/ # 🔗 Cria relação entre cliente e ativo
│   │   └── 20250603031233_adjust_model/         # ✏️ Ajustes no modelo do banco
│   ├── migration_lock.toml         # 🔒 Trava de migrações (evita conflitos paralelos)
│   ├── schema.prisma               # 📐 Definição do schema do banco de dados (Prisma)
│   └── seed.ts                     # 🌱 Script de seed (dados iniciais para o banco)
├── src/                            # 🧩 Código-fonte backend (rotas e servidor)
│   ├── routes/                     # 🚏 Endpoints da API REST
│   │   ├── allocations.ts          # 📊 Rota para alocações de ativos
│   │   ├── assets.ts               # 🏢 Rota para gerenciamento de ativos
│   │   ├── clients.ts              # 👥 Rota para operações com clientes
│   │   ├── health.ts               # ❤️ Rota de health check (status da API)
│   │   └── server.ts               # 🚀 Inicialização do servidor e rotas
├── .env                            # 🔐 Variáveis de ambiente (chaves, credenciais, etc)
├── .gitignore                      # 🙈 Arquivos/pastas ignorados pelo Git
├── Dockerfile                      # 🐳 Configuração do container Docker para o backend
├── package-lock.json               # 📦 Lockfile de dependências (versões exatas)
├── package.json                    # 📦 Gerenciamento de pacotes e scripts
├── tsconfig.json                   # ✨ Configurações do TypeScript
└── wait-for-it.sh                  # ⏳ Script para aguardar o banco iniciar antes do app

frontend/                           # 💻 Frontend da aplicação (React + Next.js + Tailwind)
├── .next/                          # ⚙️ Build gerado pelo Next.js (auto-gerado)
├── node_modules/                   # 📁 Dependências instaladas (auto-gerado)
├── public/                         # 🌍 Arquivos públicos acessíveis via URL
│   ├── file.svg                    # 🖼️ Ícone/ilustração
│   ├── globe.svg                   # 🌐 Ícone/ilustração
│   ├── next.svg                    # ⚛️ Logo do Next.js
│   ├── vercel.svg                  # ▲ Logo da Vercel (deploy Next.js)
│   └── window.svg                  # 🪟 Ícone/ilustração
├── src/                            # 🧩 Código-fonte do frontend
│   ├── app/                        # 📁 Páginas e rotas da aplicação
│   │   ├── ativos/                 # 📊 Página de listagem de ativos
│   │   │   └── page.tsx            # 🧾 Componente de página de ativos
│   │   ├── clients/                # 👥 Página de clientes
│   │   │   ├── [id]/               # 🔁 Página dinâmica de cliente por ID
│   │   │   │   └── alocacoes/      # 📈 Alocações específicas de um cliente
│   │   │   │       └── page.tsx    # 📄 Página de alocações
│   │   │   └── editar/             # ✏️ Página para editar cliente
│   │   │       └── page.tsx        # 📄 Página de edição
│   │   ├── page.tsx                # 🏠 Página inicial (root route)
│   │   ├── favicon.ico             # 🧿 Ícone do site (navegador)
│   │   ├── globals.css             # 🎨 Estilos globais da aplicação
│   │   ├── layout.tsx              # 📐 Layout base da aplicação
│   │   └── providers.tsx           # 🌐 Provedores de contexto (ex: tema, auth)
│   ├── components/                 # 🧱 Componentes reutilizáveis da UI
│   │   ├── AtivosList.tsx          # 📃 Lista de ativos
│   │   ├── ClienteForm.tsx         # 📝 Formulário de cliente
│   │   └── ClienteModal.tsx        # 💬 Modal de detalhes ou edição do cliente
│   └── services/                   # 🔌 Serviços (ex: API fetchers)
│       └── apis.ts                 # 🌐 Configuração e chamadas às APIs
├── .gitignore                      # 🙈 Arquivos ignorados pelo Git (frontend)
├── Dockerfile                      # 🐳 Dockerfile do frontend
├── eslint.config.mjs              # 🧹 Configuração do ESLint (análise de código)
├── next-env.d.ts                  # 🔍 Tipagens automáticas do Next.js
├── next.config.ts                 # ⚙️ Configurações customizadas do Next.js
├── package-lock.json              # 📦 Lockfile das dependências
├── package.json                   # 📦 Scripts e dependências do frontend
├── postcss.config.js              # 🎨 Configuração do PostCSS
├── postcss.config.mjs             # 🧩 Variante em módulo ES do PostCSS
├── README.md                      # 📖 Documentação do projeto
├── tailwind.config.js             # 💅 Configuração do Tailwind CSS
└── tsconfig.json                  # ✨ Configuração do TypeScript

.dockerignore                      # 🚫 Ignora arquivos durante build Docker
docker-compose.yml                # 🧩 Orquestra containers (backend, frontend, db, etc)
.gitignore                        # 🙈 Ignora arquivos gerais do projeto
package-lock.json                 # 📦 Lockfile geral (raiz)
package.json                      # 📦 Gerenciador de pacotes raiz (monorepo ou base)
```
