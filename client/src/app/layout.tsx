import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://educollab.oluwadamilare.xyz'),
  title: {
    default: 'EduCollab | Academic Collaboration & Resource Hub',
    template: '%s | EduCollab',
  },
  description:
    'The ultimate peer-to-peer collaboration hub for university students and lecturers to share verified lecture notes, departmental past questions, and academic resources.',
  applicationName: 'EduCollab',
  authors: [{ name: 'EduCollab Academic Community' }],
  creator: 'EduCollab',
  publisher: 'EduCollab',
  keywords: [
    'EduCollab',
    'academic collaboration',
    'lecture notes',
    'past questions',
    'university study materials',
    'departmental past papers',
    'student resources',
    'campus notes sharing',
    'academic portal',
  ],
  referrer: 'origin-when-cross-origin',
  alternates: {
    canonical: 'https://educollab.oluwadamilare.xyz',
  },
  openGraph: {
    title: 'EduCollab | Academic Collaboration & Resource Hub',
    description:
      'Empowering students and lecturers with verified lecture notes, departmental past questions, and collaborative study resources across all colleges.',
    url: 'https://educollab.oluwadamilare.xyz',
    siteName: 'EduCollab',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EduCollab - Academic Collaboration & Resource Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduCollab | Academic Collaboration & Resource Hub',
    description:
      'Access verified lecture notes, departmental past questions, and study materials shared by university students and lecturers.',
    images: ['/og-image.jpg'],
    creator: '@educollab',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://educollab.oluwadamilare.xyz/#website',
      url: 'https://educollab.oluwadamilare.xyz',
      name: 'EduCollab',
      description: 'The Ultimate Academic Collaboration & Resource Hub for Students and Lecturers.',
      publisher: {
        '@type': 'EducationalOrganization',
        '@id': 'https://educollab.oluwadamilare.xyz/#organization',
        name: 'EduCollab',
        url: 'https://educollab.oluwadamilare.xyz',
        logo: 'https://educollab.oluwadamilare.xyz/icon-192.png',
      },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://educollab.oluwadamilare.xyz/#organization',
      name: 'EduCollab',
      url: 'https://educollab.oluwadamilare.xyz',
      logo: 'https://educollab.oluwadamilare.xyz/icon-192.png',
      description: 'Peer-to-peer university academic material sharing and collaboration platform.',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-surface-bg text-text-main antialiased selection:bg-primary-light selection:text-primary-dark">
        {children}
      </body>
    </html>
  );
}
