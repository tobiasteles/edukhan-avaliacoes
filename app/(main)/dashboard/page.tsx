import { getExamsProgress } from "@/db/queries";
import { List } from "./list";

export default async function DashboardPage() {
  const progressData = await getExamsProgress();

  return (
    <div className="h-full max-w-228 px-3 mx-auto pb-10">
      <h1 className="text-2xl font-bold text-neutral-700">Painel do Aluno</h1>
      <p className="text-neutral-500 mt-1">
        Gerencie suas avaliações e acompanhe seu desempenho 👇
      </p>

      <List
        exams={progressData?.examsWithProgress ?? []}
        firstUncompletedExamId={progressData?.firstUncompletedExam?.id}
      />
    </div>
  );
}