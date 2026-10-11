import type { MetadataRoute } from 'next'
import { DATA_STRUCTURES } from '@/constants/registry'

const BASE_URL = 'https://dsvisualizer.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  const dynamicRoutes: MetadataRoute.Sitemap = Object.keys(DATA_STRUCTURES).map((dsId) => ({
    url: `${BASE_URL}/learn/${dsId}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  return [...staticRoutes, ...dynamicRoutes]
}
