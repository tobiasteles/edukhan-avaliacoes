import { auth } from "@clerk/nextjs/server";
import { cache } from "react";
import db from "./drizzle";
import { eq } from "drizzle-orm";
import { examAttempts, exams, students } from "./schema";

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
    }
  });

  return data;
})

export const getExamsProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId || !examAttempts?.startedAt) {
    return null;
  }


  
});