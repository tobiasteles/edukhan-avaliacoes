"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
// Adicionamos o inArray aqui nas importações
import { eq, and, inArray } from "drizzle-orm"; 
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

  // --- INÍCIO DA OTIMIZAÇÃO EM LOTE ---

  // 1. Salvar todas as respostas de uma vez (Bulk Insert)
  if (answers.length > 0) {
    await db.insert(examAnswers).values(
      answers.map((a) => ({
        examAttemptId: attemptId,
        questionId: a.questionId,
        optionId: a.optionId,
      }))
    );
  }

  // 2. Buscar as opções que são corretas dentre as que o usuário marcou
  const userOptionIds = answers.map((a) => a.optionId);
  
  const correctSelections = await db.query.questionOptions.findMany({
    where: and(
      inArray(questionOptions.id, userOptionIds),
      eq(questionOptions.isCorrect, true)
    ),
  });

  // A pontuação é simplesmente o número de registros encontrados 
  // (já que cada registro retornado é uma resposta correta do usuário)
  const score = correctSelections.length;

  // --- FIM DA OTIMIZAÇÃO ---

  // Marcar como finalizada
  const completedAt = new Date();
  await db.update(examAttempts)
    .set({ completedAt })
    .where(eq(examAttempts.id, attemptId));

  // Salvar resultado final na tabela de resultados
  await db.insert(examResults).values({
    examAttemptId: attemptId,
    score,
    completedAt,
  });

  return { success: true, score };
}