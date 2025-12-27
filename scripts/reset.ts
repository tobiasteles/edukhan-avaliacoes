import "dotenv/config";

import * as schema from "../db/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { th } from "date-fns/locale";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
    console.log("🔄 Resetting database");
    await db.delete(schema.examAttempts);
    await db.delete(schema.questionOptions);
    await db.delete(schema.questions);
    await db.delete(schema.exams);
    await db.delete(schema.students);
    await db.delete(schema.teachers);
    await db.delete(schema.profiles);
    console.log("✅ Database reset complete");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    throw  new Error("Database reset failed");
}
};

main();