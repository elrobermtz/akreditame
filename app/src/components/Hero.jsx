import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-gradient z-10"></div>
        <img 
          alt="Infraestructura energética de alta tensión" 
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_cI3NGgGBqJr4jQkE8KxUPaXdHLpmRBU2uiwxdHd-TC0q7cPDcM-433NgQbGQ7nWbA7rb2b5F4tq8b1ICGbBgYZEZ9RP-_pxYFSqapinmRPDEFL2rYRszHnsH7Gcv53MrwJrGJ7HrpNBJ1dEgWYC8TUtsOXrTlmMJd9y3Jypy3aVRBnWSq4_FGzRi7QYzLAMLb9Qz9cXke_YwvA_ugJHlPzZy5xRqLlIMrhVpTElNEQRnaOLSIyuX8SiJJBiXYw3SMzSy2oypz58"
        />
      </div>
      
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop relative z-20 max-w-container-max py-24">
        <div className="max-w-3xl">
          <span className="inline-block font-label-sm text-[10px] md:text-label-sm text-primary uppercase tracking-widest mb-6 px-3 py-1 border border-primary/20 rounded-full bg-primary/5">
            Suficiencia de Capacidad Instalada
          </span>
          <h1 className="font-display-lg text-4xl md:text-5xl lg:text-display-lg mb-8 text-glow leading-tight text-white">
            Potenciando la <span className="text-primary-container">Infraestructura Eléctrica</span> del Mañana.
          </h1>
          <p className="font-body-lg text-base md:text-body-lg text-on-secondary-container mb-10 md:mb-12 leading-relaxed border-l-2 border-primary-container/30 pl-6">
            Garantizamos la continuidad y el suministro energético crítico para el ecosistema del Nearshoring. Habilitamos capacidad instalada real para parques industriales, maquiladoras y centros de datos de alta escala.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#contacto" 
              className="bg-primary-container text-white px-6 md:px-10 py-4 rounded-xl font-bold text-base md:text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary-container/20"
            >
              CONVERSEMOS DE TU PROYECTO
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#infraestructura" 
              className="border border-white/20 bg-white/5 backdrop-blur-sm text-white px-6 md:px-10 py-4 rounded-xl font-bold text-base md:text-lg hover:bg-white/10 transition-all text-center"
            >
              VER CAPACIDADES TÉCNICAS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

