import { Analytics } from '@vercel/analytics/next'
import { Noto_Sans_Bengali, Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const bengaliFont = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bengali',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://easyskillbd.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'EasySkillBD | অনলাইনে স্কিল শেখার সেরা প্ল্যাটফর্ম',
    template: '%s | EasySkillBD',
  },
  description: 'বাংলাদেশের শিক্ষার্থীদের জন্য ওয়েব ডেভেলপমেন্ট, গ্রাফিক্স ডিজাইন ও ডিজিটাল মার্কেটিং শেখার অনলাইন কোর্স প্ল্যাটফর্ম।',
  keywords: ['অনলাইন কোর্স বাংলাদেশ', 'বাংলা অনলাইন কোর্স', 'ওয়েব ডেভেলপমেন্ট কোর্স', 'গ্রাফিক্স ডিজাইন কোর্স', 'ডিজিটাল মার্কেটিং কোর্স', 'EasySkillBD'],
  applicationName: 'EasySkillBD',
  authors: [{ name: 'EasySkillBD' }],
  creator: 'EasySkillBD',
  publisher: 'EasySkillBD',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    url: siteUrl,
    siteName: 'EasySkillBD',
    title: 'EasySkillBD | নিজের গতিতে স্কিল শিখুন',
    description: 'অভিজ্ঞ মেন্টরদের সাথে বাস্তব প্রজেক্ট করে নিজের ক্যারিয়ার গড়ুন।',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EasySkillBD | নিজের গতিতে স্কিল শিখুন',
    description: 'বাংলাদেশের জন্য আধুনিক অনলাইন স্কিল লার্নিং প্ল্যাটফর্ম।',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  generator: 'v0.app',
  icons: {
    icon: [{ url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64x64-VMguZyujpFt25JoEd725rAkcynnYgL.png', type: 'image/png', sizes: '64x64' }],
    shortcut: ['https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64x64-VMguZyujpFt25JoEd725rAkcynnYgL.png'],
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64x64-VMguZyujpFt25JoEd725rAkcynnYgL.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body className={`${bengaliFont.variable} ${inter.variable} antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
