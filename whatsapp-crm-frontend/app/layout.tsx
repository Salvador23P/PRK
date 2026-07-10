import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRM WhatsApp Híbrido",
  description: "Panel de administración de conversaciones bot + humano",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-100 antialiased">{children}</body>
    </html>
  );
}
