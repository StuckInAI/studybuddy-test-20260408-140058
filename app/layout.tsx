import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudyManager - Organize Your Academic Life',
  description: 'Manage your study schedules, notes, and important deadlines all in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
