import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    examId: string;
    attemptId: string;
  }>;
};

export default async function AttemptStartPage({ params }: Props) {
  const { examId, attemptId } = await params;

  const examIdNumber = Number(examId);
  const attemptIdNumber = Number(attemptId);

  if (isNaN(examIdNumber) || isNaN(attemptIdNumber)) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Início da Tentativa</h1>

      <p>
        <strong>Exam ID:</strong> {examIdNumber}
      </p>

      <p>
        <strong>Attempt ID:</strong> {attemptIdNumber}
      </p>

      <p className="text-green-600 font-medium">
        ✅ Rota dinâmica funcionando corretamente
      </p>
    </div>
  );
}
