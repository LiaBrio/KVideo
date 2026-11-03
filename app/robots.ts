import type { MetadataRoute } from 'next';
import { isPubliclyIndexable, SITE_URL } from '@/lib/site-indexing';

export default function robots(): MetadataRoute.Robots {
  if (!isPubliclyIndexable()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Home is the public page. Keep private, settings, playback, API,
      // and query-string result URLs out of the crawl.
      disallow: ['/secret', '/settings', '/player', '/api/', '/*?'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
