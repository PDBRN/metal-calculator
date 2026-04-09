import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  // Верификация поисковых систем
  verification: {
    // google: "YOUR_GOOGLE_VERIFICATION_CODE",
    yandex: "476995d2b82293e3",
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

        {/* Яндекс.Метрика — счётчик 108452367 */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) { return; }
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=108452367', 'ym');

              ym(108452367, 'init', {
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/108452367" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}
