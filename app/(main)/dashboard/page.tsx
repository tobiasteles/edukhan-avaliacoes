"use client";

import {
  FileText,
  CheckSquare,
  Trophy,
  BarChart3,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold">Painel de Controle do Aluno</h1>
        <p className="text-muted-foreground">
          Overview of your exams and performance
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Available Exams"
          value="3"
          icon={FileText}
        />
        <DashboardCard
          title="Completed Exams"
          value="5"
          icon={CheckSquare}
        />
        <DashboardCard
          title="Average Score"
          value="7.8"
          icon={BarChart3}
        />
        <DashboardCard
          title="Best Score"
          value="9.5"
          icon={Trophy}
        />
      </div>

      {/* Conteúdo em duas colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provas disponíveis */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Available Exams</h2>

          <ul className="space-y-2">
            <li className="flex justify-between items-center border p-3 rounded-lg">
              <span>Physics – Newton Laws</span>
              <button className="text-blue-600 font-semibold">
                Start
              </button>
            </li>

            <li className="flex justify-between items-center border p-3 rounded-lg">
              <span>Math – Linear Functions</span>
              <button className="text-blue-600 font-semibold">
                Start
              </button>
            </li>
          </ul>
        </div>

        {/* Últimos resultados */}
        <div className="bg-white border rounded-xl p-4">
          <h2 className="font-semibold mb-3">Recent Results</h2>

          <ul className="space-y-2">
            <li className="flex justify-between border p-3 rounded-lg">
              <span>Chemistry – Atoms</span>
              <span className="font-bold text-green-600">8.5</span>
            </li>

            <li className="flex justify-between border p-3 rounded-lg">
              <span>Biology – Cells</span>
              <span className="font-bold text-green-600">9.0</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTE AUXILIAR ---------------- */

type CardProps = {
  title: string;
  value: string;
  icon: React.ElementType;
};

function DashboardCard({ title, value, icon: Icon }: CardProps) {
  return (
    <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
      <div className="p-3 rounded-full bg-blue-100 text-blue-700">
        <Icon className="h-6 w-6" />
      </div>

      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
