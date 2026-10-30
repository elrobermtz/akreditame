import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Pillars } from './components/Pillars';
import { ValueProp } from './components/ValueProp';
import { Trust } from './components/Trust';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SimulatorView } from './components/simulator';
import './index.css';

function App() {
  const [isSimulator, setIsSimulator] = useState(() => 
    typeof window !== 'undefined' && window.location.pathname.startsWith('/simulador')
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setIsSimulator(window.location.pathname.startsWith('/simulador'));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Smooth scroll and scroll animations setup (only for public landing page)
  useEffect(() => {
    if (isSimulator) return;

    document.title = "Akredita Me | Infraestructura de Suministro Eléctrico para el Nearshoring";
    
    const handleSmoothScroll = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => link.addEventListener('click', handleSmoothScroll));
    
    return () => {
      links.forEach(link => link.removeEventListener('click', handleSmoothScroll));
    };
  }, [isSimulator]);

  if (isSimulator) {
    return <SimulatorView />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main className="pt-20">
        <Hero />
        <Pillars />
        <ValueProp />
        <Trust />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
