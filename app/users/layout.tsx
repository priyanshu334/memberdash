import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
      className="bg-orange-400"
   
      >
        {/* Navbar only on medium and larger screens */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        <div className="flex  h-screen overflow-y-auto">
          <Sidebar />
          <main className="flex-1 p-6 mt-10 md:p-6  lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
