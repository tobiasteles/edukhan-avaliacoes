// app/actions/submit-exam.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import  db from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import { examAnswers, examAttempts, examResults, questionOptions } from "@/db/schema";

interface SubmitAnswer {
  questionId: number;
  optionId: number;
}

export async function submitExam(attemptId: number, answers: SubmitAnswer[]) {
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

  // Calcular pontuação
  let score = 0;
  
  // Primeiro, salvar todas as respostas
  for (const answer of answers) {
    await db.insert(examAnswers).values({
      examAttemptId: attemptId,
      questionId: answer.questionId,
      optionId: answer.optionId,
    });

    // Verificar se a resposta está correta
    const correctOption = await db.query.questionOptions.findFirst({
      where: and(
        eq(questionOptions.id, answer.optionId),
        eq(questionOptions.isCorrect, true)
      ),
    });

    if (correctOption) {
      score++;
    }
  }

  // Marcar como finalizada
  const completedAt = new Date();
  await db.update(examAttempts)
    .set({ completedAt })
    .where(eq(examAttempts.id, attemptId));

  // Salvar resultado
  await db.insert(examResults).values({
    examAttemptId: attemptId,
    score,
    completedAt,
  });

  return { success: true, score };
}