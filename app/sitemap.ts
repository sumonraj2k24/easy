import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://easyskillbd.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/auth/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${siteUrl}/auth/sign-up`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]
}
