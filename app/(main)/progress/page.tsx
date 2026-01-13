import { getStudentStats, getUserProgress } from "@/db/queries";
import { ScoreChart } from "./score-chart";
import { redirect } from "next/navigation";
import { CheckCircle2, TrendingUp, GraduationCap } from "lucide-react";

export default async function ProgressPage() {
  const stats = await getStudentStats();
  const student = await getUserProgress();

  if (!student) redirect("/dashboard");

  const totalExams = stats?.results.length || 0;
  const avgScore = totalExams > 0 
    ? (stats!.results.reduce((acc, curr) => acc + curr.score, 0) / totalExams).toFixed(1) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="flex items-center gap-x-3 mb-8">
        <GraduationCap className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-neutral-700">Meu Progresso</h1>
      </div>

      {/* Cards de Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="border-2 rounded-2xl p-4 bg-blue-50">
          <p className="text-sm font-bold text-blue-600 uppercase">Provas Feitas</p>
          <p className="text-3xl font-black text-blue-700">{totalExams}</p>
        </div>
        <div className="border-2 rounded-2xl p-4 bg-green-50">
          <p className="text-sm font-bold text-green-600 uppercase">Média Geral</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <p className="text-3xl font-black text-green-700">{avgScore}</p>
          </div>
        </div>
        <div className="border-2 rounded-2xl p-4 bg-orange-50">
          <p className="text-sm font-bold text-orange-600 uppercase">Status</p>
          <p className="text-xl font-bold text-orange-700">Em Evolução 🚀</p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-neutral-600 mb-4">Desempenho por Prova</h2>
        {totalExams > 0 ? (
          <ScoreChart data={stats!.chartData} />
        ) : (
          <div className="h-50 flex items-center justify-center border-2 border-dashed rounded-2xl text-neutral-400">
            Nenhuma prova realizada ainda.
          </div>
        )}
      </div>

      {/* Histórico Individual */}
      <h2 className="text-lg font-bold text-neutral-600 mb-4">Histórico Detalhado</h2>
      <div className="space-y-3">
        {stats?.results.map((result) => (
          <div 
            key={result.id} 
            className="flex items-center justify-between p-4 border-2 rounded-2xl hover:bg-neutral-50 transition"
          >
            <div className="flex items-center gap-x-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-700 font-bold">
                {result.score}
              </div>
              <div>
                <p className="font-bold text-neutral-700">
                  {result.examAttempt.exam.title}
                </p>
                <p className="text-xs text-neutral-500">
                  Finalizada em: {new Date(result.completedAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <CheckCircle2 className="text-green-500 h-6 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}