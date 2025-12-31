import { getExams, getExamsProgress, getUserProgress } from "@/db/queries";
import { redirect } from "next/navigation";
import { Header } from "./header";

const AvailableExamsPage = async () => {
  const userProgressData = await getUserProgress();
  const examsProgressData = await getExamsProgress();
  const examsData = await getExams();


  const [
    userProgress,
    exams,
    examsProgress,
  ] = await Promise.all([
    userProgressData,
    examsData,
    examsProgressData,
  ]);


  // if (userProgress || !exams || !examsProgress) {
  //   redirect("/dashboard");
  // }


   return (
    <div className="flex flex-row-reverse gap-12 px-6">
        <Header title="Provas Disponíveis" />
        {exams.map((exam) => (
          <div key={exam.id} className="mb-10 text-lime-300">
             
          </div>
        ))

        }
    </div>
   )
};

export default AvailableExamsPage;