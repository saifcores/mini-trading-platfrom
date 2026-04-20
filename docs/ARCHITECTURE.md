# Mini Trading Platform — Architecture & System Design

This document describes the **logical architecture**, **major components**, **runtime behavior**, and **design decisions** for the mini trading platform (React + Spring Boot + PostgreSQL).

---

## 1. Goals & scope


| Goal                         | How it is addressed                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| Clear separation of concerns | Backend: hexagonal-style layers; frontend: pages, hooks, API layer                       |
| Testable business rules      | Rich domain models (`Wallet`, `PortfolioPosition`, `Order`) + `MarketOrderDomainService` |
| Secure API                   | JWT bearer tokens; Spring Security stateless filter chain                                |
| Data integrity               | JPA transactions; pessimistic locks on wallet/stock/position during trades               |
| Simulated market             | Scheduled price ticks; optional WebSocket broadcast                                      |


**Non-goals:** real exchange connectivity, payment rails, regulatory reporting, horizontal scaling of the matching engine.

---

## 2. System context

```mermaid
flowchart LR
  subgraph users [Users]
    U[Browser]
  end
  subgraph platform [Mini Trading Platform]
    FE[React SPA]
    API[Spring Boot API]
    DB[(PostgreSQL)]
  end
  U --> FE
  FE -->|HTTPS /api REST + optional WS| API
  API --> DB
```



- **Browser** runs the SPA (static assets or Vite dev server).
- **API** owns auth, wallet, portfolio, orders, and simulated market data.
- **PostgreSQL** is the system of record.

---

## 3. Container view (deployment)

```mermaid
flowchart TB
  subgraph dev [Local development]
    Vite[Vite dev server]
    SB[Spring Boot :8080]
    PG[(PostgreSQL :5432)]
    Vite -->|proxy /api /ws| SB
    SB --> PG
  end
  subgraph prod [Typical production]
    CDN[CDN / static host]
    API2[API :443]
    PG2[(PostgreSQL)]
    CDN -->|VITE_API_URL| API2
    API2 --> PG2
  end
```



- **Development:** `frontend/.env.development` sets `VITE_DEV_PROXY_TARGET`; the UI calls same-origin `/api/...` and Vite forwards to Spring Boot.
- **Production:** the built SPA uses `VITE_API_URL` (or same-origin `/api` behind a reverse proxy).

---

## 4. Backend architecture (hexagonal / clean)

### 4.1 Layering & dependency rule

Dependencies point **inward**: infrastructure and presentation depend on **application** and **domain**; **domain** has **no** Spring or JPA imports.


| Layer              | Package                                              | Responsibility                                                                                                                                 |
| ------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**         | `com.saifcores.trading.domain`                       | Entities/aggregates (pure Java), repository **ports**, domain services (`MarketOrderDomainService`)                                            |
| **Application**    | `com.saifcores.trading.application`                  | Use cases, DTOs, MapStruct API mappers, Spring events (`OrderExecutedEvent`)                                                                   |
| **Infrastructure** | `com.saifcores.trading.infrastructure`               | JPA entities, Spring Data repositories, **adapters** implementing ports, MapStruct persistence mappers, `StockDataLoader`, `MarketPriceTicker` |
| **Presentation**   | `com.saifcores.trading.presentation`                 | REST controllers only                                                                                                                          |
| **Cross-cutting**  | `com.saifcores.trading.common`, `config`, `security` | Exceptions, global handler, JWT, Security filter chain, CORS, WebSocket broker config                                                          |


### 4.2 Package map (abbreviated)

```
com.saifcores.trading
├── application/
│   ├── dto/              # Request/response records
│   ├── mapper/           # ApiDtoMapper (DTO ↔ domain-facing)
│   ├── service/          # AuthApplicationService, TradeApplicationService, …
│   └── event/            # OrderExecutedEvent, listener
├── domain/
│   ├── model/            # User, Wallet, Order, PortfolioPosition, Stock
│   ├── repository/       # Interfaces (ports)
│   └── service/          # MarketOrderDomainService (pure execution rules)
├── infrastructure/
│   ├── entity/           # JPA entities
│   ├── repository/       # *JpaRepository
│   ├── adapter/          # *RepositoryAdapter → ports
│   ├── mapper/           # Entity ↔ domain (MapStruct)
│   ├── bootstrap/        # Stock seed
│   └── market/           # Price simulation + scheduled ticker
├── presentation/
│   └── controller/       # REST
├── security/             # JWT, UserDetails, filter
└── config/               # Security, WebSocket, properties
```

### 4.3 Ports & adapters

- **Ports** are interfaces in `domain.repository` (e.g. `WalletRepository`, `OrderRepository`).
- **Adapters** in `infrastructure.adapter` implement those ports using JPA repositories + MapStruct mappers to translate **domain** ↔ **entity**.

This keeps persistence details out of use cases and domain logic.

---

## 5. Core runtime flows

### 5.1 Authentication (JWT)

```mermaid
sequenceDiagram
  participant C as Client
  participant API as AuthController
  participant S as AuthApplicationService
  participant U as UserRepository
  participant W as WalletRepository
  participant J as JwtTokenProvider
  C->>API: POST /api/auth/register | login
  API->>S: register / login
  S->>U: persist user / load user
  S->>W: create wallet on register
  S->>J: createAccessToken(userId, email)
  J-->>C: AuthResponse (Bearer token)
  Note over C: Subsequent requests: Authorization: Bearer ...
```



- **Login** uses Spring Security’s `AuthenticationManager` (DAO provider + BCrypt).
- **JWT** is validated in `JwtAuthenticationFilter`; `UserPrincipal` carries `userId` and `email`.

### 5.2 Place market order (trade)

```mermaid
sequenceDiagram
  participant C as Client
  participant TC as TradeController
  participant TS as TradeApplicationService
  participant D as MarketOrderDomainService
  participant WR as WalletRepository
  participant SR as StockRepository
  participant PR as PortfolioPositionRepository
  participant OR as OrderRepository
  C->>TC: POST /api/trades
  TC->>TS: placeOrder(userId, request)
  TS->>OR: save PENDING order
  TS->>WR: findByUserIdForUpdate (lock)
  TS->>SR: findBySymbolForUpdate (lock)
  TS->>PR: find position for update (optional)
  TS->>D: execute(order, wallet, position?, stock)
  D-->>TS: mutates wallet, position, order → EXECUTED
  TS->>OR: save order
  TS->>WR: save wallet
  TS->>PR: save/delete position
  TS->>TS: publish OrderExecutedEvent
```



**Concurrency:** wallet (and stock/position where applicable) use **pessimistic write** locks so two orders for the same user do not interleave inconsistently.

**Failures:** business failures (`InsufficientFundsException`, etc.) mark the order **FAILED** and persist; `@Transactional(noRollbackFor = …)` ensures failed orders remain committed for audit.

### 5.3 Simulated market

- `StockDataLoader` seeds symbols and initial prices.
- `MarketPriceTicker` (`@Profile("!test")`) runs on a fixed interval, applies `MarketPriceSimulator` random walk, persists `StockEntity`, and publishes to STOMP topic `/topic/prices`.
- Public REST: `GET /api/market/stocks`.

---

## 6. Data model (logical)

```mermaid
erDiagram
  USER ||--|| WALLET : has
  USER ||--o{ ORDER : places
  USER ||--o{ PORTFOLIO_POSITION : holds
  STOCK ||--o{ ORDER : references
  USER {
    long id PK
    string email UK
    string password_hash
  }
  WALLET {
    long id PK
    long user_id FK UK
    decimal balance
    long version
  }
  ORDER {
    long id PK
    long user_id FK
    string symbol
    enum side
    int quantity
    enum status
    decimal unit_price
    decimal total_amount
  }
  PORTFOLIO_POSITION {
    long id PK
    long user_id FK
    string symbol
    int quantity
    decimal average_price
  }
  STOCK {
    string symbol PK
    string name
    decimal current_price
    decimal volatility
  }
```



---

## 7. Frontend architecture


| Area                                    | Role                                                                                                   |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Pages**                               | Route-level UI (`Dashboard`, `Trading`, `Profile`, …)                                                  |
| **Hooks**                               | `useAssets`, `usePortfolioRows`, `useWallet`, `useOrders` — choose API vs mock via `isApiConfigured()` |
| `**lib/api/client.ts`**                 | `fetch` wrapper, `Authorization: Bearer`, skips auth header for `/api/auth/*`                          |
| `**lib/env.ts**`                        | Resolves API base URL (dev proxy, relative, or absolute)                                               |
| `**api/trading.ts**`, `**api/auth.ts**` | Typed endpoints aligned with Spring DTOs                                                               |


**State:** React local state + hooks; JWT and email in `localStorage`; `auth-changed` event for sidebar refresh.

---

## 8. Cross-cutting concerns


| Concern        | Implementation                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| **Validation** | Jakarta Bean Validation on DTOs (`@NotBlank`, `@Email`, …)                                                    |
| **Errors**     | `GlobalExceptionHandler` → JSON `ApiError` with `code`, `message`                                             |
| **Logging**    | SLF4J in services and listeners                                                                               |
| **CORS**       | `CorsConfig` + `SecurityFilterChain.cors(Customizer.withDefaults())`                                          |
| **Async**      | `@EnableAsync` for `OrderExecutedApplicationListener` (logging side-effect)                                   |
| **Tests**      | Domain unit tests; Spring Boot tests use H2 where applicable; market ticker disabled with `@Profile("!test")` |


---

## 9. Design trade-offs


| Decision                        | Rationale                                                          |
| ------------------------------- | ------------------------------------------------------------------ |
| Single monolith API             | Simplicity; enough for demo and learning                           |
| Pessimistic DB locks            | Correctness over throughput for concurrent orders per user         |
| Simulated prices in DB          | Simple reads for REST; WebSocket for push                          |
| JWT in `localStorage`           | SPA-friendly; production apps often prefer httpOnly cookies + CSRF |
| No Kafka/Redis in default build | Fewer moving parts; events are in-process Spring events            |


---

## 10. Related documents

- [README.md](../README.md) — runbooks, env vars, quick start

For API path and payload details, see controllers under `presentation/controller` and DTOs under `application/dto`.