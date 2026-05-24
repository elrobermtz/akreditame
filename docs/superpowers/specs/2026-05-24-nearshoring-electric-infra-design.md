# Diseño Técnico: Migración de Landing Page - Infraestructura Eléctrica como Vehículo Estructural

Este documento define la especificación de diseño para la migración de **[FullSite.html](file:///d:/Desarrollos/akreditame/FullSite.html)** (con el nuevo diseño enfocado en la división de Infraestructura de Suministro Eléctrico para el Nearshoring) al stack de la aplicación web React/Vite/Tailwind de Akredita Me.

---

## 1. Contexto y Objetivos

El objetivo principal es reemplazar la landing page genérica actual de Akredita Me por un diseño premium de alta fidelidad, enfocado específicamente en la división energética/infraestructura eléctrica crítica que demanda el fenómeno de relocalización industrial (Nearshoring) en México.

La migración se realizará siguiendo un enfoque de **Componentes React Modulares** con una **configuración de diseño responsivo de primer nivel**, optimizado al 100% para dispositivos móviles y perfectamente integrado con la API Node/Express/PostgreSQL existente.

---

## 2. Decisiones de Diseño Clave (Aprobadas)

1.  **Reemplazo Completo:** Se actualizará por completo el archivo principal `App.jsx` y se re-diseñarán de forma modular los componentes del directorio `src/components/`.
2.  **Calidad de Leads en Formulario:** El nuevo formulario de contacto integrará 5 campos específicos (`full_name`, `company`, `email`, `phone`, y `message`/`requerimiento`) para garantizar la total compatibilidad con la base de datos PostgreSQL del backend sin perder el diseño elegante de la tarjeta de cristal (*glass-card*).
3.  **Iconografía Lucide React:** Se migrarán los iconos de la plantilla externa (Material Symbols) a iconos nativos de **Lucide React** (línea de 1.5px) para asegurar consistencia, optimización y carga rápida de paquetes.
4.  **Adaptabilidad Móvil del Logo:** En pantallas móviles y anchos reducidos, el logotipo se adaptará dinámicamente para evitar desbordamientos, ocultando el *Wordmark* de texto y manteniendo visible únicamente el *Isotipo* corporativo junto al menú responsivo.

---

## 3. Arquitectura del Sistema

### 3.1. Configuración de Estilo y Fundamentos (CSS / Tailwind)

Se actualizará el archivo de configuración **[tailwind.config.js](file:///d:/Desarrollos/akreditame/app/tailwind.config.js)** para extender las clases de Tailwind e incorporar la nueva paleta de colores Material 3, fuentes personalizadas y tamaños de texto.

#### Colores a incorporar:
*   `background`: `#031427` (Azul ultra profundo para la base)
*   `surface-slate`: `#112240` (Para el fondo de tarjetas y componentes)
*   `primary-container`: `#ff6b00` (Naranja brillante de acción exclusivo para CTAs)
*   `text-primary`: `#ffb693` (Tono melocotón claro para realces tipográficos)
*   `surface-container`: `#102034` y `surface-container-high`: `#1b2b3f` (Sombras y capas)
*   `on-secondary-container`: `#abb9d6` (Texto secundario de alta legibilidad)

#### Fuentes tipográficas:
*   `Hanken Grotesk`: Titulares y pantallas de gran impacto visual.
*   `Inter`: Cuerpo del contenido general.
*   `JetBrains Mono`: Etiquetas, badges técnicos y código.

Se agregarán las importaciones de Google Fonts y Material Icons en **[index.html](file:///d:/Desarrollos/akreditame/app/index.html)**.

### 3.2. Estructura de Componentes React

El flujo y jerarquía de archivos en `app/src` se estructurará de la siguiente forma:

```
src/
├── components/
│   ├── Navbar.jsx      # Navegación responsiva con logo adaptativo
│   ├── Hero.jsx        # Cabecera de impacto con gradiente y CTAs
│   ├── Pillars.jsx     # Tarjetas de pilares de suministro industrial
│   ├── ValueProp.jsx   # Grid de sub-beneficios de la gestión de activos
│   ├── Trust.jsx       # Columnas de confianza institucional y reducción de riesgo
│   ├── Contact.jsx     # Formulario de lead interactivo conectado a la API
│   └── Footer.jsx      # Pie de página y enlaces institucionales
├── index.css           # Estilos globales y utilidades de gradiente/glass-card
├── App.jsx             # Punto de entrada de la SPA que organiza las secciones
└── main.jsx            # Bootstrapping de React 19
```

---

## 4. Detalles de Componentes

### 4.1. `Navbar.jsx` (Logo Adaptativo & Responsivo)
*   Control de estado `isOpen` para el menú desplegable en móvil.
*   Logotipo estructurado con clases de visualización fluidas:
    *   **Isotipo:** `h-8 md:h-10 w-auto` (siempre visible).
    *   **Wordmark:** `hidden xs:block h-5 md:h-6 w-auto` (oculto en pantallas de teléfonos móviles muy estrechos para evitar desbordar elementos de la barra).
*   Animación CSS de deslizamiento lateral (`transition-transform duration-300`) para la navegación en móviles.

### 4.2. `Pillars.jsx` (Reemplazo de VerticalsHub)
*   Grid adaptativo: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`.
*   4 divisiones clave: Parques Industriales (`Factory`), Nearshoring (`Cpu`), Maquiladoras (`Settings`), y Data Centers (`Server`).
*   Efecto de elevación en tarjetas al pasar el cursor (`hover:-translate-y-2 hover:shadow-2xl transition-all duration-300`).

### 4.3. `Contact.jsx` (Formulario e Integración con Backend)
*   Formulario premium tipo *glass-card* translúcido.
*   Manejo de estado React para los inputs: `full_name`, `company`, `email`, `phone` y `message`.
*   Integración HTTP:
    *   Llamada a `fetch('/api/leads', { method: 'POST', body: JSON.stringify(...) })` en el submit.
    *   Estados de carga (`isSubmitting` para desactivar el botón y mostrar un indicador de carga).
    *   Pantalla de éxito: Muestra una tarjeta limpia y animada con icono de check verde confirmando el contacto dentro de 24 horas.
    *   Manejo de errores: Toast o badge en color rojo indicando fallo en caso de problemas de red.

---

## 5. Plan de Verificación

### 5.1. Pruebas de Responsividad (Foco en Móviles)
*   **Prueba de Navbar:** Verificar que el menú hamburguesa aparezca en dispositivos medianos/móviles y que al dar clic se despliegue de forma fluida.
*   **Prueba de Logotipo:** Simular anchos de pantalla extremos (desde 320px como iPhone SE hasta tablets e iMacs) para asegurar que el logotipo se compacte a solo el isotipo sin desbordar el contenedor de la navbar ni pisar el botón de menú.
*   **Prueba de Cuadrículas:** Validar que los Pilares y el ValueProp se re-ordenarono correctamente a 1 sola columna en dispositivos móviles.

### 5.2. Pruebas de Integración con el Backend
*   **Prueba de Registro de Leads:** Llenar el formulario en el frontend y validar que:
    1.  Se envíe la petición HTTP exitosamente con el payload de 5 campos.
    2.  La API `/api/leads` responda `201 Created`.
    3.  El registro se inserte de forma correcta en la tabla `leads` de la base de datos de PostgreSQL.
    4.  El frontend cambie al estado de éxito de forma inmediata.
