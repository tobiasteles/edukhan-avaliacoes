import db from "@/db/drizzle";
import { announcements } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ announcementId: string }>;
};

export const GET = async (req: Request, { params }: Props) => {
  const { announcementId } = await params;
  
  const data = await db.query.announcements.findFirst({
    where: eq(announcements.id, Number(announcementId)),
  });

  if (!data) return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
  return NextResponse.json(data);
};

export const PUT = async (req: Request, { params }: Props) => {
  const { announcementId } = await params;
  const body = await req.json();

  const [updated] = await db.update(announcements)
    .set({
      title: body.title,
      content: body.content,
    })
    .where(eq(announcements.id, Number(announcementId)))
    .returning();

  return NextResponse.json(updated);
};

export const DELETE = async (req: Request, { params }: Props) => {
  const { announcementId } = await params;

  const [deleted] = await db.delete(announcements)
    .where(eq(announcements.id, Number(announcementId)))
    .returning();

  return NextResponse.json(deleted);
};