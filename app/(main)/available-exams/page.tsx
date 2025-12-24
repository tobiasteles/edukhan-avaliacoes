import { getAvailableExams } from "@/db/queries";
import Link from "next/link";
import { FileText } from "lucide-react";

export default async function AvailableExamsPage() {
  const exams = await getAvailableExams();

  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold">
          Avaliações Disponíveis
        </h1>
        <p className="text-muted-foreground">
          Escolha uma avaliação para iniciar
        </p>
      </div>

      {/* Lista */}
      {exams.length === 0 && (
        <div className="text-sm text-muted-foreground border rounded-xl p-6 text-center">
          Nenhuma avaliação disponível no momento.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="border rounded-xl p-4 flex flex-col justify-between gap-4 bg-white"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>{exam.title}</span>
              </div>

              {exam.description && (
                <p className="text-sm text-muted-foreground">
                  {exam.description}
                </p>
              )}
            </div>

            <Link
              href={`/exam/${exam.id}`}
              className="inline-flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700 transition"
            >
              Iniciar avaliação
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
