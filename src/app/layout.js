import { Inter } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Monitoramento BRT",
  description: "App de monitoramento em tempo real",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
