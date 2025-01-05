import React from 'react';
import {
  Hero,
  Features,
  SocialProof,
  Pricing,
  FAQ,
  Newsletter,
  ContactForm,
  ChatWidget
} from '../components/Landing';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Hero />
      <Features />
      <SocialProof />
      <Pricing />
      <FAQ />
      <Newsletter />
      <ContactForm />
      <ChatWidget />
    </div>
  );
}