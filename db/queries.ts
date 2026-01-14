import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import db from "./drizzle";
import { eq } from "drizzle-orm";
import {
  examAttempts,
  exams,
  students,
} from "./schema";

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const data = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  return data;
});

export const getExams = cache(async () => {
  const data = await db.query.exams.findMany();

  return data;
});

export const getExamsById = cache(async (examId: number) => {
  const data = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      questions: true,
    },
  });

  return data;
});

export const getExamsProgress = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const examsWithProgress = await db.query.exams.findMany({
    where: eq(exams.isActive, true),
    with: {
      examAttempts: {
        where: eq(examAttempts.studentId, userId),
        orderBy: (examAttempts, { desc }) => [desc(examAttempts.startedAt)],
        with: {
          examResults: true,
        },
      },
    },
  });

  // Mapeia os dados para simplificar a vida do componente List
  const formattedExams = examsWithProgress.map((exam) => {
    const lastAttempt = exam.examAttempts?.[0];
    
    let status: "available" | "active" | "completed" = "available";
    if (lastAttempt?.completedAt) status = "completed";
    else if (lastAttempt) status = "active";

    return {
      ...exam,
      status,
      lastAttemptId: lastAttempt?.id,
      score: lastAttempt?.examResults?.[0]?.score,
    };
  });

  const firstUncompletedExam = formattedExams.find((e) => e.status !== "completed");

  return { examsWithProgress: formattedExams, firstUncompletedExam };
});

export const getStudentStats = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;

  // 1. Buscamos as tentativas do aluno que JÁ POSSUEM um resultado
  const attempts = await db.query.examAttempts.findMany({
    where: eq(examAttempts.studentId, userId),
    with: {
      exam: true,
      examResults: true, // Traz o resultado vinculado
    },
    orderBy: (examAttempts, { asc }) => [asc(examAttempts.completedAt)],
  });

  // 2. Filtramos apenas as tentativas que foram concluídas (possuem resultado)
  // e mapeamos para o formato que sua página espera
  const results = attempts
    .filter((attempt) => attempt.examResults && attempt.examResults.length > 0)
    .map((attempt) => {
      const result = attempt.examResults[0];
      return {
        ...result,
        examAttempt: {
          ...attempt,
          exam: attempt.exam
        }
      };
    });

  // 3. Formata os dados para o gráfico
  const chartData = results.map((r) => ({
    name: r.examAttempt.exam.title.length > 10 
      ? r.examAttempt.exam.title.substring(0, 10) + "..." 
      : r.examAttempt.exam.title, 
    score: r.score,
  }));

  return { results, chartData };
});