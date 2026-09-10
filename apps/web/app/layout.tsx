import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KMS — Komersial Manajemen Sistem",
  description: "Enterprise Service Process Management System — Rapid Network",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
