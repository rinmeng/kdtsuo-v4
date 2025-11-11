import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'contacts ♥ kdt',
  description: 'meet the kpop dance team members at ubco!',
  openGraph: {
    images: [
      {
        url: '/assets/img/kdtlogobanner-contacts.webp',
        width: 1200,
        height: 630,
        alt: 'KDT Contacts',
      },
    ],
  },
  twitter: {
    images: ['/assets/img/kdtlogobanner-contacts.webp'],
    card: 'summary_large_image',
  },
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
