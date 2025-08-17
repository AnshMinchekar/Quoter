import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Inter, Lato, Playfair_Display, Space_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lato = Lato({ subsets: ["latin"], weight: ["400","700"], variable: "--font-lato" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400","700"], variable: "--font-playfair" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400","700"], variable: "--font-spacemono" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${lato.variable} ${playfair.variable} ${spaceMono.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
