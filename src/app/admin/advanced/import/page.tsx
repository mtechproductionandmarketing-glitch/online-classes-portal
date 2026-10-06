'use client'

import Link from 'next/link'
import { useState, useRef } from 'react'

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile)
        setMessage('')
      } else {
        setMessage('❌ Please select a valid Excel or CSV file')
        setSuccess(false)
      }
    }
  }

  const handleImport = async () => {
    if (!file) {
      setMessage('❌ Please select a file first')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/advanced/import-teachers', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ Success! Imported ${data.imported || 0} teachers`)
        setSuccess(true)
        setFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setMessage(`❌ ${data.error || 'Import failed'}`)
        setSuccess(false)
      }
    } catch (error) {
      setMessage(`❌ Error: ${(error as any).message}`)
      setSuccess(false)
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
        <main style={{ flex: 1, padding: '32px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '24px' }}>📥 Import Teachers</h1>

          <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', border: '1px solid #E8EAEF' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>Import Friday Class Schedule</h2>

            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#F0F9FF', borderRadius: '6px', border: '1px solid #BDE0FE' }}>
              <p style={{ fontSize: '14px', color: '#1E40AF', margin: '0' }}>
                <strong>Required Excel Columns:</strong>
              </p>
              <ul style={{ margin: '8px 0 0 20px', fontSize: '14px', color: '#1E40AF' }}>
                <li>Teacher Name</li>
                <li>Teacher Email</li>
                <li>Teacher Title</li>
                <li>Course Title</li>
                <li>Class Time (9 AM - 5 PM)</li>
                <li>Batch</li>
                <li>Section</li>
              </ul>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Select Excel File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {file && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#059669' }}>
                  ✅ Selected: {file.name}
                </p>
              )}
            </div>

            {message && (
              <div style={{
                marginBottom: '24px',
                padding: '12px 16px',
                backgroundColor: success ? '#DCFCE7' : '#FEE2E2',
                color: success ? '#166534' : '#991B1B',
                borderRadius: '6px',
                fontSize: '14px',
                border: `1px solid ${success ? '#BBF7D0' : '#FECACA'}`
              }}>
                {message}
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!file || loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: !file || loading ? '#D1D5DB' : '#2C5AA0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: !file || loading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {loading ? '⏳ Importing...' : '📤 Import Teachers'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
