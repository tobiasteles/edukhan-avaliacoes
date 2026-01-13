"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { examResults } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CheckCircle2, Trophy } from "lucide-react";

type Props = {
  params: Promise<{
    examId: string;
    attemptId: string;
  }>;
};

export default async function ResultPage({ params }: Props) {
  const { attemptId } = await params;
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const attemptIdNumber = Number(attemptId);

  // Busca o resultado usando as relações do seu schema
  const resultData = await db.query.examResults.findFirst({
    where: eq(examResults.examAttemptId, attemptIdNumber),
    with: {
      examAttempt: {
        with: {
          exam: {
            with: {
              questions: true,
            },
          },
        },
      },
    },
  });

  if (!resultData) {
    redirect("/dashboard");
  }

  const exam = resultData.examAttempt.exam;
  const totalQuestions = exam.questions.length;
  const score = resultData.score;
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border-2 border-b-4 rounded-2xl p-8 text-center shadow-sm">
        
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <Trophy className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Prova Concluída!</h1>
        <p className="text-neutral-500 mb-8">{exam.title}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="border-2 rounded-xl p-4 bg-neutral-50">
            <p className="text-sm font-bold text-neutral-400 uppercase">Acertos</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-3xl font-black text-neutral-700">{score} / {totalQuestions}</span>
            </div>
          </div>
          
          <div className="border-2 rounded-xl p-4 bg-blue-50">
            <p className="text-sm font-bold text-neutral-400 uppercase">Nota Final</p>
            <p className="text-3xl font-black mt-1 text-blue-600">{percentage}%</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/dashboard"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl transition border-b-4 border-blue-800 active:border-b-0"
          >
            Voltar ao Início
          </Link>
          
          
        </div>
      </div>
    </div>
  );
}