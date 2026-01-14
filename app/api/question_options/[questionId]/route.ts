import db from "@/db/drizzle";
import { questionOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// Importante: O nome aqui deve ser questionId para bater com o nome da pasta [questionId]
type Props = {
  params: Promise<{ questionId: string }>;
};

export const GET = async (req: Request, { params }: Props) => {
  const { questionId } = await params;
  const id = Number(questionId);

  // Validação simples para evitar o erro de NaN no banco
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const data = await db.query.questionOptions.findFirst({
    where: eq(questionOptions.id, id),
  });

  if (!data) {
    return NextResponse.json({ error: "Opção não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ ...data, id: data.id });
};

export const PUT = async (req: Request, { params }: Props) => {
  const { questionId } = await params;
  const id = Number(questionId);
  
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();
  const { ...updateData } = body;

  const [updated] = await db.update(questionOptions)
    .set({
      ...updateData,
      // Se o seu schema usa questionId como FK, certifique-se de que o nome da coluna no set está correto
      questionId: updateData.questionId ? Number(updateData.questionId) : undefined,
      isCorrect: updateData.isCorrect !== undefined ? Boolean(updateData.isCorrect) : undefined,
    })
    .where(eq(questionOptions.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Não foi possível atualizar" }, { status: 404 });
  }

  return NextResponse.json({ ...updated, id: updated.id });
};

export const DELETE = async (req: Request, { params }: Props) => {
  const { questionId } = await params;
  const id = Number(questionId);

  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const [deleted] = await db.delete(questionOptions)
    .where(eq(questionOptions.id, id))
    .returning();

  if (!deleted) {
    return NextResponse.json({ error: "Registro não encontrado para exclusão" }, { status: 404 });
  }

  return NextResponse.json({ ...deleted, id: deleted.id });
};