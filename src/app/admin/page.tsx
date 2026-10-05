'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email || !password) {
        setError('Please enter both email and password')
        return
      }

      // Demo authentication - test credentials
      const testUsers = [
        { email: 'admin@paf-iast.edu.pk', password: 'Admin@123' },
        { email: 'director@paf-iast.edu.pk', password: 'Director@123' },
      ]

      const user = testUsers.find(u => u.email === email && u.password === password)

      if (user) {
        // Store auth token in localStorage
        localStorage.setItem('adminToken', JSON.stringify({ email, role: 'admin' }))
        // Redirect to dashboard
        window.location.href = '/admin/dashboard'
      } else {
        setError('Invalid email or password. Try: admin@paf-iast.edu.pk / Admin@123')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-white)' }}>
      {/* Header with Branding */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <img src="/logos/paf-iast-logo.png" alt="PAF-IAST" style={{ height: '48px', objectFit: 'contain' }} />
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#2C5AA0', marginLeft: 'auto' }}>
            Admin Dashboard
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
      <div
        className="hidden lg:flex lg:w-1/2 relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(26, 26, 26, 0.4), rgba(26, 26, 26, 0.4)), url("/images/backgrounds/hero-admin.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark Overlay Box */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div
            className="rounded-lg p-8"
            style={{
              backgroundColor: 'rgba(26, 26, 26, 0.85)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-orange-300 font-semibold text-sm tracking-widest mb-4">
              ADMINISTRATION
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Online Classes Recording & Tracking Portal
            </h2>
            <p className="text-gray-300 text-lg">
              Monitor every online class submitted by faculty, review statistics, and export reports.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="mb-12 flex justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img
                  src="/logos/paf-iast-logo.png"
                  alt="PAF-IAST Logo"
                  className="h-16"
                  style={{ objectFit: 'contain' }}
                />
                <img
                  src="/logos/scs-logo.jpg"
                  alt="SCS Logo"
                  className="h-16"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <p className="font-bold text-lg mb-1" style={{ color: 'var(--color-primary-blue)' }}>
                Pak-Austria Fachhochschule
              </p>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-secondary-orange)' }}>
                School of Computing Sciences
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Institute of Applied Sciences and Technology
              </p>
            </div>
          </div>

          {/* Form Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-dark-text)' }}>
              Admin sign in
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Authorized staff only.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 error-alert">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="input-label">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Your university email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="input-label">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M15.171 13.576l1.472 1.473a1 1 0 001.414-1.414l-.001-.001L5.413 2.413a1 1 0 00-1.414 1.414l1.472 1.472a10.034 10.034 0 015.703 5.703z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-center font-semibold"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-light-bg)' }}>
            <p className="text-xs text-center" style={{ color: 'var(--color-gray-medium)' }}>
              For security, you will be signed out after 60 minutes of inactivity.
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Hero Info */}
      <div className="lg:hidden fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(26, 26, 26, 0.6), rgba(26, 26, 26, 0.6)), url("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=800&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1,
          }}
        ></div>
      </div>
    </div>
  )
}
