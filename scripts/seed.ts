import "dotenv/config";

import * as schema from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  try {
    console.log("🌱 Seeding database (exams)");

    /* -------- LIMPA -------- */

    await db.delete(schema.examAttempts);
    await db.delete(schema.questionOptions);
    await db.delete(schema.questions);
    await db.delete(schema.exams);
    await db.delete(schema.students);
    await db.delete(schema.teachers);
    await db.delete(schema.profiles);

    /* -------- PROFILES -------- */

    const [teacherProfile] = await db
      .insert(schema.profiles)
      .values({
        clerkUserId: "CLERK_USER_ID_PROF",
        role: "professor",
      })
      .returning();

    const [studentProfile] = await db
      .insert(schema.profiles)
      .values({
        clerkUserId: "CLERK_USER_ID_ALUNO",
        role: "aluno",
      })
      .returning();

    /* -------- TEACHER -------- */

    const [teacher] = await db
      .insert(schema.teachers)
      .values({
        profileId: teacherProfile.id,
        name: "Professor Carlos",
      })
      .returning();

    /* -------- STUDENT -------- */

    const [student] = await db
      .insert(schema.students)
      .values({
        profileId: studentProfile.id,
        name: "Aluno João",
        className: "1º Ano",
      })
      .returning();

    /* -------- EXAM -------- */

    const [exam] = await db
      .insert(schema.exams)
      .values({
        title: "Física – Leis de Newton",
        description: "Avaliação sobre as três Leis de Newton",
        teacherId: teacher.id,
        isPublished: true,
      })
      .returning();

    /* -------- QUESTIONS -------- */

    const [q1] = await db
      .insert(schema.questions)
      .values({
        examId: exam.id,
        type: "SELECT",
        statement: "Qual lei explica a inércia?",
        correctAnswer: "Primeira Lei de Newton",
        order: 1,
      })
      .returning();

    const [q2] = await db
      .insert(schema.questions)
      .values({
        examId: exam.id,
        type: "SELECT",
        statement: "F = m · a corresponde a qual lei?",
        correctAnswer: "Segunda Lei de Newton",
        order: 2,
      })
      .returning();

    const [q3] = await db
      .insert(schema.questions)
      .values({
        examId: exam.id,
        type: "ASSIST",
        statement:
          "Explique com suas palavras a Terceira Lei de Newton.",
        correctAnswer:
          "A toda ação corresponde uma reação de mesma intensidade e sentido oposto.",
        order: 3,
      })
      .returning();

    /* -------- OPTIONS (QUESTÕES OBJETIVAS) -------- */

    await db.insert(schema.questionOptions).values([
      {
        questionId: q1.id,
        text: "Primeira Lei de Newton",
        correct: true,
      },
      {
        questionId: q1.id,
        text: "Segunda Lei de Newton",
        correct: false,
      },
      {
        questionId: q1.id,
        text: "Terceira Lei de Newton",
        correct: false,
      },
    ]);

    await db.insert(schema.questionOptions).values([
      {
        questionId: q2.id,
        text: "Primeira Lei de Newton",
        correct: false,
      },
      {
        questionId: q2.id,
        text: "Segunda Lei de Newton",
        correct: true,
      },
      {
        questionId: q2.id,
        text: "Lei da Gravitação Universal",
        correct: false,
      },
    ]);

    /* -------- ATTEMPT (opcional, pra testar dashboard) -------- */

    await db.insert(schema.examAttempts).values({
      userId: studentProfile.clerkUserId,
      examId: exam.id,
      studentId: student.id,
      score: 8,
      status: "completed",
      completedAt: new Date(),
    });

    console.log("✅ Seed finalizado com sucesso");
  } catch (error) {
    console.error(error);
    throw new Error("❌ Failed to seed database");
  }
}

main();
