import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Online Classes Portal Admin',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
