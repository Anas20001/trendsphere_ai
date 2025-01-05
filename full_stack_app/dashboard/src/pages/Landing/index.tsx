import React from 'react';
import { Header } from '../../components/Navigation';
import {
  Hero,
  Features,
  SocialProof,
  Pricing,
  FAQ,
  Newsletter,
  ContactForm,
  ChatWidget
} from '../../components/Landing';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Header />
      <main>
        <Hero />
        <section id="features">
          <Features />
        </section>
        <section id="about">
          <SocialProof />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <section id="newsletter">
          <Newsletter />
        </section>
        <section id="contact">
          <ContactForm />
        </section>
      </main>
      <ChatWidget />
    </div>
  );
}