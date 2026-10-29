import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/app/_components/navbar"; // 👈 1. Importação adicionada aqui

export const metadata: Metadata = {
  title: "Guardiões da Fauna",
  description: "Plataforma de resgate e apoio à fauna",
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
      <body>
        <TRPCReactProvider>
          <Navbar /> {/* 👈 2. Navbar colocada no topo do conteúdo */}
          <main>{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}