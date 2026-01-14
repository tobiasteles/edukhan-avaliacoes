import db from "@/db/drizzle";
import { exams } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ examId: string }>;
};

export const GET = async (req: Request, { params }: Props) => {
  const { examId } = await params;
  const idAsNumber = Number(examId);

  const data = await db.query.exams.findFirst({
    where: eq(exams.id, idAsNumber),
  });

  if (!data) return NextResponse.json({ error: "Exame não encontrado" }, { status: 404 });

  return NextResponse.json({ ...data, id: data.id });
};

export const PUT = async (req: Request, { params }: Props) => {
  const { examId } = await params;
  const idAsNumber = Number(examId);
  const body = await req.json();
  
  // SOLUÇÃO PARA O ERRO toISOString: 
  // Removemos 'id' e 'createdAt' do corpo antes de enviar ao Drizzle.
  // O banco cuida do id e o createdAt não deve ser alterado no PUT.
  const {  ...updateData } = body;

  const [updatedData] = await db
    .update(exams)
    .set({
      ...updateData,
      // Garante que o booleano seja tratado corretamente
      isActive: updateData.isActive !== undefined ? Boolean(updateData.isActive) : undefined,
    })
    .where(eq(exams.id, idAsNumber))
    .returning();

  if (!updatedData) return NextResponse.json({ error: "Falha ao atualizar" }, { status: 404 });

  return NextResponse.json({ ...updatedData, id: updatedData.id });
};

export const DELETE = async (req: Request, { params }: Props) => {
  const { examId } = await params;
  const idAsNumber = Number(examId);

  const [deletedData] = await db
    .delete(exams)
    .where(eq(exams.id, idAsNumber))
    .returning();

  if (!deletedData) return NextResponse.json({ error: "Falha ao deletar" }, { status: 404 });

  return NextResponse.json({ ...deletedData, id: deletedData.id });
};