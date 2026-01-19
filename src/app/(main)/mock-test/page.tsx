import { getAssessmentsAction } from "./_actions/getAssessments";
import PerformaceChart from "./_components/PerformaceChart";
import QuizList from "./_components/QuizList";
import StatsCards from "./_components/StatsCards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function InterviewPage() {
  const assessments = await getAssessmentsAction() ?? [];

  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
      <StatsCards assessments={assessments} />
      <PerformaceChart assessments={assessments} />
      <QuizList assessments={assessments} />
    </div>
  );
}
