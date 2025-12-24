import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { exams, examAttempts } from "@/db/schema";
import {
  eq,
  notInArray,
  avg,
  max,
  desc,
  and,
} from "drizzle-orm";

/* ---------------- USER ID ---------------- */

async function getUserId() {
  const { userId } = await auth();
  return userId;
}

/* ---------------- PROVAS CONCLUÍDAS ---------------- */

export const getCompletedExams = cache(async () => {
  const userId = await getUserId();
  if (!userId) return [];

  return db
    .select()
    .from(examAttempts)
    .where(
      and(
        eq(examAttempts.userId, userId),
        eq(examAttempts.status, "completed")
      )
    );
});

/* ---------------- PROVAS DISPONÍVEIS ---------------- */

export const getAvailableExams = cache(async () => {
  const userId = await getUserId();
  if (!userId) return [];

  const completed = await db
    .select({ examId: examAttempts.examId })
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId));

  const completedIds = completed.map((e) => e.examId);

  return db
    .select()
    .from(exams)
    .where(
      completedIds.length > 0
        ? notInArray(exams.id, completedIds)
        : undefined
    );
});

/* ---------------- MÉTRICAS ---------------- */

export const getStudentMetrics = cache(async () => {
  const userId = await getUserId();
  if (!userId) return null;

  const [average] = await db
    .select({ value: avg(examAttempts.score) })
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId));

  const [best] = await db
    .select({ value: max(examAttempts.score) })
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId));

  return {
    averageScore: Number(average?.value ?? 0),
    bestScore: Number(best?.value ?? 0),
  };
});

/* ---------------- RESULTADOS RECENTES ---------------- */

export const getRecentResults = cache(async () => {
  const userId = await getUserId();
  if (!userId) return [];

  return db
    .select()
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId))
    .orderBy(desc(examAttempts.completedAt))
    .limit(5);
});

/* ---------------- PROVA COM QUESTÕES ---------------- */

export const getExamWithQuestions = cache(async (examId: number) => {
  const exam = await db
    .select()
    .from(exams)
    .where(eq(exams.id, examId))
    .limit(1);

  if (!exam[0]) return null;

  const examQuestions = await db
    .select()
    .from(exams)
    .leftJoin(
      examAttempts,
      eq(examAttempts.examId, exams.id)
    );

  return exam[0];
});
