

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { eq, and } from "drizzle-orm";
import {
  examAttempts,
  exams,
} from "@/db/schema";

type Props = {
  params: Promise<{
    examId: string;
    attemptId: string;
  }>;
};

export default async function ExamStartPage({ params }: Props) {
    const { userId } = await auth();
    if (!userId) {
      redirect("/dashboard");
    }
   const resolvedParams = await params;

  console.log("PARAMS RESOLVIDOS:", resolvedParams);

  const examId = Number(resolvedParams.examId);
  const attemptId = Number(resolvedParams.attemptId);

  if (Number.isNaN(examId) || Number.isNaN(attemptId)) {
    redirect("/dashboard");
  }

  /** 1️⃣ Buscar tentativa */
  const attempt = await db.query.examAttempts.findFirst({
    where: and(
      eq(examAttempts.id, attemptId),
      eq(examAttempts.examId, examId),
      eq(examAttempts.studentId, userId)
    ),
  });

  if (!attempt) {
    redirect("/dashboard");
  }

  if (attempt.completedAt) {
    redirect("/dashboard");
  }

  /** 2️⃣ Buscar prova + questões */
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      questions: {
        orderBy: (questions, { asc }) => [asc(questions.order)],
        with: {
          options: true,
        },
      },
    },
  });

  if (!exam) {
    redirect("/dashboard");
  }

  const firstQuestion = exam.questions[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{exam.title}</h1>
        {exam.description && (
          <p className="text-neutral-600 mt-1">{exam.description}</p>
        )}
      </header>

      {/* QUESTÃO */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-lg">
          {firstQuestion.order}. {firstQuestion.content}
        </h2>

        <ul className="space-y-3">
          {firstQuestion.options.map((option) => (
            <li
              key={option.id}
              className="border rounded p-3 cursor-pointer hover:bg-neutral-100 transition"
            >
              {option.content}
            </li>
          ))}
        </ul>
      </div>

      <footer className="flex justify-end">
        <button className="bg-black text-white px-6 py-2 rounded opacity-50 cursor-not-allowed">
          Próxima
        </button>
      </footer>
    </div>
  );
}
