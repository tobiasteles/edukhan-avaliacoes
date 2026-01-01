import StudentForm from "./student-form";

type Props = {
  params: Promise<{
    examId: string;
    attemptId: string;
  }>;
};

export default async function ExamAttemptPage({ params }: Props) {
  const { examId, attemptId } = await params;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Antes de começar a prova
      </h1>

      <p className="text-sm text-neutral-600 mb-6">
        Preencha seus dados corretamente para iniciar a prova.
      </p>

      <StudentForm
        examId={examId}
        attemptId={attemptId}
      />
    </div>
  );
}
