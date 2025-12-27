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
import { Loader, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Imagem / Hero visual */}
        <div className="relative w-full h-65 lg:h-105">
          <Image
            src="/siblings-listening-music-using-laptop.jpg"
            alt="Crianças aprendendo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
          
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">
              Plataforma de Aprendizado
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-800 max-w-md">
            Plataforma de Avaliações do Edukhan
          </h1>

          <p className="text-muted-foreground max-w-md">
           A Plataforma de Avaliações do Edukhan foi criada para acompanhar e medir, de forma simples e objetiva, o nível de aprendizagem dos alunos atendidos pelo projeto Edukhan.
          </p>

          {/* Ações */}
          <div className="w-full max-w-sm flex flex-col gap-3">
            <ClerkLoading>
              <Loader className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
            </ClerkLoading>

            <ClerkLoaded>
              <SignedOut>
                <SignUpButton
                  mode="modal"
                  afterSignUpUrl="/dashboard"
                  afterSignInUrl="/dashboard"
                >
                  <Button size="lg" className="w-full">
                    Vamos começar?
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>

                <SignInButton
                  mode="modal"
                  afterSignInUrl="/dashboard"
                  afterSignUpUrl="/dashboard"
                >
                  <Button size="lg" variant="outline" className="w-full">
                    Já tenho uma conta
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/dashboard">
                    Continuar
                  </Link>
                </Button>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </div>
  );
}
