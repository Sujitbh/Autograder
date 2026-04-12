export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: 'var(--landing-bg)',
          overflowX: 'hidden',
        }}
      >
        {children}
      </body>
    </html>
  );
}
