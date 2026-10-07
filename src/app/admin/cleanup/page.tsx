'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CleanupPage() {
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDeleteAllData = async () => {
    try {
      const response = await fetch('/api/admin/delete-all', { method: 'POST' })
      const data = await response.json()

      if (response.ok) {
        alert(`✅ SUCCESS! All data deleted.\nRemaining records: ${data.remaining || 0}`)
        setShowConfirm(false)
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
      <style>{`
        @media (max-width: 767px) {
          .mobile-header-text { font-size: 10px !important; }
          .mobile-logo { height: 36px !important; }
          .mobile-container { flex-direction: column !important; }
          .mobile-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid #E8EAEF !important; padding: 12px !important; }
          .mobile-nav { flex-direction: row !important; gap: 6px !important; overflow-x: auto !important; }
          .mobile-nav a { padding: 8px 12px !important; font-size: 12px !important; white-space: nowrap !important; }
          .mobile-main { padding: 16px 12px !important; }
          .mobile-main h1 { font-size: 20px !important; margin-bottom: 12px !important; }
          .mobile-card { padding: 16px !important; max-width: 100% !important; }
          .mobile-button { font-size: 14px !important; padding: 10px 12px !important; }
        }
      `}</style>

      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 16px', textAlign: 'center', borderBottom: '1px solid #E8EAEF' }}>
        <p className="mobile-header-text" style={{ fontSize: '12px', fontWeight: '700', color: '#2C5AA0', margin: '0' }}>School of Computing Sciences</p>
      </div>

      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '12px 16px' }}>
        <img src="/logos/scs-logo.jpg" alt="SCS" className="mobile-logo" style={{ height: '48px', objectFit: 'contain' }} />
      </header>

      <div className="mobile-container" style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>
        <aside className="mobile-sidebar" style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #E8EAEF', padding: '24px' }}>
          <nav className="mobile-nav" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/admin/dashboard" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Dashboard</Link>
            <Link href="/admin/classes" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📋 All Classes</Link>
            <Link href="/admin/reports" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📊 Reports</Link>
            <Link href="/admin/cleanup" style={{ padding: '12px 16px', backgroundColor: '#F3F5F9', color: '#2C5AA0', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px', fontWeight: '600' }}>🗑️ Cleanup</Link>
            <Link href="/admin/audit-log" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>📝 Audit</Link>
            <Link href="/admin/settings" style={{ padding: '12px 16px', color: '#4B5563', textDecoration: 'none', fontSize: '14px', display: 'block', borderRadius: '4px' }}>⚙️ Settings</Link>
          </nav>
        </aside>

        <main className="mobile-main" style={{ flex: 1, padding: '32px 24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', marginBottom: '24px' }}>Data Cleanup</h1>
          <div className="mobile-card" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E8EAEF', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px' }}>⚠️ Delete All Data</h2>
            <p style={{ color: '#9CA3AF', marginBottom: '16px' }}>Permanently delete ALL class records from database</p>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className="mobile-button"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: loading ? '#D1D5DB' : '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Deleting...' : '🗑️ DELETE ALL DATA'}
            </button>

            {showConfirm && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#EF4444', marginBottom: '12px' }}>⚠️ Are you absolutely sure?</h3>
                  <p style={{ color: '#6B7280', marginBottom: '24px' }}>This will DELETE ALL class records permanently from the database. This action cannot be undone.</p>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '10px 16px', backgroundColor: '#E5E7EB', color: '#1F2937', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleDeleteAllData} disabled={loading} style={{ flex: 1, padding: '10px 16px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>Delete All</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
