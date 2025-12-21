import { useAuth } from "@/context/AuthContext";
import { BookOpen, GraduationCap, Trophy, Users } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";



export default function Home() {
  
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user && userRole) {
      router.push(userRole === 'professor' ? '/professor' : '/aluno');
    }
  }, [user, userRole, loading, router]);

  const features = [
    {
      icon: BookOpen,
      title: "Provas Interativas",
      description: "Crie e realize provas com questões variadas e feedback instantâneo",
      color: "text-primary"
    },
    {
      icon: Trophy,
      title: "Acompanhe o Progresso",
      description: "Visualize estatísticas detalhadas de desempenho e evolução",
      color: "text-success"
    },
    {
      icon: Users,
      title: "Gestão de Turmas",
      description: "Gerencie alunos e atribua provas de forma simples e organizada",
      color: "text-accent"
    },
    {
      icon: GraduationCap,
      title: "Aprendizado Gamificado",
      description: "Torne o aprendizado divertido com elementos de gamificação",
      color: "text-warning"
    }
  ];


 return (
  <div>
    Hello Edukhan
  </div>
 )
}
