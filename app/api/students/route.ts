// app/api/students/route.ts
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { students } from "@/db/schema";

export const GET = async () => {
    const data = await db.query.students.findMany();

    // 1. Transformar userId em id para o React Admin
    const formattedData = data.map((item) => ({
        ...item,
        id: item.userId, // O React Admin EXIGE a chave "id"
    }));

    // 2. O simpleRestProvider exige o header Content-Range para paginação
    // Formato: students 0-total/total
    const total = formattedData.length;

    return new NextResponse(JSON.stringify(formattedData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Content-Range": `students 0-${total}/${total}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};


export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    // Verificação de segurança
    if (!body.userId) {
       return NextResponse.json({ error: "O campo userId é obrigatório" }, { status: 400 });
    }

    const data = await db.insert(students).values({
      userId: body.userId, // Garante que o ID digitado no form vá para o banco
      name: body.name,
      age: Number(body.age),
      grade: body.grade,
      schoolName: body.schoolName,
      unit: body.unit,
      city: body.city,
      state: body.state,
      userImageSrc: body.userImageSrc || "/user.png",
    }).returning();

    const newItem = data[0];

    return NextResponse.json({
      ...newItem,
      id: newItem.userId,
    }, { status: 201 });

  } catch (error) {
    console.error("Erro detalhado no POST:", error);
    return NextResponse.json({ error: "Erro ao criar estudante" }, { status: 500 });
  }
};