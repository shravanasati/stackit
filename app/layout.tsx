import type { Metadata } from "next";
import "./globals.css";
import {GeistSans} from "geist/font/sans"
import { Navbar } from "@/components/Navbar";
import { getAuthUser } from "@/lib/user";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "@/lib/ThemeContext";

const APP_DEFAULT_TITLE = "StackIt's PWA";


export const metadata: Metadata = {
  title: "StackIt",
  description: "Your one and only QnA forum, where you can ask questions and get answers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  openGraph: {
    type: "website",
    title: "StackIt",
    description: "Your one and only QnA forum, where you can ask questions and get answers.",
    images: [
      {
        url: "/mail-logo.png",
        width: 434,
        height: 152,
        alt: "StackIt",
      },
    ],
    url: "https://stackit.vercel.app",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser();
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="image" property="og:image" content="/mail_logo.png" />
      </head>
      <ThemeProvider>
        <body className={`${GeistSans.className} antialiased min-h-screen w-screen`}>
          <Navbar user={user} />
          {children}
          <Toaster />

        </body>
      </ThemeProvider>

      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId="G-3XCDLX2W7Z" />
      )}
    </html>
  );
}
