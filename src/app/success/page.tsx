'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getClassById, OnlineClass } from '@/lib/database'
import { ErrorAlert } from '@/components/ErrorAlert'

export default function SuccessPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-paf-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-paf-blue/20">
        <div className="page-container">
          <div className="flex items-center gap-4 py-4">
            <div className="w-12 h-12 bg-paf-blue rounded-lg flex items-center justify-center text-white font-bold">
              PAF
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-barlow font-bold text-paf-dark-blue">
                Online Classes Recording & Tracking Portal
              </h1>
            </div>
          </div>
        </div>
      </header>

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

            <h1 className="text-3xl md:text-4xl font-barlow font-bold text-paf-dark-blue mb-2">
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
              <h3 className="font-barlow font-bold text-paf-blue mb-3">What's next?</h3>
              <ul className="text-sm text-paf-gray space-y-2">
                <li>✓ Your class is immediately visible to administrators</li>
                <li>✓ The record will be included in their reports and statistics</li>
                <li>✓ No further action is needed from you</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-barlow font-bold text-green-700 mb-3">Troubleshooting</h3>
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
      <footer className="border-t border-paf-blue/20 mt-12 py-6 bg-white/50">
        <div className="page-container text-center text-sm text-paf-gray">
          <p>
            Pak-Austria Fachhochschule: Institute of Applied Sciences and Technology · Online Classes
            Recording & Tracking Portal
          </p>
        </div>
      </footer>
    </div>
  )
}
