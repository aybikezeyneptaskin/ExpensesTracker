# Expense Tracker

A simple expense tracking application to focus on cloud deployment concepts, Docker containerization, environment configuration, and communication between a frontend, backend API, and PostgreSQL database.

# Features
- Create and delete expenses
- View existing expenses
- Calculate total expenses
- Persistent data storage using PostgreSQL

## Architecture

The application is designed around three services:

- Frontend: static HTML/CSS/JavaScript hosted in Azure Blob Storage
- Backend: Java 21 + Spring Boot REST API running in a Docker container on Azure Container Apps
- Database: PostgreSQL for local development and Azure Database for PostgreSQL Flexible Server in production

The frontend communicates with the backend through a public HTTPS REST API. The backend connects to PostgreSQL privately through an Azure Virtual Network.

The backend and database are deployed in separate subnets within the same virtual network. Private DNS is used for database name resolution.

All main application resources are organized under the rg-expensetracker resource group.

Deployment region: Poland Central.

## Technology Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Java 21, Spring Boot 3, Maven
- Database: PostgreSQL 16
- Containerization: Docker, Docker Compose
- Container Registry: Docker Hub
- Cloud Provider: Microsoft Azure

## Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Java 21
- Maven 3.9+
- Git
## Local Development

### Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Git

### Running the application

1. Clone the repository:

```bash
git clone https://github.com/aybikezeyneptaskin/ExpensesTracker.git
cd ExpensesTracker
```

2. Copy the example environment file:

```bash
cp .env.example .env
```

3. Configure the local database credentials in the `.env` file.

4. Ensure that `frontend/js/config.js` points to:

```text
http://localhost:8080
```

5. Start all three services:

```bash
docker compose up --build -d
```

6. Access the application:

| Service | Address |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

To stop the application:

```bash
docker compose down
```

## REST API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | List all expenses |
| POST | `/api/expenses` | Create an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |
| GET | `/api/expenses/total` | Get total expenses |

## Docker

The backend uses a multi-stage Docker build:

- Maven build stage for compiling and packaging the application.
- Distroless Java 21 runtime image.
- Non-root container execution.
- No compiler or shell in the final runtime image.
- `.dockerignore` to exclude unnecessary files.

The backend image was published to Docker Hub using a versioned tag.

**Docker image:**

```text
aybikezey/expensetracker-api:1.0
```

**Docker Hub repository:**

https://hub.docker.com/r/aybikezey/expensetracker-api

## Azure Deployment

### Frontend

- Azure Blob Storage with static website hosting enabled.
- HTML, CSS and JavaScript files uploaded to the `$web` container.
- Configurable backend API URL.

### Backend

- Azure Container Apps with a Consumption workload profile.
- Docker Hub image with version tag `1.0`.
- External HTTPS ingress with target port `8080`.
- Startup, readiness and liveness probes.
- Automatic scaling between zero and one replica.

### Database

- Azure Database for PostgreSQL Flexible Server.
- PostgreSQL 16.
- Burstable Standard_B1ms.
- 32 GiB storage.
- Private network access.
- TLS-enabled database connection.

### Networking

- Virtual network: `10.0.0.0/16`
- PostgreSQL subnet: `10.0.0.0/24`
- Container Apps subnet: `10.0.2.0/23`
- Private DNS for database name resolution.
- No public access to the database.
- Public HTTPS access to the frontend and backend.

## Environment Variables

| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL JDBC connection URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `SERVER_PORT` | Backend server port |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |

In Azure, database connection details are stored as Container App
secrets and referenced through environment variables.

| Environment Variable | Secret Reference |
|---|---|
| `DB_URL` | `db-url` |
| `DB_USERNAME` | `db-username` |
| `DB_PASSWORD` | `db-password` |

Local environment variables are managed through a `.env` file,
which is excluded from version control.
