import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// The site's font: https://fonts.google.com/specimen/Roboto+Slab
// Greek is included for θ, β and χ.
const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin", "latin-ext", "greek"],
});

// Roboto Slab has no glyphs for most IPA symbols or the tie bar (◌͡◌). This is
// Noto Serif (SIL Open Font License, see fonts/OFL.txt), cut down by Google
// Fonts to just the table's symbols. Google's standard Noto Serif files leave
// out the tie bar, so the file is kept here instead.
const ipaFallback = localFont({
  src: "./fonts/noto-serif-ipa.woff2",
  variable: "--font-ipa-fallback",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Phonetic Alphabet Study Tool",
  description: "Type or pick IPA symbols and hear how they sound together.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${robotoSlab.variable} ${ipaFallback.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
