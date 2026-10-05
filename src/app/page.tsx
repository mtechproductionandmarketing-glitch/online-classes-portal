import FacultyForm from '@/components/FacultyForm'

export default function Home() {
  return (
    <main>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="flex items-center gap-8 w-full">
          {/* Logo */}
          <div className="nav-brand">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: 'var(--color-primary-blue)' }}>
              PAF
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold" style={{ color: 'var(--color-primary-blue)' }}>
                PAF-IAST
              </p>
              <p className="text-xs" style={{ color: 'var(--color-gray-medium)' }}>
                Online Classes Portal
              </p>
            </div>
          </div>

          {/* Right Side - Admin Link */}
          <div className="ml-auto">
            <a href="/admin" className="nav-link">
              Admin Login
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section className="hero-section" style={{
        backgroundImage: 'linear-gradient(rgba(44, 90, 160, 0.7), rgba(44, 90, 160, 0.7)), url("/images/backgrounds/hero-faculty.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div className="hero-content">
          <div className="mb-8">
            <span className="text-orange-300 font-semibold text-sm tracking-widest">FACULTY PORTAL</span>
          </div>
          <h1 className="hero-title">Submit your online class record</h1>
          <p className="hero-subtitle">
            No login needed. Fill in the class details, paste the MS Teams link, and you will get a Reference ID once it is saved.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="page-container py-16">
        <div className="max-w-3xl mx-auto">
          <div className="card">
            <FacultyForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--color-gray-light)' }}>
        <div className="page-container py-12">
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
          <div className="text-center text-sm" style={{ color: 'var(--color-gray-medium)' }}>
            <p>
              Pak-Austria Fachhochschule: Institute of Applied Sciences and Technology · Online Classes Recording & Tracking Portal
            </p>
            <p className="mt-4">© 2026 PAF-IAST. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
