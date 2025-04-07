// apps/example-app/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import the client boundary wrapper component
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zeitgg Analytics - Example App",
  description: "Testing @zeitgg/analytics with central backend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Use the Providers wrapper component */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
