import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Pillars } from './components/Pillars';
import { ValueProp } from './components/ValueProp';
import { Trust } from './components/Trust';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import './index.css';

function App() {
  // Smooth scroll and scroll animations setup
  useEffect(() => {
    document.title = "Akredita Me | Infraestructura de Suministro Eléctrico para el Nearshoring";
    
    const handleSmoothScroll = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href.startsWith('#')) {
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
  }, []);

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

