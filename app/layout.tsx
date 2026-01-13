import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Educify - The Open Knowledge Platform',
  description: 'The open platform for limitless learning. Host premium courses, stream live workshops, and certify the next generation of engineers.',
  icons: {
    icon: '/icon.png?v=3',
    shortcut: '/icon.png?v=3',
    apple: '/icon.png?v=3',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans ${jetbrainsMono.variable} antialiased bg-[#FDFBF7] text-[#1A1916] bg-pattern min-h-screen flex flex-col`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
