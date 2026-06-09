# Frontend — Spotify-style Login App

Aplicación web desarrollada con **React + Vite** que implementa una pantalla de login conectada al backend JWT y una página de bienvenida protegida. El diseño sigue el sistema de diseño inspirado en Spotify definido en `DESIGN.md`.

## Características

- **Página de login** (`/login`): formulario de usuario y contraseña que consume el endpoint `POST /token` del backend.
- **Página de bienvenida** (`/welcome`): página protegida que sólo es accesible con sesión activa. Muestra una grilla de tarjetas al estilo Spotify.
- **Protección de rutas**: si no hay sesión activa, cualquier ruta redirige a `/login`.
- **Sesión con `sessionStorage`**: el `access_token` y `refresh_token` se guardan en `sessionStorage` (se eliminan al cerrar el tab o al hacer logout).
- **Diseño Spotify**: tema oscuro (`#121212`), tipografía SpotifyMixUI, botones tipo pill, acento verde Spotify (`#1ed760`).

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Backend corriendo en `http://localhost:8000` (ver `../backend/README.md`)

## Instalación y uso

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar entorno (opcional)

Si el backend no corre en `http://localhost:8000`, copia el archivo de ejemplo y modifica la URL:

```bash
cp .env.example .env
# Editar VITE_API_URL en .env
```

### 3. Iniciar en modo desarrollo

```bash
npm run dev
```

La app quedará disponible en `http://localhost:5173`.

### 4. Construir para producción

```bash
npm run build
npm run preview   # servidor local de la build
```

## Credenciales de prueba

| Campo    | Valor     |
|----------|-----------|
| Usuario  | `admin`   |
| Contraseña | `admin123` |

## Estructura del proyecto

```
frontend/
├── public/              # Assets estáticos
├── src/
│   ├── context/
│   │   └── AuthContext.jsx       # Estado global de autenticación
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Guard de rutas autenticadas
│   ├── pages/
│   │   ├── LoginPage.jsx         # Página de login
│   │   ├── LoginPage.module.css
│   │   ├── WelcomePage.jsx       # Página de bienvenida (protegida)
│   │   └── WelcomePage.module.css
│   ├── App.jsx                   # Configuración de rutas
│   ├── main.jsx                  # Punto de entrada
│   └── index.css                 # Variables y estilos globales (Design System)
├── .env.example         # Ejemplo de variables de entorno
├── package.json
└── vite.config.js
```

## Flujo de autenticación

1. El usuario ingresa sus credenciales en `/login`.
2. El frontend hace `POST /token` al backend con `{ username, password }`.
3. Si la respuesta es `200`, se guarda el `access_token` y `refresh_token` en `sessionStorage`.
4. El usuario es redirigido a `/welcome`.
5. Al cerrar sesión (botón "Cerrar Sesión"), los tokens se eliminan y se redirige a `/login`.
6. Si se accede a `/welcome` sin token, se redirige automáticamente a `/login`.

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con Hot Module Replacement |
| `npm run build` | Build optimizado para producción |
| `npm run preview` | Previsualizar la build de producción |
| `npm run lint` | Revisar el código con ESLint |

## Iniciar backend + frontend juntos

En dos terminales separadas:

```bash
# Terminal 1: backend
cd backend
poetry run uvicorn app.main:app --reload

# Terminal 2: frontend
cd frontend
npm run dev
```

O usando Docker para el backend:

```bash
# Terminal 1: backend con Docker
cd backend
docker compose up --build

# Terminal 2: frontend
cd frontend
npm run dev
```
