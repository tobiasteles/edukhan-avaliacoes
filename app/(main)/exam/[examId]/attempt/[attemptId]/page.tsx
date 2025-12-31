// app/exam/[examId]/attempt/[attemptId]/page.tsx

type PageProps = {
  params: {
    examId: string;
    attemptId: string;
  };
};

export default function ExamAttemptPage({ params }: PageProps) {
  const { examId, attemptId } = params;

  return (
    <div style={{ padding: 24 }}>
      <h1>Página da Prova</h1>
      <p><strong>Exam ID:</strong> {examId}</p>
      <p><strong>Attempt ID:</strong> {attemptId}</p>
    </div>
  );
}
