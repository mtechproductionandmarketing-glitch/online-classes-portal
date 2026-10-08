import FacultyForm from '@/components/FacultyForm'

export default function Home() {
  return (
    <main>
      {/* Header Branding Line */}
      <div style={{ backgroundColor: '#F3F5F9', padding: '8px 24px', borderBottom: '1px solid #E8EAEF', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', fontWeight: '700', color: '#2C5AA0', margin: '0', letterSpacing: '0.5px' }}>
          School of Computing Sciences
        </p>
      </div>

      {/* Navigation Bar */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #E8EAEF', padding: '12px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <img
            src="/logos/scs-logo.jpg"
            alt="SCS"
            style={{ height: '48px', objectFit: 'contain' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginLeft: 'auto' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#9CA3AF' }}>
              Online Classes Portal
            </p>
            <a href="/admin" style={{ fontSize: '14px', fontWeight: '600', color: '#C46A1C', textDecoration: 'none' }}>
              Admin login
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background Image */}
      <section style={{
        backgroundImage: 'linear-gradient(rgba(44, 90, 160, 0.7), rgba(44, 90, 160, 0.7)), url("/images/backgrounds/faculty-hero.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ color: '#FCD34D', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', marginBottom: '16px' }}>
            FACULTY PORTAL
          </p>
          <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
            Submit your online class record
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', lineHeight: '1.6' }}>
            No login needed. Fill in the class details, paste a meeting link (Teams, Meet, Zoom, or other), and you will get a Reference ID once it is saved.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '48px 24px', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <FacultyForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #E8EAEF', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
          <img
            src="/logos/scs-logo.jpg"
            alt="SCS"
            style={{ height: '32px', objectFit: 'contain' }}
          />
        </div>
        <p style={{ color: '#2C5AA0', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
          School of Computing Sciences
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '8px' }}>
          Online Classes Recording & Tracking Portal
        </p>
        <p style={{ color: '#9CA3AF', fontSize: '12px' }}>
          © 2026 School of Computing Sciences. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
