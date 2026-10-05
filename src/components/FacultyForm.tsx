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
    <form onSubmit={handleSubmit} style={{ padding: '48px' }}>
      {submitError && (
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FEE2E2', borderLeft: '4px solid #EF4444', borderRadius: '6px', color: '#DC2626' }}>
          <p style={{ fontWeight: '600', marginBottom: '4px' }}>Error</p>
          <p style={{ fontSize: '14px' }}>{submitError}</p>
        </div>
      )}

      {/* Section 1: When was the class? */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2C5AA0', marginBottom: '24px' }}>
          1. When was the class?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Class date
            </label>
            <input
              type="date"
              name="class_date"
              value={formData.class_date}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${errors.class_date ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
              placeholder="mm/dd/yyyy"
            />
            {errors.class_date && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.class_date}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Start time
            </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${errors.start_time ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
            />
            {errors.start_time && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.start_time}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Minutes
            </label>
            <input
              type="text"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${errors.duration_minutes ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
              placeholder="e.g. 90"
            />
            {errors.duration_minutes && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.duration_minutes}</p>}
          </div>
        </div>
      </div>

      {/* Section 2: Who taught, and which class? */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2C5AA0', marginBottom: '24px' }}>
          2. Who taught, and which class?
        </h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Faculty name
          </label>
          <input
            type="text"
            name="faculty_name"
            value={formData.faculty_name}
            onChange={handleChange}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `2px solid ${errors.faculty_name ? '#EF4444' : '#D1D5DB'}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
            placeholder="Your full name"
          />
          {errors.faculty_name && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.faculty_name}</p>}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Course title
          </label>
          <input
            type="text"
            name="course_title"
            value={formData.course_title}
            onChange={handleChange}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `2px solid ${errors.course_title ? '#EF4444' : '#D1D5DB'}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
            placeholder="e.g. Data Structures and Algorithms"
          />
          {errors.course_title && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.course_title}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Program
            </label>
            <input
              type="text"
              name="program"
              value={formData.program}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${errors.program ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
              placeholder="e.g. BS Computer Science"
            />
            {errors.program && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.program}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Batch
            </label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${errors.batch ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
              placeholder="e.g. Fall 2024"
            />
            {errors.batch && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.batch}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Section
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${errors.section ? '#EF4444' : '#D1D5DB'}`,
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit',
              }}
              placeholder="e.g. Blue, or Blue + Green"
            />
            {errors.section && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.section}</p>}
          </div>
        </div>
      </div>

      {/* Section 3: Meeting link */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2C5AA0', marginBottom: '24px' }}>
          3. Meeting link
        </h2>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            MS Teams link
          </label>
          <input
            type="text"
            name="teams_link"
            value={formData.teams_link}
            onChange={handleChange}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `2px solid ${errors.teams_link ? '#EF4444' : '#D1D5DB'}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
            placeholder="https://teams.microsoft.com/l/meetup-join/..."
          />
          <p style={{ marginTop: '6px', fontSize: '12px', color: '#6B7280' }}>
            Paste the full link of the class meeting. Only the link is needed, no recording.
          </p>
          {errors.teams_link && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.teams_link}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Remarks <span style={{ fontWeight: '400', color: '#9CA3AF' }}>(optional)</span>
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `2px solid ${errors.remarks ? '#EF4444' : '#D1D5DB'}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              minHeight: '120px',
              resize: 'vertical',
            }}
            placeholder="Anything the admin should know, e.g. combined class or rescheduled"
          />
          {errors.remarks && <p style={{ marginTop: '6px', fontSize: '12px', color: '#DC2626' }}>{errors.remarks}</p>}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #E5E7EB', paddingTop: '24px' }}>
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
          style={{
            padding: '12px 24px',
            border: '2px solid #D1D5DB',
            backgroundColor: 'white',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.5 : 1,
          }}
        >
          Clear form
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: '12px 24px',
            backgroundColor: '#2C5AA0',
            color: 'white',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit class record'}
        </button>
      </div>

      <p style={{ marginTop: '24px', fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
        Your record is saved only when you see a Reference ID on the next screen.
      </p>
    </form>
  )
}
