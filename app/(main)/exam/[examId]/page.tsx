import db from "@/db/drizzle";
import { exams, questions, questionOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import ExamClient from "./exam-client";

type Props = {
  params: { examId: string };
};

export default async function ExamPage({ params }: Props) {
  const examId = Number(params.examId);

  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
  });

  if (!exam || !exam.isPublished) {
    return <p>Exam not found</p>;
  }

  const examQuestions = await db.query.questions.findMany({
    where: eq(questions.examId, examId),
    orderBy: (q, { asc }) => [asc(q.order)],
    with: {
      questionOptions: true,
    },
  });

  return (
    <ExamClient
      exam={exam}
      questions={examQuestions}
    />
  );
}
