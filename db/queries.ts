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

  if (!userId) {
    return null;
  }

  const examsWithProgress = await db.query.exams.findMany({
    where: eq(exams.isActive, true),
    with: {
      questions: true,
      examAttempts: {
        where: eq(examAttempts.studentId, userId),
        with: {
          examAnswers: true,
          examResults: true,
        },
      },
    },
  });

  const firstUncompletedExam = examsWithProgress.find((exam) => {
    const attempts = exam.examAttempts?.[0];

    if (!attempts) return true;

    if (!attempts.completedAt) {
      return true;
    }

    return false
  });

  return { examsWithProgress, firstUncompletedExam };
});
