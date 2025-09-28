import Link from "next/link"
import QuizDashboard from "./_component/QuizDashboard"
import { ArrowLeft } from "lucide-react"

const MockInterviewPage = () => {
  return (
    <div className="mt-20 lg:px-24 md:px-18 px-4 min-h-screen">
          <Link className="flex items-center gap-2 underline mb-3" href={"/mock-test"}>
            <ArrowLeft className="w-5 h-5"/><p className="text-sm">Back to Interview Insights Page</p>
          </Link>

        <div>
            <h1 className="gradient-title animate-gradient text-3xl lg:text-4xl mb-3">Mock Interview</h1>
            <p className="mb-3">Prep for your industry level interview questions</p>
        </div>
        <QuizDashboard/>
  
    </div>
  )
}

export default MockInterviewPage