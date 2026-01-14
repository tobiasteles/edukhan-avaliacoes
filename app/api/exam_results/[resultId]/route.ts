import db from "@/db/drizzle";
import { examResults } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ resultId: string }>;
};

export const GET = async (req: Request, { params }: Props) => {
  const { resultId } = await params;
  const data = await db.query.examResults.findFirst({
    where: eq(examResults.id, Number(resultId)),
    with: { examAttempt: { with: { students: true } } }
  });

  if (!data) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json({ ...data, id: data.id });
};

export const PUT = async (req: Request, { params }: Props) => {
  const { resultId } = await params;
  const body = await req.json();
  const { ...updateData } = body; // Removemos o objeto 'examAttempt' aninhado

  const [updated] = await db.update(examResults)
    .set({
      ...updateData,
      score: updateData.score ? Number(updateData.score) : undefined,
    })
    .where(eq(examResults.id, Number(resultId)))
    .returning();

  return NextResponse.json({ ...updated, id: updated.id });
};

export const DELETE = async (req: Request, { params }: Props) => {
  const { resultId } = await params;
  const [deleted] = await db.delete(examResults)
    .where(eq(examResults.id, Number(resultId)))
    .returning();

  return NextResponse.json({ ...deleted, id: deleted.id });
};