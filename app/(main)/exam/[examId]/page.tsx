import db from "@/db/drizzle";
import { examAttempts, students } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";

interface Props {
    params: { examId: string };
}

// app/exam/[examId]/page.tsx
export default async function ExamPage({ params }: Props) {
  const { examId } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // 1. Busca tentativa aberta
  const existingAttempt = await db.query.examAttempts.findFirst({
    where: and(
      eq(examAttempts.examId, Number(examId)),
      eq(examAttempts.studentId, userId),
      isNull(examAttempts.completedAt)
    ),
  });

  let attemptId;

  if (existingAttempt) {
    attemptId = existingAttempt.id;
  } else {
    // 2. Se não existe, cria uma nova
    const [newAttempt] = await db.insert(examAttempts).values({
      examId: Number(examId),
      studentId: userId,
    }).returning();
    attemptId = newAttempt.id;
  }

  // 3. Checa se o perfil do aluno existe
  const student = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  if (!student) {
    // Se não tem perfil, manda para o formulário de dados
    redirect(`/exam/${examId}/attempt/${attemptId}`);
  }

  // 4. Se já tem perfil, vai direto para o início da prova
  redirect(`/exam/${examId}/attempt/${attemptId}/take`);
}