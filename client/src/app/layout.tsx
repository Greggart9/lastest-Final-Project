import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduCollab - Academic Collaboration Hub',
  description: 'The Ultimate Collaboration Hub for Students and Lecturers to Expand Knowledge and Sharpen Skills.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-surface-bg text-text-main antialiased selection:bg-primary-light selection:text-primary-dark">
        {children}
      </body>
    </html>
  );
}
