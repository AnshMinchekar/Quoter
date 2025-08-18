// src/pages/_app.tsx
import type { AppProps } from "next/app";
import "@/styles/globals.css";

import {
  Inter,
  Bebas_Neue,        // weight must be set (only 400 exists)
  Open_Sans,          // variable font (weight optional)
  Playfair_Display,   // variable font
  Roboto_Slab,        // variable font
  Space_Mono          // ❗ needs explicit weights
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const slab = Roboto_Slab({ subsets: ["latin"], variable: "--font-slab" });
const mono = Space_Mono({
  weight: ["400", "700"],        // ✅ required for Space Mono
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={[
        inter.variable,
        bebas.variable,
        openSans.variable,
        playfair.variable,
        slab.variable,
        mono.variable,
        "min-h-screen",
      ].join(" ")}
    >
      <Component {...pageProps} />
    </div>
  );
}
