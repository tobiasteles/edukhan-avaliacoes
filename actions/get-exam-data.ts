"use server";

import { auth } from "@clerk/nextjs/server";
import  db from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { exams, questions, questionOptions, examAttempts } from "@/db/schema";
import { cache } from "react";

export const getExamWithQuestions = cache(async (examId: number, attemptId: number) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se a tentativa pertence ao usuário
  const attempt = await db.query.examAttempts.findFirst({
    where: and(
      eq(examAttempts.id, attemptId),
      eq(examAttempts.studentId, userId)
    ),
  });

  if (!attempt) {
    throw new Error("Tentativa não encontrada");
  }

  if (attempt.completedAt) {
    throw new Error("Esta tentativa já foi finalizada");
  }

  // Buscar exame com questões e opções
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      questions: {
        with: {
          options: true,
        },
        orderBy: (questions, { asc }) => [asc(questions.order)],
      },
    },
  });

  if (!exam) {
    throw new Error("Exame não encontrado");
  }

  return {
    exam,
    attempt,
  };
});