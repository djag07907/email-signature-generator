"use client";

import "./globals.css";
import { SignatureProvider } from "@/components/context/signature-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SignatureProvider>
            <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-muted/50">
              {children}
            </div>
          </SignatureProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
