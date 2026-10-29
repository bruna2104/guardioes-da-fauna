import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/app/_components/navbar";
import Footer from "~/app/_components/footer";

export const metadata: Metadata = {
  title: "Guardiões da Fauna — Resgate e Proteção Animal",
  description:
    "Plataforma colaborativa conectando pessoas, voluntários e ONGs para socorrer e acolher a fauna brasileira em risco.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${geist.variable}`}>
      <body className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <TRPCReactProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
