import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Splitwise Clone',
  description: 'Simple expense sharing app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}