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
  is_deleted?: boolean
}

export default function AllClassesPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProgram, setFilterProgram] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        window.location.href = '/admin'
        return
      }
      setIsAuthed(true)
      fetchData()

      // Auto-refresh every 30 seconds per SRS FR-03 (within 60 seconds requirement)
      const interval = setInterval(() => {
        console.log('[Admin Dashboard] Auto-refreshing data...')
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
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Failed to load classes')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      const response = await fetch(`/api/admin/classes/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setClasses(classes.filter(c => c.id !== id))
        setMessage('✅ Record deleted successfully')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${(error as any).message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredClasses = classes.filter(c => {
    // Filter out soft-deleted records
    if (c.is_deleted) return false

    const matchSearch = c.faculty_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.reference_id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchProgram = !filterProgram || c.program === filterProgram
    return matchSearch && matchProgram
  })

  const programs = [...new Set(classes.filter(c => !c.is_deleted).map(c => c.program))]

  if (!isAuthed) return null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 24px', textAlign: 'center', borderBottom: '1px solid #E8EAEF' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>
          School of Computing Sciences
        </p>
      </div>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/logos/scs-logo.jpg" alt="SCS" style={{ height: '48px', objectFit: 'contain' }} />
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', color: '#2C5AA0', fontWeight: '600', fontSize: '14px' }}>← Back to Dashboard</Link>
        </div>
      </header>

      {/* Content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        {/* Sidebar */}
        <aside style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #E8EAEF', padding: '24px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin/dashboard" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>
              📊 Dashboard
            </Link>
            <Link href="/admin/classes" style={{ padding: '12px 16px', backgroundColor: '#F3F5F9', color: '#2C5AA0', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px', fontWeight: '600' }}>
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
          </nav>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px' }}>All Classes</h1>
          <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Total: {filteredClasses.length} submissions</p>

          {message && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '16px',
              borderRadius: '6px',
              backgroundColor: message.includes('✅') ? '#D1FAE5' : '#FEE2E2',
              color: message.includes('✅') ? '#065F46' : '#991B1B',
              border: `1px solid ${message.includes('✅') ? '#6EE7B7' : '#FECACA'}`
            }}>
              {message}
            </div>
          )}

          {/* Filters */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search by faculty, course, or reference ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              style={{
                padding: '10px 12px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                minWidth: '150px'
              }}
            >
              <option value="">All Programs</option>
              {programs.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E8EAEF', overflow: 'hidden' }}>
            {filteredClasses.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                <p>No classes found</p>
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
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #E8EAEF', backgroundColor: i % 2 === 0 ? '#FAFBFC' : 'white' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#2C5AA0', fontWeight: '600' }}>{row.reference_id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{new Date(row.class_date).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.faculty_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.course_title}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.program}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.duration_minutes} min</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => setEditingId(row.id)} style={{ padding: '4px 8px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(row.id)} style={{ padding: '4px 8px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                        </td>
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
