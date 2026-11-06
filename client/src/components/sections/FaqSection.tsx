'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: 'How do I access past questions and lecture notes for my department?',
    answer:
      'Simply click on "Browse Colleges" or "University" in the navbar, choose your college (e.g. COLPHYS), select your department (e.g. Computer Science), and choose your academic level (100L – 500L) to view all verified course materials and past examination papers.',
  },
  {
    question: 'Are all uploaded study materials and syllabus outlines verified?',
    answer:
      'Yes. All lecture notes, past questions, and assignment solutions undergo academic peer-review and verification by departmental course representatives and lecturers before being made available in the repository.',
  },
  {
    question: 'Can I upload past questions or lecture notes as a student or course rep?',
    answer:
      'Absolutely. You can contribute study materials directly on any course page via the "Upload Note" button, or register as a Course Representative through the Course Rep Desk in the contact section for direct bulk upload access.',
  },
  {
    question: 'Is access to the platform free for university students?',
    answer:
      'Yes! Accessing, reading, and downloading past questions and lecture notes across all university colleges is 100% free for students and lecturers.',
  },
  {
    question: 'How can my institution or faculty be registered on the platform?',
    answer:
      'You can register your university via the "Register New University" page or reach out through the contact form under "Register University". Our team will verify and initialize your faculty directory.',
  },
];

export default function FaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-surface-bg scroll-mt-20">
      <div className="site-container max-w-5xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold tracking-wider uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about accessing lecture notes, past questions, and departmental resources.
          </p>
        </div>

        <div className="space-y-4 w-full md:w-2/3 mx-auto">
          {faqItems.map((faq, idx) => (
            <motion.div
              key={idx}
              className="bg-white border border-border-subtle rounded-2xl overflow-hidden shadow-xs hover:border-primary/40 transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
              >
                <span className="font-bold text-text-main text-base sm:text-lg">
                  {faq.question}
                </span>
                <div
                  className={`h-8 w-8 rounded-full bg-surface-muted flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    openFaqIndex === idx ? 'rotate-180 bg-primary-light text-primary' : 'text-text-muted'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 text-text-body text-sm sm:text-base leading-relaxed border-t border-border-light">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
