import type { MetadataRoute } from 'next';
import { isPubliclyIndexable, SITE_URL } from '@/lib/site-indexing';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isPubliclyIndexable()) return [];

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
