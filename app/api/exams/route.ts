import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { exams } from "@/db/schema";
import { desc } from "drizzle-orm";

export const GET = async () => {
    const data = await db.query.exams.findMany({
        orderBy: [desc(exams.id)],
    });

    const formattedData = data.map(item => ({ ...item, id: item.id }));
    const total = formattedData.length;

    return new NextResponse(JSON.stringify(formattedData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Content-Range": `exams 0-${total}/${total}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();

        // Extraímos apenas o que o banco aceita para evitar erros de campos extras
        const [newExam] = await db.insert(exams).values({
            title: body.title,
            description: body.description,
            isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
        }).returning();

        return NextResponse.json({ ...newExam, id: newExam.id }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erro ao criar exame" }, { status: 400 });
    }
};