import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Online Classes Recording & Tracking Portal — Pak-Austria Fachhochschule',
  description: 'Submit and manage online class records for Pak-Austria Fachhochschule',
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
