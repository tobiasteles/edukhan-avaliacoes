"use client";

import { upsertExamProgress } from "@/actions/exam-progress";
import { examAttempts, exams } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Card } from "./card";

type Props = {
  exams: (typeof exams.$inferSelect)[];
  firstUncompletedExam?: typeof examAttempts.$inferSelect.examId;
};

export const List = ({ exams, firstUncompletedExam }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onClick = (examId: number) => {
    if (pending) return;

      startTransition(async () => {
        try {
          const attemptId = await upsertExamProgress(examId);

          router.push(`/exam/${examId}/attempt/${attemptId}/start`);

        } catch {
          toast.error("Não foi possível iniciar a prova. Tente novamente.");
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
          onClick={onClick}
          active={exam.id === firstUncompletedExam}
        />
      ))}
    </div>
  );
};
