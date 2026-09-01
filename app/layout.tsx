import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VARK Learning Profile',
  description: 'VARK learning preferences assessment',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
