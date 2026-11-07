'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface TestimonialItem {
  name: string;
  id: string;
  faculty: string;
  text: string;
}

const testimonialsCol1: TestimonialItem[] = [
  {
    name: 'Liam Hayes',
    id: 'ID: U20250101',
    faculty: 'Physical Sciences • FUNAAB',
    text: 'This platform offers vetted past questions and experienced instructor notes that made preparing for semester exams 10x faster and engaging. Practical knowledge is at your fingertips.',
  },
  {
    name: 'Damilare Ogundare',
    id: 'ID: CSC/2021/0491',
    faculty: 'Computer Science • 400L',
    text: 'The CSC 405 Formal Methods notes and past questions archive saved my entire study group during finals week. Everything is organized cleanly by department and semester.',
  },
  {
    name: 'Sophia Adeyemi',
    id: 'ID: U182903',
    faculty: 'Mechanical Engineering • COLENG',
    text: 'Uploading lecture slides as a course representative is effortless. It keeps our entire class synchronized ahead of continuous assessments and tests.',
  },
];

const testimonialsCol2: TestimonialItem[] = [
  {
    name: 'Noah Carter',
    id: 'ID: U459854',
    faculty: 'Mathematical Sciences',
    text: 'Studying here has been an incredible experience thanks to expert faculty notes, well-designed past questions, and hands-on peer learning opportunities that strengthened my abilities.',
  },
  {
    name: 'Jimmy Olatunji',
    id: 'ID: ABU/2023/118',
    faculty: 'College of Engineering • ABUAD',
    text: 'Cross-referencing past exam questions across universities opened up great problem-solving techniques. The repository structure with colleges and levels is intuitive.',
  },
  {
    name: 'Fatima Bello',
    id: 'ID: U391048',
    faculty: 'Biological Sciences • COLBIOS',
    text: 'The ease of downloading lab handouts and past semester tests without broken links is what makes this repository stand out from scattered WhatsApp group drives.',
  },
];

const testimonialsCol3: TestimonialItem[] = [
  {
    name: 'Marcus Vance',
    id: 'ID: U20250102',
    faculty: 'Physical Sciences',
    text: 'Having verified past questions alongside syllabus outlines makes academic collaboration between lecturers and students seamless and highly effective.',
  },
  {
    name: 'Chinwe Okoro',
    id: 'ID: U510928',
    faculty: 'Management Sciences • COLMAS',
    text: 'No more searching endlessly for scattered PDF files. Everything is structured by college and level in clean repositories with direct one-click downloads.',
  },
  {
    name: 'Samuel Adeleke',
    id: 'ID: U290184',
    faculty: 'Animal Science • COLANIM',
    text: 'The community discussions and shared lecture notes helped me bridge difficult topics before finals week. Highly recommended for every undergraduate.',
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-surface-card border-y border-border-subtle relative overflow-hidden scroll-mt-20">
      <div className="site-container relative">
        {/* Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 text-primary text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Success Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight leading-[1.15]">
            Faculty & Students Who
            <br />
            Truly Excel Together
          </h2>
          <p className="text-text-muted text-sm sm:text-base max-w-lg mx-auto">
            Real stories from undergraduates and course representatives excelling across university departments.
          </p>
        </div>

        {/* Marquee Viewport with Top and Bottom Cloud Gradient Fades */}
        <div className="relative h-[34rem] sm:h-[38rem] overflow-hidden">
          {/* Top Cloud Gradient Fade */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-surface-card via-surface-card/85 to-transparent z-20" />
          
          {/* Bottom Cloud Gradient Fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-card via-surface-card/85 to-transparent z-20" />

          {/* 3-Column Marquee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-full items-start">
            {/* Column 1: Moves UP Slowly */}
            <div className="relative overflow-hidden h-full">
              <div className="animate-marquee-up flex flex-col gap-6">
                {[...testimonialsCol1, ...testimonialsCol1].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-7 shadow-xs hover:border-primary/40 hover:shadow-md transition-all cursor-default group"
                  >
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className="h-11 w-11 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-sm shrink-0 border border-primary-subtle">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-base leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-text-placeholder text-xs font-mono mt-0.5">
                          {item.faculty}
                        </p>
                      </div>
                    </div>
                    <p className="text-text-body text-sm leading-relaxed italic">
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Moves DOWN Slowly (Opposite Direction) */}
            <div className="relative overflow-hidden h-full hidden sm:block">
              <div className="animate-marquee-down flex flex-col gap-6">
                {[...testimonialsCol2, ...testimonialsCol2].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-7 shadow-xs hover:border-primary/40 hover:shadow-md transition-all cursor-default group"
                  >
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className="h-11 w-11 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-sm shrink-0 border border-primary-subtle">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-base leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-text-placeholder text-xs font-mono mt-0.5">
                          {item.faculty}
                        </p>
                      </div>
                    </div>
                    <p className="text-text-body text-sm leading-relaxed italic">
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Moves UP Slowly */}
            <div className="relative overflow-hidden h-full hidden lg:block">
              <div className="animate-marquee-up flex flex-col gap-6">
                {[...testimonialsCol3, ...testimonialsCol3].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-border-subtle rounded-2xl p-6 sm:p-7 shadow-xs hover:border-primary/40 hover:shadow-md transition-all cursor-default group"
                  >
                    <div className="flex items-center gap-3.5 mb-3.5">
                      <div className="h-11 w-11 rounded-full bg-primary-light flex items-center justify-center font-bold text-primary text-sm shrink-0 border border-primary-subtle">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-text-main text-base leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-text-placeholder text-xs font-mono mt-0.5">
                          {item.faculty}
                        </p>
                      </div>
                    </div>
                    <p className="text-text-body text-sm leading-relaxed italic">
                      "{item.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
