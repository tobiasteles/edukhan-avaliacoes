"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { upsertStudent } from "@/actions/students";

type Props = {
  examId: string;
  attemptId: string;
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

      router.push(`/exam/${examId}/attempt/${attemptId}/start`);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar os dados do aluno");
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
