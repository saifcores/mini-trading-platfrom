# Mini Trading Platform

A small full-stack trading-style demo: **React (Vite)** frontend and **Spring Boot** backend with JWT auth, simulated market prices, wallet, portfolio, and market orders.

## Architecture

| Layer        | Stack                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, lightweight-charts  |
| **Backend**  | Java 17, Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, PostgreSQL |
| **Mapping**  | MapStruct + Lombok                                                           |

The backend follows **hexagonal-style** packages: `domain` (pure logic), `application` (use cases, DTOs), `infrastructure` (JPA, adapters), `presentation` (REST). The UI talks to the API over **`/api/...`** and stores the JWT in `localStorage`.

**System design (layers, flows, diagrams):** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Repository layout

```
mini-trading-platform/
├── backend/                 # Spring Boot (Maven)
│   ├── docker-compose.yml   # PostgreSQL only
│   ├── Dockerfile
│   └── src/main/java/com/saifcores/trading/...
├── docs/
│   └── ARCHITECTURE.md      # System design & diagrams
├── frontend/                # Vite + React
│   └── src/...
└── README.md
```

## Prerequisites

- **JDK 17+** and **Maven 3.9+** (backend)
- **Node.js 20+** and **npm** (frontend)
- **Docker** (optional, for PostgreSQL via Compose)

---

## Backend

### Run PostgreSQL

From `backend/`:

```bash
docker compose up -d
```

Default connection (see `backend/docker-compose.yml`):

- Host: `localhost:5432`
- Database / user / password: `trading` / `trading` / `trading`

### Configuration

Environment variables (or `backend/src/main/resources/application.yml`):

| Variable            | Purpose                                                               |
| ------------------- | --------------------------------------------------------------------- |
| `DATABASE_URL`      | JDBC URL (default `jdbc:postgresql://localhost:5432/trading`)         |
| `DATABASE_USERNAME` | DB user                                                               |
| `DATABASE_PASSWORD` | DB password                                                           |
| `JWT_SECRET`        | **Required in production**: long random secret (≥ 256 bits for HS256) |
| `JWT_EXPIRATION_MS` | Access token lifetime (default 24h)                                   |
| `SERVER_PORT`       | HTTP port (default `8080`)                                            |

### Run the API

```bash
cd backend
mvn spring-boot:run
```

### Build & Docker image

```bash
cd backend
mvn -DskipTests package
docker build -t mini-trading-api .
```

### API overview

Public:

- `POST /api/auth/register` — register (creates wallet with initial balance)
- `POST /api/auth/login`
- `GET /api/market/stocks` — listed symbols and simulated prices

Authenticated (Bearer JWT):

- `GET /api/wallet`
- `GET /api/portfolio`
- `GET /api/orders`
- `POST /api/trades` — body: `{ "symbol", "side": "BUY"|"SELL", "quantity" }`

WebSocket (STOMP): connect to **`/ws`**, subscribe to **`/topic/prices`** for price tick payloads.

### Tests

```bash
cd backend
mvn test
```

Domain unit tests cover wallet and portfolio math. Full Spring context tests use **H2** in-memory (see `src/test`).

---

## Frontend

### Install & dev server

```bash
cd frontend
npm install
npm run dev
```

### Environment

**Local development (default):** `frontend/.env.development` sets `VITE_DEV_PROXY_TARGET=http://localhost:8080`. With `npm run dev`, the UI treats the API as configured and sends `/api/...` and `/ws` through the Vite proxy to Spring Boot (same origin, no extra flags).

| Variable                | Meaning                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `VITE_DEV_PROXY_TARGET` | Backend origin for the dev proxy (`/api`, `/ws`). Default in `.env.development`.       |
| `VITE_API_RELATIVE=1`   | Force same-origin `/api/...` (e.g. nginx serving both app and API).                    |
| `VITE_API_URL`          | Direct backend URL (e.g. production or calling `http://localhost:8080` without proxy). |

Copy `frontend/.env.example` if you need overrides; use `.env.local` for secrets (gitignored).

**Production build:** set `VITE_API_URL` to your deployed API (dev proxy is not used in `vite build`).

### Build

```bash
cd frontend
npm run build
npm run preview   # optional production preview
```

### Using the app with the API

1. Start PostgreSQL and the backend.
2. Configure `.env` as above and run `npm run dev`.
3. Open **Profile** → register or log in (JWT is stored; sidebar shows email when using the API).
4. **Dashboard** shows net worth (cash + positions) when authenticated; **Trade** places real orders against the backend when a token is present.
5. With the API enabled, the SPA opens a **STOMP** WebSocket to `/ws` and subscribes to `/topic/prices`; live ticks update movers and the Trading quote (the assets badge shows **Live API · WS** when the stream is connected).

Without any of the above (e.g. production build with no `VITE_API_URL`), the UI uses built-in demo data.

---

## End-to-end checklist

1. `docker compose up -d` in `backend/`
2. `cd backend && mvn spring-boot:run`
3. `cd frontend && npm install && npm run dev` (uses `frontend/.env.development` → proxy to `http://localhost:8080`)
4. Open the app → **Profile** → register or log in → **Trade** / **Dashboard** / **Portfolio** / **Orders**

The backend enables **CORS** for browser calls to a separate origin; the dev proxy avoids CORS during local work.
