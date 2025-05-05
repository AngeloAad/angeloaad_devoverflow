import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import "./globals.css";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/context/Theme";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://angeloaad-devoverflow.vercel.app/"),
  title: {
    template: "%s | DevOverflow",
    default: "DevOverflow - Developer Q&A Community",
  },
  description:
    "A community-driven platform for developers to ask questions, share knowledge, and learn from each other.",
  keywords: [
    "programming",
    "coding",
    "web development",
    "software engineering",
    "developer community",
    "Q&A",
  ],
  authors: [{ name: "DevOverflow Team" }],
  creator: "DevOverflow Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "DevOverflow",
    title: {
      template: "%s | DevOverflow",
      default: "DevOverflow - Developer Q&A Community",
    },
    description:
      "A community-driven platform for developers to ask questions, share knowledge, and learn from each other.",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | DevOverflow",
      default: "DevOverflow - Developer Q&A Community",
    },
    description:
      "A community-driven platform for developers to ask questions, share knowledge, and learn from each other.",
    creator: "@devoverflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body
          className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default RootLayout;
