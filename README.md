# WeDo Taskys

**Gestor de tareas colaborativo: grupos de trabajo, listas compartidas y tareas, con invitaciones entre usuarios.**

🔗 **[wedo-taskys.vercel.app](https://wedo-taskys.vercel.app)**

Proyecto full stack MERN desarrollado **en equipo**, con flujo de ramas y pull requests.

---

## Qué hace

El modelo tiene cuatro piezas encadenadas:

- **Usuarios** — registro y login con sesión por cookie.
- **Grupos** — cada usuario crea grupos e invita a otros por mail. Las invitaciones se aceptan o se rechazan; nadie entra a un grupo sin haber aceptado.
- **Listas** — dentro de cada grupo, para organizar el trabajo por tema.
- **Tareas** — la unidad final, dentro de una lista.

La interfaz está en **español e inglés**, con un selector que cambia el idioma en caliente.

## Stack

**Backend** — Node + Express 5, MongoDB con Mongoose, validación con Zod.

**Frontend** — React 19 + Vite, React Router 7, Axios, iconos de Lucide.

## Seguridad

Es la parte del backend que más trabajo tiene, y no es la configuración por defecto de Express:

- **Sesión por cookie `HttpOnly`.** El JWT viaja en una cookie que JavaScript no puede leer, así un XSS no se lleva el token. En producción va con `secure` y `sameSite: none`, porque el front y el back están en dominios distintos; en desarrollo baja a `lax`, que es lo que hace falta en `localhost`.
- **Access token y refresh token separados**, firmados con secretos distintos. Si se filtra el de acceso, no alcanza para emitir sesiones nuevas.
- **Contraseñas con bcrypt**, nunca en texto plano.
- **`helmet`** para las cabeceras de seguridad HTTP.
- **`express-rate-limit`** contra fuerza bruta.
- **CORS restringido** al origen del frontend.
- **Validación con Zod** en el borde: cada ruta valida su payload contra un schema antes de tocar la lógica, con un middleware que centraliza el manejo del error.

## Estructura

```
server/src/
├── models/          User, Group, Invitation, List, Task
├── controllers/     un controlador por recurso
├── routes/          definición de endpoints
├── schemas/         schemas de Zod por recurso
├── middlewares/     validateToken, validator, errorHandler
└── config/db.js     conexión a MongoDB

client/src/
├── components/
│   ├── auth/          login y registro
│   ├── groups/        dashboard, alta, gestión, invitaciones
│   ├── lists/         listas dentro de un grupo
│   ├── tasks/         tareas dentro de una lista
│   ├── notifications/ avisos de invitaciones y acciones
│   ├── settings/      preferencias del usuario
│   ├── common/        contextos de usuario e idioma, UI compartida
│   └── mainPage/      landing y about
└── App.jsx            ruteo
```

## Correrlo

Hacen falta Node y una instancia de MongoDB.

```bash
# Backend
cd server
npm install
cp .env.example .env     # completar MONGODB_URI, CLIENT_URL y los dos secretos
npm run dev

# Frontend, en otra terminal
cd client
npm install
cp .env.example .env     # VITE_API_URL apuntando al backend
npm run dev
```

`CLIENT_URL` tiene que coincidir exacto con el origen del frontend, puerto incluido, o CORS bloquea las llamadas.

## Cómo se trabajó

74 commits y 17 pull requests mergeados, sobre un flujo de ramas acordado por el equipo:

| Prefijo | Para qué |
|---|---|
| `feature/` | funcionalidad nueva |
| `bugfix/` | corrección de un error puntual |
| `hotfix/` | corrección urgente sobre producción |
| `refactor/` | cambios internos que no alteran el comportamiento |

Todas las ramas salen de `develop`, que es la que se mantiene actualizada. El merge a `develop` va siempre por pull request, nunca directo, y la rama se borra recién después de mergeada.

## Equipo

Renzo Piris · Marcos Perez · Santiago Vallejos
