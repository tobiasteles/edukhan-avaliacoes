// actions/create-exam-attempt.ts
"use server";

import db from "@/db/drizzle";
import { examAttempts } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";

export async function createExamAttempt(examId: number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Usuário não autenticado");
  }

  const [attempt] = await db
    .insert(examAttempts)
    .values({
      studentId: userId,
      examId,
    })
    .returning();

  return attempt;
}
