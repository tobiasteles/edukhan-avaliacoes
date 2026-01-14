import db from "@/db/drizzle";
import { announcements } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async () => {
  const data = await db.query.announcements.findMany({
    orderBy: [desc(announcements.createdAt)],
  });
  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  const body = await req.json();
  
  if (!body.title || !body.content) {
    return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
  }

  const [data] = await db.insert(announcements).values({
    title: body.title,
    content: body.content,
  }).returning();

  return NextResponse.json(data);
};