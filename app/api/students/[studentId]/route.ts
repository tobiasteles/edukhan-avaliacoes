import db from "@/db/drizzle";
import { students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ studentId: string }>;
};

export const GET = async (req: Request, { params }: Props) => {
  // 1. Unwrapping params (Obrigatório no Next.js 16)
  const { studentId } = await params;

  const data = await db.query.students.findFirst({
    where: eq(students.userId, studentId),
  });

  if (!data) {
    return NextResponse.json({ error: "Estudante não encontrado" }, { status: 404 });
  }

  // 2. Retornar com a chave "id" para o React Admin
  return NextResponse.json({
    ...data,
    id: data.userId,
  });
};

export const PUT = async (req: Request, { params }: Props) => {
  const { studentId } = await params;
  const body = await req.json();
  
  // Removemos campos sensíveis ou automáticos do corpo do update
  const { ...updateData } = body;

  const [updatedData] = await db
    .update(students)
    .set({
      ...updateData,
      // Garante que campos numéricos sejam tratados corretamente
      age: updateData.age ? Number(updateData.age) : undefined,
      grade: updateData.grade ? Number(updateData.grade) : undefined,
    })
    .where(eq(students.userId, studentId))
    .returning();

  if (!updatedData) {
    return NextResponse.json({ error: "Falha ao atualizar" }, { status: 404 });
  }

  return NextResponse.json({
    ...updatedData,
    id: updatedData.userId,
  });
};

export const DELETE = async (req: Request, { params }: Props) => {
  const { studentId } = await params;

  const [deletedData] = await db
    .delete(students)
    .where(eq(students.userId, studentId))
    .returning();

  if (!deletedData) {
    return NextResponse.json({ error: "Falha ao deletar" }, { status: 404 });
  }

  return NextResponse.json({
    ...deletedData,
    id: deletedData.userId,
  });
};