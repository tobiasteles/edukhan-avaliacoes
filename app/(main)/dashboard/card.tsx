import { cn } from "@/lib/utils";
import { Check, Trophy } from "lucide-react";

type Props = {
  id: number;
  title: string;
  onClick: () => void;
  status: "available" | "active" | "completed";
  score?: number;
  active?: boolean;
};

export const Card = ({  title, onClick, status, score, active }: Props) => {
  const getIconByTitle = (title: string) => {
    const normalized = title.toLowerCase();
    if (normalized.includes("matem")) return "📐";
    if (normalized.includes("ciên") || normalized.includes("cien")) return "🔬";
    return "📘";
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative border-2 rounded-xl border-b-4 cursor-pointer flex flex-col items-center justify-between p-4 pb-6 min-h-56 transition-all",
        status === "completed" ? "border-green-500 bg-green-50/50" : 
        active ? "border-blue-600 bg-blue-50" : "hover:bg-black/5"
      )}
    >
      <div className="h-6 w-full flex items-center justify-end">
        {status === "completed" ? (
          <Trophy className="text-green-600 h-5 w-5" />
        ) : active && (
          <div className="rounded-md bg-blue-700 flex items-center justify-center p-1.5">
            <Check className="text-white h-3 w-3" />
          </div>
        )}
      </div>

      <p className="text-neutral-700 text-center font-bold mt-2">
        {getIconByTitle(title)} {title}
      </p>

      {status === "completed" && (
        <div className="mt-2 text-center">
          <p className="text-xs text-neutral-500 font-bold uppercase">Nota</p>
          <p className="text-xl font-black text-green-700">{score}</p>
        </div>
      )}

      <span className={cn(
        "mt-4 text-xs font-semibold px-3 py-1 rounded-full",
        status === "completed" ? "bg-green-600 text-white" :
        status === "active" ? "bg-blue-600 text-white" : "bg-neutral-200 text-neutral-600"
      )}>
        {status === "completed" ? "Finalizada" : status === "active" ? "Em andamento" : "Disponível"}
      </span>

      <p className={cn(
        "mt-3 text-sm font-bold",
        status === "completed" ? "text-green-700" : "text-blue-700"
      )}>
        {status === "completed" ? "Ver Resultado →" : status === "active" ? "Continuar →" : "Iniciar Prova →"}
      </p>
    </div>
  );
};