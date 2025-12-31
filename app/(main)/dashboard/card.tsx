import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

type Props = {
  id: number;
  title: string;
  description?: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  active?: boolean;
  imageSrc?: string;
};

export const Card = ({
  id,
  title,
  description,
  onClick,
  disabled,
  active,
  imageSrc,
}: Props) => {

  const getIconByTitle = (title: string) => {
  const normalized = title.toLowerCase();

  if (normalized.includes("matem")) return "📐";
  if (normalized.includes("hist")) return "📜";
  if (normalized.includes("ciên") || normalized.includes("cien")) return "🔬";
  if (normalized.includes("geog")) return "🌎";

  return "📘"; // fallback genérico
};



  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "relative border-2 rounded-xl border-b-4 cursor-pointer flex flex-col items-center justify-between p-4 pb-6 min-h-52.5 transition-all",
        active
          ? "border-blue-600 bg-blue-50 hover:bg-blue-100"
          : "hover:bg-black/5",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      <div className="h-6 w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md bg-blue-700 flex items-center justify-center p-1.5">
            <Check className="text-white stroke-4 h-4 w-4" />
          </div>
        )}
      </div>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={title}
          height={70}
          width={93.33}
          className="rounded-lg drop-shadow-md border object-cover"
        />
      )}
      <p className="text-neutral-700 text-center font-bold mt-3">{getIconByTitle(title)} {title}</p>
      <span
        className={cn(
          "mt-2 text-xs font-semibold px-3 py-1 rounded-full",
          active ? "bg-blue-600 text-white" : "bg-neutral-200 text-neutral-600"
        )}
      >
        {active ? "Em andamento" : "Disponível"}
      </span>

      {description && (
        <p className="text-neutral-500 text-center text-sm mt-1">
          {description}
        </p>
      )}
      <p className="mt-3 text-sm font-semibold text-blue-700">
        {active ? "Continuar prova →" : "Iniciar prova →"}
      </p>
    </div>
  );
};
