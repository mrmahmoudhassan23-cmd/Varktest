import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Year 7 Learning Profile',
  description: 'EBIS Year 7 VARK learning preferences assessment',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
