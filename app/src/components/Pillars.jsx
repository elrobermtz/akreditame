import React from 'react';
import { Factory, Cpu, Settings, Server } from 'lucide-react';

const pillars = [
  {
    id: 'parks',
    title: 'Parques Industriales',
    description: 'Suministro eléctrico robusto para desarrollos industriales que demandan alta disponibilidad y redundancia.',
    icon: Factory,
  },
  {
    id: 'nearshoring',
    title: 'Nearshoring',
    description: 'Infraestructura lista para recibir la relocalización de procesos críticos con suficiencia energética inmediata.',
    icon: Cpu,
  },
  {
    id: 'maquilas',
    title: 'Maquiladoras',
    description: 'Optimización de costos y capacidad para manufactura intensiva a través de infraestructura de red dedicada.',
    icon: Settings,
  },
  {
    id: 'datacenters',
    title: 'Data Centers',
    description: 'Suministro de energía de alta densidad y ultra-confiable para infraestructuras de datos de escala mundial.',
    icon: Server,
  }
];

export const Pillars = () => {
  return (
    <section id="pilares" className="py-16 md:py-24 bg-surface-container-lowest">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max">
        <div className="mb-12 md:mb-16">
          <h2 className="font-headline-lg text-3xl md:text-headline-lg mb-4 relative inline-block text-white">
            Pilares del Suministro Industrial
            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-primary-container rounded-full"></span>
          </h2>
          <p className="text-on-secondary-container max-w-2xl text-sm md:text-base mt-4">
            Nuestra especialización se centra en la infraestructura del suministro eléctrico, asegurando que los sectores más dinámicos de la economía cuenten con la potencia necesaria para operar sin interrupciones.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((p) => (
            <div 
              key={p.id}
              className="group bg-surface-slate p-6 md:p-8 rounded-2xl border border-white/5 hover:border-primary-container/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary-container/10 flex items-center justify-center mb-6 border border-primary-container/20 text-primary-container transition-colors group-hover:bg-primary-container group-hover:text-white animate-transition duration-300">
                <p.icon className="w-6 h-6 md:w-7 h-7" />
              </div>
              <h3 className="font-headline-md text-lg md:text-xl mb-3 md:mb-4 text-white">{p.title}</h3>
              <p className="text-on-secondary-container text-sm leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
