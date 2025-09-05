import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
          <Link href="/events">Events</Link>
          <Link href="/my">My RSVPs</Link>
          <Link href="/admin/events">Admin</Link>
          <div style={{ flex: 1 }} />
          <a href="/auth/signout">Sign out</a>
        </nav>
        <main style={{ maxWidth: 820, margin: '24px auto', padding: '0 12px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
