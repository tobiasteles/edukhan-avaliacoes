"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { createExamAttempt, upsertStudent } from "@/actions/students";

type Props = {
  examId: string;
  attemptId?: string;
};

export default function StudentForm({ examId, attemptId }: Props) {
  const router = useRouter();
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) {
      alert("Usuário não autenticado");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      // 1. Salva os dados (trocado age por birthDate)
      await upsertStudent({
        userId,
        name: String(formData.get("name")),
        birthDate: String(formData.get("birthDate")), // Enviando a string da data
        grade: Number(formData.get("grade")),
        schoolName: String(formData.get("school")),
        unit: String(formData.get("unit")),
        city: String(formData.get("city")),
        state: String(formData.get("state")),
      });

      let finalAttemptId = attemptId;

      // 2. Garantir que temos um attemptId válido
      if (!finalAttemptId || finalAttemptId === "undefined") {
        // O result aqui deve ser apenas o ID (string ou number)
        const result = await createExamAttempt(Number(examId), userId);
        finalAttemptId = String(result);
      }

      // 3. Redirecionamento direto
      // Use window.location.assign se o router.push falhar, mas o push deve funcionar:
      const destination = `/exam/${examId}/attempt/${finalAttemptId}/take`;

      console.log("Redirecionando para:", destination);
      router.push(destination);
    } catch (error) {
      console.error("Erro no formulário:", error);
      alert("Erro ao iniciar a prova. Verifique sua conexão.");
    } finally {
      // Não setamos loading(false) aqui se o redirecionamento for bem sucedido
      // para evitar que o botão volte ao estado normal enquanto a página troca.
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-neutral-200"
    >
      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-700">
          Nome completo
        </label>
        <input
          name="name"
          required
          placeholder="Digite seu nome"
          className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">
            Data de Nascimento
          </label>
          <input
            name="birthDate"
            type="date"
            required
            className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">
            Série / Ano
          </label>
          <select
            name="grade"
            required
            className="w-full border border-neutral-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="">Selecione...</option>
            <optgroup label="Ensino Fundamental">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <option key={i} value={i}>
                  {i}º Ano
                </option>
              ))}
            </optgroup>
            <optgroup label="Ensino Médio">
              <option value="10">1ª Série EM</option>
              <option value="11">2ª Série EM</option>
              <option value="12">3ª Série EM</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Outros campos de Escola, Unidade, etc permanecem iguais... */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-700">Escola</label>
        <input
          name="school"
          required
          placeholder="Nome da sua escola"
          className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-700">
          Unidade / Projeto
        </label>
        <input
          name="unit"
          required
          placeholder="Ex: Associação Viver ou Unidade Centro"
          className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">
            Cidade
          </label>
          <input
            name="city"
            required
            placeholder="Sua cidade"
            className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">
            Estado
          </label>
          <input
            name="state"
            required
            placeholder="Ex: SP"
            maxLength={2}
            className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition uppercase"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-[0.98] transition disabled:opacity-60 mt-4"
      >
        {loading ? "Iniciando prova..." : "Começar prova agora"}
      </button>
    </form>
  );
}
