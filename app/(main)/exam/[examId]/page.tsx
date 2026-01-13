// app/(main)/exam/[examId]/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { exams, examAttempts, students } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

type Props = {
  params: Promise<{ examId: string }>;
};

export default async function ExamPage({ params }: Props) {
  const { examId } = await params;
  const examIdNumber = Number(examId);
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  // 1. Verifica se o perfil do aluno existe no banco
  const student = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  // 2. Verifica se já existe uma tentativa aberta
  const existingAttempt = await db.query.examAttempts.findFirst({
    where: and(
      eq(examAttempts.examId, examIdNumber),
      eq(examAttempts.studentId, userId),
      isNull(examAttempts.completedAt)
    ),
  });

  // --- LÓGICA DE REDIRECIONAMENTO ---

  // Se o aluno não tem perfil, ele PRECISA preencher o formulário.
  // Mas o formulário precisa de um attemptId. Vamos criar a tentativa APENAS se o aluno existir.
  // Se não existir, mandamos para uma rota que trate a criação do aluno primeiro.
  
  if (!student) {
    // Redirecionamos para uma página de "pré-tentativa" que captura os dados do aluno
    // Vamos passar apenas o examId, pois o attempt só será criado após o form.
    redirect(`/exam/${examIdNumber}/setup`);
  }

  if (existingAttempt) {
    redirect(`/exam/${examIdNumber}/attempt/${existingAttempt.id}/take`);
  }

  // Se o aluno existe e não tem tentativa, cria uma e vai para a prova
  const [newAttempt] = await db.insert(examAttempts).values({
    examId: examIdNumber,
    studentId: userId,
  }).returning();

  redirect(`/exam/${examIdNumber}/attempt/${newAttempt.id}/take`);
}