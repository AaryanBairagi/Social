import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import UsageTracker from "@/global/UsageTracker";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Social",
  description: "Connecting Futures, Together",
  icons : "/SocialLogo.png"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

          <AuthProvider>
          <UsageTracker />
          <div> {children} </div>
          <Toaster richColors position="top-right" />
          
          </AuthProvider>
        </body>
      </html>
  );
}