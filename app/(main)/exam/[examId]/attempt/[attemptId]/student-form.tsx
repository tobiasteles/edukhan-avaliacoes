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
  if (!userId) return;

  setLoading(true);
  const formData = new FormData(e.currentTarget);

  try {
    // 1. Salva ou atualiza os dados do aluno
    await upsertStudent({
      userId,
      name: String(formData.get("name")),
      age: Number(formData.get("age")),
      grade: Number(formData.get("grade")),
      schoolName: String(formData.get("school")),
      unit: String(formData.get("unit")),
      city: String(formData.get("city")),
      state: String(formData.get("state")),
    });

    // 2. Definimos qual ID de tentativa usar
    let finalAttemptId = attemptId;

    // Se não recebemos um attemptId via props, criamos um agora
    if (!finalAttemptId || finalAttemptId === "undefined") {
      const newId = await createExamAttempt(Number(examId), userId);
      finalAttemptId = String(newId);
    }

    // 3. Redirecionamento forçado para a página da prova
    // Usamos o window.location.assign se o router.push falhar em rotas dinâmicas pesadas
    router.push(`/exam/${examId}/attempt/${finalAttemptId}/take`);
    
  } catch (error) {
    console.error("Erro no formulário:", error);
    alert("Erro ao iniciar a prova. Verifique seus dados.");
  } finally {
    setLoading(false);
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        name="name"
        required
        placeholder="Nome completo"
        className="w-full border p-2 rounded"
      />

      <input
        name="age"
        type="number"
        required
        placeholder="Idade"
        className="w-full border p-2 rounded"
      />

      <input
        name="grade"
        type="number"
        required
        placeholder="Série / Ano"
        className="w-full border p-2 rounded"
      />

      <input
        name="school"
        required
        placeholder="Escola"
        className="w-full border p-2 rounded"
      />

      <input
        name="unit"
        required
        placeholder="Unidade"
        className="w-full border p-2 rounded"
      />

      <input
        name="city"
        required
        placeholder="Cidade"
        className="w-full border p-2 rounded"
      />

      <input
        name="state"
        required
        placeholder="Estado"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
      >
        {loading ? "Iniciando..." : "Começar prova"}
      </button>
    </form>
  );
}
