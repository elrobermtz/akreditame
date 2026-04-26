# Institutional Tailwind Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the website to Tailwind CSS and apply the approved "Institutional" & "Minimalismo Premium" design.

**Architecture:** Transition from Vanilla CSS to utility-first styling. Use a centralized design system in `tailwind.config.js` to enforce brand consistency across the Hero, Vertical Hub, and Lead Wizard components.

**Tech Stack:** React, Vite, Tailwind CSS, Framer Motion, Lucide React.

---

### Task 1: Environment Setup

**Files:**
- Modify: `app/package.json`
- Create: `app/postcss.config.js`

- [ ] **Step 1: Install Tailwind dependencies**
Run: `npm install -D tailwindcss postcss autoprefixer`

- [ ] **Step 2: Initialize Tailwind**
Run: `npx tailwindcss init -p` (Wait, I'll create the file manually to be safe on Windows)

- [ ] **Step 3: Create PostCSS config**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 4: Commit**
```bash
git add app/package.json app/package-lock.json app/postcss.config.js
git commit -m "chore: install tailwind and postcss"
```

### Task 2: Institutional Configuration

**Files:**
- Modify: `app/tailwind.config.js`

- [ ] **Step 1: Configure Tailwind for the brand**
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
        }
      },
      fontFamily: {
        inter: ['Inter Tight', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Commit**
```bash
git add app/tailwind.config.js
git commit -m "feat: configure institutional theme in tailwind"
```

### Task 3: Global Styles Migration

**Files:**
- Modify: `app/src/index.css`

- [ ] **Step 1: Inject Tailwind directives**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-inter bg-akredita-dark text-white antialiased overflow-x-hidden;
  }
}

.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70;
}
```

- [ ] **Step 2: Commit**
```bash
git add app/src/index.css
git commit -m "style: set up tailwind directives and base styles"
```

### Task 4: Navbar & Footer Refactor

**Files:**
- Modify: `app/src/App.jsx`

- [ ] **Step 1: Refactor Navbar to Tailwind**
```jsx
<nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-8 sm:px-12 transition-all duration-300">
  <img src="/wordmark-v4.png" alt="Akredita Me" className="h-5 sm:h-7" />
  <div className="flex gap-8 items-center">
    <a href="#verticals" className="text-[0.9rem] font-medium tracking-tight hover:text-akredita-blue transition-colors">Verticales</a>
    <a href="#contact" className="text-[0.9rem] font-medium tracking-tight hover:text-akredita-blue transition-colors">Contacto</a>
  </div>
</nav>
```

- [ ] **Step 2: Refactor Footer**
```jsx
<footer className="py-16 px-8 border-t border-white/10 text-center opacity-60">
  <img src="/logo-v4.png" alt="Akredita Me" className="h-8 mx-auto mb-6" />
  <p className="text-sm">© {new Date().getFullYear()} Akredita Me. Todos los derechos reservados.</p>
  <p className="text-xs mt-2 font-medium tracking-widest uppercase">Estructurando activos. Conectando capital.</p>
</footer>
```

- [ ] **Step 3: Commit**
```bash
git commit -m "feat: refactor App layout with tailwind"
```

### Task 5: Institutional Hero Migration (Approved Design V3)

**Files:**
- Modify: `app/src/components/Hero.jsx`

- [ ] **Step 1: Implement Hero with Dynamic Glow and White Title**
```jsx
export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 px-6 text-center overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(0,155,255,0.15),_transparent_40%)]">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-akredita-blue/10 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 animate-fade-in">
        <div className="mb-8 opacity-80 tracking-[0.2em] text-[0.7rem] sm:text-[0.8rem] font-bold uppercase text-akredita-blue">
          Holding Institucional & Estructuración de Activos
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-bold leading-[1.1] mb-8 text-white max-w-5xl mx-auto">
          Estructurando Activos.<br/>Conectando Capital.
        </h1>
        
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 opacity-80 leading-relaxed border-l-2 border-akredita-blue pl-6 text-left sm:text-center sm:border-l-0 sm:pl-0">
          Convertimos proyectos productivos en oportunidades de inversión estructuradas mediante vehículos financieros, tecnología y modelos escalables.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-akredita-orange hover:bg-akredita-orangeDark text-white px-10 py-4 rounded-md font-bold transition-all hover:scale-[1.02] shadow-[0_4px_15px_rgba(255,106,0,0.3)]">
            INICIAR ESTRUCTURACIÓN
          </button>
          <button className="bg-white/5 border border-akredita-blue/30 backdrop-blur-md text-white px-10 py-4 rounded-md font-semibold hover:bg-white/10 transition-all">
            EXPLORAR VERTICALES
          </button>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 2: Commit**
```bash
git commit -m "feat: implement institutional hero with approved V3 design"
```

### Task 6: VerticalsHub Refactor

**Files:**
- Modify: `app/src/components/VerticalsHub.jsx`

- [ ] **Step 1: Transition Vertical Grid and Cards to Tailwind**
- Use `backdrop-blur` for the Innovation card.
- Use group hovers for interaction.

- [ ] **Step 2: Commit**
```bash
git commit -m "feat: refactor VerticalsHub with tailwind aesthetics"
```

### Task 7: LeadWizard Refactor

**Files:**
- Modify: `app/src/components/LeadWizard.jsx`

- [ ] **Step 1: Redesign contact form to be more corporate**
- Update inputs to use `bg-white/5` and `border-white/10`.
- Update button to standard `akredita-orange`.

- [ ] **Step 2: Commit**
```bash
git commit -m "feat: modernize LeadWizard UI"
```

### Task 8: Final Cleanup

**Files:**
- Modify: `app/src/index.css`

- [ ] **Step 1: Remove all legacy Vanilla CSS that was replaced by Tailwind**
Keep only base layer and necessary custom animations.

- [ ] **Step 2: Commit**
```bash
git commit -m "chore: cleanup legacy css"
```
