import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "@/components/dashboard/TopBar";

export const metadata: Metadata = {
  title: "CodeLabOS — mission control",
  description:
    "The Learning Operating System for becoming a technical orchestrator.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="relative z-10">
          <TopBar />
          <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
