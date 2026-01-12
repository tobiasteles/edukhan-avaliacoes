import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const students = pgTable("students", {
  userId: text("user_id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  grade: integer("grade").notNull(),
  schoolName: text("school_name").notNull(),
  unit: text("unit").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userImageSrc: text("user_image_src").notNull().default("/user.png"),
  
});

export const studentsRelations = relations(students, ({ many }) => ({
  examAttempts: many(examAttempts),
}));

export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const examsRelations = relations(exams, ({ many }) => ({
  questions: many(questions),
  examAttempts: many(examAttempts),
}));

export const examAttempts = pgTable("exam_attempts", {
  id: serial("id").primaryKey(),
  studentId: text("user_id")
    .notNull()
    .references(() => students.userId, { onDelete: "cascade" }),
  examId: integer("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const examAttemptsRelations = relations(
  examAttempts,
  ({ one, many }) => ({
    exam: one(exams, {
      fields: [examAttempts.examId],
      references: [exams.id],
    }),
    students: one(students, {
      fields: [examAttempts.studentId],
      references: [students.userId],
    }),
    examAnswers: many(examAnswers),
    examResults: many(examResults),
  })
);

export const questionsEnum = pgEnum("question_type", [
  "multiple_choice",
  "true_false",
]);

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  type: questionsEnum("type").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
});

export const questionsRelations = relations(questions, ({ many, one }) => ({
  exam: one(exams, {
    fields: [questions.examId],
    references: [exams.id],
  }),
  options: many(questionOptions), // Aqui diz que uma questão tem várias opções
  examAnswers: many(examAnswers),
}));

export const questionOptions = pgTable("question_options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  imageSrc: text("image_src"),
});

export const questionOptionsRelations = relations(
  questionOptions,
  ({ one }) => ({
    question: one(questions, {
      fields: [questionOptions.questionId], // Campo na tabela question_options
      references: [questions.id],          // Campo na tabela questions
    }),
  })
);

export const examResults = pgTable("exam_results", {
  id: serial("id").primaryKey(),
  examAttemptId: integer("exam_attempt_id")
    .notNull()
    .references(() => examAttempts.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at").notNull(),
});

export const examResultsRelations = relations(examResults, ({ one }) => ({
  examAttempt: one(examAttempts, {
    fields: [examResults.examAttemptId],
    references: [examAttempts.id],
  }),
}));

export const examAnswers = pgTable("exam_answers", {
  id: serial("id").primaryKey(),
  examAttemptId: integer("exam_attempt_id")
    .notNull()
    .references(() => examAttempts.id, { onDelete: "cascade" }),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  optionId: integer("option_id").references(() => questionOptions.id),
});

export const examAnswersRelations = relations(examAnswers, ({ one }) => ({
  examAttempt: one(examAttempts, {
    fields: [examAnswers.examAttemptId],
    references: [examAttempts.id],
  }),
  question: one(questions, {
    fields: [examAnswers.questionId],
    references: [questions.id],
  }),
  option: one(questionOptions, {
    fields: [examAnswers.optionId],
    references: [questionOptions.id],
  }),
}));
