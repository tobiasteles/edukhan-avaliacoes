import { redirect } from "next/navigation";
import { getExamWithQuestions } from "@/actions/get-exam-data";
import { auth } from "@clerk/nextjs/server";
import  db from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { students } from "@/db/schema";
import ExamComponent from "./components/examComponent";

type Props = {
  params: Promise<{
    examId: string;
    attemptId: string;
  }>;
};

export default async function TakeExamPage({ params }: Props) {
  const { examId, attemptId } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const examIdNumber = Number(examId);
  const attemptIdNumber = Number(attemptId);

  if (isNaN(examIdNumber) || isNaN(attemptIdNumber)) {
    redirect("/dashboard");
  }

  let exam, attempt;

  try {
    // Verificar se o estudante já preencheu os dados
    const student = await db.query.students.findFirst({
      where: eq(students.userId, userId),
    });

    if (!student) {
      // Redirecionar de volta para preencher os dados
      redirect(`/exam/${examId}/attempt/${attemptId}`);
    }

    const result = await getExamWithQuestions(examIdNumber, attemptIdNumber);
    exam = result.exam;
    attempt = result.attempt;
  } catch (error) {
    console.error("Erro ao carregar exame:", error);
    redirect("/dashboard");
  }

  return (
    <ExamComponent 
      exam={{
        id: exam.id,
        title: exam.title,
        description: exam.description ?? undefined,
        questions: exam.questions.map(q => ({
          id: q.id,
          content: q.content,
          options: q.options.map(o => ({
            id: o.id,
            content: o.content,
            imageSrc: o.imageSrc ?? undefined,
          })),
        })),
      }}
      attempt={attempt}
    />
  );
}