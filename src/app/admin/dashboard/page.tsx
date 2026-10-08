'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ClassRecord {
  id: string
  reference_id: string
  class_date: string
  faculty_name: string
  course_title: string
  program: string
  duration_minutes: number
}

export default function AdminDashboard() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    week: 0,
    month: 0
  })

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken')
      const session = localStorage.getItem('adminSession')

      if (!token || !session) {
        window.location.href = '/admin'
        return
      }

      try {
        const parsedSession = JSON.parse(session)
        if (parsedSession.expires_at && new Date(parsedSession.expires_at * 1000) < new Date()) {
          localStorage.removeItem('adminToken')
          localStorage.removeItem('adminSession')
          window.location.href = '/admin'
          return
        }
      } catch (error) {
        window.location.href = '/admin'
        return
      }

      setIsAuthed(true)
      fetchData()

      // Auto-refresh every 30 seconds per SRS FR-03 (within 60 seconds requirement)
      const interval = setInterval(() => {
        console.log('[Admin Dashboard] Auto-refreshing statistics...')
        fetchData()
      }, 30000)

      return () => clearInterval(interval)
    }

    checkAuth()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/classes')

      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
        setStats(data.stats || { total: 0, today: 0, week: 0, month: 0 })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminSession')
    window.location.href = '/admin'
  }

  if (!isAuthed) return null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header Branding */}
      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 24px', borderBottom: '1px solid #E8EAEF', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>
          School of Computing Sciences
        </p>
      </div>

      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/logos/scs-logo.jpg" alt="SCS" style={{ height: '48px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#C46A1C',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #E8EAEF', padding: '24px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin/dashboard" style={{ padding: '12px 16px', backgroundColor: '#F3F5F9', color: '#2C5AA0', textDecoration: 'none', borderRadius: '4px', fontWeight: '600', fontSize: '14px', display: 'block' }}>
              📊 Dashboard
            </Link>
            <Link href="/admin/classes" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>
              📋 All Classes
            </Link>
            <Link href="/admin/reports" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>
              📊 Reports & Export
            </Link>
            <Link href="/admin/cleanup" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>
              🗑️ Data Cleanup
            </Link>
            <Link href="/admin/audit-log" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>
              📝 Audit Log
            </Link>
            <Link href="/admin/settings" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>
              ⚙️ Settings
            </Link>
            <Link href="/admin/advanced" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>
              ⚡ Advanced Features
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px 24px', maxWidth: '1200px' }}>
          {/* Quick Actions */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <Link
                href="/admin/advanced/email-notifications"
                style={{
                  backgroundColor: '#DC2626',
                  padding: '24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '1px solid #991B1B',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B91C1C')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
              >
                <p style={{ fontSize: '24px', margin: '0' }}>📧</p>
                <p style={{ fontSize: '16px', fontWeight: '600', margin: '0' }}>Send Reminder Emails</p>
                <p style={{ fontSize: '12px', color: '#FEE2E2', margin: '0' }}>Send notifications to teachers who haven't submitted</p>
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>Statistics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px 0' }}>Total Submissions</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>{stats.total}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px 0' }}>Today</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>{stats.today}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px 0' }}>This Week</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>{stats.week}</p>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 8px 0' }}>This Month</p>
                <p style={{ fontSize: '36px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>{stats.month}</p>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E8EAEF', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EAEF' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', margin: '0' }}>Recent Submissions (Last 10)</h2>
            </div>

            {classes.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                <p style={{ margin: '0', fontSize: '16px' }}>No class submissions yet</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E8EAEF' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Ref ID</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Faculty</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Course</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Program</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.slice(0, 10).map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #E8EAEF', backgroundColor: i % 2 === 0 ? '#FAFBFC' : 'white' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#2C5AA0', fontWeight: '600' }}>{row.reference_id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{new Date(row.class_date).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.faculty_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.course_title}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.program}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.duration_minutes} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
