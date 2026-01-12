"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ExamSecurity from "./examSecurity";
import { submitExam } from "@/actions/submit-exam";

type AnswerState = Record<number, number | null>;

interface ExamComponentProps {
  exam: {
    id: number;
    title: string;
    description?: string;
    questions: Array<{
      id: number;
      content: string;
      options: Array<{
        id: number;
        content: string;
        imageSrc?: string;
      }>;
    }>;
  };
  attempt: {
    id: number;
  };
}

export default function ExamComponent({ exam, attempt }: ExamComponentProps) {
  const router = useRouter();
  const handleSubmitRef = useRef<(() => Promise<void>) | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const initialAnswers = useMemo(() => {
    const initial: AnswerState = {};
    // Usamos o ?. para prevenir erro caso questions seja undefined
    exam.questions?.forEach((q) => {
      initial[q.id] = null;
    });
    return initial;
  }, [exam.questions]);

  const [answers, setAnswers] = useState<AnswerState>(initialAnswers);
  const [timeLeft, setTimeLeft] = useState(60 * 60); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warnings, setWarnings] = useState(0);

  // --- CÁLCULO DAS CONSTANTES ---
  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;

  const answeredQuestions = Object.values(answers).filter(
    (v) => v !== null
  ).length;

  // --- HANDLERS ---
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = Object.entries(answers)
        .filter(([, optionId]) => optionId !== null)
        .map(([questionId, optionId]) => ({
          questionId: Number(questionId),
          optionId: optionId!,
        }));
      await submitExam(attempt.id, payload);
      router.push(`/exam/${exam.id}/attempt/${attempt.id}/result`);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar a prova.");
      setIsSubmitting(false);
    }
  }, [answers, attempt.id, exam.id, isSubmitting, router]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && handleSubmitRef.current) {
      handleSubmitRef.current();
    }
  }, [timeLeft]);

  const handleAnswer = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSecurityViolation = useCallback(() => {
    setWarnings((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        handleSubmit();
      } else {
        alert(`⚠️ Aviso ${next}/3 — não saia da prova.`);
      }
      return next;
    });
  }, [handleSubmit]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  // --- BLOCO DE PROTEÇÃO (DEVE FICAR AQUI, ANTES DO RETURN PRINCIPAL) ---
  if (totalQuestions === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <h2 className="text-2xl font-bold mb-2">Ops! Nenhuma questão encontrada.</h2>
        <p className="text-neutral-500 mb-6">Esta prova ainda não possui perguntas cadastradas ou houve um erro no carregamento.</p>
        <button 
          onClick={() => router.push("/dashboard")} 
          className="bg-black text-white px-6 py-2 rounded-lg font-medium"
        >
          Voltar ao Painel
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  // --- RENDERIZAÇÃO PRINCIPAL ---
  return (
    <>
      <ExamSecurity onViolation={handleSecurityViolation} warnings={warnings} />

      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">{exam.title}</h1>
          {exam.description && (
            <p className="text-muted-foreground">{exam.description}</p>
          )}
        </header>

        <div className="flex justify-between mb-4 font-mono bg-neutral-100 p-3 rounded-lg">
          <span>⏱ Tempo: {formatTime(timeLeft)}</span>
          <span>
            {answeredQuestions}/{totalQuestions} respondidas
          </span>
        </div>

        <div className="mb-6 border p-6 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-blue-700">
            Questão {currentQuestionIndex + 1}
          </h2>
          <p className="text-xl mb-6 leading-relaxed">{currentQuestion.content}</p>

          <div className="grid gap-3">
            {currentQuestion.options.map((opt) => {
              const selected = answers[currentQuestion.id] === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() => handleAnswer(currentQuestion.id, opt.id)}
                  className={`border-2 p-4 rounded-xl cursor-pointer transition-all ${
                    selected
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20"
                      : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-blue-600" : "border-neutral-300"}`}>
                        {selected && <div className="h-2.5 w-2.5 bg-blue-600 rounded-full" />}
                    </div>
                    <p className="font-medium text-neutral-800">{opt.content}</p>
                  </div>

                  {opt.imageSrc && (
                    <div className="mt-4 relative w-full h-48">
                        <Image
                          src={opt.imageSrc}
                          alt="Opção"
                          fill
                          className="rounded-lg object-contain"
                        />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            className="px-6 py-2 rounded-lg border-2 font-semibold disabled:opacity-30"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((i) => i - 1)}
          >
            ← Anterior
          </button>

          {currentQuestionIndex === totalQuestions - 1 ? (
             <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
             >
               {isSubmitting ? "Enviando..." : "Finalizar Prova"}
             </button>
          ) : (
            <button
              className="px-6 py-2 bg-neutral-800 text-white rounded-lg font-semibold"
              onClick={() => setCurrentQuestionIndex((i) => i + 1)}
            >
              Próxima →
            </button>
          )}
        </div>
      </div>
    </>
  );
}