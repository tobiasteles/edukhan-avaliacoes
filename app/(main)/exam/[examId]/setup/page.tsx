// app/(main)/exam/[examId]/setup/page.tsx

import StudentForm from "../attempt/[attemptId]/student-form";

export default async function ExamSetupPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo à Avaliação</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Identificamos que é sua primeira vez. Preencha seus dados para começar.
      </p>
      {/* Aqui passamos attemptId como undefined ou 0 pois o form vai criar o aluno primeiro */}
      <StudentForm examId={examId} /> 
    </div>
  );
}