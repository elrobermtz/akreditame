import React from 'react';
import { FileText, Hammer, ShieldAlert, Wrench } from 'lucide-react';

const values = [
  {
    title: 'PPAs',
    desc: 'Power Purchase Agreements estructurados para competitividad a largo plazo.',
    icon: FileText
  },
  {
    title: 'Construcción',
    desc: 'Ejecución institucional de subestaciones y redes de distribución.',
    icon: Hammer
  },
  {
    title: 'Administración',
    desc: 'Gestión regulatoria y técnica de la infraestructura eléctrica.',
    icon: ShieldAlert
  },
  {
    title: 'Operación',
    desc: 'Mantenimiento y monitoreo proactivo para continuidad operativa.',
    icon: Wrench
  }
];

export const ValueProp = () => {
  return (
    <section id="infraestructura" className="py-16 md:py-24 bg-surface-container-high relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden lg:block">
        <svg className="w-full h-full fill-primary-container" viewBox="0 0 400 400">
          <circle cx="400" cy="0" r="300"></circle>
        </svg>
      </div>
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="font-label-sm text-xs md:text-label-sm text-primary uppercase tracking-[0.2em] mb-4 block">
              Infraestructura del Suministro Eléctrico
            </span>
            <h2 className="font-headline-lg text-3xl md:text-headline-lg mb-6 md:mb-8 text-white">
              Gestión Integral del Activo Energético
            </h2>
            <p className="font-body-lg text-base md:text-body-lg text-on-secondary-container mb-10 md:mb-12">
              Aportamos valor tangible tanto a constructoras como a usuarios finales al garantizar la <strong>suficiencia de capacidad instalada</strong>. Nuestra infraestructura permite a las empresas concentrarse en su operación mientras nosotros aseguramos el flujo vital de energía.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {values.map((v, i) => (
                <div key={i} className="bg-surface-slate/50 p-5 md:p-6 rounded-xl border border-white/5">
                  <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                    <v.icon className="w-5 h-5 text-primary-container" />
                    {v.title}
                  </h4>
                  <p className="text-sm text-on-surface-variant">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] hidden lg:block shadow-2xl border border-white/5">
            <img 
              alt="Electrical Infrastructure" 
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQc4hxwl4MNvTZuX3Iv966dAQw26ARdfo5OxTJT-UckZRJkt0vr4L72CuARB7mo8mOymmdFZB_q6u3UrUX2V3XCx6djcwTJbixx8v57p3z2v0TxLCx0KpzsJ2CjQ6OG-RtOokrme60M9gdTJg1QIq2DfjLRFBKO-vn4mnZaegprsYLr9LQyQX__GfHF5K0JOfLL0q-1n5OArGsadquupTygUkclOsVVrkjv6GC628JLiVlvCZrPMLskdi5DkPUga_m1vzQH96a2CA"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
