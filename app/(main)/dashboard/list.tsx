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

  const onClick = (id: number) => {
    if (pending) return;

    if (id === firstUncompletedExam) {
      return router.push("/dashboard");
    }

    startTransition(() => {
      upsertExamProgress(id).catch(() =>
        toast.error("Falha ao iniciar o exame.")
      );
    });
  };

  return (
    <div className="pt-6 grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
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
