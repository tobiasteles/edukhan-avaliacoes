import { LojinhaPremios } from "@/components/lojinhaPremios";

export default function PainelDoAluno() {
  return (
    <div>
      <h1>Bem-vindo, Aluno!</h1>
      {/* Suas avaliações aqui... */}
      
      <section className="mt-10 bg-slate-50 rounded-2xl border">
        <LojinhaPremios />
      </section>
    </div>
  );
}