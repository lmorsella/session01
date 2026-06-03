# JWT Backend API (FastAPI)

Este repositorio contiene una carpeta `backend` con una API Web hecha en **Python + FastAPI** que implementa autenticación con JWT.

## Requisitos funcionales implementados

- Endpoint para autenticación con credenciales fijas:
  - `username`: `admin`
  - `password`: `admin123`
- Generación de `access_token` JWT con expiración de **300 segundos**.
- Endpoint para refrescar token usando `refresh_token`.
- Gestión de dependencias con **Poetry**.
- Archivos **Dockerfile** y **docker-compose.yml** para despliegue con Docker.

## Estructura

- `/tmp/workspace/lmorsella/session01/backend/app/main.py`: aplicación FastAPI.
- `/tmp/workspace/lmorsella/session01/backend/tests/test_auth.py`: pruebas enfocadas de autenticación.
- `/tmp/workspace/lmorsella/session01/backend/Dockerfile`: imagen Docker.
- `/tmp/workspace/lmorsella/session01/backend/docker-compose.yml`: despliegue local.

## Uso local (Poetry)

```bash
cd /tmp/workspace/lmorsella/session01/backend
poetry install
poetry run uvicorn app.main:app --reload
```

La API quedará en `http://127.0.0.1:8000`.

## Endpoints

### 1) Obtener token

**POST** `/token`

Body JSON:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Respuesta esperada:

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300,
  "refresh_token": "<jwt>"
}
```

### 2) Refrescar token

**POST** `/token/refresh`

Body JSON:

```json
{
  "refresh_token": "<jwt-refresh>"
}
```

Respuesta esperada:

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "expires_in": 300
}
```

## Ejemplos con `curl`

```bash
curl -X POST http://127.0.0.1:8000/token \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

```bash
curl -X POST http://127.0.0.1:8000/token/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"<jwt-refresh>"}'
```

## Ejecutar pruebas

```bash
cd /tmp/workspace/lmorsella/session01/backend
poetry run pytest
```

## Uso con Docker

```bash
cd /tmp/workspace/lmorsella/session01/backend
docker compose up --build
```

Luego consumir en `http://127.0.0.1:8000`.
