import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EduCollab | Academic Collaboration Hub',
    short_name: 'EduCollab',
    description:
      'The Ultimate Peer-to-Peer Academic Collaboration & Resource Hub for Students and Lecturers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1120',
    theme_color: '#2563EB',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
