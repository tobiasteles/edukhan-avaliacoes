"use server";

import db from "@/db/drizzle";
import { examAttempts, exams, students } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertExamProgress = async (examId: number) => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Usuário não autenticado.");
  }

  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
  });

  if (!exam) {
    throw new Error("Exame não encontrado.");
  }

  if (!exam.isActive) {
    throw new Error("Exame inativo.");
  }

  

  const existingStudent = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!existingStudent) {
    await db.insert(students).values({
      userId,
      name: user.firstName || "Usuário não informado",
      userImageSrc: user.imageUrl || "/user.png",
      age: 0,
      grade: 0,
      schoolName: "",
      unit: "",
      city: "",
      state: "",
    });
  } else {
    await db
      .update(students)
      .set({
        name: user.firstName || "Usuário não informado",
        userImageSrc: user.imageUrl || "/user.png",
      })
      .where(eq(students.userId, userId));
  }

  const existingAttempt = await db.query.examAttempts.findFirst({
    where: and(
      eq(examAttempts.examId, examId),
      eq(examAttempts.studentId, userId),
      isNull(examAttempts.completedAt)
    ),
  });

  if (existingAttempt) {
    await db.insert(examAttempts).values({
      studentId: userId,
      examId: examId,
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/available-exams");
  redirect("/dashboard");
};
