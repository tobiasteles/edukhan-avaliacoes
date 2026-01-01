import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { exams, examAttempts, students } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";

type Props = {
  params: Promise<{
    examId: string;
  }>;
};

export default async function ExamStartPage({ params }: Props) {
  const { examId } = await params;
  const examIdNumber = Number(examId);

  if (Number.isNaN(examIdNumber)) {
    redirect("/dashboard");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  /* 1️⃣ Verifica se o aluno existe */
  const student = await db.query.students.findFirst({
    where: eq(students.userId, userId),
  });

  const [attempt] = await db
    .insert(examAttempts)
    .values({
      examId: examIdNumber,
      studentId: userId,
    })
    .returning();


  if (!student) {
    // 👉 AQUI é onde você deve mandar pro form-student
    redirect(`/exam/${examIdNumber}/attempt/${attempt.id}`);
  }

  /* 2️⃣ Verifica se a prova existe */
  const exam = await db.query.exams.findFirst({
    where: and(eq(exams.id, examIdNumber), eq(exams.isActive, true)),
  });

  if (!exam) {
    redirect("/dashboard");
  }

  /* 3️⃣ Verifica se já existe tentativa aberta */
  const existingAttempt = await db.query.examAttempts.findFirst({
    where: and(
      eq(examAttempts.examId, examIdNumber),
      eq(examAttempts.studentId, userId),
      isNull(examAttempts.completedAt)
    ),
  });

  if (existingAttempt) {
    redirect(
      `/exam/${examIdNumber}/attempt/${existingAttempt.id}`
    );
  }

  /* 4️⃣ Cria a tentativa */
  
  redirect(`/exam/${examIdNumber}/attempt/${attempt.id}`);
}
