'use client';


const platformLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'AI & Security', href: '#ai-security' },
  { label: 'User Roles', href: '#roles' },
];

const accessLinks = [
  { label: 'Student Portal', href: '/login' },
  { label: 'Faculty Portal', href: '/login' },
  { label: 'Admin Portal', href: '/login' },
];

const supportLinks = [
  { label: 'Documentation', href: '#' },
  { label: 'Contact Support', href: '#' },
  { label: 'System Status', href: '#' },
];

export default function LandingFooter() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--landing-ink)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="mx-auto px-8 pt-20 pb-10" style={{ maxWidth: 1200 }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-5">
              <img
                src="/images/axiom-logo.png"
                alt="Axiom"
                className="rounded-full"
                style={{ width: 36, height: 36 }}
              />
            </div>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.35)',
                maxWidth: 240,
              }}
            >
              Automated grading platform for the University of Louisiana Monroe.
            </p>
          </div>

          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Access" links={accessLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between pt-7 gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>
            &copy; {new Date().getFullYear()} Axiom. University of Louisiana Monroe.
          </span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>
            Department of Computer Science — Academic Tools
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4
        className="mb-5"
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.45)',
        }}
      >
        {title}
      </h4>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="no-underline transition-colors duration-200"
            style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
