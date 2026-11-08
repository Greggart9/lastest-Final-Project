import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://educollab.oluwadamilare.xyz';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/settings',
          '/manageprofile',
          '/updatepw',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
