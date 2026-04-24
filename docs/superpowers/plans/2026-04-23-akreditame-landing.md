# Akredita Me Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-impact, modular institutional landing page for Akredita Me with a Node/Express backend for lead capture and PostgreSQL storage.

**Architecture:** Monorepo-style structure with `/app` (Vite/React) and `/api` (Express). Deployment via Coolify using Docker Compose.

**Tech Stack:** React, Vite, Vanilla CSS, Node.js, Express, PostgreSQL, Resend (Email).

---

### Task 1: Project Structure & Basic Scaffold

**Files:**
- Create: `package.json`
- Create: `app/package.json`
- Create: `api/package.json`
- Create: `docker-compose.yml`

- [ ] **Step 1: Create root package.json**
```json
{
  "name": "akreditame-workspace",
  "private": true,
  "scripts": {
    "dev:app": "npm run dev --prefix app",
    "dev:api": "npm run dev --prefix api",
    "dev": "concurrently \"npm run dev:app\" \"npm run dev:api\""
  }
}
```
- [ ] **Step 2: Initialize Vite App**
Run: `npx -y create-vite@latest app --template react`
- [ ] **Step 3: Initialize Express API**
Create `api/package.json`:
```json
{
  "name": "akreditame-api",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "resend": "^3.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```
- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "chore: initial project scaffold"
```

---

### Task 2: Database Schema (PostgreSQL)

**Files:**
- Create: `api/db/init.sql`

- [ ] **Step 1: Define leads table**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    interest_type VARCHAR(50),
    vertical VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new'
);
```
- [ ] **Step 2: Commit**
```bash
git add api/db/init.sql
git commit -m "feat: add leads database schema"
```

---

### Task 3: Backend API - Lead Capture

**Files:**
- Create: `api/index.js`
- Create: `api/.env.example`

- [ ] **Step 1: Create Express server with POST /leads endpoint**
```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/api/leads', async (req, res) => {
  const { full_name, company, email, phone, interest_type, vertical, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO leads (full_name, company, email, phone, interest_type, vertical, message) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [full_name, company, email, phone, interest_type, vertical, message]
    );
    // TODO: Add Resend email logic here
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(3001, () => console.log('API running on port 3001'));
```
- [ ] **Step 2: Commit**
```bash
git add api/index.js
git commit -m "feat: implement lead capture API endpoint"
```

---

### Task 4: UI Foundations (Theme & Design System)

**Files:**
- Modify: `app/src/index.css`
- Create: `app/src/theme.css`

- [ ] **Step 1: Define CSS Variables from Brand Assets**
```css
:root {
  --color-blue-deep: #0B1F3A;
  --color-blue-main: #009BFF;
  --color-blue-dark: #0052CC;
  --color-orange-main: #FF6A00;
  --color-orange-dark: #E53900;
  --font-main: 'Inter Tight', sans-serif;
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```
- [ ] **Step 2: Add Inter Tight Font Import**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600;700&display=swap');
```
- [ ] **Step 3: Commit**
```bash
git add app/src/theme.css
git commit -m "style: add brand theme and fonts"
```

---

### Task 5: Modular Verticals Hub (Frontend)

**Files:**
- Create: `app/src/components/VerticalCard.jsx`
- Create: `app/src/components/VerticalsHub.jsx`

- [ ] **Step 1: Create individual Vertical Card component**
```javascript
export const VerticalCard = ({ title, description, icon }) => (
  <div className="vertical-card glassmorphism">
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
```
- [ ] **Step 2: Create Grid layout for verticals**
```javascript
import { VerticalCard } from './VerticalCard';

const verticals = [
  { title: 'Energía', description: 'Generación distribuida y PPAs.', icon: '⚡' },
  { title: 'Infraestructura', description: 'Activos productivos a gran escala.', icon: '🏗️' },
  { title: 'Real Estate', description: 'Estructuración de activos inmobiliarios.', icon: '🏢' }
];

export const VerticalsHub = () => (
  <section className="verticals-grid">
    {verticals.map(v => <VerticalCard key={v.title} {...v} />)}
  </section>
);
```
- [ ] **Step 3: Commit**
```bash
git add app/src/components/
git commit -m "feat: add modular verticals hub components"
```

---

### Task 6: Hero Section (High-Impact UI)

**Files:**
- Create: `app/src/components/Hero.jsx`

- [ ] **Step 1: Create Hero component with brand gradients**
```javascript
export const Hero = () => (
  <section className="hero">
    <div className="hero-content">
      <img src="/akredita_full_centered.svg" alt="Akredita Me" className="hero-logo" />
      <h1 className="gradient-text">Estructurando activos. Conectando capital.</h1>
      <p>Infraestructura financiera aplicada a activos reales.</p>
      <button className="btn-primary">Conoce más</button>
    </div>
  </section>
);
```
- [ ] **Step 2: Commit**
```bash
git add app/src/components/Hero.jsx
git commit -m "feat: add high-impact hero section"
```

---

### Task 7: Lead Capture Wizard (Multi-step)

**Files:**
- Create: `app/src/components/LeadWizard.jsx`

- [ ] **Step 1: Implement multi-step state logic**
```javascript
import { useState } from 'react';

export const LeadWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="wizard">
      {step === 1 && (
        <div className="step">
          <h2>¿Cómo podemos ayudarte?</h2>
          <button onClick={() => { setFormData({...formData, interest: 'Invest'}); nextStep(); }}>Quiero Invertir</button>
          <button onClick={() => { setFormData({...formData, interest: 'Develop'}); nextStep(); }}>Tengo un Proyecto</button>
        </div>
      )}
      {/* ... steps 2 and 3 */}
    </div>
  );
};
```
- [ ] **Step 2: Commit**
```bash
git add app/src/components/LeadWizard.jsx
git commit -m "feat: implement multi-step lead wizard"
```
