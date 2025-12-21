import type { Metadata } from "next";
import { Kode_Mono } from "next/font/google";
import "./globals.css";

const kode_Mono = Kode_Mono({
  subsets: ["latin"],
  variable: "--font-kode-mono",
});

export const metadata: Metadata = {
  title: "Edukhan Avaliações",
  description: "A Plataforma de Avaliações do Edukhan permite que professores criem e gerenciem avaliações pedagógicas e acompanhem o desempenho dos alunos de forma simples e objetiva. Desenvolvida para a realidade do projeto Educam, a ferramenta prioriza acessibilidade, uso prático e dados claros para apoiar o processo de ensino e aprendizagem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${kode_Mono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
