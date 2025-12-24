"use client";

import { useState } from "react";
import { startExam, finishExam } from "./actions";

type Props = {
  exam: any;
  questions: any[];
};

export default function ExamClient({ exam, questions }: Props) {
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);

  const handleStart = async () => {
    const attempt = await startExam(exam.id);
    setAttemptId(attempt.id);
  };

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFinish = async () => {
    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    if (attemptId) {
      await finishExam(attemptId, score);
    }

    setFinished(true);
  };

  if (!attemptId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">{exam.title}</h1>
        <p className="mb-4 text-muted-foreground">
          {exam.description}
        </p>
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Exam
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">
          Exam finished 🎉
        </h2>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {questions.map((q) => (
        <div key={q.id} className="border p-4 rounded">
          <p className="font-semibold">{q.statement}</p>

          {q.type === "SELECT" && (
            <div className="space-y-2 mt-2">
              {q.questionOptions.map((opt: any) => (
                <label key={opt.id} className="block">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt.text}
                    onChange={() =>
                      handleAnswer(q.id, opt.text)
                    }
                  />{" "}
                  {opt.text}
                </label>
              ))}
            </div>
          )}

          {q.type === "ASSIST" && (
            <textarea
              className="w-full border rounded p-2 mt-2"
              onChange={(e) =>
                handleAnswer(q.id, e.target.value)
              }
            />
          )}
        </div>
      ))}

      <button
        onClick={handleFinish}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Finish Exam
      </button>
    </div>
  );
}
