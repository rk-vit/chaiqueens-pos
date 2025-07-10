import type { Metadata } from 'next'
import './globals.css'
import ClientSessionProvider from './clientSessionProvider'

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
      <body>
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  )
}
