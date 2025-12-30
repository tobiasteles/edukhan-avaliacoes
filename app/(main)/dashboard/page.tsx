import { getExams, getExamsProgress } from "@/db/queries";
import { List } from "./list";

export default async function DashboardPage() {
  const examsData = getExams();
  const examsProgressData = getExamsProgress();

  const [exams, examsProgress] = await Promise.all([
    examsData,
    examsProgressData,
  ]);

  return (
    <div className="h-full max-w-228 px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">Painel do Aluno</h1>

      <List
        exams={exams}
        firstUncompletedExam={examsProgress?.firstUncompletedExam?.id}
      />
    </div>
  );
}
