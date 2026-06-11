# HMS Backend

Backend do HMS, organizado em microserviços Java com Spring Boot. Os serviços são expostos externamente pelo `GatewayMS`, registrados no Eureka e persistem dados em bancos MySQL separados por domínio.

## Stack

- Java 17
- Spring Boot
- Spring Cloud Gateway
- Netflix Eureka
- Spring Security
- Spring Data JPA
- OpenFeign
- Spring WebSocket
- MySQL 8
- Redis 8
- JWT com `io.jsonwebtoken`

## Serviços

| Serviço | Porta padrão | Banco | Responsabilidade |
| --- | --- | --- | --- |
| `eureka-server` | `8761` | - | Registro e descoberta de serviços. |
| `GatewayMS` | `9000` | - | Entrada única da API, roteamento e validação de JWT. |
| `UserMS` | `8080` | `userdb` | Registro, login e emissão de tokens. |
| `ProfileMS` | `8081` | `profiledb` | Perfis de médicos e pacientes. |
| `AppointmentsMS` | `8082` | `appointmentsdb` | Consultas, relatórios, prescrições e estatísticas. |
| `PharmacyMS` | `8083` | `pharmacydb` | Medicamentos, inventário, vendas e itens de venda. |
| `VideoCallMS` | `8084` | `videocalldb` | Videochamadas, salas e sinalização em tempo real. |
| `media` / `MediaMS` | `8085` | `mediadb` | Upload e recuperação de arquivos. |

## Arquitetura

- O frontend consome somente o Gateway em `http://localhost:9000`.
- O `GatewayMS` valida o JWT, injeta cabeçalhos internos e encaminha a requisição para o serviço correto.
- Os serviços se registram no Eureka e são resolvidos por nome, como `lb://UserMS`.
- Chamadas internas entre serviços usam OpenFeign.
- As rotas internas dos serviços são protegidas pelo cabeçalho `X-Secret-Key`.
- Redis é usado para cache e apoio a fluxos que precisam de estado rápido.
- O `VideoCallMS` combina endpoints REST em `/videocalls/*` com WebSocket em `/videocalls/ws`.

## Endpoints via Gateway

| Domínio | Base path |
| --- | --- |
| Autenticação e usuários | `/user/*` |
| Perfis | `/profile/*` |
| Consultas e relatórios | `/appointment/*` |
| Farmácia | `/pharmacy/*` |
| Videochamadas | `/videocalls/*` |
| WebSocket de videochamada | `/videocalls/ws` |
| Mídia | `/media/*` |

Base URL local:

```text
http://localhost:9000
```

## Bancos de dados

O ambiente local usa bancos separados por domínio:

- `userdb`
- `profiledb`
- `appointmentsdb`
- `pharmacydb`
- `videocalldb`
- `mediadb`

O script `../.docker/mysql/init.sql` cria os bancos e aplica privilégios iniciais quando o volume MySQL é criado pela primeira vez.

Diagramas disponíveis:

- `../docs/db-diagrams/user_ms_db_diagram.pdf`
- `../docs/db-diagrams/profile_ms_db_diagram.pdf`
- `../docs/db-diagrams/appointment_ms_db_diagram.pdf`
- `../docs/db-diagrams/micro_diagram_v1.pdf`

## Configuração

Os serviços usam perfis Spring para separar ambiente local e container:

- `application-dev.properties`
- `application-container.properties`
- `application.properties`

Variáveis importantes em ambiente de execução:

```env
JWT_KEY=SUA_CHAVE_SECRETA_FORTE_AQUI
MYSQL_USER=usuario
MYSQL_PASSWORD=senha
MYSQL_ROOT_PASSWORD=senha_root
```

Não versione credenciais reais, chaves JWT reais ou arquivos `.env` com segredos.

## Como rodar com Docker

Na raiz do repositório:

```powershell
docker compose up --build
```

Serviços principais após subir:

```text
Gateway: http://localhost:9000
Eureka:  http://localhost:8761
Redis:   localhost:6379
MySQL:   mysql:3306 dentro da rede Docker
```

Para subir apenas um serviço específico, use:

```powershell
docker compose up --build gatewayms
```

## Como rodar manualmente

Pré-requisitos:

- Java JDK 17
- MySQL 8+
- Redis 8+
- Maven Wrapper incluído em cada serviço
- Eureka rodando antes dos serviços dependentes

Ordem recomendada:

1. `eureka-server`
2. `GatewayMS`
3. `UserMS`
4. `ProfileMS`
5. `AppointmentsMS`
6. `PharmacyMS`
7. `VideoCallMS`
8. `media`

Exemplo:

```powershell
cd backendHms/eureka-server/eureka-server
.\mvnw.cmd spring-boot:run
```

Em outro terminal:

```powershell
cd backendHms/GatewayMS/GatewayMS
.\mvnw.cmd spring-boot:run
```

Repita o padrão para os demais microserviços, entrando na pasta do serviço e executando `.\mvnw.cmd spring-boot:run`.

## Segurança

- O JWT é emitido pelo `UserMS`.
- O `GatewayMS` valida o token antes de encaminhar requisições protegidas.
- Login e cadastro são rotas públicas.
- Rotas internas dos microserviços exigem `X-Secret-Key`.
- O handshake WebSocket das videochamadas também passa pelo Gateway.

## Observações de desenvolvimento

- Prefira expor novas rotas externas pelo Gateway, mantendo a entrada única da API.
- Novos serviços devem se registrar no Eureka e receber configuração de ambiente por propriedades Spring.
- Novas integrações internas devem usar OpenFeign e o cabeçalho interno padrão.
- Alterações de banco devem considerar o domínio responsável pelo dado antes de cruzar responsabilidades entre serviços.
