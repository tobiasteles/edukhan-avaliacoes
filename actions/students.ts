"use server";

import db from "@/db/drizzle";
import { examAttempts, students } from "@/db/schema";
import { eq } from "drizzle-orm";

type StudentInput = {
  userId: string;
  name: string;
  age: number;
  grade: number;
  schoolName: string;
  unit: string;
  city: string;
  state: string;
};

export async function upsertStudent(data: StudentInput) {
  const existing = await db
    .select()
    .from(students)
    .where(eq(students.userId, data.userId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(students)
      .set({
        name: data.name,
        age: data.age,
        grade: data.grade,
        schoolName: data.schoolName,
        unit: data.unit,
        city: data.city,
        state: data.state,
      })
      .where(eq(students.userId, data.userId));

    return;
  }

  await db.insert(students).values({
    userId: data.userId,
    name: data.name,
    age: data.age,
    grade: data.grade,
    schoolName: data.schoolName,
    unit: data.unit,
    city: data.city,
    state: data.state,
  });
}

export async function createExamAttempt(examId: number, userId: string) {
  // Criamos a tentativa no banco de dados
  const [newAttempt] = await db.insert(examAttempts).values({
    examId: examId,
    studentId: userId,
    startedAt: new Date(),
  }).returning();

  return newAttempt.id;
}
