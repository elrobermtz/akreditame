# Contexto del Proyecto: Akredita.me
**Entidad:** Empresa Holding Institucional y Estructuración de Activos.
**Ubicación:** México (Foco en el sector financiero y energético).
**Filosofía de Diseño:** Autoridad, Transparencia, Minimalismo Premium, Solidez "Old Money".

## 1. Stack Tecnológico (Mobile First Ready)
- **Frontend:** React.js con Vite (Optimizado para carga rápida).
- **Backend:** Node.js (Estructura de API robusta).
- **Estilos:** Tailwind CSS (Uso de utilidades personalizadas).
- **Animaciones:** Framer Motion (Transiciones suaves y pesadas).
- **Iconografía:** Lucide React (Línea fina, 1px o 1.5px de grosor).

## 2. Identidad Visual e Institucional
Basado en la paleta oficial de Akredita Me:
- **Azul Profundo:** `#0B1F3A` (Uso: Navbar, Footer, Títulos principales).
- **Azul Principal (Gradiente):** `#009BFF` a `#0052CC` (Uso: Secciones de confianza, fondos de tarjetas).
- **Naranja de Acción:** `#FF6A00` a `#E53900` (Uso: EXCLUSIVO para CTAs y botones de conversión).
- **Superficies:** Blanco Puro `#FFFFFF` y Gris de Fondo `#F9FAFB`.

## 3. Arquitectura de Información y Contenido

### A. Tesis de Inversión Global
- **Core:** "Estructurando activos. Conectando capital."
- **Pilares:** Estructuración Estratégica, Conectividad de Capital, Gobernanza.

### B. Vertical I: Energía e Infraestructura (Desarrollado)
- **Foco:** Activos de generación, transmisión y FIBRAs E.
- **Narrativa:** Resiliencia, flujos de efectivo constantes (PPA) y eficiencia energética.
- **Visual:** Imágenes de infraestructura con filtros duotono en Azul Profundo.

### C. Vertical II: Innovación y Activos Digitales (En fase de estructuración)
- **Foco:** Ecosistemas SaaS (como VendePlus), PropTech y Fintech.
- **Narrativa:** Escalabilidad basada en datos, tokenización y optimización operativa tecnológica.
- **UI:** Uso de tarjetas tipo "Glassmorphism" con badges de "En fase de estructuración estratégica".

## 4. Reglas de Desarrollo (UI/UX)
- **Jerarquía:** Priorizar el espacio en blanco (Whitespace). El sitio debe "respirar" para proyectar solvencia.
- **Mobile First:** Todo componente debe ser testeado en `sm:` de Tailwind antes que en escritorio.
- **Interactividad:** Los botones deben tener estados `hover` y `active` claros, preferiblemente con escalas suaves (0.98).
- **Seguridad:** Los formularios deben procesarse en el backend de Node.js con validaciones estrictas de datos.

## 5. Instrucciones para la IA
- Generar código modular y reutilizable en la carpeta `src/components/`.
- Al crear componentes, usar siempre la paleta de colores definida en el `tailwind.config.js` extendido.
- Mantener un tono de texto profesional, ejecutivo y directo (evitar lenguaje de marketing agresivo).