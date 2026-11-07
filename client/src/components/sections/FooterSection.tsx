'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
  FaGithub,
} from 'react-icons/fa6';
import BrandLogo from '../ui/BrandLogo';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [

  { icon: <FaLinkedinIn className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
  { icon: <FaXTwitter className="w-4 h-4" />, href: '#', label: 'X / Twitter' },
  { icon: <FaGithub className="w-4 h-4" />, href: '#', label: 'GitHub' },
];

export default function FooterSection() {
  return (
    <footer className="w-full bg-surface-card/60 pb-12">
      <div className="site-container">
        {/* Main Navigation, Brand & Social Links Card */}
        <div className="bg-white border border-border-subtle rounded-3xl md:rounded-[2.5rem] p-8 sm:p-10 md:p-14 shadow-xs mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
            {/* Column 1: Brand Info & Social Links (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
              <Link href="/" className="inline-block">
                <BrandLogo className="h-10 w-10" showText={true} />
              </Link>

              <p className="text-text-muted text-sm leading-relaxed max-w-sm">
                A better way to learn, grow, and prepare for what's next across universities and departments.
              </p>

              {/* Follow Us Social Icons */}
              <div className="pt-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Follow us
                </p>
                <div className="flex items-center gap-2.5">
                  {socialLinks.map((s, idx) => (
                    <motion.a
                      key={idx}
                      href={s.href}
                      whileHover={{ y: -3, scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={s.label}
                      className="h-10 w-10 rounded-2xl bg-surface-muted hover:bg-primary-light text-text-muted hover:text-primary border border-border-light flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="space-y-4">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wider">
                Explore
              </h3>
              <ul className="space-y-3 text-sm text-text-body">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="hover:text-primary transition-colors">
                    FAQs & Guide
                  </Link>
                </li>
                <li>
                  <Link href="/colleges" className="hover:text-primary transition-colors">
                    Departments & Faculties
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-primary transition-colors">
                    Student Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="space-y-4">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wider">
                Resources
              </h3>
              <ul className="space-y-3 text-sm text-text-body">
                <li>
                  <Link href="/colleges" className="hover:text-primary transition-colors">
                    Past Question Archive
                  </Link>
                </li>
                <li>
                  <Link href="/colleges" className="hover:text-primary transition-colors">
                    Lecture Notes Vault
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="hover:text-primary transition-colors">
                    Upload Study Material
                  </Link>
                </li>
                <li>
                  <Link href="/colleges" className="hover:text-primary transition-colors">
                    Academic Levels
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-primary transition-colors">
                    Student Registration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Community & Support */}
            <div className="space-y-4">
              <h3 className="font-bold text-text-main text-sm uppercase tracking-wider">
                Community
              </h3>
              <ul className="space-y-3 text-sm text-text-body">
                <li>
                  <Link href="#contact" className="hover:text-primary transition-colors">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/manageprofile" className="hover:text-primary transition-colors">
                    Student Profile
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:text-primary transition-colors">
                    Account Settings
                  </Link>
                </li>
                <li>
                  <a href="#faq" className="hover:text-primary transition-colors">
                    FAQs & Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Academic Integrity
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row / Copyright & Subtitle */}
          <div className="pt-10 mt-10 border-t border-border-light flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-4">
            <p>© {new Date().getFullYear()} EduCollab. All rights reserved.</p>
            <p className="text-text-placeholder text-[11px] text-center sm:text-right">
              Curated lecture notes and materials are tailored for university collaboration and academic study.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
