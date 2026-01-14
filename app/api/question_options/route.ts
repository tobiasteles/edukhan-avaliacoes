import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { questionOptions } from "@/db/schema";
import { desc } from "drizzle-orm";

export const GET = async () => {
    const data = await db.query.questionOptions.findMany({
        orderBy: [desc(questionOptions.id)],
    });

    const formattedData = data.map(item => ({ ...item, id: item.id }));
    const total = formattedData.length;

    return new NextResponse(JSON.stringify(formattedData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Content-Range": `question_options 0-${total}/${total}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();

        const [newOption] = await db.insert(questionOptions).values({
            questionId: Number(body.questionId),
            content: body.text,
            isCorrect: Boolean(body.isCorrect),
        }).returning();

        return NextResponse.json({ ...newOption, id: newOption.id }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erro ao criar opção" }, { status: 400 });
    }
};