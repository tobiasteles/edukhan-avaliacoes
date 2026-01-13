import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import db from "./drizzle";
import { eq } from "drizzle-orm";
import {
  examAnswers,
  examAttempts,
  examResults,
  exams,
  questions,
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

  const results = await db.query.examResults.findMany({
    with: {
      examAttempt: {
        with: {
          exam: true,
        },
      },
    },
    // Ordena pela data de conclusão para o gráfico fazer sentido
    orderBy: (examResults, { asc }) => [asc(examResults.completedAt)],
  });

  // Formata os dados para o gráfico
  const chartData = results.map((r) => ({
    name: r.examAttempt.exam.title.substring(0, 10) + "...", 
    score: r.score,
    // Se quiser calcular porcentagem aqui:
    // percentage: (r.score / r.examAttempt.exam.questions.length) * 100
  }));

  return { results, chartData };
});