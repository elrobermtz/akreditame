# Migración de Landing Page - Suministro Eléctrico como Vehículo Estructural Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar por completo la landing page de Akredita Me por el nuevo diseño premium responsivo enfocado en infraestructura eléctrica para el nearshoring, integrando el formulario con el backend.

**Architecture:** Componentes funcionales en React modulares e independientes, control de estado para el menú móvil y formulario, traducción de iconos a SVG optimizados (Lucide React), y extensión limpia de la paleta y fuentes de Tailwind.

**Tech Stack:** React 19, Vite, Tailwind CSS v3/v4 (PostCSS), Lucide React, Express.js y PostgreSQL.

---

### Task 1: Tailwind CSS Theme & Google Fonts Integration

**Files:**
- Modify: `app/index.html`
- Modify: `app/tailwind.config.js`

- [ ] **Step 1: Cargar Google Fonts y Material Icons**
  Añadir los links de Google Fonts para `Hanken Grotesk`, `Inter`, `JetBrains Mono` y `Material Symbols Outlined` en el cabezal de `app/index.html`.
  
  *Código a inyectar en `<head>` de `app/index.html`:*
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  ```

- [ ] **Step 2: Extender configuración de Tailwind**
  Modificar `app/tailwind.config.js` para añadir la nueva paleta de colores Material 3, borderRadius, spacing y familias de fuentes del diseño.
  
  *Código a reemplazar en `app/tailwind.config.js`:*
  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          akredita: {
            dark: '#0B1F3A',
            blue: '#009BFF',
            blueDark: '#0052CC',
            orange: '#FF6A00',
            orangeDark: '#E53900',
            bgLight: '#F9FAFB',
          },
          "on-secondary-container": "#abb9d6",
          "on-error-container": "#ffdad6",
          "background": "#031427",
          "on-tertiary-fixed-variant": "#004395",
          "pure-white": "#FFFFFF",
          "on-secondary": "#233148",
          "surface-container-high": "#1b2b3f",
          "outline": "#a98a7d",
          "error-container": "#93000a",
          "outline-variant": "#5a4136",
          "on-primary": "#561f00",
          "tertiary-fixed": "#d8e2ff",
          "on-primary-container": "#572000",
          "surface-container-lowest": "#000f21",
          "surface-dim": "#031427",
          "inverse-on-surface": "#213145",
          "surface-slate": "#112240",
          "surface-tint": "#ffb693",
          "on-primary-fixed-variant": "#7a3000",
          "tertiary-fixed-dim": "#adc6ff",
          "secondary": "#b9c7e4",
          "on-surface": "#d3e4fe",
          "primary-container": "#ff6b00",
          "surface-bright": "#2a3a4f",
          "inverse-surface": "#d3e4fe",
          "surface-variant": "#26364a",
          "primary-fixed-dim": "#ffb693",
          "on-secondary-fixed": "#0d1c32",
          "surface-container-highest": "#26364a",
          "on-surface-variant": "#e2bfb0",
          "primary-fixed": "#ffdbcc",
          "tertiary-container": "#5f97ff",
          "on-error": "#690005",
          "surface-container-low": "#0b1c30",
          "on-tertiary-container": "#002f6b",
          "surface": "#031427",
          "secondary-container": "#3c4962",
          "primary": "#ffb693",
          "secondary-fixed": "#d6e3ff",
          "surface-container": "#102034",
          "on-tertiary": "#002e6a",
          "on-primary-fixed": "#351000",
          "tertiary": "#adc6ff",
          "on-secondary-fixed-variant": "#39475f",
          "deep-navy": "#0A1128",
          "on-background": "#d3e4fe",
          "error": "#ffb4ab",
          "on-tertiary-fixed": "#001a42",
          "secondary-fixed-dim": "#b9c7e4",
          "inverse-primary": "#a04100"
        },
        borderRadius: {
          "DEFAULT": "0.125rem",
          "lg": "0.25rem",
          "xl": "0.5rem",
          "full": "0.75rem"
        },
        spacing: {
          "gutter": "24px",
          "margin-desktop": "40px",
          "margin-mobile": "16px",
          "unit": "8px",
          "container-max": "1280px"
        },
        fontFamily: {
          "headline-lg": ["Hanken Grotesk", "sans-serif"],
          "display-lg": ["Hanken Grotesk", "sans-serif"],
          "headline-lg-mobile": ["Hanken Grotesk", "sans-serif"],
          "body-lg": ["Inter", "sans-serif"],
          "body-md": ["Inter", "sans-serif"],
          "label-sm": ["JetBrains Mono", "monospace"],
          "headline-md": ["Hanken Grotesk", "sans-serif"]
        },
        fontSize: {
          "headline-lg": ["40px", { "lineHeight": "1.2", "fontWeight": "600" }],
          "display-lg": ["64px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
          "headline-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "600" }],
          "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
          "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
          "label-sm": ["12px", { "lineHeight": "1.0", "letterSpacing": "0.05em", "fontWeight": "500" }],
          "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }]
        }
      },
    },
    plugins: [],
  }
  ```

- [ ] **Step 3: Compilar y verificar**
  Ejecutar el comando de compilación en la subcarpeta `app`.
  Run: `npm run build --prefix app`
  Expected: Cero errores de compilación de Tailwind CSS.

- [ ] **Step 4: Commit**
  ```bash
  git add app/index.html app/tailwind.config.js
  git commit -m "style: add google fonts and extend tailwind config with new custom theme"
  ```

---

### Task 2: Styles Setup & CSS Variables

**Files:**
- Modify: `app/src/index.css`

- [ ] **Step 1: Añadir variables de animación y degradado**
  Modificar `app/src/index.css` para añadir las clases de degradado `.hero-gradient`, efectos de cristal `.glass-card` y el brillo de texto `.text-glow`.
  
  *Código a añadir en `app/src/index.css`:*
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  
  @layer base {
    body {
      @apply font-body-md bg-background text-on-background antialiased overflow-x-hidden selection:bg-primary-container selection:text-white;
    }
  
    h1, h2, h3, h4, h5, h6 {
      @apply font-headline-lg font-semibold tracking-tight;
    }
  }
  
  @layer components {
    .btn-primary {
      @apply bg-primary-container text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-lg shadow-primary-container/20;
    }
  
    .btn-secondary {
      @apply bg-white/5 border border-white/15 hover:bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98];
    }
  
    .hero-gradient {
      background: linear-gradient(180deg, rgba(3, 20, 39, 0.4) 0%, rgba(3, 20, 39, 0.95) 100%);
    }
  
    .glass-card {
      background: rgba(17, 34, 64, 0.6);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  
    .text-glow {
      text-shadow: 0 0 20px rgba(255, 107, 0, 0.25);
    }
  }
  ```

- [ ] **Step 2: Compilar y verificar**
  Run: `npm run build --prefix app`
  Expected: La compilación termina con éxito.

- [ ] **Step 3: Commit**
  ```bash
  git add app/src/index.css
  git commit -m "style: configure index.css layers with new glass-card and glow classes"
  ```

---

### Task 3: Navbar Component (Responsive & Interactive Menu)

**Files:**
- Create: `app/src/components/Navbar.jsx`

- [ ] **Step 1: Crear e implementar componente Navbar**
  Escribir el código en `app/src/components/Navbar.jsx` con el menú hamburguesa móvil responsivo y la ocultación selectiva del Wordmark en pantallas ultra-pequeñas (`hidden xs:block`).
  
  *Código completo:*
  ```jsx
  import React, { useState } from 'react';
  import { Menu, X } from 'lucide-react';
  
  export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <>
        <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-transparent">
              <img 
                alt="Akredita Me Isotipo" 
                className="h-8 md:h-10 w-auto bg-transparent object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M" 
              />
              <img 
                alt="Akredita Me Wordmark" 
                className="hidden xs:block h-5 md:h-6 w-auto bg-transparent object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ" 
              />
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#infraestructura" className="text-primary font-bold border-b-2 border-primary font-label-sm text-label-sm py-2">
                Infraestructura Eléctrica
              </a>
              <a href="#pilares" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 font-label-sm text-label-sm py-2">
                Sectores Clave
              </a>
              <a href="#contacto" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 font-label-sm text-label-sm py-2">
                Contacto
              </a>
            </nav>
            
            <div class="flex items-center gap-4">
              <a href="#contacto" className="hidden lg:block bg-primary-container text-white px-6 py-2.5 rounded-lg font-bold hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-sm">
                Conversemos de tu proyecto
              </a>
              <button 
                className="md:hidden p-2 text-on-surface transition-transform active:scale-95" 
                onClick={() => setIsOpen(true)}
              >
                <Menu className="w-8 h-8" />
              </button>
            </div>
          </div>
        </header>
  
        {/* Mobile Navigation Drawer */}
        <div className={`fixed inset-0 z-[60] bg-background transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="h-20 px-margin-mobile flex items-center justify-between border-b border-outline-variant/10">
              <div className="flex items-center gap-2">
                <img 
                  alt="Akredita Me Isotipo" 
                  className="h-8 w-auto bg-transparent object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M" 
                />
                <img 
                  alt="Akredita Me Wordmark" 
                  className="h-5 w-auto bg-transparent object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ" 
                />
              </div>
              <button className="p-2 text-on-surface" onClick={() => setIsOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <nav className="flex-1 px-margin-mobile py-12 flex flex-col gap-8">
              <a href="#infraestructura" className="text-2xl font-headline-lg text-primary" onClick={() => setIsOpen(false)}>
                Infraestructura Eléctrica
              </a>
              <a href="#pilares" className="text-2xl font-headline-lg text-on-surface" onClick={() => setIsOpen(false)}>
                Sectores Clave
              </a>
              <a href="#contacto" className="text-2xl font-headline-lg text-on-surface" onClick={() => setIsOpen(false)}>
                Contacto
              </a>
            </nav>
            
            <div className="p-margin-mobile border-t border-outline-variant/10">
              <a 
                href="#contacto" 
                className="w-full bg-primary-container text-white py-4 rounded-xl font-bold text-lg block text-center"
                onClick={() => setIsOpen(false)}
              >
                Conversemos de tu proyecto
              </a>
            </div>
          </div>
        </div>
      </>
    );
  };
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add app/src/components/Navbar.jsx
  git commit -m "feat: add responsive Navbar component with logo adaptive behavior"
  ```

---

### Task 4: Hero Section Component

**Files:**
- Modify: `app/src/components/Hero.jsx`

- [ ] **Step 1: Re-escribir Hero.jsx**
  Implementar la cabecera duotono con imagen e interactividad responsiva de los CTAs.
  
  *Código completo:*
  ```jsx
  import React from 'react';
  import { ArrowRight } from 'lucide-react';
  
  export const Hero = () => {
    return (
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 hero-gradient z-10"></div>
          <img 
            alt="Infraestructura energética de alta tensión" 
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_cI3NGgGBqJr4jQkE8KxUPaXdHLpmRBU2uiwxdHd-TC0q7cPDcM-433NgQbGQ7nWbA7rb2b5F4tq8b1ICGbBgYZEZ9RP-_pxYFSqapinmRPDEFL2rYRszHnsH7Gcv53MrwJrGJ7HrpNBJ1dEgWYC8TUtsOXrTlmMJd9y3Jypy3aVRBnWSq4_FGzRi7QYzLAMLb9Qz9cXke_YwvA_ugJHlPzZy5xRqLlIMrhVpTElNEQRnaOLSIyuX8SiJJBiXYw3SMzSy2oypz58"
          />
        </div>
        
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-20 max-w-container-max py-24">
          <div className="max-w-3xl">
            <span className="inline-block font-label-sm text-[10px] md:text-label-sm text-primary uppercase tracking-widest mb-6 px-3 py-1 border border-primary/20 rounded-full bg-primary/5">
              Suficiencia de Capacidad Instalada
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl lg:text-display-lg mb-8 text-glow leading-tight text-white">
              Potenciando la <span className="text-primary-container">Infraestructura Eléctrica</span> del Mañana.
            </h1>
            <p className="font-body-lg text-base md:text-body-lg text-on-secondary-container mb-10 md:mb-12 leading-relaxed border-l-2 border-primary-container/30 pl-6">
              Garantizamos la continuidad y el suministro energético crítico para el ecosistema del Nearshoring. Habilitamos capacidad instalada real para parques industriales, maquiladoras y centros de datos de alta escala.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#contacto" 
                className="bg-primary-container text-white px-6 md:px-10 py-4 rounded-xl font-bold text-base md:text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary-container/20"
              >
                CONVERSEMOS DE TU PROYECTO
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#infraestructura" 
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white px-6 md:px-10 py-4 rounded-xl font-bold text-base md:text-lg hover:bg-white/10 transition-all text-center"
              >
                VER CAPACIDADES TÉCNICAS
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  };
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add app/src/components/Hero.jsx
  git commit -m "feat: redesign Hero component with nearshoring high-tension duotone imagery"
  ```

---

### Task 5: Pillars Component (Grid layout with Lucide Icons)

**Files:**
- Create: `app/src/components/Pillars.jsx`
- Delete: `app/src/components/VerticalsHub.jsx`

- [ ] **Step 1: Crear e implementar Pillars.jsx**
  Implementar la rejilla de los cuatro pilares usando iconos Lucide React (`Factory`, `Cpu`, `Settings`, `Server`).
  
  *Código completo:*
  ```jsx
  import React from 'react';
  import { Factory, Cpu, Settings, Server } from 'lucide-react';
  
  const pillars = [
    {
      id: 'parks',
      title: 'Parques Industriales',
      description: 'Suministro eléctrico robusto para desarrollos industriales que demandan alta disponibilidad y redundancia.',
      icon: Factory,
    },
    {
      id: 'nearshoring',
      title: 'Nearshoring',
      description: 'Infraestructura lista para recibir la relocalización de procesos críticos con suficiencia energética inmediata.',
      icon: Cpu,
    },
    {
      id: 'maquilas',
      title: 'Maquiladoras',
      description: 'Optimización de costos y capacidad para manufactura intensiva a través de infraestructura de red dedicada.',
      icon: Settings,
    },
    {
      id: 'datacenters',
      title: 'Data Centers',
      description: 'Suministro de energía de alta densidad y ultra-confiable para infraestructuras de datos de escala mundial.',
      icon: Server,
    }
  ];
  
  export const Pillars = () => {
    return (
      <section id="pilares" className="py-16 md:py-24 bg-surface-container-lowest">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max">
          <div className="mb-12 md:mb-16">
            <h2 className="font-headline-lg text-3xl md:text-headline-lg mb-4 relative inline-block text-white">
              Pilares del Suministro Industrial
              <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary-container rounded-full"></span>
            </h2>
            <p className="text-on-secondary-container max-w-2xl text-sm md:text-base mt-4">
              Nuestra especialización se centra en la infraestructura del suministro eléctrico, asegurando que los sectores más dinámicos de la economía cuenten con la potencia necesaria para operar sin interrupciones.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pillars.map((p) => (
              <div 
                key={p.id}
                className="group bg-surface-slate p-6 md:p-8 rounded-2xl border border-white/5 hover:border-primary-container/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-container/10 flex items-center justify-center mb-6 border border-primary-container/20 text-primary-container transition-colors group-hover:bg-primary-container group-hover:text-white">
                  <p.icon className="w-6 h-6 md:w-7 h-7" />
                </div>
                <h3 className="font-headline-md text-lg md:text-xl mb-3 md:mb-4 text-white">{p.title}</h3>
                <p className="text-on-secondary-container text-sm leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  ```

- [ ] **Step 2: Eliminar archivo obsoleto**
  Remove: `app/src/components/VerticalsHub.jsx`

- [ ] **Step 3: Commit**
  ```bash
  git rm app/src/components/VerticalsHub.jsx
  git add app/src/components/Pillars.jsx
  git commit -m "feat: implement Pillars component with 4 grids and delete obsolete VerticalsHub"
  ```

---

### Task 6: ValueProp & Trust Components

**Files:**
- Create: `app/src/components/ValueProp.jsx`
- Create: `app/src/components/Trust.jsx`

- [ ] **Step 1: Crear e implementar ValueProp.jsx**
  Implementar la sección "Gestión Integral del Activo Energético" con 4 tarjetas de valor y una imagen ilustrativa responsiva.
  
  *Código completo:*
  ```jsx
  import React from 'react';
  import { FileText, Hammer, ShieldAlert, Wrench } from 'lucide-react';
  
  const values = [
    {
      title: 'PPAs',
      desc: 'Power Purchase Agreements estructurados para competitividad a largo plazo.',
      icon: FileText
    },
    {
      title: 'Construcción',
      desc: 'Ejecución institucional de subestaciones y redes de distribución.',
      icon: Hammer
    },
    {
      title: 'Administración',
      desc: 'Gestión regulatoria y técnica de la infraestructura eléctrica.',
      icon: ShieldAlert
    },
    {
      title: 'Operación',
      desc: 'Mantenimiento y monitoreo proactivo para continuidad operativa.',
      icon: Wrench
    }
  ];
  
  export const ValueProp = () => {
    return (
      <section id="infraestructura" className="py-16 md:py-24 bg-surface-container-high relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
          <svg className="w-full h-full fill-primary-container" viewBox="0 0 400 400">
            <circle cx="400" cy="0" r="300"></circle>
          </svg>
        </div>
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="font-label-sm text-xs md:text-label-sm text-primary uppercase tracking-[0.2em] mb-4 block">
                Infraestructura del Suministro Eléctrico
              </span>
              <h2 className="font-headline-lg text-3xl md:text-headline-lg mb-6 md:mb-8 text-white">
                Gestión Integral del Activo Energético
              </h2>
              <p className="font-body-lg text-base md:text-body-lg text-on-secondary-container mb-10 md:mb-12">
                Aportamos valor tangible tanto a constructoras como a usuarios finales al garantizar la <strong>suficiencia de capacidad instalada</strong>. Nuestra infraestructura permite a las empresas concentrarse en su operación mientras nosotros aseguramos el flujo vital de energía.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {values.map((v, i) => (
                  <div key={i} className="bg-surface-slate/50 p-5 md:p-6 rounded-xl border border-white/5">
                    <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                      <v.icon className="w-5 h-5" />
                      {v.title}
                    </h4>
                    <p className="text-sm text-on-surface-variant">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] hidden lg:block shadow-2xl">
              <img 
                alt="Electrical Infrastructure" 
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQc4hxwl4MNvTZuX3Iv966dAQw26ARdfo5OxTJT-UckZRJkt0vr4L72CuARB7mo8mOymmdFZB_q6u3UrUX2V3XCx6djcwTJbixx8v57p3z2v0TxLCx0KpzsJ2CjQ6OG-RtOokrme60M9gdTJg1QIq2DfjLRFBKO-vn4mnZaegprsYLr9LQyQX__GfHF5K0JOfLL0q-1n5OArGsadquupTygUkclOsVVrkjv6GC628JLiVlvCZrPMLskdi5DkPUga_m1vzQH96a2CA"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  ```

- [ ] **Step 2: Crear e implementar Trust.jsx**
  Crear la sección de confianza institucional corporativa.
  
  *Código completo:*
  ```jsx
  import React from 'react';
  import { Shield, Zap, Building } from 'lucide-react';
  
  export const Trust = () => {
    return (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <h2 className="font-headline-lg text-3xl md:text-headline-lg mb-6 text-white">Confianza Institucional</h2>
            <p className="text-on-secondary-container max-w-2xl text-base md:text-body-lg">
              Operamos bajo los más altos estándares de gobernanza, brindando certeza jurídica y técnica a desarrolladores inmobiliarios y clientes corporativos transnacionales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-primary-container flex items-center justify-center rounded-full mb-6 text-white shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform">
                <Shield className="w-7 h-7 md:w-8 h-8" />
              </div>
              <h4 className="font-headline-md text-lg md:text-xl text-primary mb-2">Certeza Jurídica</h4>
              <p className="text-on-secondary-container text-sm px-4">Contratos y gestiones alineadas al marco regulatorio energético nacional.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-primary-container flex items-center justify-center rounded-full mb-6 text-white shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform">
                <Zap className="w-7 h-7 md:w-8 h-8" />
              </div>
              <h4 className="font-headline-md text-lg md:text-xl text-primary mb-2">Reducción de Riesgo</h4>
              <p className="text-on-secondary-container text-sm px-4">Garantizamos la potencia eléctrica desde las fases tempranas del desarrollo.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-primary-container flex items-center justify-center rounded-full mb-6 text-white shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform">
                <Building className="w-7 h-7 md:w-8 h-8" />
              </div>
              <h4 className="font-headline-md text-lg md:text-xl text-primary mb-2">Escala Institucional</h4>
              <p className="text-on-secondary-container text-sm px-4">Capacidad de ejecución en múltiples regiones y proyectos de gran envergadura.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  ```

- [ ] **Step 3: Commit**
  ```bash
  git add app/src/components/ValueProp.jsx app/src/components/Trust.jsx
  git commit -m "feat: add ValueProp and Trust components with Lucide icons"
  ```

---

### Task 7: Contact Component (Lead Form with HTTP Integration)

**Files:**
- Create: `app/src/components/Contact.jsx`
- Delete: `app/src/components/LeadWizard.jsx`

- [ ] **Step 1: Crear e implementar Contact.jsx**
  Implementar el formulario de lead de contacto premium responsivo de 5 campos conectado de forma interactiva con el endpoint `/api/leads`.
  
  *Código completo:*
  ```jsx
  import React, { useState } from 'react';
  import { User, Building, Mail, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
  
  export const Contact = () => {
    const [form, setForm] = useState({
      full_name: '',
      company: '',
      email: '',
      phone: '',
      message: ''
    });
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus('submitting');
      try {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            full_name: form.full_name,
            company: form.company,
            email: form.email,
            phone: form.phone,
            interest_type: 'Desarrollar un proyecto', // default value mapping
            vertical: 'energy',
            message: form.message
          })
        });
        if (res.ok) {
          setStatus('success');
          setForm({ full_name: '', company: '', email: '', phone: '', message: '' });
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };
  
    if (status === 'success') {
      return (
        <section id="contacto" className="py-24 bg-background text-white text-center px-6">
          <div className="max-w-md mx-auto animate-fade-in glass-card p-10 rounded-2xl">
            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-white">Solicitud Recibida</h2>
            <p className="text-on-secondary-container leading-relaxed mb-8">
              Su requerimiento ha sido registrado de manera institucional. Un consultor se pondrá en contacto con usted en un plazo máximo de 24 horas hábiles.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="text-primary font-bold tracking-widest text-xs uppercase hover:underline"
            >
              Enviar otra solicitud
            </button>
          </div>
        </section>
      );
    }
  
    return (
      <section id="contacto" className="py-16 md:py-24 bg-surface-container">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="flex flex-col justify-center">
              <span className="font-label-sm text-xs md:text-label-sm text-primary-container uppercase tracking-widest mb-4">
                CONSULTORÍA ESPECIALIZADA
              </span>
              <h2 className="font-display-lg text-3xl md:text-headline-lg mb-8 text-white">Iniciemos tu Proyecto</h2>
              
              <div className="mb-10">
                <div className="flex items-center gap-3 bg-transparent mb-6">
                  <img 
                    alt="Akredita Me Isotipo" 
                    className="h-10 md:h-12 w-auto bg-transparent object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M" 
                  />
                  <img 
                    alt="Akredita Me Wordmark" 
                    className="h-6 md:h-8 w-auto bg-transparent object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ" 
                  />
                </div>
                <p className="text-on-secondary-container max-w-md mb-8 leading-relaxed text-sm md:text-base">
                  Nuestro equipo está listo para analizar las necesidades de infraestructura y energía de su próximo desarrollo industrial. Aseguramos su capacidad instalada.
                </p>
              </div>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="text-primary-container w-5 h-5" />
                  <span className="font-body-lg text-sm md:text-body-lg text-on-surface">contacto@akredita.me</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-primary-container w-5 h-5" />
                  <span className="font-body-lg text-sm md:text-body-lg text-on-surface">+52 81 1234 5678</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 md:p-10 rounded-2xl mt-8 lg:mt-0">
              <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl text-sm">
                      Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo.
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="font-label-sm text-[10px] md:text-label-sm text-on-secondary-container uppercase tracking-wider">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
                      <input 
                        required
                        className="w-full bg-surface-slate border border-white/10 rounded-xl py-3 md:py-4 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-0 outline-none transition-all text-sm md:text-base"
                        placeholder="Tu nombre completo"
                        type="text"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <label className="font-label-sm text-[10px] md:text-label-sm text-on-secondary-container uppercase tracking-wider">
                      Empresa
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
                      <input 
                        required
                        className="w-full bg-surface-slate border border-white/10 rounded-xl py-3 md:py-4 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-0 outline-none transition-all text-sm md:text-base"
                        placeholder="Nombre de la Empresa"
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <label className="font-label-sm text-[10px] md:text-label-sm text-on-secondary-container uppercase tracking-wider">
                      Correo Corporativo
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
                      <input 
                        required
                        className="w-full bg-surface-slate border border-white/10 rounded-xl py-3 md:py-4 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-0 outline-none transition-all text-sm md:text-base"
                        placeholder="correo@empresa.com"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <label className="font-label-sm text-[10px] md:text-label-sm text-on-secondary-container uppercase tracking-wider">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5" />
                      <input 
                        required
                        className="w-full bg-surface-slate border border-white/10 rounded-xl py-3 md:py-4 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-0 outline-none transition-all text-sm md:text-base"
                        placeholder="Ej. +52 81 1234 5678"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <label className="font-label-sm text-[10px] md:text-label-sm text-on-secondary-container uppercase tracking-wider">
                      Requerimiento de Potencia / Tipo de Proyecto
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-5 text-outline-variant w-5 h-5" />
                      <textarea 
                        required
                        className="w-full bg-surface-slate border border-white/10 rounded-xl py-3 md:py-4 pl-12 pr-4 text-on-surface focus:border-primary-container focus:ring-0 outline-none transition-all text-sm md:text-base resize-none"
                        placeholder="Describa brevemente los requerimientos..."
                        rows="4"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
  
                <button 
                  className="w-full bg-primary-container text-white py-4 md:py-5 rounded-xl font-bold text-base md:text-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  type="submit"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'PROCESANDO...' : 'CONVERSEMOS DE TU PROYECTO'}
                  <Send className="w-5 h-5" />
                </button>
                <p className="font-label-sm text-[10px] text-center text-on-secondary-container/50 mt-4">
                  Al enviar, acepta nuestra política de privacidad y manejo de datos institucionales.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  };
  ```

- [ ] **Step 2: Eliminar archivo LeadWizard.jsx obsoleto**
  Remove: `app/src/components/LeadWizard.jsx`

- [ ] **Step 3: Commit**
  ```bash
  git rm app/src/components/LeadWizard.jsx
  git add app/src/components/Contact.jsx
  git commit -m "feat: implement structured Contact lead form component and delete LeadWizard"
  ```

---

### Task 8: App Integration & Assembly

**Files:**
- Create: `app/src/components/Footer.jsx`
- Modify: `app/src/App.jsx`

- [ ] **Step 1: Crear e implementar Footer.jsx**
  Crear el componente del pie de página oficial responsivo.
  
  *Código completo:*
  ```jsx
  import React from 'react';
  
  export const Footer = () => {
    return (
      <footer className="w-full py-12 md:py-16 bg-surface-container-lowest border-t border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 bg-transparent">
              <img 
                alt="Akredita Me Footer Isotipo" 
                className="h-10 md:h-12 w-auto bg-transparent object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M" 
              />
              <img 
                alt="Akredita Me Footer Wordmark" 
                className="h-6 md:h-8 w-auto bg-transparent object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ" 
              />
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4 text-center">
              <a href="#infraestructura" className="text-on-secondary-container hover:text-primary transition-colors font-label-sm text-[10px] md:text-label-sm">
                Infraestructura Eléctrica
              </a>
              <a href="#pilares" className="text-on-secondary-container hover:text-primary transition-colors font-label-sm text-[10px] md:text-label-sm">
                Sectores Clave
              </a>
              <a href="#contacto" className="text-on-secondary-container hover:text-primary transition-colors font-label-sm text-[10px] md:text-label-sm">
                Contacto
              </a>
              <span className="text-on-secondary-container font-label-sm text-[10px] md:text-label-sm cursor-pointer hover:text-primary transition-colors">
                Aviso de Privacidad
              </span>
            </div>
          </div>
          <div className="w-full max-w-4xl border-t border-white/5 pt-8 flex flex-col items-center text-center">
            <p className="font-label-sm text-[10px] md:text-label-sm text-on-secondary-container/60 leading-relaxed mb-4">
              © {new Date().getFullYear()} Akredita Me, S.A.P.I. de C.V. Todos los derechos reservados.
            </p>
            <p className="font-label-sm text-[10px] md:text-label-sm text-primary tracking-[0.2em] md:tracking-[0.3em] font-bold">
              INFRAESTRUCTURA DEL SUMINISTRO ELÉCTRICO INDUSTRIAL.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  ```

- [ ] **Step 2: Modificar App.jsx**
  Reemplazar el contenido de `app/src/App.jsx` para integrar y estructurar ordenadamente todas las secciones del diseño técnico.
  
  *Código completo:*
  ```jsx
  import React, { useEffect } from 'react';
  import { Navbar } from './components/Navbar';
  import { Hero } from './components/Hero';
  import { Pillars } from './components/Pillars';
  import { ValueProp } from './components/ValueProp';
  import { Trust } from './components/Trust';
  import { Contact } from './components/Contact';
  import { Footer } from './components/Footer';
  import './index.css';
  
  function App() {
    // Smooth scroll and scroll animations setup
    useEffect(() => {
      document.title = "Akredita Me | Infraestructura de Suministro Eléctrico para el Nearshoring";
      
      const handleSmoothScroll = (e) => {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      };
  
      const links = document.querySelectorAll('a[href^="#"]');
      links.forEach(link => link.addEventListener('click', handleSmoothScroll));
      
      return () => {
        links.forEach(link => link.removeEventListener('click', handleSmoothScroll));
      };
    }, []);
  
    return (
      <div className="min-h-screen bg-background text-on-background">
        <Navbar />
        <main className="pt-20">
          <Hero />
          <Pillars />
          <ValueProp />
          <Trust />
          <Contact />
        </main>
        <Footer />
      </div>
    );
  }
  
  export default App;
  ```

- [ ] **Step 3: Commit**
  ```bash
  git add app/src/components/Footer.jsx app/src/App.jsx
  git commit -m "feat: assemble and integrate all modular components in App.jsx and add Footer"
  ```

---

### Task 9: Verify & Build

**Files:**
- None (Verification task)

- [ ] **Step 1: Compilar para producción**
  Ejecutar el proceso de compilación para comprobar la validez de los imports y la sintaxis JSX.
  Run: `npm run build --prefix app`
  Expected: La compilación de Vite termina exitosamente con `dist/` generado.

- [ ] **Step 2: Verificar respuesta y responsividad**
  Comprobar localmente que el diseño y el formulario responsivo funcionen correctamente en el servidor local de desarrollo.
