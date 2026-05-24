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
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 animate-transition duration-200" />
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
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 animate-transition duration-200" />
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
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 animate-transition duration-200" />
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
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant w-5 h-5 animate-transition duration-200" />
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
                    <MessageSquare className="absolute left-4 top-5 text-outline-variant w-5 h-5 animate-transition duration-200" />
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
