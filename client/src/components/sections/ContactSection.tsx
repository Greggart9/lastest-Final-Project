'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Mail,
  GraduationCap,
  MapPin,
  Clock,
  BookOpen,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  university: string;
  subject: string;
  message: string;
}

const contactCategories: string[] = [
  'Study Materials',
  'General Inquiry',
  'Register University',
  'Course Rep Desk',
];

export default function ContactSection() {
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Study Materials');

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    university: '',
    subject: '',
    message: '',
  });

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setContactSubmitted(true);
      setFormData({ name: '', email: '', university: '', subject: '', message: '' });
      setTimeout(() => setContactSubmitted(false), 6000);
    }, 800);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-surface-bg scroll-mt-20">
      <div className="site-container">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
          {/* Left Column: Direct Touchpoints & Context */}
          <div className="flex-1 w-full space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold tracking-wider uppercase mb-3">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Academic Support Desk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-main tracking-tight leading-[1.15]">
                Get in Touch with our
                <br />
                <span className="text-primary">Academic Network</span>
              </h2>
              <p className="text-text-muted text-sm sm:text-base md:text-lg mt-3 leading-relaxed max-w-xl">
                Have questions regarding course repositories, past questions, or looking to register your institution? Our student and lecturer support team is here to assist.
              </p>
            </div>

            {/* Direct Info Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Support Card */}
              <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-text-main text-sm">General Support</h3>
                <a href="mailto:info@greg.com" className="text-primary hover:underline text-sm font-semibold block mt-0.5">
                  info@greg.com
                </a>
                <p className="text-text-placeholder text-xs mt-1">Replies in under 2 hours</p>
              </div>

              {/* Course Rep Desk Card */}
              <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-text-main text-sm">Course Rep Desk</h3>
                <p className="text-text-main text-sm font-semibold mt-0.5">
                  reps@campushub.xyz
                </p>
                <p className="text-text-placeholder text-xs mt-1">Material upload verification</p>
              </div>

              {/* Campus Location Card */}
              <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-text-main text-sm">Campus Base</h3>
                <p className="text-text-body text-sm font-semibold mt-0.5">
                  FUNAAB Campus
                </p>
                <p className="text-text-placeholder text-xs mt-1">Abeokuta, Ogun State, Nigeria</p>
              </div>

              {/* Live Hours Card */}
              <div className="p-5 rounded-2xl bg-surface-card border border-border-subtle hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center text-primary mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-text-main text-sm">Desk Hours</h3>
                <p className="text-text-body text-sm font-semibold mt-0.5">
                  Mon - Sat (8am - 8pm)
                </p>
                <p className="text-text-placeholder text-xs mt-1">Academic semester support</p>
              </div>
            </div>

            {/* Course Rep Highlight Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-primary-light/70 border border-primary-subtle flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-text-main text-sm">Are you a Course Representative or Lecturer?</h4>
                <p className="text-text-body text-xs sm:text-sm mt-1 leading-relaxed">
                  Course representatives receive expedited material verification and direct upload permissions for departmental past question vaults.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Rebuilt Contact Form Card */}
          <div className="w-full lg:w-[48%] shrink-0">
            <div className="bg-white border border-border-subtle rounded-3xl sm:rounded-[2.5rem] p-7 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="mb-6 space-y-3">
                <h3 className="text-2xl font-bold text-text-main tracking-tight">
                  Send a Message
                </h3>
                <p className="text-text-muted text-xs sm:text-sm">
                  Select a topic and fill out the details below. We'll route your request to the right team.
                </p>

                {/* Topic Selector Tabs */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {contactCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface-muted text-text-muted hover:text-text-main hover:bg-border-subtle'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {contactSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 mb-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Your message has been delivered successfully. A member of our team will get back to you shortly!</span>
                </motion.div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Ogundare Oluwadamilare"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="student@funaab.edu.ng"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* University & Department */}
                <div>
                  <label htmlFor="university" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    University & Department
                  </label>
                  <input
                    id="university"
                    type="text"
                    placeholder="e.g. FUNAAB - Computer Science (400L)"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    placeholder={`e.g. [${selectedCategory}] Past Questions Inquiry`}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-sm"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    placeholder="How can we help your academic journey or study group?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-card border border-border-subtle rounded-xl text-text-main placeholder-text-placeholder focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-sm sm:text-base rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Message'}</span>
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
