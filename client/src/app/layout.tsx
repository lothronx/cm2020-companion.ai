import Providers from "@/components/Providers";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// The metadata for the entire app: title and description
export const metadata: Metadata = {
  title: "Companion.ai",
  description: "The AI Companion who can detect your emotions",
};

// The layout for the entire app
// the entire app is wrapped in the next-auth session provider
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
