## 🎬 Configuração do Projeto (Vídeo)

[![Assista à apresentação no YouTube](https://img.youtube.com/vi/hfeHjI23rsE/maxresdefault.jpg)](https://www.youtube.com/watch?v=hfeHjI23rsE)

## 🚀 Passo a Passo para Rodar o Projeto

1. **Configure o arquivo `.env`**

Antes de qualquer coisa, crie um arquivo `.env` na raiz do projeto e na pasta backend com as seguintes variáveis de ambiente:

```env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=your_database
MYSQL_USER=your_user
MYSQL_PASSWORD=your_user_password
DATABASE_URL="mysql://user:password@db:3306/dbname"
```

> ⚠️ **Importante**: nunca comite o arquivo `.env` com credenciais reais em repositórios públicos.  
> Os valores acima são apenas exemplos, o original está comigo — preencha com as variáveis corretas do seu ambiente local.

2. **Clone o repositório**:

```bash
git clone https://github.com/vmellozk/crud-anka-tech.git
cd crud-anka-tech
```

3. **Build dos containers e instalação das dependências**:

Após clonar o projeto, execute o comando abaixo para construir as imagens Docker e instalar todas as dependências:

```bash
docker-compose up --build
```

> Após a finalização do processo, pressione `Ctrl + C` para sair dos logs e continuar com os próximos comandos.

4. **Inicie os containers manualmente**:

```bash
docker start crud-anka-tech-db-1 crud-anka-tech-backend-1 crud-anka-tech-frontend-1
```

5. **Acesse o container do banco de dados**:

```bash
docker compose exec db mysql -u root -p
```

> Insira a senha configurada no arquivo `.env` (MYSQL_ROOT_PASSWORD).

6. **Conceda permissões no MySQL**:

Dentro do MySQL (já logado no passo anterior), execute os comandos abaixo:

```sql
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

> Em seguida, digite `exit` para sair do MySQL e voltar ao terminal.

7. **Reinicie todos os containers**:

```bash
docker stop $(docker ps -q)
docker start crud-anka-tech-db-1 crud-anka-tech-backend-1 crud-anka-tech-frontend-1
```

---

✅ Pronto! O ambiente está configurado, permissões concedidas e tudo rodando corretamente.  
Acesse a URL exibida nos logs do Docker para utilizar a aplicação.

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
