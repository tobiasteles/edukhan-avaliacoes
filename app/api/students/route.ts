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