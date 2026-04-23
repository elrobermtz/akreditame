import React, { useState } from 'react';

export const LeadWizard = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company: '',
    phone: '',
    interest_type: '',
    vertical: 'Energy',
    message: ''
  });

  const handleOption = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="wizard-container">
      <div className="wizard-card glassmorphism">
        {success ? (
          <div className="wizard-step" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 className="gradient-text">¡Gracias por tu interés!</h2>
            <p>Nuestro equipo se pondrá en contacto contigo a la brevedad.</p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="wizard-step">
                <h2 style={{ textAlign: 'center' }}>¿Cuál es tu principal interés?</h2>
                <div className="wizard-options">
                  <button className="wizard-option-btn" onClick={() => handleOption('interest_type', 'Investor')}>
                    Quiero Invertir
                  </button>
                  <button className="wizard-option-btn" onClick={() => handleOption('interest_type', 'Developer')}>
                    Tengo un Proyecto
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="wizard-step">
                <h2 style={{ textAlign: 'center' }}>¿En qué vertical estás interesado?</h2>
                <div className="wizard-options">
                  <button className="wizard-option-btn" onClick={() => handleOption('vertical', 'Energy')}>Energía</button>
                  <button className="wizard-option-btn" onClick={() => handleOption('vertical', 'Infra')}>Infraestructura</button>
                  <button className="wizard-option-btn" onClick={() => handleOption('vertical', 'Real Estate')}>Real Estate</button>
                  <button className="wizard-option-btn" onClick={() => handleOption('vertical', 'Other')}>Otro</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="wizard-step">
                <h2 style={{ marginBottom: '2rem' }}>Ponte en contacto con nuestro equipo</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Empresa</label>
                    <input 
                      type="text" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Mensaje (Opcional)</label>
                    <textarea 
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ width: '100%', marginTop: '1rem' }}
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
