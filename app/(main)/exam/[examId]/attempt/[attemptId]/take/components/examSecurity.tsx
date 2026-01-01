"use client";

import { useEffect, useState, useCallback } from "react";

interface ExamSecurityProps {
  onViolation: () => void;
  warnings: number;
}

export default function ExamSecurity({ onViolation, warnings }: ExamSecurityProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Prevenir cópia
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation();
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation();
      return false;
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation();
      return false;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onViolation();
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevenir DevTools e atalhos
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
        onViolation();
        return false;
      }

      // Prevenir Ctrl+C, Ctrl+V, Ctrl+X
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
        e.preventDefault();
        onViolation();
        return false;
      }

      if (e.key === 'PrintScreen') {
        e.preventDefault();
        onViolation();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    // Entrar em tela cheia
    const requestFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.warn('Erro ao entrar em tela cheia:', err);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        onViolation();
        requestFullscreen();
      } else {
        setIsFullscreen(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        onViolation();
        document.title = "⚠️ VOLTE PARA A PROVA!";
        
        setTimeout(() => {
          document.title = "Exame em andamento";
        }, 2000);
      }
    };

    const handleBlur = () => {
      onViolation();
    };

    requestFullscreen();

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    // Detectar DevTools
    const blockDevTools = () => {
      const threshold = 160;
      const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          onViolation();
          window.location.reload();
        }
      };
      
      setInterval(checkDevTools, 1000);
    };

    blockDevTools();

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [onViolation]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        <div className={`w-3 h-3 rounded-full ${isFullscreen ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        <span className="text-sm font-medium text-red-700">
          {isFullscreen ? 'Modo Prova Ativo' : 'Sistema de Segurança Ativo'}
        </span>
        {warnings > 0 && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            Avisos: {warnings}/3
          </span>
        )}
      </div>
    </div>
  );
}