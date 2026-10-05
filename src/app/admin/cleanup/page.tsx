'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CleanupPage() {
  const [loading, setLoading] = useState(false)

  const handleDeleteAllData = async () => {
    if (!window.confirm('Are you absolutely sure? This will DELETE ALL class records permanently!')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/delete-all', { method: 'POST' })
      const data = await response.json()

      if (response.ok) {
        alert(`✅ SUCCESS! All data deleted.\nRemaining records: ${data.remaining || 0}`)
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      alert(`❌ Error: ${(error as any).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 24px', textAlign: 'center', borderBottom: '1px solid #E8EAEF' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>Pak-Austria Fachhochschule · School of Computing Sciences</p>
      </div>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '16px 24px' }}>
        <img src="/logos/paf-iast-logo.png" alt="PAF-IAST" style={{ height: '48px', objectFit: 'contain' }} />
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        <aside style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #E8EAEF', padding: '24px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin/dashboard" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Dashboard</Link>
            <Link href="/admin/classes" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📋 All Classes</Link>
            <Link href="/admin/reports" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Reports</Link>
            <Link href="/admin/cleanup" style={{ padding: '12px 16px', backgroundColor: '#F3F5F9', color: '#2C5AA0', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px', fontWeight: '600' }}>🗑️ Data Cleanup</Link>
            <Link href="/admin/audit-log" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📝 Audit Log</Link>
            <Link href="/admin/settings" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>⚙️ Settings</Link>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '24px' }}>Data Cleanup</h1>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>⚠️ Delete All Data</h2>
            <p style={{ color: '#9CA3AF', marginBottom: '16px' }}>Permanently delete ALL class records from database</p>
            <button
              onClick={handleDeleteAllData}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: loading ? '#D1D5DB' : '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Deleting...' : '🗑️ DELETE ALL DATA'}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
