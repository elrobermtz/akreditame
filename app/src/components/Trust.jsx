import React from 'react';
import { Shield, Zap, Building } from 'lucide-react';

export const Trust = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-container-max">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="font-headline-lg text-3xl md:text-headline-lg mb-6 text-white">Confianza Institucional</h2>
          <p className="text-on-secondary-container max-w-2xl text-base md:text-body-lg">
            Operamos bajo los más altos estándares de gobernanza, brindando certeza jurídica y técnica a desarrolladores inmobiliarios y clientes corporativos transnacionales.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="flex flex-col items-center text-center group">
            <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-primary-container flex items-center justify-center rounded-full mb-6 text-white shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-7 h-7 md:w-8 h-8" />
            </div>
            <h4 className="font-headline-md text-lg md:text-xl text-primary mb-2">Certeza Jurídica</h4>
            <p className="text-on-secondary-container text-sm px-4">Contratos y gestiones alineadas al marco regulatorio energético nacional.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-primary-container flex items-center justify-center rounded-full mb-6 text-white shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-7 h-7 md:w-8 h-8" />
            </div>
            <h4 className="font-headline-md text-lg md:text-xl text-primary mb-2">Reducción de Riesgo</h4>
            <p className="text-on-secondary-container text-sm px-4">Garantizamos la potencia eléctrica desde las fases tempranas del desarrollo.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-primary-container flex items-center justify-center rounded-full mb-6 text-white shadow-lg shadow-primary-container/20 group-hover:scale-105 transition-transform duration-300">
              <Building className="w-7 h-7 md:w-8 h-8" />
            </div>
            <h4 className="font-headline-md text-lg md:text-xl text-primary mb-2">Escala Institucional</h4>
            <p className="text-on-secondary-container text-sm px-4">Capacidad de ejecución en múltiples regiones y proyectos de gran envergadura.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
