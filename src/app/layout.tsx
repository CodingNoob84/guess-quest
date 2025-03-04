import { Toaster } from "@/components/ui/toaster";
import { ConvexClientProvider } from "@/providers/convex-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Guess Quest",
  description:
    "A fun and interactive game where users guess words, movie names, or famous people based on pictures! 🎯🎨",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico", sizes: "any" },
      { rel: "icon", url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-touch-icon.png" },
    other: [{ rel: "manifest", url: "/manifest.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
