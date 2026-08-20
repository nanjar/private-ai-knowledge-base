import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Private AI Knowledge Base',
  description: 'Private, self-hosted enterprise AI knowledge base',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
