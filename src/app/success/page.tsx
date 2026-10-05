'use client'

export const dynamic = 'force-dynamic'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { getClassById, OnlineClass } from '@/lib/database'
import { ErrorAlert } from '@/components/ErrorAlert'

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const refId = searchParams.get('ref')

  const [classRecord, setClassRecord] = useState<OnlineClass | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!refId) {
      setError('No Reference ID provided. Redirecting to home...')
      setTimeout(() => router.push('/'), 2000)
      return
    }

    // Fetch class details using reference ID
    const fetchClass = async () => {
      try {
        setLoading(true)
        // Note: In a real implementation, we'd query by reference_id
        // For now, this is a placeholder - the actual implementation
        // would fetch from the database using the reference ID
        setClassRecord(null) // Will be populated by actual database query
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch record')
      } finally {
        setLoading(false)
      }
    }

    fetchClass()
  }, [refId, router])

  const handleSubmitAnother = () => {
    router.push('/')
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paf-light flex items-center justify-center">
        <div className="max-w-md w-full">
          <ErrorAlert type="error" title="Error" message={error} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-white)' }}>
      {/* Navigation Bar */}
      <nav className="navbar" style={{ borderBottom: '2px solid var(--color-primary-blue)' }}>
        <div className="flex items-center justify-between w-full gap-4">
          {/* Left Logo Section */}
          <div className="flex items-center gap-6">
            {/* PAF-IAST Logo */}
            <img
              src="/logos/paf-iast-logo.png"
              alt="PAF-IAST Logo"
              className="h-12"
              style={{ objectFit: 'contain' }}
            />

            {/* Text Branding */}
            <div className="border-l-2 border-gray-300 pl-6">
              <p className="font-bold text-sm" style={{ color: 'var(--color-primary-blue)' }}>
                Pak-Austria Fachhochschule
              </p>
              <p className="text-xs" style={{ color: 'var(--color-secondary-orange)' }}>
                Institute of Applied Sciences and Technology
              </p>
              <p className="text-xs font-semibold text-gray-700">
                School of Computing Sciences
              </p>
            </div>

            {/* SCS Logo */}
            <img
              src="/logos/scs-logo.jpg"
              alt="SCS Logo"
              className="h-12"
              style={{ objectFit: 'contain' }}
            />
          </div>

          {/* Right Side - Title */}
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold" style={{ color: 'var(--color-primary-blue)' }}>
              Online Classes Portal
            </p>
          </div>
        </div>
      </nav>

      {/* Hero Section - Success Page */}
      <section className="hero-section" style={{
        backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.7), rgba(16, 185, 129, 0.7)), url("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=600&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="hero-content">
          <div className="mb-8">
            <span className="text-green-100 font-semibold text-sm tracking-widest">SUCCESS</span>
          </div>
          <h1 className="hero-title">Class Recording Submitted</h1>
          <p className="hero-subtitle">
            Your record has been saved successfully. Keep this Reference ID for your records.
          </p>
        </div>
      </section>

      {/* Main content */}
      <main className="page-container py-8 md:py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success message */}
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">✓</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-paf-dark-blue mb-2">
              Online class submitted
            </h1>
            <p className="text-paf-gray text-lg">
              Your record has been saved. Keep this Reference ID for your records.
            </p>
          </div>

          {/* Reference ID card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold text-paf-gray uppercase tracking-wide mb-3">
                Reference ID
              </p>
              <p className="font-mono text-4xl font-bold text-paf-blue break-all">
                {refId || 'Loading...'}
              </p>
              <p className="text-xs text-paf-gray mt-2">
                Save this ID for your records
              </p>
            </div>

            {/* Class details (if loaded) */}
            {classRecord && (
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-paf-gray uppercase">Class Date</p>
                    <p className="text-lg font-semibold text-paf-dark-blue">
                      {new Date(classRecord.class_date).toLocaleDateString()}, {classRecord.start_time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-paf-gray uppercase">Faculty</p>
                    <p className="text-lg font-semibold text-paf-dark-blue">
                      {classRecord.faculty_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-paf-gray uppercase">Course</p>
                    <p className="text-lg font-semibold text-paf-dark-blue">
                      {classRecord.course_title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-paf-gray uppercase">Program · Section</p>
                    <p className="text-lg font-semibold text-paf-dark-blue">
                      {classRecord.program} · {classRecord.section}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder for class details if loading */}
            {loading && (
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Info boxes */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-paf-blue mb-3">What's next?</h3>
              <ul className="text-sm text-paf-gray space-y-2">
                <li>✓ Your class is immediately visible to administrators</li>
                <li>✓ The record will be included in their reports and statistics</li>
                <li>✓ No further action is needed from you</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-700 mb-3">Troubleshooting</h3>
              <ul className="text-sm text-paf-gray space-y-2">
                <li>✓ Lost your Reference ID? Contact administration</li>
                <li>✓ Need to edit? Contact your administrator</li>
                <li>✓ Questions? Refer to the help section</li>
              </ul>
            </div>
          </div>

          {/* Action button */}
          <div className="text-center">
            <button onClick={handleSubmitAnother} className="btn-primary text-lg px-12 py-4">
              Submit another class
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-paf-blue/20 mt-12 py-12 bg-white/50">
        <div className="page-container">
          <div className="flex flex-col items-center justify-center gap-8 mb-8">
            <div className="flex gap-8 items-center justify-center flex-wrap">
              <img
                src="/logos/paf-iast-logo.png"
                alt="PAF-IAST Logo"
                className="h-16"
              />
              <img
                src="/logos/scs-logo.jpg"
                alt="SCS Logo"
                className="h-16"
              />
            </div>
          </div>
          <div className="text-center text-sm text-paf-gray">
            <p>
              Pak-Austria Fachhochschule: Institute of Applied Sciences and Technology · Online Classes
              Recording & Tracking Portal
            </p>
            <p className="mt-4">© 2026 PAF-IAST. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  )
}
