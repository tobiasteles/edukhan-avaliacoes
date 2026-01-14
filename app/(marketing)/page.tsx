"use client";

import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Loader, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // Fundo com gradiente suave e padrão de pontos
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-50 via-white to-white flex items-center justify-center px-4 overflow-hidden">
      
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12">
        
        {/* Lado Esquerdo: Imagem com Moldura Estilizada */}
        <div className="relative group order-2 lg:order-1">
          <div className="absolute -inset-1 bg-linear-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white rounded-2xl p-2 shadow-2xl overflow-hidden">
            <div className="aspect-4/3 relative rounded-xl overflow-hidden bg-slate-100">
              <Image
                src="/siblings-listening-music-using-laptop.jpg"
                alt="Crianças aprendendo de forma divertida"
                fill
                className="object-cover hover:scale-105 transition duration-700"
                priority
              />
            </div>
            {/* Badge flutuante na imagem */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-bounce-slow">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-medium">Progresso Real</p>
                <p className="text-sm font-bold text-slate-800">Resultados Práticos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Conteúdo e Texto */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8 order-1 lg:order-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full ring-1 ring-primary/20 animate-pulse">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                Educação do Futuro
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Avalie o <span className="text-primary bg-clip-text">Potencial</span> de cada aluno.
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 max-w-lg leading-relaxed">
              Acompanhe e meça o nível de aprendizagem no projeto 
              <span className="font-semibold text-slate-800"> Edukhan</span> de forma intuitiva, gamificada e eficiente.
            </p>
          </div>

          {/* Cards de Pequenos Recursos */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Relatórios em Tempo Real
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Fácil de Usar
            </div>
          </div>

          {/* Ações e Auth */}
          <div className="w-full max-w-sm flex flex-col gap-4 pt-4">
            <ClerkLoading>
              <div className="flex justify-center p-4">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            </ClerkLoading>

            <ClerkLoaded>
              <SignedOut>
                <SignUpButton
                  mode="modal"
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button size="icon" className="w-full text-lg h-14 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                    Começar Jornada Gratuitamente
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpButton>

                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/dashboard"
                  fallbackRedirectUrl="/dashboard"
                >
                  <Button size="lg" variant="ghost" className="w-full text-slate-600 hover:text-primary hover:bg-primary/5">
                    Já sou parte do projeto (Entrar)
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Button size="icon" className="w-full text-lg h-14 shadow-xl" asChild>
                  <Link href="/dashboard">
                    Ir para o Dashboard
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div>

      {/* Estilos customizados para a animação flutuante */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}