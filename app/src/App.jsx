import React from 'react';
import { Hero } from './components/Hero';
import { VerticalsHub } from './components/VerticalsHub';
import { LeadWizard } from './components/LeadWizard';
import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-8 sm:px-12 bg-akredita-dark/80 backdrop-blur-md transition-all duration-300">
        <img src="/wordmark-v4.png" alt="Akredita Me" className="h-5 sm:h-7" />
        <div className="flex gap-8 items-center">
          <a href="#verticals" className="text-[0.8rem] font-bold tracking-[0.2em] uppercase hover:text-akredita-blue transition-colors">Verticales</a>
          <a href="#contact" className="text-[0.8rem] font-bold tracking-[0.2em] uppercase hover:text-akredita-blue transition-colors">Contacto</a>
        </div>
      </nav>

      <main>
        <Hero />
        <VerticalsHub />
        <LeadWizard />
      </main>

      <footer className="py-20 px-8 border-t border-white/10 text-center bg-akredita-dark">
        <img src="/logo-v4.png" alt="Akredita Me" className="h-8 mx-auto mb-8 opacity-80" />
        <div className="max-w-2xl mx-auto opacity-40">
          <p className="text-sm">© {new Date().getFullYear()} Akredita Me, S.A.P.I. de C.V. Todos los derechos reservados.</p>
          <p className="text-xs mt-3 font-bold tracking-[0.3em] uppercase">Estructurando activos. Conectando capital.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
