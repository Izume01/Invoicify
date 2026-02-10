import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoicify | AI-Powered Invoice Generation",
  description: "Generate professional invoices from chat, files, and pasted notes.",
};

/**
 * Provides the root layout for the application, applying global fonts, authentication context, and rendering child components.
 *
 * Wraps the entire app with `ClerkProvider` for authentication and sets up global font styles and metadata.
 *
 * @param children - The content to be rendered within the layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
          {children}
          <Toaster closeButton position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
