import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'positions ♥ kdt',
  description: 'apply for open positions in the kpop dance team at ubco!',
  openGraph: {
    images: [
      {
        url: '/assets/img/kdtlogobanner-positions.webp',
        width: 1200,
        height: 630,
        alt: 'KDT Positions',
      },
    ],
  },
  twitter: {
    images: ['/assets/img/kdtlogobanner-positions.webp'],
    card: 'summary_large_image',
  },
};

export default function PositionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
