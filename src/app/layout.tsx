"use client";

import "./globals.css";
import { SignatureProvider } from "@/components/context/signature-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SignatureProvider>{children}</SignatureProvider>
      </body>
    </html>
  );
}
