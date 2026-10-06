'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function AdvancedPage() {
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        window.location.href = '/admin'
        return
      }
      setIsAuthed(true)
    }
    checkAuth()
  }, [])

  if (!isAuthed) return null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 16px', textAlign: 'center', borderBottom: '1px solid #E8EAEF' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>School of Computing Sciences</p>
      </div>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/logos/scs-logo.jpg" alt="SCS" style={{ height: '40px', objectFit: 'contain' }} />
        <Link href="/admin/dashboard" style={{ textDecoration: 'none', color: '#2C5AA0', fontWeight: '600', fontSize: '14px' }}>← Back</Link>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        <aside style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #E8EAEF', padding: '24px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin/dashboard" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Dashboard</Link>
            <Link href="/admin/classes" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📋 All Classes</Link>
            <Link href="/admin/reports" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Reports</Link>
            <Link href="/admin/cleanup" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>🗑️ Cleanup</Link>
            <Link href="/admin/advanced" style={{ padding: '12px 16px', backgroundColor: '#F3F5F9', color: '#2C5AA0', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px', fontWeight: '600' }}>⚙️ Advanced</Link>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '24px' }}>Advanced Features</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Import Teachers */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>📥 Import Teachers</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', fontSize: '14px' }}>
                Upload Excel file with teacher schedule (Friday classes only)
              </p>
              <Link
                href="/admin/advanced/import"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#2C5AA0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Go to Import
              </Link>
            </div>

            {/* Email Templates */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>✉️ Email Templates</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', fontSize: '14px' }}>
                Edit email template for missing class notifications
              </p>
              <Link
                href="/admin/advanced/email-templates"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#2C5AA0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Edit Templates
              </Link>
            </div>

            {/* Teacher Management */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>👥 Teacher Management</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', fontSize: '14px' }}>
                Manage imported teachers and their schedules
              </p>
              <Link
                href="/admin/advanced/teachers"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#2C5AA0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Manage Teachers
              </Link>
            </div>

            {/* Email Notifications */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '12px' }}>📧 Send Reminder Emails</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', fontSize: '14px' }}>
                Send automated reminders to teachers who haven't submitted classes
              </p>
              <Link
                href="/admin/advanced/email-notifications"
                style={{
                  display: 'inline-block',
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Send Emails
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
