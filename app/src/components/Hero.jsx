import React from 'react';

export const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <img 
          src="/logo-v3.png" 
          alt="Akredita Me" 
          className="hero-logo" 
        />
        <h1 className="gradient-text">Estructurando activos. Conectando capital.</h1>
        <p>
          Convertimos proyectos productivos en oportunidades de inversión estructuradas mediante vehículos financieros, tecnología y modelos escalables.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>
            Comenzar ahora
          </button>
          <button 
            className="btn-secondary" 
            style={{ 
              background: 'transparent', 
              color: 'white', 
              border: '1px solid var(--glass-border)',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('verticals').scrollIntoView({ behavior: 'smooth' })}
          >
            Explorar Divisiones
          </button>
        </div>
      </div>
    </section>
  );
};
