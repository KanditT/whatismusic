
import type { Metadata } from "next";
import { Lexend, Noto_Sans } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["300", "400", "500", "700", "900"],
});

const noto = Noto_Sans({
  subsets: ["latin", "thai"],
  variable: "--font-noto",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "What Is Music? | Museum Exhibition",
  description: "An immersive educational experience exploring the fundamental elements of music.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${lexend.variable} ${noto.variable} font-display antialiased`}>
        {children}
      </body>
    </html>
  );
}
