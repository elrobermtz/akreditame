import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full py-12 md:py-16 bg-surface-container-lowest border-t border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 bg-transparent">
            <img 
              alt="Akredita Me Footer Isotipo" 
              className="h-10 md:h-12 w-auto bg-transparent object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M" 
            />
            <img 
              alt="Akredita Me Footer Wordmark" 
              className="h-6 md:h-8 w-auto bg-transparent object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ" 
            />
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4 text-center">
            <a href="#infraestructura" className="text-on-secondary-container hover:text-primary transition-colors font-label-sm text-[10px] md:text-label-sm">
              Infraestructura Eléctrica
            </a>
            <a href="#pilares" className="text-on-secondary-container hover:text-primary transition-colors font-label-sm text-[10px] md:text-label-sm">
              Sectores Clave
            </a>
            <a href="#contacto" className="text-on-secondary-container hover:text-primary transition-colors font-label-sm text-[10px] md:text-label-sm">
              Contacto
            </a>
            <span className="text-on-secondary-container font-label-sm text-[10px] md:text-label-sm cursor-pointer hover:text-primary transition-colors">
              Aviso de Privacidad
            </span>
          </div>
        </div>
        <div className="w-full max-w-4xl border-t border-white/5 pt-8 flex flex-col items-center text-center">
          <p className="font-label-sm text-[10px] md:text-label-sm text-on-secondary-container/60 leading-relaxed mb-4">
            © {new Date().getFullYear()} Akredita Me, S.A.P.I. de C.V. Todos los derechos reservados.
          </p>
          <p className="font-label-sm text-[10px] md:text-label-sm text-primary tracking-[0.2em] md:tracking-[0.3em] font-bold">
            INFRAESTRUCTURA DEL SUMINISTRO ELÉCTRICO INDUSTRIAL.
          </p>
        </div>
      </div>
    </footer>
  );
};
