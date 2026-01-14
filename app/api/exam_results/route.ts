import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { examResults } from "@/db/schema";
import { desc } from "drizzle-orm";

export const GET = async () => {
    const data = await db.query.examResults.findMany({
        orderBy: [desc(examResults.id)],
        // Inclui a tentativa e o aluno para o React Admin poder mostrar o nome
        with: {
            examAttempt: {
                with: {
                    students: true 
                }
            }
        }
    });

    const formattedData = data.map(item => ({ ...item, id: item.id }));
    const total = formattedData.length;

    return new NextResponse(JSON.stringify(formattedData), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Content-Range": `exam_results 0-${total}/${total}`,
            "Access-Control-Expose-Headers": "Content-Range",
        },
    });
};

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const [newResult] = await db.insert(examResults).values({
            examAttemptId: Number(body.examAttemptId),
            score: Number(body.score),
            completedAt: body.completedAt ? new Date(body.completedAt) : new Date(),
        }).returning();

        return NextResponse.json({ ...newResult, id: newResult.id }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erro ao criar resultado" }, { status: 400 });
    }
};