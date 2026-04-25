import React from 'react';
import { Hero } from './components/Hero';
import { VerticalsHub } from './components/VerticalsHub';
import { LeadWizard } from './components/LeadWizard';
import './index.css';

function App() {
  return (
    <div className="app-container">
      <nav style={{ padding: '2rem', position: 'absolute', width: '100%', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="/wordmark-v4.png" alt="Akredita Me" className="nav-logo" />
        <div style={{ display: 'flex', gap: '2rem' }}>
          <a href="#verticals" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Divisiones</a>
          <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Contacto</a>
        </div>
      </nav>

      <main>
        <Hero />
        <VerticalsHub />
        <LeadWizard />
      </main>

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center', opacity: 0.6 }}>
        <img src="/logo-v4.png" alt="Akredita Me" style={{ height: '30px', marginBottom: '1.5rem' }} />
        <p>&copy; {new Date().getFullYear()} Akredita Me. Todos los derechos reservados.</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Estructurando activos. Conectando capital.</p>
      </footer>
    </div>
  );
}

export default App;
