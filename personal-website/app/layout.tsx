import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/navbar/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Islam Tayeb",
  description: "Personal Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#2e294e] overflow-y-scroll overflow-x-hidden`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
