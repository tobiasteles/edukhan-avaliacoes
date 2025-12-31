import "dotenv/config";

import * as schema from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
    console.log("🔄 Resetting database");
    console.log("🧹 Limpando tabelas existentes...");
  await db.delete(schema.examAnswers);
  await db.delete(schema.examResults);
  await db.delete(schema.examAttempts);
  await db.delete(schema.questionOptions);
  await db.delete(schema.questions);
  await db.delete(schema.exams);
  await db.delete(schema.students);
    console.log("✅ Database reset complete");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw  new Error("Database reset failed");
}
};

main();