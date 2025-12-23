import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/* ---------------- ENUMS ---------------- */

export const userRoleEnum = pgEnum("user_role", [
  "aluno",
  "professor",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "SELECT",
  "ASSIST",
]);

export const attemptStatusEnum = pgEnum("attempt_status", [
  "in_progress",
  "completed",
]);

/* ---------------- PROFILES (ponte com Clerk) ---------------- */

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  role: userRoleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* ---------------- STUDENTS ---------------- */

export const students = pgTable("students", {
  id: serial("id").primaryKey(),

  profileId: integer("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),

  name: text("name").notNull(),
  className: text("class_name"),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ---------------- TEACHERS ---------------- */

export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),

  profileId: integer("profile_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),

  name: text("name").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ---------------- EXAMS ---------------- */

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),

  title: text("title").notNull(),
  description: text("description"),

  teacherId: integer("teacher_id")
    .references(() => teachers.id, { onDelete: "cascade" })
    .notNull(),

  isPublished: boolean("is_published").default(false),

  createdAt: timestamp("created_at").defaultNow(),
});

/* ---------------- QUESTIONS ---------------- */

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),

  examId: integer("exam_id")
    .references(() => exams.id, { onDelete: "cascade" })
    .notNull(),

  type: questionTypeEnum("type").notNull(),
  statement: text("statement").notNull(),
  correctAnswer: text("correct_answer").notNull(),

  order: integer("order").notNull(),
});

/* ---------------- QUESTION OPTIONS ---------------- */

export const questionOptions = pgTable("question_options", {
  id: serial("id").primaryKey(),

  questionId: integer("question_id")
    .references(() => questions.id, { onDelete: "cascade" })
    .notNull(),

  text: text("text"),
  imageSrc: text("image_src"),
  correct: boolean("correct").default(false),
});

/* ---------------- EXAM ATTEMPTS ---------------- */

export const examAttempts = pgTable("exam_attempts", {
  id: serial("id").primaryKey(),

   userId: text("user_id").notNull(),

  examId: integer("exam_id")
    .references(() => exams.id, { onDelete: "cascade" })
    .notNull(),

  studentId: integer("student_id")
    .references(() => students.id, { onDelete: "cascade" })
    .notNull(),

  score: integer("score"),
  status: attemptStatusEnum("status").default("in_progress"),

  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});
