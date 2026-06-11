# HMS Frontend

Frontend do HMS, desenvolvido com React, TypeScript e Vite. A aplicação entrega a experiência web para administração, médicos e pacientes, consumindo a API unificada pelo Gateway em `http://localhost:9000`.

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Axios
- Mantine UI
- PrimeReact
- Tailwind CSS
- Recharts
- `jwt-decode`

## Responsabilidades

- Renderizar os dashboards e fluxos por perfil de usuário.
- Controlar rotas públicas e rotas protegidas.
- Armazenar o JWT no `localStorage` e sincronizar o estado com Redux.
- Injetar automaticamente o token nas requisições com o interceptor Axios.
- Consumir os domínios de usuários, perfis, consultas, farmácia, mídia e videochamadas pelo Gateway.

## Estrutura principal

```text
hms/
|- src/
|  |- assets/        # Imagens e recursos estáticos
|  |- components/    # Componentes reutilizáveis por domínio
|  |- data/          # Dados auxiliares e mocks visuais
|  |- interceptor/   # Configuração central do Axios
|  |- Layout/        # Layouts por perfil
|  |- pages/         # Páginas roteadas
|  |- Routes/        # Rotas públicas, protegidas e mapa da aplicação
|  |- services/      # Camada de consumo da API
|  |- slices/        # Estados Redux
|  |- utilities/     # Store e utilitários compartilhados
|- package.json
|- vite.config.ts
```

## Rotas

| Perfil | Rotas principais |
| --- | --- |
| Público | `/login`, `/register` |
| Administração | `/admin/dashboard`, `/admin/medicines`, `/admin/doctors`, `/admin/inventory`, `/admin/patients`, `/admin/sales` |
| Médico | `/doctor/dashboard`, `/doctor/profile`, `/doctor/patients`, `/doctor/appointments`, `/doctor/pharmacy`, `/doctor/videocall`, `/doctor/video-room/:roomId` |
| Paciente | `/patient/dashboard`, `/patient/profile`, `/patient/appointments`, `/patient/videocall`, `/patient/video-room/:roomId` |

## Autenticação e API

A base URL da API fica centralizada em `src/interceptor/AxiosInterceptor.tsx`:

```ts
baseURL: "http://localhost:9000"
```

O interceptor adiciona automaticamente o cabeçalho:

```http
Authorization: Bearer <token>
```

O controle de acesso é feito por:

- `JwtSlice`, que guarda o token.
- `UserSlice`, que decodifica os dados do usuário.
- `ProtectedRoute`, que bloqueia páginas privadas sem token.
- `PublicRoute`, que redireciona usuários autenticados para o dashboard do perfil.

## Como rodar

Pré-requisitos:

- Node.js 20+
- npm 10+
- Backend disponível em `http://localhost:9000`

Instalar dependências:

```powershell
npm install
```

Executar em desenvolvimento:

```powershell
npm run dev
```

Aplicação local:

```text
http://localhost:5173
```

Gerar build:

```powershell
npm run build
```

Rodar lint:

```powershell
npm run lint
```

## Execução com Docker

Na raiz do repositório, o frontend é iniciado junto com os serviços:

```powershell
docker compose up --build frontend
```

Para subir a aplicação completa:

```powershell
docker compose up --build
```

## Observações de desenvolvimento

- As chamadas HTTP devem passar pela camada de `services/`.
- Novas rotas protegidas devem ser adicionadas em `Routes/AppRoutes.tsx`.
- Fluxos específicos de perfil devem permanecer nas pastas de `components/Admin`, `components/Doctor` ou `components/Patient`.
- Estados globais devem ser adicionados em `slices/` e registrados na store em `utilities/Store.tsx`.
