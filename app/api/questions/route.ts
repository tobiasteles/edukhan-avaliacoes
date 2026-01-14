import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { questions } from "@/db/schema"; // Certifique-se de importar 'questions' do seu schema
import { desc } from "drizzle-orm";

export const GET = async () => {
    const data = await db.query.questions.findMany({
        orderBy: [desc(questions.id)],
    });

    // Mapeia para o React Admin reconhecer o 'id'
    const formattedData = data.map(item => ({ ...item, id: item.id }));
    const total = formattedData.length;

    return new NextResponse(JSON.stringify(formattedData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Content-Range": `questions 0-${total}/${total}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();

        // Extraímos os campos baseados no seu banco (conforme o CSV enviado)
        const [newQuestion] = await db.insert(questions).values({
            content: body.content,
            type: body.type,
            examId: Number(body.examId), // Garante que o ID do exame seja número
            order: Number(body.order),   // Garante que a ordem seja número
        }).returning();

        return NextResponse.json({ ...newQuestion, id: newQuestion.id }, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar questão:", error);
        return NextResponse.json({ error: "Erro ao criar questão" }, { status: 400 });
    }
};