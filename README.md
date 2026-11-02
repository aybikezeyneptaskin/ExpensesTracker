# Expense Tracker

A simple expense tracking application to focus on cloud deployment concepts, Docker containerization, environment configuration, and communication between a frontend, backend API, and PostgreSQL database.

## Architecture

The application is designed around three services:

- Frontend: static HTML/CSS/JavaScript hosted in Azure Blob Storage
- Backend: Java 21 + Spring Boot REST API running in a Docker container on Azure Container Apps
- Database: PostgreSQL for local development and Azure Database for PostgreSQL Flexible Server in production

## Technology Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Java 21, Spring Boot 3, Maven
- Database: PostgreSQL
- Local orchestration: Docker Compose
- Deployment target: Microsoft Azure

## Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Java 21
- Maven 3.9+
- Git

## Local Development

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Start PostgreSQL and the backend with Docker Compose:

```bash
docker compose up --build
```

3. The backend will be available at:

```text
http://localhost:8080
```

4. The PostgreSQL database will be available on:

```text
localhost:5432
```

## Planned Azure Deployment Architecture

- Frontend: Azure Blob Storage static website
- Backend: Azure Container Apps hosting the Spring Boot Docker image
- Database: Azure Database for PostgreSQL Flexible Server
- Communication: backend uses environment-based database connection variables and frontend uses a configurable API URL

