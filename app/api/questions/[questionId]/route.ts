import db from "@/db/drizzle";
import { questions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ questionId: string }>;
};

export const GET = async (req: Request, { params }: Props) => {
  const { questionId } = await params;
  const idAsNumber = Number(questionId);

  const data = await db.query.questions.findFirst({
    where: eq(questions.id, idAsNumber),
  });

  if (!data) return NextResponse.json({ error: "Questão não encontrada" }, { status: 404 });

  return NextResponse.json({ ...data, id: data.id });
};

export const PUT = async (req: Request, { params }: Props) => {
  const { questionId } = await params;
  const idAsNumber = Number(questionId);
  const body = await req.json();
  
  // Limpeza de campos para evitar erro de toISOString e conflito de ID
  const { ...updateData } = body;

  const [updatedData] = await db
    .update(questions)
    .set({
      ...updateData,
      examId: updateData.examId ? Number(updateData.examId) : undefined,
      order: updateData.order ? Number(updateData.order) : undefined,
    })
    .where(eq(questions.id, idAsNumber))
    .returning();

  if (!updatedData) return NextResponse.json({ error: "Falha ao atualizar" }, { status: 404 });

  return NextResponse.json({ ...updatedData, id: updatedData.id });
};

export const DELETE = async (req: Request, { params }: Props) => {
  const { questionId } = await params;
  const idAsNumber = Number(questionId);

  const [deletedData] = await db
    .delete(questions)
    .where(eq(questions.id, idAsNumber))
    .returning();

  if (!deletedData) return NextResponse.json({ error: "Falha ao deletar" }, { status: 404 });

  return NextResponse.json({ ...deletedData, id: deletedData.id });
};