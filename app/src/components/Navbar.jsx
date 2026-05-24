import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-transparent">
            <img 
              alt="Akredita Me Isotipo" 
              className="h-8 md:h-10 w-auto bg-transparent object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M" 
            />
            <img 
              alt="Akredita Me Wordmark" 
              className="hidden xs:block h-5 md:h-6 w-auto bg-transparent object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ" 
            />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#infraestructura" className="text-primary font-bold border-b-2 border-primary font-label-sm text-label-sm py-2">
              Infraestructura Eléctrica
            </a>
            <a href="#pilares" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 font-label-sm text-label-sm py-2">
              Sectores Clave
            </a>
            <a href="#contacto" className="text-on-surface-variant hover:text-on-surface transition-colors duration-200 font-label-sm text-label-sm py-2">
              Contacto
            </a>
          </nav>
          
          <div className="flex items-center gap-4">
            <a href="#contacto" className="hidden lg:block bg-primary-container text-white px-6 py-2.5 rounded-lg font-bold hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-sm">
              Conversemos de tu proyecto
            </a>
            <button 
              className="md:hidden p-2 text-on-surface transition-transform active:scale-95" 
              onClick={() => setIsOpen(true)}
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`fixed inset-0 z-[60] bg-background transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="h-20 px-margin-mobile flex items-center justify-between border-b border-outline-variant/10">
            <div className="flex items-center gap-2">
              <img 
                alt="Akredita Me Isotipo" 
                className="h-8 w-auto bg-transparent object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJh3TTpvGdRvBA81-hYwvB_uiIxuLMt2_yxlq52oRJtyM6XX2ZkXexZzWB4J_fgGDQZYhxegta3V-g0WB6pQN7CykFESLnkVu55iuqBVpeB8mudTMfxlxUiKhToIYXns6gr1BWJ3ta_RuU-bV--BATWjYoM-Yndjj3rOivtVyl-o7JIJISa9QvySrfBzJC4Nf27WLTdfEfPWRUJyhPj3Ix0pF7umz5b8xFilkiM2g-55cpTrE5BJ80cKO0EYehWWfs_4KessPrB-M" 
              />
              <img 
                alt="Akredita Me Wordmark" 
                className="h-5 w-auto bg-transparent object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyFARvUFR03QImWBW5uozcc9AbGk9UArF7epzg7aRwxeC08p5082fRZPFzHBWLhc8pGGuzOmEyqVL6hkkzRUW6Hzz-TFdWuL_Bgj2WwF1RdvIuIIOPH9co_BgZbJPTwgS_thHkSuL2tQih0756GlkhY4hvRu1AnqK9q4feQ8fvdeEjxA5WZhMDjI5cbS_xmLRNkC40Jm9XzrYiUK0Z1X3xA2rU3XNuOC9ZMk6XO1gViJnG3vv4hXWM8sxQVQBxs28z9E6TfvPJ_ZQ" 
              />
            </div>
            <button className="p-2 text-on-surface" onClick={() => setIsOpen(false)}>
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <nav className="flex-1 px-margin-mobile py-12 flex flex-col gap-8">
            <a href="#infraestructura" className="text-2xl font-headline-lg text-primary" onClick={() => setIsOpen(false)}>
              Infraestructura Eléctrica
            </a>
            <a href="#pilares" className="text-2xl font-headline-lg text-on-surface" onClick={() => setIsOpen(false)}>
              Sectores Clave
            </a>
            <a href="#contacto" className="text-2xl font-headline-lg text-on-surface" onClick={() => setIsOpen(false)}>
              Contacto
            </a>
          </nav>
          
          <div className="p-margin-mobile border-t border-outline-variant/10">
            <a 
              href="#contacto" 
              className="w-full bg-primary-container text-white py-4 rounded-xl font-bold text-lg block text-center"
              onClick={() => setIsOpen(false)}
            >
              Conversemos de tu proyecto
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
