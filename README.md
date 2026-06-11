# HMS - Hospital Management System

![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white) ![Spring Cloud Gateway](https://img.shields.io/badge/Spring_Cloud_Gateway-API_Gateway-6DB33F?logo=spring&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-8-DC382D?logo=redis&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

O HMS é uma plataforma full stack para apoiar a operação hospitalar em três perfis principais: administração, médicos e pacientes. O projeto centraliza autenticação, perfis, consultas, prontuários, prescrições, farmácia, mídia e videochamadas em uma arquitetura modular baseada em microserviços.

## Screenshots

### Visão geral

| Login | Cadastro |
| --- | --- |
| ![Tela de login](docs/screenshots/playwright_login.png) | ![Tela de cadastro](docs/screenshots/playwright_register.png) |

### Administração

| Dashboard | Estoque | Vendas |
| --- | --- | --- |
| ![Dashboard administrativo](docs/screenshots/admin_dashboard.png) | ![Estoque administrativo](docs/screenshots/admin_stock.png) | ![Vendas administrativas](docs/screenshots/admin_sales.png) |

| Dashboard completo | Médicos | Pacientes |
| --- | --- | --- |
| ![Dashboard administrativo completo](docs/screenshots/playwright_admin_dashboard.png) | ![Listagem de médicos](docs/screenshots/playwright_admin_doctors.png) | ![Listagem de pacientes](docs/screenshots/playwright_admin_patients.png) |

| Medicamentos | Inventário | Vendas |
| --- | --- | --- |
| ![Cadastro de medicamentos](docs/screenshots/playwright_admin_medicines.png) | ![Inventário de medicamentos](docs/screenshots/playwright_admin_inventory.png) | ![Fluxo de vendas](docs/screenshots/playwright_admin_sales.png) |

### Médico e paciente

| Consultas do médico | Dashboard médico | Perfil médico |
| --- | --- | --- |
| ![Consultas do médico](docs/screenshots/doctor_appointments.png) | ![Dashboard médico](docs/screenshots/playwright_doctor_dashboard.png) | ![Perfil médico](docs/screenshots/playwright_doctor_profile.png) |

| Dashboard paciente | Perfil paciente |
| --- | --- |
| ![Dashboard do paciente](docs/screenshots/playwright_patient_dashboard.png) | ![Perfil do paciente](docs/screenshots/playwright_patient_profile.png) |

## O problema

Hospitais e clínicas lidam com fluxos que dependem de informação confiável e disponível em tempo real. Quando cadastro, agenda, prontuário, estoque e vendas ficam em ferramentas separadas, a operação perde velocidade, aumenta o retrabalho e dificulta a visão do atendimento.

O HMS organiza esses domínios em uma experiência única:

- Administração com visão de médicos, pacientes, medicamentos, estoque e vendas.
- Médicos com acesso ao próprio perfil, pacientes, consultas, farmácia e videochamadas.
- Pacientes com acesso ao próprio perfil, consultas e videochamadas.
- Backend dividido por contexto de negócio, facilitando manutenção e evolução.

## Funcionalidades

- Login e registro com autenticação baseada em JWT.
- Gestão de perfis de médicos e pacientes.
- Agendamento e acompanhamento de consultas.
- Registro de relatórios clínicos e prescrições.
- Gestão farmacêutica com medicamentos, estoque e vendas.
- Upload e recuperação de arquivos de mídia.
- Videochamadas com salas, listagem por participante e sinalização em tempo real.

## Arquitetura

O projeto usa um frontend React consumindo uma API unificada pelo `GatewayMS`. Os microserviços se registram no Eureka e mantêm bancos MySQL separados por domínio.

```mermaid
flowchart LR
    U[Usuário Web] --> FE[Frontend React + Vite]
    FE --> GW[GatewayMS :9000]
    GW --> US[UserMS]
    GW --> PR[ProfileMS]
    GW --> AP[AppointmentsMS]
    GW --> PH[PharmacyMS]
    GW --> VC[VideoCallMS]
    GW --> MD[MediaMS]

    GW -. descoberta .-> EU[Eureka Server :8761]
    US -. registro .-> EU
    PR -. registro .-> EU
    AP -. registro .-> EU
    PH -. registro .-> EU
    VC -. registro .-> EU
    MD -. registro .-> EU
```

## Módulos

| Módulo | Responsabilidade |
| --- | --- |
| `hms` | Frontend React, rotas por perfil e consumo da API. |
| `GatewayMS` | Entrada única da API, roteamento e validação de JWT. |
| `UserMS` | Cadastro, login e emissão de tokens. |
| `ProfileMS` | Perfis de médicos e pacientes. |
| `AppointmentsMS` | Consultas, relatórios, prescrições e estatísticas. |
| `PharmacyMS` | Medicamentos, inventário, vendas e itens de venda. |
| `VideoCallMS` | Videochamadas, salas e sinalização WebSocket. |
| `MediaMS` | Upload e recuperação de arquivos. |
| `eureka-server` | Descoberta e registro de serviços. |

## Stack

**Frontend:** React 19, TypeScript, Vite, React Router, Redux Toolkit, Axios, Mantine UI, PrimeReact, Tailwind CSS e Recharts.

**Backend:** Java 17, Spring Boot, Spring Cloud Gateway, Netflix Eureka, Spring Security, Spring Data JPA, OpenFeign, WebSocket, MySQL, Redis e JWT com `io.jsonwebtoken`.

## Documentação específica

- [Frontend](hms/README.md)
- [Backend](backendHms/README.md)
- [Diagramas de banco e arquitetura](docs/db-diagrams/)

## Estrutura do repositório

```text
hmsReact/
|- docs/
|  |- db-diagrams/
|  |- screenshots/
|- hms/
|- backendHms/
|  |- eureka-server/
|  |- GatewayMS/
|  |- UserMS/
|  |- ProfileMS/
|  |- AppointmentsMS/
|  |- PharmacyMS/
|  |- VideoCallMS/
|  |- media/
|- .docker/
|- docker-compose.yml
|- README.md
```

## Execução local resumida

O caminho mais simples para executar a aplicação completa é via Docker Compose:

```powershell
docker compose up --build
```

Após subir os containers:

- Frontend: `http://localhost:5173`
- Gateway: `http://localhost:9000`
- Eureka: `http://localhost:8761`

Para detalhes de execução, configuração e desenvolvimento, consulte os READMEs de [frontend](hms/README.md) e [backend](backendHms/README.md).

## Estado do projeto

O HMS está em evolução e demonstra uma base modular para uma solução hospitalar integrada. Próximos passos naturais incluem ampliar testes integrados, melhorar a cobertura das jornadas clínicas, evoluir a robustez das videochamadas e documentar APIs com OpenAPI ou Swagger.
