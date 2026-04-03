import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "./components/providers/LenisProvider";
import { ThemeProvider } from "./components/providers/ThemeProvider";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Felinonologist AI | Fotoğraftan Kedi Irkı Tespiti",
  description:
    "Kedinizin fotoğrafını yükleyin, yapay zeka saniyeler içinde cinsini tespit etsin. Kedi ırkları hakkında detaylı bilgi ve bakım önerileri alın.",
  openGraph: {
    title: "Felinonologist AI | Feline Intelligence Reimagined",
    description:
      "Discover how AI decodes cat behavior and DNA. Advanced feline intelligence platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <ThemeProvider>
          <LenisProvider>
            {children}
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
