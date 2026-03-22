import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "LeadBot — AI-ассистент для бизнеса",
  description:
    "Умный ассистент, который отвечает клиентам, квалифицирует заявки и сохраняет лиды в Google Sheets",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-bg text-ink`}>
        {children}
      </body>
    </html>
  );
}
