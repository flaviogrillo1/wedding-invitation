import "./globals.css";
import { Cormorant_Garamond, Great_Vibes, Lora } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const script = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
});

const body = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Boda Aitana & Flavio",
  description: "Invitación oficial a la boda de Aitana y Flavio",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${script.variable} ${body.variable} bg-ivory text-sage-dark antialiased`}>
        {children}
      </body>
    </html>
  );
}
