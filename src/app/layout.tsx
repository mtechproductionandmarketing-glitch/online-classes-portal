import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Online Classes Recording & Tracking Portal — School of Computing Sciences',
  description: 'Submit and manage online class records for School of Computing Sciences',
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
