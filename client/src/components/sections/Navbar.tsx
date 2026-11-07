'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact Us', href: '/#contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface-bg/90 backdrop-blur-md border-b border-border-subtle transition-all duration-200">
      <div className="site-container h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="relative flex items-center"
          >
            <BrandLogo className="h-9 w-9" showText={true} />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 px-3 py-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative px-3.5 lg:px-4 py-2 text-sm font-medium text-text-body hover:text-primary rounded-full transition-colors group"
            >
              <span>{link.label}</span>
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center rounded-full" />
            </Link>
          ))}
        </nav>

        {/* Auth Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-3">
          <Link href="/signin">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="text-primary hover:text-primary-hover border border-primary/30 hover:border-primary py-2.5 px-6 text-sm font-semibold rounded-4xl hover:bg-primary-light transition-all cursor-pointer"
            >
              Login
            </motion.button>
          </Link>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 10px 20px -10px rgba(59, 130, 246, 0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="text-white bg-primary hover:bg-primary-hover py-2.5 px-6 text-sm font-semibold rounded-4xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Sign up</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl text-text-body hover:text-primary hover:bg-surface-muted transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-border-subtle bg-surface-bg/95 backdrop-blur-lg px-6 pt-3 pb-6 shadow-xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-text-main font-medium hover:bg-surface-muted hover:text-primary transition-colors text-base"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border-subtle grid grid-cols-2 gap-3">
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-3 text-primary border border-primary/40 font-semibold text-sm rounded-full hover:bg-primary-light transition cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-3 bg-primary text-white font-semibold text-sm rounded-full shadow-sm hover:bg-primary-hover transition cursor-pointer">
                    Sign up
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
