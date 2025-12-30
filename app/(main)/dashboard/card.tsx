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
  imageSrc
}: Props) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "border-2 rounded-xl border-b-4 hover:bg-black/5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-54.25 min-w-50",
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
        <p className="text-neutral-700 text-center font-bold mt-3">{title}</p>
        {description && (
            <p className="text-neutral-500 text-center text-sm mt-1">{description}</p>
        )}
    </div>
  );
};
