import React from 'react';
import { Zap, Cpu, Building2, ChevronRight } from 'lucide-react';

const verticals = [
  {
    id: 'energy',
    title: 'Energía e Infraestructura',
    description: 'Estructuración de activos de generación y transmisión con flujos resilientes (PPA) y alta eficiencia operativa.',
    icon: Zap,
    type: 'solid',
    status: 'Activo'
  },
  {
    id: 'digital',
    title: 'Innovación y Activos Digitales',
    description: 'Ecosistemas SaaS, Fintech y PropTech escalables mediante tokenización y optimización operativa tecnológica.',
    icon: Cpu,
    type: 'glass',
    status: 'Fase de Estructuración'
  },
  {
    id: 'real-estate',
    title: 'Activos Reales',
    description: 'Desarrollo y administración de infraestructura estratégica con enfoque en plusvalía y rentabilidad institucional.',
    icon: Building2,
    type: 'solid',
    status: 'Activo'
  }
];

export const VerticalsHub = () => {
  return (
    <section id="verticals" className="py-24 px-6 bg-akredita-bgLight">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="text-akredita-dark text-3xl sm:text-4xl mb-4">Nuestras Divisiones de Inversión</h2>
          <div className="w-20 h-1 bg-akredita-blue rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-akredita-dark">
          {verticals.map((v) => (
            <div 
              key={v.id}
              className={`group flex flex-col p-10 transition-all duration-500 rounded-2xl ${
                v.type === 'glass' 
                  ? 'bg-gradient-to-br from-akredita-blue/10 to-akredita-blue-dark/20 border border-akredita-blue/20 backdrop-blur-md' 
                  : 'bg-white shadow-xl shadow-akredita-dark/5 border border-transparent'
              } hover:-translate-y-2 hover:shadow-2xl`}
            >
              <div className={`w-14 h-14 flex items-center justify-center rounded-xl mb-8 transition-colors ${
                v.type === 'glass' ? 'bg-akredita-blue text-white' : 'bg-akredita-dark/5 text-akredita-blue group-hover:bg-akredita-blue group-hover:text-white'
              }`}>
                <v.icon size={28} strokeWidth={1.5} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[0.6rem] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                    v.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-akredita-blue'
                  }`}>
                    {v.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-4">{v.title}</h3>
                <p className="text-akredita-dark/60 text-sm leading-relaxed mb-8">
                  {v.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-akredita-blue font-bold text-xs tracking-widest uppercase cursor-pointer">
                Ver Detalles <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
