import React from 'react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center overflow-hidden bg-akredita-dark">
      {/* Institutional Background Glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[600px] bg-akredita-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[400px] bg-akredita-blue-dark/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-6xl mx-auto animate-fade-in">
        <div className="mb-10 opacity-70 tracking-[0.25em] text-[0.7rem] sm:text-[0.8rem] font-bold uppercase text-akredita-blue">
          Holding Institucional & Estructuración de Activos
        </div>
        
        <h1 className="text-[2.8rem] sm:text-[5rem] font-bold leading-[1.05] mb-10 text-white tracking-tight">
          Estructurando Activos.<br className="hidden sm:block" /> Conectando Capital.
        </h1>
        
        <div className="max-w-2xl mx-auto mb-14 relative">
          <div className="absolute left-[-1.5rem] top-0 bottom-0 w-[2px] bg-akredita-blue hidden sm:block opacity-50" />
          <p className="text-lg sm:text-xl opacity-80 leading-relaxed font-medium pl-0 sm:pl-4 text-center sm:text-left border-l-2 border-akredita-blue sm:border-l-0">
            Convertimos proyectos productivos en oportunidades de inversión estructuradas mediante vehículos financieros, tecnología y modelos escalables.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button className="btn-primary min-w-[240px]">
            INICIAR ESTRUCTURACIÓN
          </button>
          <button className="btn-secondary min-w-[240px]">
            EXPLORAR VERTICALES
          </button>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-4 opacity-40 text-[0.75rem] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-akredita-blue rounded-full" />
            Energía e Infraestructura
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-akredita-blue rounded-full" />
            Innovación Tech
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-akredita-blue rounded-full" />
            Activos Reales
          </div>
        </div>
      </div>
    </section>
  );
};
