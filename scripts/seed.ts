import "dotenv/config"

// seed.ts

; // Ajuste o caminho conforme sua configuração
import db from "@/db/drizzle";
import { examAnswers, examAttempts, examResults, exams, questionOptions, questions, students } from "@/db/schema";
 // Ajuste o caminho conforme sua estrutura

async function seed() {
  console.log("🌱 Iniciando seed...");

  // Limpar tabelas na ordem correta (devido a foreign keys)
  console.log("🧹 Limpando tabelas existentes...");
  await db.delete(examAnswers);
  await db.delete(examResults);
  await db.delete(examAttempts);
  await db.delete(questionOptions);
  await db.delete(questions);
  await db.delete(exams);
  await db.delete(students);

  // 1. Inserir estudantes
  console.log("👨‍🎓 Inserindo estudantes...");
  const insertedStudents = await db.insert(students).values([
    {
      userId: "user_37UdggT9NxfKCEdpDJ0bIpmcYbw",
      name: "Tobias Teles",
      age: 16,
      grade: 2,
      schoolName: "Escola Estadual São Paulo",
      unit: "Unidade Centro",
      city: "São Paulo",
      state: "SP",
      userImageSrc: "/avatars/joao.png",
    },
    {
      userId: "STU002",
      name: "Maria Santos",
      age: 17,
      grade: 3,
      schoolName: "Colégio Rio de Janeiro",
      unit: "Unidade Zona Sul",
      city: "Rio de Janeiro",
      state: "RJ",
      userImageSrc: "/avatars/maria.png",
    },
    {
      userId: "STU003",
      name: "Carlos Oliveira",
      age: 15,
      grade: 1,
      schoolName: "Instituto Federal Minas Gerais",
      unit: "Campus Principal",
      city: "Belo Horizonte",
      state: "MG",
      userImageSrc: "/avatars/carlos.png",
    },
    {
      userId: "STU004",
      name: "Ana Costa",
      age: 16,
      grade: 2,
      schoolName: "Colégio Porto Alegre",
      unit: "Sede Central",
      city: "Porto Alegre",
      state: "RS",
      userImageSrc: "/avatars/ana.png",
    },
    {
      userId: "STU005",
      name: "Pedro Lima",
      age: 17,
      grade: 3,
      schoolName: "Escola Técnica Brasília",
      unit: "Unidade Asa Norte",
      city: "Brasília",
      state: "DF",
      userImageSrc: "/avatars/pedro.png",
    },
  ]).returning();

  // 2. Inserir exames
  console.log("📝 Inserindo exames...");
  const insertedExams = await db.insert(exams).values([
    {
      title: "Matemática Básica - 1º Bimestre",
      description: "Avaliação de conceitos fundamentais de matemática",
      isActive: true,
    },
    {
      title: "História do Brasil - Colônia",
      description: "Período colonial brasileiro (1500-1822)",
      isActive: true,
    },
    {
      title: "Ciências - Biologia Celular",
      description: "Estrutura e função das células",
      isActive: false,
    },
    {
      title: "Geografia - América do Sul",
      description: "Características físicas e humanas do continente",
      isActive: true,
    },
  ]).returning();

  // 3. Inserir questões para o primeiro exame (Matemática)
  console.log("❓ Inserindo questões...");
  const insertedQuestions = await db.insert(questions).values([
    // Exame 1 - Matemática
    {
      examId: insertedExams[0].id,
      type: "multiple_choice",
      content: "Qual o resultado de 15 + 27?",
      order: 1,
    },
    {
      examId: insertedExams[0].id,
      type: "multiple_choice",
      content: "Quanto é 8 × 7?",
      order: 2,
    },
    {
      examId: insertedExams[0].id,
      type: "multiple_choice",
      content: "Qual a raiz quadrada de 144?",
      order: 3,
    },
    {
      examId: insertedExams[0].id,
      type: "true_false",
      content: "Um triângulo equilátero tem todos os lados iguais.",
      order: 4,
    },
    {
      examId: insertedExams[0].id,
      type: "true_false",
      content: "O número π (pi) é uma dízima periódica.",
      order: 5,
    },
    // Exame 2 - História
    {
      examId: insertedExams[1].id,
      type: "multiple_choice",
      content: "Em que ano o Brasil foi descoberto?",
      order: 1,
    },
    {
      examId: insertedExams[1].id,
      type: "multiple_choice",
      content: "Quem foi o primeiro governador-geral do Brasil?",
      order: 2,
    },
    {
      examId: insertedExams[1].id,
      type: "true_false",
      content: "A Inconfidência Mineira ocorreu no século XVIII.",
      order: 3,
    },
    // Exame 4 - Geografia
    {
      examId: insertedExams[3].id,
      type: "multiple_choice",
      content: "Qual é o maior país da América do Sul em área territorial?",
      order: 1,
    },
  ]).returning();

  // 4. Inserir opções para as questões
  console.log("🔘 Inserindo opções de questões...");
  await db.insert(questionOptions).values([
    // Questão 1 - Matemática
    { questionId: insertedQuestions[0].id, content: "32", isCorrect: false },
    { questionId: insertedQuestions[0].id, content: "42", isCorrect: true },
    { questionId: insertedQuestions[0].id, content: "38", isCorrect: false },
    { questionId: insertedQuestions[0].id, content: "45", isCorrect: false },
    
    // Questão 2 - Matemática
    { questionId: insertedQuestions[1].id, content: "54", isCorrect: false },
    { questionId: insertedQuestions[1].id, content: "56", isCorrect: true },
    { questionId: insertedQuestions[1].id, content: "64", isCorrect: false },
    { questionId: insertedQuestions[1].id, content: "49", isCorrect: false },
    
    // Questão 3 - Matemática
    { questionId: insertedQuestions[2].id, content: "11", isCorrect: false },
    { questionId: insertedQuestions[2].id, content: "12", isCorrect: true },
    { questionId: insertedQuestions[2].id, content: "13", isCorrect: false },
    { questionId: insertedQuestions[2].id, content: "14", isCorrect: false },
    
    // Questão 4 - Matemática (True/False)
    { questionId: insertedQuestions[3].id, content: "Verdadeiro", isCorrect: true },
    { questionId: insertedQuestions[3].id, content: "Falso", isCorrect: false },
    
    // Questão 5 - Matemática (True/False)
    { questionId: insertedQuestions[4].id, content: "Verdadeiro", isCorrect: false },
    { questionId: insertedQuestions[4].id, content: "Falso", isCorrect: true },
    
    // Questão 6 - História
    { questionId: insertedQuestions[5].id, content: "1492", isCorrect: false },
    { questionId: insertedQuestions[5].id, content: "1500", isCorrect: true },
    { questionId: insertedQuestions[5].id, content: "1520", isCorrect: false },
    { questionId: insertedQuestions[5].id, content: "1453", isCorrect: false },
    
    // Questão 7 - História
    { questionId: insertedQuestions[6].id, content: "Duarte Coelho", isCorrect: false },
    { questionId: insertedQuestions[6].id, content: "Tomé de Sousa", isCorrect: true },
    { questionId: insertedQuestions[6].id, content: "Mem de Sá", isCorrect: false },
    { questionId: insertedQuestions[6].id, content: "Martim Afonso", isCorrect: false },
    
    // Questão 8 - História (True/False)
    { questionId: insertedQuestions[7].id, content: "Verdadeiro", isCorrect: true },
    { questionId: insertedQuestions[7].id, content: "Falso", isCorrect: false },
    
    // Questão 9 - Geografia
    { questionId: insertedQuestions[8].id, content: "Argentina", isCorrect: false },
    { questionId: insertedQuestions[8].id, content: "Brasil", isCorrect: true },
    { questionId: insertedQuestions[8].id, content: "Peru", isCorrect: false },
    { questionId: insertedQuestions[8].id, content: "Colômbia", isCorrect: false },
  ]);

  // Buscar opções para usar nas respostas
  const options = await db.select().from(questionOptions);

  // 5. Inserir tentativas de exame
  console.log("📊 Inserindo tentativas de exame...");
  const insertedAttempts = await db.insert(examAttempts).values([
    {
      studentId: insertedStudents[0].userId,
      examId: insertedExams[0].id,
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 1800000), // 30 minutos depois
    },
    {
      studentId: insertedStudents[0].userId,
      examId: insertedExams[1].id,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2400000), // 40 minutos depois
    },
    {
      studentId: insertedStudents[1].userId,
      examId: insertedExams[0].id,
      startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1500000), // 25 minutos depois
    },
    {
      studentId: insertedStudents[2].userId,
      examId: insertedExams[3].id,
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      // Esta tentativa não foi completada (completedAt é null)
    },
    {
      studentId: insertedStudents[3].userId,
      examId: insertedExams[0].id,
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2000000), // 33 minutos depois
    },
  ]).returning();

  // 6. Inserir respostas do exame
  console.log("✏️ Inserindo respostas de exames...");
  await db.insert(examAnswers).values([
    // Tentativa 1 - João Silva (Matemática) - Respostas corretas
    {
      examAttemptId: insertedAttempts[0].id,
      questionId: insertedQuestions[0].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[0].id && opt.content === "42")?.id,
    },
    {
      examAttemptId: insertedAttempts[0].id,
      questionId: insertedQuestions[1].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[1].id && opt.content === "56")?.id,
    },
    {
      examAttemptId: insertedAttempts[0].id,
      questionId: insertedQuestions[2].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[2].id && opt.content === "12")?.id,
    },
    {
      examAttemptId: insertedAttempts[0].id,
      questionId: insertedQuestions[3].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[3].id && opt.content === "Verdadeiro")?.id,
    },
    {
      examAttemptId: insertedAttempts[0].id,
      questionId: insertedQuestions[4].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[4].id && opt.content === "Falso")?.id,
    },
    
    // Tentativa 2 - João Silva (História) - Mistas
    {
      examAttemptId: insertedAttempts[1].id,
      questionId: insertedQuestions[5].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[5].id && opt.content === "1500")?.id,
    },
    {
      examAttemptId: insertedAttempts[1].id,
      questionId: insertedQuestions[6].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[6].id && opt.content === "Mem de Sá")?.id, // Errada
    },
    {
      examAttemptId: insertedAttempts[1].id,
      questionId: insertedQuestions[7].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[7].id && opt.content === "Verdadeiro")?.id,
    },
    
    // Tentativa 3 - Maria Santos (Matemática) - Mistas
    {
      examAttemptId: insertedAttempts[2].id,
      questionId: insertedQuestions[0].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[0].id && opt.content === "42")?.id,
    },
    {
      examAttemptId: insertedAttempts[2].id,
      questionId: insertedQuestions[1].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[1].id && opt.content === "54")?.id, // Errada
    },
    {
      examAttemptId: insertedAttempts[2].id,
      questionId: insertedQuestions[2].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[2].id && opt.content === "12")?.id,
    },
    {
      examAttemptId: insertedAttempts[2].id,
      questionId: insertedQuestions[3].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[3].id && opt.content === "Falso")?.id, // Errada
    },
    {
      examAttemptId: insertedAttempts[2].id,
      questionId: insertedQuestions[4].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[4].id && opt.content === "Falso")?.id,
    },
    
    // Tentativa 5 - Ana Costa (Matemática) - Boa performance
    {
      examAttemptId: insertedAttempts[4].id,
      questionId: insertedQuestions[0].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[0].id && opt.content === "42")?.id,
    },
    {
      examAttemptId: insertedAttempts[4].id,
      questionId: insertedQuestions[1].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[1].id && opt.content === "56")?.id,
    },
    {
      examAttemptId: insertedAttempts[4].id,
      questionId: insertedQuestions[2].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[2].id && opt.content === "11")?.id, // Errada
    },
    {
      examAttemptId: insertedAttempts[4].id,
      questionId: insertedQuestions[3].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[3].id && opt.content === "Verdadeiro")?.id,
    },
    {
      examAttemptId: insertedAttempts[4].id,
      questionId: insertedQuestions[4].id,
      optionId: options.find(opt => opt.questionId === insertedQuestions[4].id && opt.content === "Falso")?.id,
    },
  ]);

  // 7. Inserir resultados dos exames (apenas para tentativas completadas)
  console.log("🏆 Inserindo resultados de exames...");
  await db.insert(examResults).values([
    {
      examAttemptId: insertedAttempts[0].id,
      score: 100, // 5/5 acertos
      completedAt: insertedAttempts[0].completedAt!,
    },
    {
      examAttemptId: insertedAttempts[1].id,
      score: 67, // 2/3 acertos
      completedAt: insertedAttempts[1].completedAt!,
    },
    {
      examAttemptId: insertedAttempts[2].id,
      score: 60, // 3/5 acertos
      completedAt: insertedAttempts[2].completedAt!,
    },
    {
      examAttemptId: insertedAttempts[4].id,
      score: 80, // 4/5 acertos
      completedAt: insertedAttempts[4].completedAt!,
    },
  ]);

  console.log("✅ Seed completado com sucesso!");
  console.log(`📊 Estatísticas:`);
  console.log(`   👨‍🎓 Estudantes: ${insertedStudents.length}`);
  console.log(`   📝 Exames: ${insertedExams.length}`);
  console.log(`   ❓ Questões: ${insertedQuestions.length}`);
  console.log(`   🔘 Opções: ${options.length}`);
  console.log(`   📊 Tentativas: ${insertedAttempts.length}`);
}

// Executar o seed
seed()
  .catch((error) => {
    console.error("❌ Erro durante o seed:", error);
    process.exit(1);
  })
  .finally(() => {
    console.log("🏁 Processo de seed finalizado.");
  });