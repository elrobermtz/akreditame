import React, { useState } from 'react';
import { Send, CheckCircle2, User, Phone, Mail, MessageSquare } from 'lucide-react';

export const LeadWizard = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <section id="contact" className="py-24 bg-akredita-dark text-white text-center px-6">
        <div className="max-w-md mx-auto animate-fade-in">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Solicitud Recibida</h2>
          <p className="opacity-60 leading-relaxed mb-8">
            Un consultor de estructuración se pondrá en contacto con usted en un plazo máximo de 24 horas hábiles.
          </p>
          <button 
            onClick={() => { setSent(false); setStep(1); }}
            className="text-akredita-blue font-bold tracking-widest text-xs uppercase"
          >
            Volver al Inicio
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 bg-akredita-dark text-white px-6 relative overflow-hidden">
      {/* Background depth */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-20">
          <div className="flex-1">
            <div className="mb-6 opacity-60 tracking-[0.2em] text-[0.7rem] font-bold uppercase">Área de Contacto</div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">Iniciemos la Estructuración</h2>
            <p className="text-lg opacity-60 leading-relaxed mb-12">
              Provea los detalles básicos de su perfil o requerimiento. Nuestro equipo analizará la viabilidad y modelo de negocio para conectar con capital institucional.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <span className="text-sm">+52 81 1234 5678</span>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <span className="text-sm">contacto@akredita.me</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <form onSubmit={handleSubmit} className="glass-card !bg-white/[0.05] p-10 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50 ml-1">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="Ej. Roberto Martínez"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-akredita-blue/50 focus:bg-white/[0.08] transition-all"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50 ml-1">Correo Corporativo</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    <input 
                      required
                      type="email" 
                      placeholder="ejemplo@empresa.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-akredita-blue/50 focus:bg-white/[0.08] transition-all"
                      value={form.email}
                      onChange={(e) => setForm({...form, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[0.6rem] font-bold uppercase tracking-widest opacity-50 ml-1">Mensaje o Requerimento</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-5 opacity-30" size={18} />
                    <textarea 
                      required
                      rows={4}
                      placeholder="Describa brevemente su activo o proyecto..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-akredita-blue/50 focus:bg-white/[0.08] transition-all resize-none"
                      value={form.message}
                      onChange={(e) => setForm({...form, message: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3 py-5">
                ENVIAR SOLICITUD <Send size={18} />
              </button>
              
              <p className="text-center text-[0.6rem] opacity-30 tracking-tight">
                Al enviar, acepta nuestra política de privacidad y manejo de datos institucionales.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
