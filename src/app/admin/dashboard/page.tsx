'use client'

import { useEffect, useState } from 'react'

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
          Pak-Austria Fachhochschule · School of Computing Sciences
        </p>
      </div>

      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/logos/paf-iast-logo.png" alt="PAF-IAST" style={{ height: '48px', objectFit: 'contain' }} />
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

      {/* Main Content */}
      <main style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
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

        {/* Recent Submissions Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E8EAEF', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8EAEF' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', margin: '0' }}>Recent Submissions</h2>
          </div>

          {classes.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
              <p style={{ margin: '0', fontSize: '16px' }}>No class submissions yet</p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>Faculty can submit classes from the portal</p>
            </div>
          ) : (
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
                  {classes.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #E8EAEF', backgroundColor: i % 2 === 0 ? '#FAFBFC' : 'white' }}>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#2C5AA0', fontWeight: '600' }}>{row.reference_id}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{new Date(row.class_date).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.faculty_name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.course_title}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.program}</td>
                      <td style={{ padding: '12px 16px', fontSize: '14px', color: '#4B5563' }}>{row.duration_minutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
