import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Hero from './hero';
import Features from './features';
import HowItWorks from './how-it-works';
import AboutUs from './about-us';
import FAQ from './faq';
import FinalCTA from './final-cta';
import Footer from './footer';
import { useAuth } from '../common/UserContext';

const MainPage = () => {
  const { user } = useAuth ? useAuth() : { user: null };
  const navigate = useNavigate();
  
  const goToLogin = () => navigate('/login');
  const goToRegister = () => navigate('/register');
  const goToGroups = () => navigate('/dashboard');
  
  // Escuchar el evento personalizado para ir a grupos
  useEffect(() => {
    const handleGoToGroups = () => {
      if (user) {
        navigate('/dashboard');
      }
    };

    window.addEventListener('goToGroups', handleGoToGroups);
    
    return () => {
      window.removeEventListener('goToGroups', handleGoToGroups);
    };
  }, [navigate, user]);
  
  return (
    <>
      <Header onLogin={goToLogin} onRegister={goToRegister} onGroups={user ? goToGroups : null} />
      <section id="inicio"><Hero onStart={goToRegister} onGroups={goToGroups} /></section>
      <section id="como-funciona"><HowItWorks /></section>
      <section id="caracteristicas"><Features /></section>
      <section id="nosotros"><AboutUs /></section>
      <section id="faq"><FAQ /></section>
      <FinalCTA />
      <Footer />
    </>
  );
};

export default MainPage;