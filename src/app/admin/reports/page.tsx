'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ReportsPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        window.location.href = '/admin'
        return
      }
      setIsAuthed(true)
      fetchStats()
    }
    checkAuth()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/classes')
      if (response.ok) {
        const data = await response.json()
        setTotalRecords(data.classes?.length || 0)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const downloadCSV = async () => {
    try {
      const response = await fetch('/api/admin/classes')
      if (response.ok) {
        const data = await response.json()
        const classes = data.classes || []

        const csv = [
          ['Reference ID', 'Date', 'Faculty Name', 'Course Title', 'Program', 'Batch', 'Section', 'Start Time', 'Duration (min)', 'Teams Link', 'Remarks'],
          ...classes.map((c: any) => [
            c.reference_id,
            c.class_date,
            c.faculty_name,
            c.course_title,
            c.program,
            c.batch,
            c.section,
            c.start_time,
            c.duration_minutes,
            c.teams_link,
            c.remarks || ''
          ])
        ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `online-classes-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
      }
    } catch (error) {
      console.error('Error downloading:', error)
    }
  }

  if (!isAuthed) return null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 24px', textAlign: 'center', borderBottom: '1px solid #E8EAEF' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>
          Pak-Austria Fachhochschule · School of Computing Sciences
        </p>
      </div>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/logos/paf-iast-logo.png" alt="PAF-IAST" style={{ height: '48px', objectFit: 'contain' }} />
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', color: '#2C5AA0', fontWeight: '600', fontSize: '14px' }}>← Back</Link>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #E8EAEF', padding: '24px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin/dashboard" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Dashboard</Link>
            <Link href="/admin/classes" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📋 All Classes</Link>
            <Link href="/admin/reports" style={{ padding: '12px 16px', backgroundColor: '#F3F5F9', color: '#2C5AA0', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px', fontWeight: '600' }}>📊 Reports & Export</Link>
            <Link href="/admin/cleanup" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>🗑️ Data Cleanup</Link>
            <Link href="/admin/audit-log" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📝 Audit Log</Link>
            <Link href="/admin/settings" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>⚙️ Settings</Link>
          </nav>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>Reports & Export</h1>
          <p style={{ color: '#9CA3AF', marginBottom: '32px' }}>Download your data in various formats</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* CSV Export */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>📥 Export as CSV</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', fontSize: '14px' }}>Total records: {totalRecords}</p>
              <button
                onClick={downloadCSV}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#2C5AA0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Download CSV
              </button>
            </div>

            {/* Statistics */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>📊 Summary Report</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', fontSize: '14px' }}>Quick overview of submissions</p>
              <button
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#2C5AA0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Generate Report
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
