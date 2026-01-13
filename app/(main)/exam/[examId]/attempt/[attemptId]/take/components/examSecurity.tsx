"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface ExamSecurityProps {
  onViolation: () => void;
  warnings: number;
}

export default function ExamSecurity({ onViolation, warnings }: ExamSecurityProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastViolationTime = useRef<number>(0);

  // Corrigido: Função memorizada que gerencia o cooldown com segurança
  const triggerViolation = useCallback(() => {
    const now = Date.now();
    // Se passaram menos de 2 segundos desde o último aviso, ignora
    if (now - lastViolationTime.current > 2000) {
      lastViolationTime.current = now;
      onViolation();
    }
  }, [onViolation]);

  useEffect(() => {
    // 1. Bloqueio de Teclas e Cliques
    const handleKeyDown = (e: KeyboardEvent) => {
      const isDevTools = e.key === 'F12' || 
                         (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
                         (e.ctrlKey && e.key === 'U');
      
      const isCopyPaste = (e.ctrlKey || e.metaKey) && 
                          (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a');
      
      if (isDevTools || isCopyPaste || e.key === 'PrintScreen') {
        e.preventDefault();
        triggerViolation();
      }
    };

    const preventDefault = (e: Event) => {
      e.preventDefault();
      triggerViolation();
    };

    document.addEventListener('copy', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('paste', preventDefault);
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('keydown', handleKeyDown);

    // 2. Lógica de Tela Cheia
    const requestFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.warn('Fullscreen bloqueado:', err);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        triggerViolation();
      } else {
        setIsFullscreen(true);
      }
    };

    // 3. Lógica de Troca de Aba (Visibility)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation();
        document.title = "⚠️ VOLTE PARA A PROVA!";
      } else {
        document.title = "Exame em andamento";
      }
    };

    requestFullscreen();

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('paste', preventDefault);
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [triggerViolation]);

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none select-none">
      <div className="flex items-center gap-2 bg-white/90 border border-red-200 rounded-lg px-3 py-2 shadow-sm backdrop-blur-sm">
        <div className={`w-3 h-3 rounded-full ${isFullscreen ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
        <span className="text-sm font-medium text-red-700">
          {isFullscreen ? 'Monitoramento Ativo' : 'Ajuste a Tela Cheia'}
        </span>
        {warnings > 0 && (
          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-md font-bold">
            Avisos: {warnings}/3
          </span>
        )}
      </div>
    </div>
  );
}