'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { validateFacultySubmission } from '@/lib/validation'

interface FormErrors {
  [key: string]: string
}

export default function FacultyForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    class_date: '',
    faculty_name: '',
    course_title: '',
    batch: '',
    program: '',
    section: '',
    start_time: '',
    duration_minutes: '',
    teams_link: '',
    remarks: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError('')

    const validation = validateFacultySubmission(formData)
    if (!validation.valid) {
      const errorMap: FormErrors = {}
      validation.errors.forEach(err => {
        errorMap[err.field] = err.message
      })
      setErrors(errorMap)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          idempotency_key: uuidv4(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitError(data.error || 'Failed to submit class. Please try again.')
        return
      }

      router.push(`/success?ref=${data.reference_id}`)
    } catch (error) {
      setSubmitError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("/campus-bg.jpg")',
      backgroundAttachment: 'fixed',
    }}>
      <div className="min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-3xl">
          {/* Header with Branding */}
          <div className="mb-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <img src="/logos/paf-iast-logo.png" alt="PAF-IAST" className="h-14" style={{ objectFit: 'contain' }} />
              <img src="/logos/scs-logo.jpg" alt="SCS" className="h-14" style={{ objectFit: 'contain' }} />
            </div>
            <div className="mb-4">
              <p className="text-sm font-semibold opacity-90">Pak-Austria Fachhochschule · School of Computing Sciences</p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Submit your online class record
            </h1>
            <p className="text-lg opacity-90">
              No login needed. Fill in all details below and get an instant Reference ID.
            </p>
          </div>

          {/* Form Card - Excel-style */}
          <div className="bg-white rounded-lg shadow-2xl p-0 overflow-hidden border-2" style={{ borderColor: 'var(--color-primary-blue)' }}>
            {submitError && (
              <div className="p-4 bg-red-50 border-b-2 border-red-500 text-red-700">
                <p className="font-semibold">❌ Error</p>
                <p>{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="">
              {/* Section 1 */}
              <div className="border-b-2" style={{ borderColor: 'var(--color-primary-blue)' }}>
                <div className="px-8 py-4" style={{ backgroundColor: 'var(--color-primary-blue)', color: 'white' }}>
                  <h2 className="text-xl font-bold">
                    1. When was the class?
                  </h2>
                </div>
                <div className="px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class date</label>
                    <input
                      type="date"
                      name="class_date"
                      value={formData.class_date}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                        errors.class_date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                      }`}
                      placeholder="mm/dd/yyyy"
                    />
                    {errors.class_date && <p className="mt-1 text-sm text-red-600">{errors.class_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Class start time</label>
                    <input
                      type="time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                        errors.start_time ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                      }`}
                    />
                    {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="text"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="e.g. 90"
                      className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                        errors.duration_minutes ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                      }`}
                    />
                    {errors.duration_minutes && <p className="mt-1 text-sm text-red-600">{errors.duration_minutes}</p>}
                  </div>
                </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="border-b-2" style={{ borderColor: 'var(--color-primary-blue)' }}>
                <div className="px-8 py-4" style={{ backgroundColor: 'var(--color-secondary-orange)', color: 'white' }}>
                  <h2 className="text-xl font-bold">
                    2. Who taught, and which class?
                  </h2>
                </div>
                <div className="px-8 py-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Faculty name</label>
                    <input
                      type="text"
                      name="faculty_name"
                      value={formData.faculty_name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="Your full name"
                      className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                        errors.faculty_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                      }`}
                    />
                    {errors.faculty_name && <p className="mt-1 text-sm text-red-600">{errors.faculty_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course title</label>
                    <input
                      type="text"
                      name="course_title"
                      value={formData.course_title}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="e.g. Data Structures and Algorithms"
                      className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                        errors.course_title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                      }`}
                    />
                    {errors.course_title && <p className="mt-1 text-sm text-red-600">{errors.course_title}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Program</label>
                      <input
                        type="text"
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. BS Computer Science"
                        className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                          errors.program ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.program && <p className="mt-1 text-sm text-red-600">{errors.program}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Batch</label>
                      <input
                        type="text"
                        name="batch"
                        value={formData.batch}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. Fall 2024"
                        className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                          errors.batch ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.batch && <p className="mt-1 text-sm text-red-600">{errors.batch}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                      <input
                        type="text"
                        name="section"
                        value={formData.section}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. Blue or Blue + Green"
                        className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                          errors.section ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.section && <p className="mt-1 text-sm text-red-600">{errors.section}</p>}
                    </div>
                  </div>
                </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="border-b-2" style={{ borderColor: 'var(--color-primary-blue)' }}>
                <div className="px-8 py-4" style={{ backgroundColor: 'var(--color-primary-blue)', color: 'white' }}>
                  <h2 className="text-xl font-bold">
                    3. Meeting link
                  </h2>
                </div>

                <div className="px-8 py-6">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">MS Teams link</label>
                  <input
                    type="text"
                    name="teams_link"
                    value={formData.teams_link}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="https://teams.microsoft.com/l/meetup-join/..."
                    className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                      errors.teams_link ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  <p className="mt-1 text-sm text-gray-600">Paste the full link of the class meeting. Only the link is needed, no recording.</p>
                  {errors.teams_link && <p className="mt-1 text-sm text-red-600">{errors.teams_link}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remarks <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="Anything the admin should know, e.g. combined class or rescheduled"
                    rows={3}
                    className={`w-full px-4 py-2 border-2 rounded focus:outline-none focus:ring-2 ${
                      errors.remarks ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-400'
                    }`}
                  />
                  {errors.remarks && <p className="mt-1 text-sm text-red-600">{errors.remarks}</p>}
                </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="px-8 py-6 border-t flex gap-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setFormData({
                      class_date: '',
                      faculty_name: '',
                      course_title: '',
                      batch: '',
                      program: '',
                      section: '',
                      start_time: '',
                      duration_minutes: '',
                      teams_link: '',
                      remarks: '',
                    })
                    setErrors({})
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  Clear form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 text-white rounded font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#2C5AA0'}}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit class record'}
                </button>
              </div>

              <p className="text-sm text-gray-600 text-center">
                Your record is saved only when you see a Reference ID on the next screen.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
