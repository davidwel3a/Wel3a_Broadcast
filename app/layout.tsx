import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wel3a_Broadcast | ولعة برودكاست',
  description: 'منصة Wel3a_Broadcast لبث وإرسال إعلانات الديسكورد الموجهة بدقة بحسب الرتب وبأعلى درجات الأمان.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
