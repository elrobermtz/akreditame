import React from 'react';

export const VerticalCard = ({ title, description, icon }) => {
  return (
    <div className="vertical-card glassmorphism">
      <div className="vertical-card-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: '0.75rem', color: 'var(--color-blue-main)', fontSize: '1.5rem' }}>{title}</h3>
      <p style={{ opacity: 0.8, fontSize: '1rem', lineHeight: '1.5' }}>{description}</p>
    </div>
  );
};
