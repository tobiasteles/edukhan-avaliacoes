import db from "@/db/drizzle";
import { announcements } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function AnnouncementsPage() {
  // Busca os anúncios do mais novo para o mais antigo
  const data = await db.query.announcements.findMany({
    orderBy: [desc(announcements.createdAt)],
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Megaphone className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mural de Avisos</h1>
          <p className="text-muted-foreground">Fique por dentro das novidades do Edukhan</p>
        </div>
      </div>

      <div className="grid gap-6">
        {data.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed">
            <p className="text-muted-foreground">Nenhum anúncio postado ainda.</p>
          </div>
        ) : (
          data.map((item) => (
            <Card key={item.id} className="overflow-hidden border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/50">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl text-slate-800">{item.title}</CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                    <Calendar className="mr-1 h-3 w-3" />
                    {format(new Date(item.createdAt), "dd 'de' MMMM", { locale: ptBR })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {item.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}