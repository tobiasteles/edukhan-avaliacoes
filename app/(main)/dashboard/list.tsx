"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Card } from "./card";

type Exam = {
  id: number;
  title: string;
  status: "available" | "active" | "completed";
  score?: number;
  lastAttemptId?: number;
};

type Props = {
  exams: Exam[];
  firstUncompletedExamId?: number;
};

export const List = ({ exams, firstUncompletedExamId }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (examId: number, status: string, attemptId?: number) => {
    if (pending) return;

    startTransition(() => {
      if (status === "completed" && attemptId) {
        router.push(`/exam/${examId}/attempt/${attemptId}/result`);
      } else if (status === "active" && attemptId) {
        router.push(`/exam/${examId}/attempt/${attemptId}/take`);
      } else {
        // Envia para a rota pai do exame que fará a triagem do formulário
        router.push(`/exam/${examId}`);
      }
    });
  };

  return (
    <div className="pt-6 grid gap-6 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
      {exams.map((exam) => (
        <Card
          key={exam.id}
          id={exam.id}
          title={exam.title}
          status={exam.status}
          score={exam.score}
          onClick={() => onClick(exam.id, exam.status, exam.lastAttemptId)}
          active={exam.id === firstUncompletedExamId}
        />
      ))}
    </div>
  );
};