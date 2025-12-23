import { auth } from "@clerk/nextjs/server";
import  db from "@/db/drizzle";
import { exams, examAttempts } from "@/db/schema";
import { eq, notInArray, avg, max, desc } from "drizzle-orm";

import {
  FileText,
  CheckSquare,
  Trophy,
  BarChart3,
} from "lucide-react";

export default async function DashboardPage() {
  const authData = await auth();
  const userId = authData.userId;

  if (!userId) {
    return null;
  }

  /* ---------------- PROVAS FEITAS ---------------- */

  const completedExams = await db
    .select()
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId));

  const completedExamIds = completedExams.map(
    (attempt) => attempt.examId
  );

  /* ---------------- PROVAS DISPONÍVEIS ---------------- */

  const availableExams = await db
    .select()
    .from(exams)
    .where(
      completedExamIds.length > 0
        ? notInArray(exams.id, completedExamIds)
        : undefined
    );

  /* ---------------- MÉTRICAS ---------------- */

  const averageScore = await db
    .select({ value: avg(examAttempts.score) })
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId));

  const bestScore = await db
    .select({ value: max(examAttempts.score) })
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId));

  /* ---------------- RESULTADOS RECENTES ---------------- */

  const recentResults = await db
    .select()
    .from(examAttempts)
    .where(eq(examAttempts.userId, userId))
    .orderBy(desc(examAttempts.completedAt))
    .limit(5);

  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold">
          Painel de Controle do Aluno
        </h1>
        <p className="text-muted-foreground">
          Overview of your exams and performance
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Available Exams"
          value={availableExams.length.toString()}
          icon={FileText}
        />

        <DashboardCard
          title="Completed Exams"
          value={completedExams.length.toString()}
          icon={CheckSquare}
        />

        <DashboardCard
          title="Average Score"
          value={
            averageScore[0]?.value
              ? Number(averageScore[0].value).toFixed(1)
              : "0"
          }
          icon={BarChart3}
        />

        <DashboardCard
          title="Best Score"
          value={
            bestScore[0]?.value
              ? bestScore[0].value.toString()
              : "0"
          }
          icon={Trophy}
        />
      </div>

      {/* Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provas disponíveis */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">
            Available Exams
          </h2>

          <ul className="space-y-2">
            {availableExams.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No exams available
              </p>
            )}

            {availableExams.map((exam) => (
              <li
                key={exam.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <span>{exam.title}</span>
                <button className="text-blue-600 font-semibold">
                  Start
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Últimos resultados */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">
            Recent Results
          </h2>

          <ul className="space-y-2">
            {recentResults.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No exams completed yet
              </p>
            )}

            {recentResults.map((attempt) => (
              <li
                key={attempt.id}
                className="flex justify-between border p-3 rounded-lg"
              >
                <span>Exam #{attempt.examId}</span>
                <span className="font-bold text-green-600">
                  {attempt.score}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------- CARD ---------------- */

function DashboardCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
      <div className="p-3 rounded-full bg-blue-100 text-blue-700">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">
          {title}
        </p>
        <p className="text-xl font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}
