import "dotenv/config";
import db from "@/db/drizzle";
import { exams, questions, questionOptions } from "@/db/schema";

async function seed() {
  console.log("🌱 Iniciando seed...");

  /** 1️⃣ Criar prova */
  const [exam] = await db
    .insert(exams)
    .values({
      title: "Prova de Ciências – Teste",
      description: "Prova de teste para validar o sistema",
    })
    .returning();

  console.log("✅ Prova criada:", exam.id);

  /** 2️⃣ Questão 1 */
  const [q1] = await db
    .insert(questions)
    .values({
      examId: exam.id,
      order: 1,
      type: "multiple_choice",
      content: "Qual planeta é conhecido como o Planeta Vermelho?",
    })
    .returning();

  await db.insert(questionOptions).values([
    { questionId: q1.id, content: "Terra", isCorrect: false },
    { questionId: q1.id, content: "Marte", isCorrect: true },
    { questionId: q1.id, content: "Júpiter", isCorrect: false },
    { questionId: q1.id, content: "Vênus", isCorrect: false },
  ]);

  /** 3️⃣ Questão 2 */
  const [q2] = await db
    .insert(questions)
    .values({
      examId: exam.id,
      order: 2,
      type: "multiple_choice",
      content: "Qual é o estado físico da água a 100°C?",
    })
    .returning();

  await db.insert(questionOptions).values([
    { questionId: q2.id, content: "Sólido", isCorrect: false },
    { questionId: q2.id, content: "Líquido", isCorrect: false },
    { questionId: q2.id, content: "Gasoso", isCorrect: true },
    { questionId: q2.id, content: "Plasma", isCorrect: false },
  ]);

  console.log("🎉 Seed finalizado com sucesso");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
