import "./styles/globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-primary" });

export const metadata = {
  title: "My Next.js App",
  description: "Created with Next.js 14",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50 pt-16">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
