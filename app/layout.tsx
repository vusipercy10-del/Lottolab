import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'LottoLab Master System',
  description: 'Lottery research, sections, wheels, partner matrices and combinatorial analysis.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
