import localFont from 'next/font/local';
import './globals.css';
import Providers from '@/components/providers';
import pkg from '../../package.json';
import BuildInfo from '@/components/build-info';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="theme-color"
          content="#FFFFFF"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#000000"
          media="(prefers-color-scheme: dark)"
        />
        <title>{pkg.title}</title>
        <meta name="description" content={pkg.description} />
        <meta name="keywords" content={pkg.keywords.toString()} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pkg.site} />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* <!--[if lt IE 11]><script>window.location.href='/ie.html';</script><![endif]--> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Providers> {children}</Providers>
        <BuildInfo />
        <Footer />
        <Toaster />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_ANALYTICS_ID!} />
      </body>
    </html>
  );
}
