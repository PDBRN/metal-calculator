import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Калькулятор металла",
  description: "Профессиональный калькулятор веса и длины металлопроката",
  icons: {
    icon: [
      { url: "/favicon.ico?v=3", sizes: "any" },
      { url: "/icon.png?v=3", type: "image/png", sizes: "512x512" },
    ],
    apple: "/icon.png?v=3",
  },
  // Разрешаем индексацию (Google + Яндекс)
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large" as const,
    "max-video-preview": -1,
  },
  // Верификация поисковых систем (заменить реальными кодами после регистрации)
  verification: {
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
    // yandex: "YOUR_YANDEX_VERIFICATION_CODE",
    other: {
      // Яндекс вебмастер — раскомментировать после регистрации:
      // "yandex-verification": "YOUR_CODE",
    },
  },
  // Базовые OpenGraph для всех страниц (переопределяется на конкретных)
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Metall Calculator — Калькулятор металла",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
