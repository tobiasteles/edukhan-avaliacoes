"use server";

import db from "@/db/drizzle";
import { examAttempts, students } from "@/db/schema";
import { eq } from "drizzle-orm";

// 1. Atualizamos o tipo para receber birthDate (string vinda do input type="date")
type StudentInput = {
  userId: string;
  name: string;
  birthDate: string; // Trocado de age: number
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

  // Criamos um objeto com os dados para não repetir código abaixo
  const studentData = {
    name: data.name,
    birthDate: data.birthDate, // Certifique-se que no seu schema.ts o nome é birthDate
    grade: data.grade,
    schoolName: data.schoolName,
    unit: data.unit,
    city: data.city,
    state: data.state,
  };

  if (existing.length > 0) {
    await db
      .update(students)
      .set(studentData)
      .where(eq(students.userId, data.userId));

    return;
  }

  await db.insert(students).values({
    userId: data.userId,
    ...studentData,
  });
}

export async function createExamAttempt(examId: number, userId: string) {
  // 2. Para resolver o erro do 'id' não existir no tipo 'never',
  // passamos o campo que queremos dentro do returning()
  const [newAttempt] = await db
    .insert(examAttempts)
    .values({
      examId: examId,
      studentId: userId,
      startedAt: new Date(),
    })
    .returning({ id: examAttempts.id }); // Isso força o TS a reconhecer o ID

  return newAttempt.id;
}