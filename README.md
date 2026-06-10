# Apicultura en el Bosque Seco

Videojuego de dos niveles sobre apicultura en ecosistemas de bosque seco.

## Requisitos

- Node.js 18+
- MySQL 8+ con base de datos `juego_piurano_db`
- Extensión Live Server para VS Code (o cualquier servidor estático en puerto 5500)

## Base de datos

Crear la tabla antes de iniciar el backend:

```sql
CREATE DATABASE IF NOT EXISTS juego_piurano_db;
USE juego_piurano_db;

CREATE TABLE IF NOT EXISTS tabla_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_jugador VARCHAR(50) NOT NULL,
  puntaje_total INT NOT NULL,
  tiempo_segundos INT NOT NULL,
  nivel_alcanzado INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Iniciar el backend

```bash
cd backend
npm install
node server.js
```

El servidor queda escuchando en `http://localhost:3000`.

## Iniciar el frontend

Abrí `index.html` con Live Server (clic derecho → Open with Live Server).
El juego se sirve desde `http://127.0.0.1:5500`.

## Despliegue en GitHub Pages

1. Subí la carpeta raíz (sin `backend/`) a un repositorio de GitHub.
2. Activá GitHub Pages desde Settings → Pages → Branch: main / root.
3. El frontend funciona sin backend (el récord simplemente no se guarda si el servidor no está disponible).
4. Para el backend, desplegalo en Railway, Render, o cualquier VPS con Node.js y MySQL, y actualizá la URL en `js/api.js`.

## Controles

| Nivel | Acción | Control |
|-------|--------|---------|
| 1 | Disparar humo | Clic en el panal |
| 2 | Acelerar centrífuga | D o flecha derecha |
| 2 | Frenar centrífuga | A o flecha izquierda |
