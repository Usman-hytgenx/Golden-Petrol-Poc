import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Golden Petrol — Branch Operations Dashboard",
  description: "Quick Lube Network — Head Office Operations Control",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 antialiased overflow-hidden`}>
        <div className="flex h-screen">
          <div className="flex-shrink-0 h-screen overflow-y-auto">
            <Sidebar />
          </div>
          <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
