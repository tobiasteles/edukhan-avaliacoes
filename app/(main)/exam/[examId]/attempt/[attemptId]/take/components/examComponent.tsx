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
    exam.questions.forEach((q) => {
      initial[q.id] = null;
    });
    return initial;
  }, [exam.questions]);
  const [answers, setAnswers] = useState<AnswerState>(initialAnswers);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutos
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warnings, setWarnings] = useState(0);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const totalQuestions = exam.questions.length;

  const answeredQuestions = Object.values(answers).filter(
    (v) => v !== null
  ).length;

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

      router.push(
        `/exam/${exam.id}/attempt/${attempt.id}/result`
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar a prova.");
      setIsSubmitting(false);
    }
  }, [answers, attempt.id, exam.id, isSubmitting, router]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle timeout submission
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

        <div className="flex justify-between mb-4">
          <span>⏱ {formatTime(timeLeft)}</span>
          <span>
            {answeredQuestions}/{totalQuestions} respondidas
          </span>
        </div>

        <div className="mb-6">
          <h2 className="font-semibold mb-2">
            Questão {currentQuestionIndex + 1}
          </h2>
          <p className="mb-4">{currentQuestion.content}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const selected =
                answers[currentQuestion.id] === opt.id;

              return (
                <div
                  key={opt.id}
                  onClick={() =>
                    handleAnswer(currentQuestion.id, opt.id)
                  }
                  className={`border p-4 rounded cursor-pointer ${
                    selected
                      ? "border-blue-500 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p>{opt.content}</p>

                  {opt.imageSrc && (
                    <Image
                      src={opt.imageSrc}
                      alt="Opção"
                      width={300}
                      height={200}
                      className="mt-2 rounded"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() =>
              setCurrentQuestionIndex((i) => i - 1)
            }
          >
            Anterior
          </button>

          <button
            disabled={currentQuestionIndex === totalQuestions - 1}
            onClick={() =>
              setCurrentQuestionIndex((i) => i + 1)
            }
          >
            Próxima
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
        >
          Finalizar prova
        </button>
      </div>
    </>
  );
}
