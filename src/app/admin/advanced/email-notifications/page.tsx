'use client'

import Link from 'next/link'
import { useState } from 'react'

interface EmailResponse {
  success: boolean
  message: string
  emailsSent: number
  missingCount: number
  missingTeachers?: Array<{ name: string; email: string; course: string }>
  errors?: string[]
}

export default function EmailNotificationsPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EmailResponse | null>(null)
  const [error, setError] = useState('')

  const handleSendEmails = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/admin/advanced/send-missing-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to send emails')
      }
    } catch (err) {
      setError(`Error: ${(err as any).message}`)
    } finally {
      setLoading(false)
    }
  }

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
        <main style={{ flex: 1, padding: '32px 24px', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '24px' }}>📧 Send Missing Teacher Emails</h1>

          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', border: '1px solid #E8EAEF', marginBottom: '24px' }}>
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#DBEAFE', borderRadius: '6px', border: '1px solid #93C5FD' }}>
              <p style={{ fontSize: '14px', color: '#1E40AF', margin: '0', lineHeight: '1.6' }}>
                <strong>ℹ️ What this does:</strong> Compares all imported teachers with submitted class records from the past 7 days. Teachers who haven't submitted are marked as missing. Personalized reminder emails will be sent to them using the configured email template.
              </p>
            </div>

            <button
              onClick={handleSendEmails}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: loading ? '#D1D5DB' : '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                marginBottom: '24px'
              }}
            >
              {loading ? '⏳ Checking and Sending Emails...' : '🚀 Send Missing Teacher Reminder Emails'}
            </button>

            {error && (
              <div style={{
                marginBottom: '24px',
                padding: '14px',
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                borderRadius: '6px',
                border: '1px solid #FECACA',
                fontSize: '14px'
              }}>
                ❌ {error}
              </div>
            )}

            {result && (
              <div>
                <div style={{
                  marginBottom: '24px',
                  padding: '14px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  borderRadius: '6px',
                  border: '1px solid #BBF7D0',
                  fontSize: '14px'
                }}>
                  ✅ {result.message}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '6px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>Missing Teachers</p>
                    <p style={{ margin: '0', fontSize: '24px', fontWeight: '700', color: '#2C5AA0' }}>{result.missingCount}</p>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '6px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>Emails Sent</p>
                    <p style={{ margin: '0', fontSize: '24px', fontWeight: '700', color: '#10B981' }}>{result.emailsSent}</p>
                  </div>
                </div>

                {result.missingTeachers && result.missingTeachers.length > 0 && (
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1A1A1A', marginBottom: '12px' }}>Missing Teachers:</h2>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #E8EAEF', backgroundColor: '#F9FAFB' }}>
                            <th style={{ textAlign: 'left', padding: '10px', fontWeight: '600', color: '#374151' }}>Name</th>
                            <th style={{ textAlign: 'left', padding: '10px', fontWeight: '600', color: '#374151' }}>Email</th>
                            <th style={{ textAlign: 'left', padding: '10px', fontWeight: '600', color: '#374151' }}>Course</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.missingTeachers.map((teacher, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                              <td style={{ padding: '10px', color: '#1A1A1A' }}>{teacher.name}</td>
                              <td style={{ padding: '10px', color: '#1A1A1A', fontSize: '12px' }}>{teacher.email}</td>
                              <td style={{ padding: '10px', color: '#1A1A1A' }}>{teacher.course}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {result.errors && result.errors.length > 0 && (
                  <div style={{ marginTop: '24px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#DC2626', marginBottom: '12px' }}>⚠️ Errors:</h2>
                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                      {result.errors.map((err, idx) => (
                        <li key={idx} style={{ color: '#DC2626', marginBottom: '6px', fontSize: '13px' }}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
