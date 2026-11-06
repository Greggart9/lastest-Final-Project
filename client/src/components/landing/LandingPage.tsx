'use client';

import React from 'react';
import Navbar from '../sections/Navbar';
import HeroSection from '../sections/HeroSection';
import StatsSection from '../sections/StatsSection';
import AboutSection from '../sections/AboutSection';
import FeaturesSection from '../sections/FeaturesSection';
import FaqSection from '../sections/FaqSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ContactSection from '../sections/ContactSection';
import CtaSection from '../sections/CtaSection';
import FooterSection from '../sections/FooterSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-bg text-text-main flex flex-col justify-between selection:bg-primary-subtle selection:text-primary-active">
      {/* 1. Header & Navigation */}
      <Navbar />

      {/* 2. Main Sections */}
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <AboutSection />
        <FeaturesSection />
        <FaqSection />
        <TestimonialsSection />
        <ContactSection />
        <CtaSection />
      </main>

      {/* 3. Footer */}
      <FooterSection />
    </div>
  );
}
