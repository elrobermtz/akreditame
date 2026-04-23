import React from 'react';
import { VerticalCard } from './VerticalCard';

const verticals = [
  { 
    title: 'Energía', 
    description: 'Estructuración de proyectos de generación distribuida y contratos PPA para maximizar retornos.', 
    icon: '⚡' 
  },
  { 
    title: 'Infraestructura', 
    description: 'Vehículos de inversión para activos productivos de gran escala con flujos predecibles.', 
    icon: '🏗️' 
  },
  { 
    title: 'Real Estate', 
    description: 'Transformación de activos inmobiliarios en oportunidades estructuradas de inversión institucional.', 
    icon: '🏢' 
  }
];

export const VerticalsHub = () => {
  return (
    <section id="verticals" className="verticals-container">
      <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 2rem' }}>
        <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Divisiones de Akredita Me</h2>
        <p style={{ maxWidth: '600px', margin: '0 auto', opacity: 0.7 }}>
          Operamos como una plataforma multivertical, aislando riesgos y conectando capital con los activos más productivos del mercado.
        </p>
      </div>
      <div className="verticals-grid">
        {verticals.map((v, i) => (
          <VerticalCard key={i} {...v} />
        ))}
      </div>
    </section>
  );
};
