"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { examAttempts, questions, questionOptions } from "@/db/schema";
import { eq } from "drizzle-orm";

/* -------- INICIAR PROVA -------- */
export async function startExam(examId: number) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const attempt = await db
    .insert(examAttempts)
    .values({
      userId,
      studentId,
      examId,
      status: "in_progress",
    })
    .returning();

  return attempt[0];
}

/* -------- FINALIZAR PROVA -------- */
export async function finishExam(
  attemptId: number,
  score: number
) {
  await db
    .update(examAttempts)
    .set({
      score,
      status: "completed",
      completedAt: new Date(),
    })
    .where(eq(examAttempts.id, attemptId));
}
