// app/exam/[examId]/attempt/[attemptId]/page.tsx

import StudentForm from "./student-form";

type PageProps = {
  params: {
    examId: string;
    attemptId: string;
  };
};

export default function ExamAttemptPage({ params }: PageProps) {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Antes de começar a prova
      </h1>

      <p className="text-sm text-muted-foreground mb-6">
        Preencha seus dados corretamente. Eles serão usados para identificação da prova.
      </p>

      <StudentForm
        examId={params.examId}
        attemptId={params.attemptId}
      />
    </div>
  );
}
