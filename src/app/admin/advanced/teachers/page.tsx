'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Teacher {
  id: string
  name: string
  email: string
  title: string
  course: string
  class_time: string
  batch: string
  section: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/admin/advanced/teachers')
      if (response.ok) {
        const data = await response.json()
        setTeachers(data.teachers || [])
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        await fetch(`/api/admin/advanced/teachers/${id}`, { method: 'DELETE' })
        fetchTeachers()
      } catch (error) {
        console.error('Error deleting teacher:', error)
      }
    }
  }

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 16px', textAlign: 'center', borderBottom: '1px solid #E8EAEF' }}>
        <p style={{ fontSize: '11px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>School of Computing Sciences</p>
      </div>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src="/logos/scs-logo.jpg" alt="SCS" style={{ height: '40px', objectFit: 'contain' }} />
        <Link href="/admin/advanced" style={{ textDecoration: 'none', color: '#2C5AA0', fontWeight: '600', fontSize: '14px' }}>← Back</Link>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        <main style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '24px' }}>👥 Teacher Management</h1>

          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF', marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {loading ? (
              <p style={{ color: '#9CA3AF' }}>Loading teachers...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>No teachers found</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E8EAEF' }}>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Course</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Time</th>
                      <th style={{ textAlign: 'left', padding: '12px', fontWeight: '600', color: '#374151' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((teacher) => (
                      <tr key={teacher.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '12px', color: '#1A1A1A' }}>{teacher.name}</td>
                        <td style={{ padding: '12px', color: '#1A1A1A', fontSize: '12px' }}>{teacher.email}</td>
                        <td style={{ padding: '12px', color: '#1A1A1A' }}>{teacher.course}</td>
                        <td style={{ padding: '12px', color: '#1A1A1A' }}>{teacher.class_time}</td>
                        <td style={{ padding: '12px' }}>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#EF4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
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
