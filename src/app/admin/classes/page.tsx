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
  batch: string
  semester: string
  section: string
  start_time: string
  duration_minutes: number
  teams_link: string
  remarks: string | null
  is_deleted?: boolean
}

type EditForm = {
  class_date: string
  faculty_name: string
  course_title: string
  program: string
  batch: string
  semester: string
  section: string
  start_time: string
  duration_minutes: string
  teams_link: string
  remarks: string
}

const emptyEditForm = (): EditForm => ({
  class_date: '',
  faculty_name: '',
  course_title: '',
  program: '',
  batch: '',
  semester: '',
  section: '',
  start_time: '',
  duration_minutes: '',
  teams_link: '',
  remarks: '',
})

export default function AllClassesPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProgram, setFilterProgram] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm>(emptyEditForm())
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      window.location.href = '/admin'
      return
    }
    setIsAuthed(true)
    fetchData()

    const interval = setInterval(() => {
      fetchData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/classes', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setClasses(data.classes || [])
      } else {
        setMessage('Failed to load classes')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (row: ClassRecord) => {
    setEditingId(row.id)
    setEditErrors({})
    setEditForm({
      class_date: row.class_date || '',
      faculty_name: row.faculty_name || '',
      course_title: row.course_title || '',
      program: row.program || '',
      batch: row.batch || '',
      semester: row.semester || '',
      section: row.section || '',
      start_time: (row.start_time || '').slice(0, 5),
      duration_minutes: String(row.duration_minutes ?? ''),
      teams_link: row.teams_link || '',
      remarks: row.remarks || '',
    })
  }

  const closeEdit = () => {
    setEditingId(null)
    setEditForm(emptyEditForm())
    setEditErrors({})
    setSaving(false)
  }

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return

    setSaving(true)
    setEditErrors({})

    try {
      const response = await fetch(`/api/admin/classes/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const data = await response.json()

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          const map: Record<string, string> = {}
          data.details.forEach((err: { field: string; message: string }) => {
            map[err.field] = err.message
          })
          setEditErrors(map)
        }
        setMessage(`❌ ${data.error || 'Update failed'}`)
        return
      }

      setMessage('✅ Record updated successfully')
      setTimeout(() => setMessage(''), 3000)
      closeEdit()
      await fetchData()
    } catch (error) {
      setMessage(`❌ Error: ${(error as Error).message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return

    try {
      const response = await fetch(`/api/admin/classes/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setClasses(prev => prev.filter(c => c.id !== id))
        if (editingId === id) closeEdit()
        setMessage('✅ Record deleted successfully')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${(error as Error).message}`)
    }
  }

  const filteredClasses = classes.filter(c => {
    if (c.is_deleted) return false

    const haystack = [
      c.faculty_name,
      c.course_title,
      c.reference_id,
      c.batch,
      c.semester,
      c.section,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchSearch = haystack.includes(searchTerm.toLowerCase())
    const matchProgram = !filterProgram || c.program === filterProgram
    return matchSearch && matchProgram
  })

  const programs = [...new Set(classes.filter(c => !c.is_deleted).map(c => c.program))]

  if (!isAuthed) return null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
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

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
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

          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search by faculty, course, batch, semester, or reference ID..."
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
            <button
              onClick={() => { setLoading(true); fetchData() }}
              style={{
                padding: '10px 16px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Refresh
            </button>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E8EAEF', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                <p>Loading classes...</p>
              </div>
            ) : filteredClasses.length === 0 ? (
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
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Batch</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Semester</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Meeting Link</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Duration</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#4B5563' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.map((row, i) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #E8EAEF', backgroundColor: i % 2 === 0 ? '#FAFBFC' : 'white' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#2C5AA0', fontWeight: '600' }}>{row.reference_id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.class_date ? new Date(row.class_date).toLocaleDateString() : '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.faculty_name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.course_title}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.program}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.batch || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.semester || '—'}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563', maxWidth: '180px' }}>
                          {row.teams_link ? (
                            <a
                              href={row.teams_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#2C5AA0', wordBreak: 'break-all' }}
                            >
                              Open link
                            </a>
                          ) : '—'}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', color: '#4B5563' }}>{row.duration_minutes} min</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => openEdit(row)} style={{ padding: '4px 8px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✏️ Edit</button>
                            <button onClick={() => handleDelete(row.id)} style={{ padding: '4px 8px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Delete</button>
                          </div>
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

      {editingId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !saving) closeEdit()
          }}
        >
          <form
            onSubmit={handleSaveEdit}
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', marginBottom: '16px' }}>
              Edit class record
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {([
                ['class_date', 'Class date', 'date'],
                ['start_time', 'Start time', 'time'],
                ['duration_minutes', 'Duration (minutes)', 'text'],
                ['faculty_name', 'Faculty name', 'text'],
                ['course_title', 'Course title', 'text'],
                ['program', 'Program', 'text'],
                ['batch', 'Batch', 'text'],
                ['semester', 'Semester', 'text'],
                ['section', 'Section', 'text'],
              ] as const).map(([name, label, type]) => (
                <div key={name} style={{ gridColumn: name === 'course_title' || name === 'faculty_name' ? '1 / -1' : undefined }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={editForm[name]}
                    onChange={handleEditChange}
                    disabled={saving}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: `2px solid ${editErrors[name] ? '#EF4444' : '#D1D5DB'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                  {editErrors[name] && (
                    <p style={{ marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>{editErrors[name]}</p>
                  )}
                </div>
              ))}

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                  Meeting / class link (required)
                </label>
                <input
                  type="url"
                  name="teams_link"
                  value={editForm.teams_link}
                  onChange={handleEditChange}
                  disabled={saving}
                  required
                  placeholder="https://teams.microsoft.com/... or meet.google.com/... or zoom.us/..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: `2px solid ${editErrors.teams_link ? '#EF4444' : '#D1D5DB'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ marginTop: '4px', fontSize: '12px', color: '#6B7280' }}>
                  Teams, Google Meet, Zoom, or any other valid HTTPS meeting link.
                </p>
                {editErrors.teams_link && (
                  <p style={{ marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>{editErrors.teams_link}</p>
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#374151' }}>
                  Remarks (optional)
                </label>
                <textarea
                  name="remarks"
                  value={editForm.remarks}
                  onChange={handleEditChange}
                  disabled={saving}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: `2px solid ${editErrors.remarks ? '#EF4444' : '#D1D5DB'}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
                {editErrors.remarks && (
                  <p style={{ marginTop: '4px', fontSize: '12px', color: '#DC2626' }}>{editErrors.remarks}</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#2C5AA0',
                  color: 'white',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
