'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function EmailTemplatesPage() {
  const [subject, setSubject] = useState('Class Not Submitted - Action Required')
  const [body, setBody] = useState(
    `Dear {teacher_name},

You were scheduled to teach {course_title} at {class_time} on Friday.
Class: {batch} - {section}

We noticed that you haven't submitted the class record yet. Please submit it as soon as possible.

Emails will be sent from: muhammad.kashif@paf-iast.edu.pk (Chairman)

Thank you,
School of Computing Sciences`
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/advanced/email-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body })
      })

      if (response.ok) {
        setMessage('✅ Template saved successfully!')
      } else {
        setMessage('❌ Failed to save template')
      }
    } catch (error) {
      setMessage(`❌ Error: ${(error as any).message}`)
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
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
        <main style={{ flex: 1, padding: '32px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '24px' }}>✉️ Email Templates</h1>

          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FEF3C7', borderRadius: '6px', border: '1px solid #FCD34D' }}>
              <p style={{ fontSize: '14px', color: '#92400E', margin: '0' }}>
                <strong>Available Variables:</strong> {'{teacher_name}'}, {'{course_title}'}, {'{class_time}'}, {'{batch}'}, {'{section}'}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Email Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={15}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            {message && (
              <div style={{
                marginBottom: '24px',
                padding: '12px 16px',
                backgroundColor: message.includes('✅') ? '#DCFCE7' : '#FEE2E2',
                color: message.includes('✅') ? '#166534' : '#991B1B',
                borderRadius: '6px',
                fontSize: '14px'
              }}>
                {message}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: saving ? '#D1D5DB' : '#2C5AA0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {saving ? '⏳ Saving...' : '💾 Save Template'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
