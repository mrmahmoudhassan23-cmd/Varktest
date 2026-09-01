import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VARK Learning Profile',
  description: 'VARK learning preferences assessment',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="site-footer">
          <span>© 2026 Mahmoud Hassan — VARK Learning Profile</span>
          <a
            className="footer-contact"
            href="mailto:mr.mahmud.hassan.ebis@gmail.com?subject=VARK%20Learning%20Profile%20Support"
          >
            Contact Support
          </a>
        </footer>
      </body>
    </html>
  );
}
