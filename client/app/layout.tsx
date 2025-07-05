import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Axion-POS',
  description: 'Custom POS made for chai queens by axion developers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
