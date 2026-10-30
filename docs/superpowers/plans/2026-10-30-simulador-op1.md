# Plan de Implementación: Simulador OP1 Privado con Panel de Administración

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar el simulador financiero OP1 (`op1_web/`) en la web de Akredita Me bajo la ruta privada `/simulador`, protegido con correo y contraseña, con una interfaz maestra para dar de alta y gestionar usuarios autorizados, y empaquetado de forma unificada dentro del contenedor existente de `app`.

**Architecture:** El frontend en React detecta la ruta `/simulador` sin enlaces públicos; autentica contra la API Express con JWT y almacena las contraseñas encriptadas con `bcrypt` en PostgreSQL (`simulator_users`). Si el usuario tiene rol `admin`, puede gestionar usuarios autorizados mediante un panel maestro. Una vez autenticado, se visualiza el simulador embebido mediante un iframe que Nginx redirige internamente a Streamlit (puerto 8501) con WebSockets dentro del mismo contenedor `app`.

**Tech Stack:** React 19, Tailwind CSS, Lucide Icons, Node.js / Express, PostgreSQL (`pg`), `bcryptjs`, `jsonwebtoken`, Nginx, Python 3.13, Streamlit.

---

### Task 1: Base de Datos y Semilla Inicial del Administrador

**Files:**
- Modify: `api/package.json`
- Modify: `api/db/init.sql`
- Create: `api/scripts/seed-admin.js`

- [x] **Paso 1: Agregar dependencias de seguridad al backend**
  En `api/package.json`, añadir `bcryptjs` y `jsonwebtoken`.
  Comando:
  ```bash
  cd api && npm install bcryptjs jsonwebtoken
  ```

- [x] **Paso 2: Actualizar `api/db/init.sql` para crear la tabla `simulator_users`**
  Agregar al final de `api/db/init.sql`:
  ```sql
  CREATE TABLE IF NOT EXISTS simulator_users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      role VARCHAR(50) DEFAULT 'user',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [x] **Paso 3: Crear script de inicialización del administrador maestro (`api/scripts/seed-admin.js`)**
  Crear el script que crea la tabla si no existe y siembra el usuario:
  - Email: `roberto.martinez@akredita.me`
  - Password: `Temporal12345!!` (hasheado con bcrypt)
  - Name: `Roberto Martinez`
  - Role: `admin`

- [x] **Paso 4: Probar ejecución del script de semilla**
  Ejecutar el script o verificar su sintaxis:
  ```bash
  node api/scripts/seed-admin.js
  ```

- [x] **Paso 5: Commit de Task 1**
  ```bash
  git add api/package.json api/package-lock.json api/db/init.sql api/scripts/seed-admin.js
  git commit -m "feat(api): add simulator_users schema and seed admin script"
  ```

---

### Task 2: Endpoints de Autenticación y Gestión de Usuarios en Express

**Files:**
- Modify: `api/index.js`
- Create: `api/routes/simulator.js` (o integrarlo de forma limpia y modular en `api/`)

- [ ] **Paso 1: Escribir módulo de autenticación y endpoints del simulador**
  Crear las siguientes rutas:
  - `POST /api/simulador/login`: Valida email y password con `bcrypt.compare`. Emite JWT con `{ id, email, role, name }`.
  - `GET /api/simulador/verify`: Middleware de verificación de token JWT. Devuelve `{ valid: true, user }`.
  - `GET /api/simulador/admin/users`: Exclusivo para rol `admin`. Lista usuarios (id, email, name, role, is_active, created_at).
  - `POST /api/simulador/admin/users`: Exclusivo para rol `admin`. Registra un nuevo usuario con correo, nombre, contraseña y rol.
  - `PATCH /api/simulador/admin/users/:id`: Exclusivo para rol `admin`. Actualiza estado (`is_active`) o nueva contraseña.
  - `DELETE /api/simulador/admin/users/:id`: Exclusivo para rol `admin`. Elimina un usuario (previniendo que el admin actual se borre a sí mismo).

- [ ] **Paso 2: Registrar rutas y ejecutar migración automática al iniciar la API**
  En `api/index.js`, invocar la creación de tabla y semilla al arrancar el servidor Express para garantizar que la base de datos siempre esté lista.

- [ ] **Paso 3: Probar endpoints con un script de prueba automatizado**
  Crear y ejecutar `api/scripts/test-simulator-auth.js` que pruebe:
  1. Login con credenciales incorrectas (espera 401).
  2. Login con `roberto.martinez@akredita.me` / `Temporal12345!!` (espera 200 y token).
  3. Llamar `/api/simulador/verify` con el token recibido (espera 200).
  4. Llamar `/api/simulador/admin/users` (espera 200 y array con el usuario admin).

- [ ] **Paso 4: Eliminar script temporal de prueba y hacer commit**
  ```bash
  git add api/
  git commit -m "feat(api): implement auth and admin endpoints for simulator"
  ```

---

### Task 3: Pantalla de Login Institucional y Panel de Administración en React

**Files:**
- Create: `app/src/components/simulator/SimulatorLogin.jsx`
- Create: `app/src/components/simulator/SimulatorAdminModal.jsx`

- [ ] **Paso 1: Crear componente `SimulatorLogin.jsx`**
  - Identidad gráfica Akredita Me (Navy `#0A192F` o tono corporativo, acentos dorados/ámbar, tipografía limpia).
  - Campos: Correo electrónico y Contraseña.
  - Botón de submit con estado de carga ("Iniciando sesión...").
  - Alerta visual en caso de error.
  - Al autenticar con éxito, llama al callback `onLoginSuccess(token, user)`.

- [ ] **Paso 2: Crear componente `SimulatorAdminModal.jsx`**
  - Modal o panel desplegable exclusivo para administradores.
  - Sección 1: Formulario "Dar de alta usuario" (Correo, Nombre/Referencia, Contraseña).
  - Sección 2: Tabla de usuarios con estado (Badge verde Activo / rojo Inactivo).
  - Acciones por usuario:
    - Botón para conmutar estado (Activar / Desactivar).
    - Botón para cambiar contraseña.
    - Botón para eliminar usuario.
  - Botón para cerrar el panel y volver al simulador.

- [ ] **Paso 3: Verificar compilación en frontend**
  Ejecutar:
  ```bash
  cd app && npm run build
  ```
  Asegurar que no haya errores de sintaxis ni de Tailwind.

- [ ] **Paso 4: Commit de Task 3**
  ```bash
  git add app/src/components/simulator/
  git commit -m "feat(app): add SimulatorLogin and SimulatorAdminModal components"
  ```

---

### Task 4: Vista del Simulador y Enrutamiento Privado en React

**Files:**
- Create: `app/src/components/simulator/SimulatorView.jsx`
- Modify: `app/src/App.jsx`

- [ ] **Paso 1: Crear `SimulatorView.jsx`**
  - Gestiona el estado de sesión (`token`, `user`, `loading`).
  - Al montar, si hay token en `localStorage` o `sessionStorage`, llama a `/api/simulador/verify`.
  - Si no está autenticado, renderiza `SimulatorLogin`.
  - Si está autenticado:
    - Muestra barra superior corporativa:
      - Logotipo o isotipo de Akredita Me.
      - Título: "Simulador OP1 — Operadora Energética I".
      - Correo del usuario activo.
      - Si `user.role === 'admin'`: botón con ícono de llave/usuarios "Administrar Accesos" para abrir `SimulatorAdminModal`.
      - Botón "Cerrar Sesión" (limpia token y recarga estado).
    - Debajo, un contenedor `iframe` que ocupa el alto restante de la pantalla (`h-[calc(100vh-64px)] w-full border-0`) cargando `/stream/?embed=true`.

- [ ] **Paso 2: Modificar `app/src/App.jsx` para enrutamiento discreto**
  - Sin alterar las anclas ni la landing page pública:
    ```javascript
    const isSimulatorRoute = window.location.pathname.startsWith('/simulador');
    if (isSimulatorRoute) {
      return <SimulatorView />;
    }
    ```
  - Verificar que `Navbar` y `Footer` permanecen sin enlaces al simulador.

- [ ] **Paso 3: Probar navegación en React**
  Ejecutar `npm run build` en `app` para asegurar compilación exitosa.

- [ ] **Paso 4: Commit de Task 4**
  ```bash
  git add app/src/components/simulator/SimulatorView.jsx app/src/App.jsx
  git commit -m "feat(app): integrate private /simulador route and simulator view"
  ```

---

### Task 5: Empaquetado Unificado en `app/Dockerfile` y Nginx

**Files:**
- Create: `app/nginx.conf`
- Create: `app/entrypoint.sh`
- Modify: `app/Dockerfile`

- [ ] **Paso 1: Crear `app/nginx.conf`**
  - Escucha en puerto 80.
  - Sirve archivos estáticos de React desde `/usr/share/nginx/html`.
  - Regla SPA: `try_files $uri $uri/ /index.html;` para que `/simulador` cargue `index.html`.
  - Proxy inverso para Streamlit:
    ```nginx
    location /stream/ {
        proxy_pass http://127.0.0.1:8501/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
    ```
  - Proxy para llamadas `/api/` hacia el servicio backend `http://api:3001/api/`.

- [ ] **Paso 2: Crear `app/entrypoint.sh`**
  - Script ejecutable en Unix/Alpine:
    ```sh
    #!/bin/sh
    export OP1_AUTH_EXTERNA=1
    streamlit run /opt/simulador/simulador_op1.py \
        --server.port=8501 \
        --server.address=127.0.0.1 \
        --server.baseUrlPath=stream \
        --server.enableCORS=false \
        --server.enableXsrfProtection=false \
        --browser.gatherUsageStats=false &
    
    exec nginx -g "daemon off;"
    ```

- [ ] **Paso 3: Actualizar `app/Dockerfile`**
  - Multi-etapa:
    1. Etapa de build Node: compila React (`npm run build`).
    2. Etapa final: parte de `nginx:alpine` e instala Python 3 y pip (`apk add --no-cache python3 py3-pip`).
    3. Copia `op1_web/requirements.txt` e instala dependencias (`pip install --no-cache-dir --break-system-packages -r /opt/simulador/requirements.txt`).
    4. Copia `op1_web` a `/opt/simulador`.
    5. Copia la app compilada a `/usr/share/nginx/html`.
    6. Copia `nginx.conf` a `/etc/nginx/conf.d/default.conf`.
    7. Copia `entrypoint.sh`, le da permisos de ejecución `chmod +x /entrypoint.sh`.
    8. `ENTRYPOINT ["/entrypoint.sh"]`.

- [ ] **Paso 4: Validar sintaxis y configuración**
  Verificar que `app/Dockerfile`, `app/nginx.conf` y `app/entrypoint.sh` cumplan los estándares de Docker.

- [ ] **Paso 5: Commit de Task 5**
  ```bash
  git add app/nginx.conf app/entrypoint.sh app/Dockerfile
  git commit -m "chore(docker): unify React and Streamlit inside app/Dockerfile"
  ```

---

### Task 6: Verificación Integral End-to-End

- [ ] **Paso 1: Verificación de compilación del frontend (`app`)**
  Verificar con `npm run build` en `app/`.

- [ ] **Paso 2: Verificación de sintaxis del backend (`api`)**
  Verificar con `node -c` sobre todos los archivos `.js` modificados.

- [ ] **Paso 3: Verificación de credenciales semilla y flujo de login**
  Confirmar que `roberto.martinez@akredita.me` con `Temporal12345!!` sea generado correctamente.

- [ ] **Paso 4: Verificación de invisibilidad en landing page**
  Garantizar que ningún archivo público contenga enlaces a `/simulador`.

- [ ] **Paso 5: Commit final y resumen de entrega**
  ```bash
  git add .
  git commit -m "feat(simulador): complete private OP1 simulator integration"
  ```

