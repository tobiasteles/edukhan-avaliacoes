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
      // 1. Salva ou atualiza os dados do aluno no banco
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

      // 2. Define qual ID de tentativa usar
      let finalAttemptId = attemptId;

      // Se não recebemos um attemptId via props ou se ele for inválido, criamos um novo
      if (!finalAttemptId || finalAttemptId === "undefined") {
        const newId = await createExamAttempt(Number(examId), userId);
        finalAttemptId = String(newId);
      }

      // 3. Redirecionamento para a página da prova
      router.push(`/exam/${examId}/attempt/${finalAttemptId}/take`);
      router.refresh(); 
      
    } catch (error) {
      console.error("Erro no formulário:", error);
      alert("Erro ao iniciar a prova. Verifique seus dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-neutral-200">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-neutral-700">Nome completo</label>
        <input
          name="name"
          required
          placeholder="Digite seu nome"
          className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Idade</label>
          <input
            name="age"
            type="number"
            required
            placeholder="Ex: 12"
            className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Série / Ano</label>
          <select 
            name="grade" 
            required 
            className="w-full border border-neutral-300 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="">Selecione...</option>
            <optgroup label="Ensino Fundamental - Iniciais">
              <option value="1">1º Ano</option>
              <option value="2">2º Ano</option>
              <option value="3">3º Ano</option>
              <option value="4">4º Ano</option>
              <option value="5">5º Ano</option>
            </optgroup>
            <optgroup label="Ensino Fundamental - Finais">
              <option value="6">6º Ano</option>
              <option value="7">7º Ano</option>
              <option value="8">8º Ano</option>
              <option value="9">9º Ano</option>
            </optgroup>
            <optgroup label="Ensino Médio">
              <option value="10">1ª Série EM</option>
              <option value="11">2ª Série EM</option>
              <option value="12">3ª Série EM</option>
            </optgroup>
          </select>
        </div>
      </div>

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
        <label className="text-sm font-semibold text-neutral-700">Unidade</label>
        <input
          name="unit"
          required
          placeholder="Ex: Associação Viver"
          className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Cidade</label>
          <input
            name="city"
            required
            placeholder="Sua cidade"
            className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-700">Estado</label>
          <input
            name="state"
            required
            placeholder="Ex: SP"
            className="w-full border border-neutral-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transform active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed mt-4"
      >
        {loading ? "Iniciando prova..." : "Começar prova agora"}
      </button>
    </form>
  );
}