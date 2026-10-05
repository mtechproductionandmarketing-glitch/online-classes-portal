'use client'

import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [isAuthed, setIsAuthed] = useState(false)

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
        // Verify session is still valid
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
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin'
  }

  if (!isAuthed) return null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F3F5F9' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img
            src="/logos/paf-iast-logo.png"
            alt="PAF-IAST"
            style={{ height: '48px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C5AA0' }}>
              Admin Dashboard
            </p>
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

      {/* Sidebar & Content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '200px', backgroundColor: 'white', borderRight: '1px solid #E8EAEF', padding: '24px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="#" style={{ padding: '12px 16px', backgroundColor: '#F3F5F9', color: '#2C5AA0', textDecoration: 'none', borderRadius: '4px', fontWeight: '600', fontSize: '14px' }}>Dashboard</a>
            <a href="#" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px' }}>All online classes</a>
            <a href="#" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px' }}>Reports & export</a>
            <a href="#" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px' }}>Data cleanup</a>
            <a href="#" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px' }}>Audit log</a>
            <a href="#" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px' }}>Settings</a>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>Dashboard</h1>
            <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '24px' }}>Online classes reported by faculty, by class date.</p>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>Total online classes</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A' }}>248</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>Today</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A' }}>12</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>This week</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A' }}>46</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>This month</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A' }}>156</p>
            </div>
          </div>

          {/* Data Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Faculty', value: '38' },
              { label: 'Programs', value: '5' },
              { label: 'Batches', value: '9' },
              { label: 'Sections', value: '14' }
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>{item.label}</p>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#2C5AA0' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Submissions Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #E8EAEF' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A1A' }}>Recent submissions</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E8EAEF' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Reference ID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Faculty</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Course</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Program</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'OC-261904-0017', date: '04 Oct 2026', faculty: 'Faculty A', course: 'Data Structures', program: 'BS CS', duration: '90 min' },
                    { id: 'OC-261904-0016', date: '04 Oct 2026', faculty: 'Faculty B', course: 'Machine Learning', program: 'BS AI', duration: '60 min' },
                    { id: 'OC-261904-0015', date: '04 Oct 2026', faculty: 'Faculty C', course: 'Network Security', program: 'BS CYS', duration: '90 min' },
                    { id: 'OC-261903-0001', date: '03 Oct 2026', faculty: 'Faculty D', course: 'Software Requirements', program: 'BS SE', duration: '75 min' },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E8EAEF', backgroundColor: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#2C5AA0', fontWeight: '600' }}>{row.id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.faculty}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.course}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.program}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
